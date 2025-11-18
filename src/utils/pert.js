// src/utils/pert.js

const MINUTES_PER_DAY = 24 * 60;

// kan7awdo kol durée l minutes (ila user xtar "jours")
function normalizeDuration(task) {
  const val = Number(task.durationValue || 0);
  if (Number.isNaN(val)) return 0;
  if (task.durationUnit === "jours") {
    return val * MINUTES_PER_DAY;
  }
  return val; 
}

// tasks: [{id, durationValue, durationUnit, predecessors: "A,B"}]
export function computePert(tasks) {
  const taskMap = {};
  const successorsMap = {};

  // build taskMap + predecessors
  tasks.forEach((t) => {
    const preds = (t.predecessors || "")
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    const duration = normalizeDuration(t);

    taskMap[t.id] = {
      id: t.id,
      duration,
      predecessors: preds,
    };
  });

  // init successeurs
  Object.values(taskMap).forEach((t) => {
    if (!successorsMap[t.id]) successorsMap[t.id] = [];
  });
  Object.values(taskMap).forEach((t) => {
    t.predecessors.forEach((p) => {
      if (!successorsMap[p]) successorsMap[p] = [];
      successorsMap[p].push(t.id);
    });
  });

  const early = {};
  const late = {};

  // -------- forward pass (ES/EF) --------
  function forward(id) {
    if (early[id]) return early[id];
    const t = taskMap[id];
    if (!t) throw new Error("Task not found: " + id);

    let ES = 0;
    if (t.predecessors.length > 0) {
      let maxEF = 0;
      t.predecessors.forEach((pid) => {
        const { EF } = forward(pid);
        if (EF > maxEF) maxEF = EF;
      });
      ES = maxEF;
    }
    const EF = ES + t.duration;
    early[id] = { ES, EF };
    return early[id];
  }

  Object.keys(taskMap).forEach((id) => forward(id));

  const projectDuration = Math.max(
    ...Object.values(early).map((v) => v.EF)
  );

  // -------- backward pass (LS/LF) --------
  function backward(id) {
    if (late[id]) return late[id];
    const t = taskMap[id];
    const succs = successorsMap[id] || [];

    let LF;
    if (succs.length === 0) {
      LF = projectDuration;
    } else {
      let minLS = Infinity;
      succs.forEach((sid) => {
        const { LS: succLS } = backward(sid);
        if (succLS < minLS) minLS = succLS;
      });
      LF = minLS;
    }
    const LS = LF - t.duration;
    late[id] = { LS, LF };
    return late[id];
  }

  Object.keys(taskMap).forEach((id) => backward(id));

  // -------- perTask + slack --------
  const perTask = {};
  Object.keys(taskMap).forEach((id) => {
    const t = taskMap[id];
    const { ES, EF } = early[id];
    const { LS, LF } = late[id];
    const slack = LS - ES;
    perTask[id] = {
      id,
      duration: t.duration,
      ES,
      EF,
      LS,
      LF,
      slack,
      predecessors: t.predecessors,
      successors: successorsMap[id] || [],
    };
  });

  // -------- chercher chemin critique (plus long chemin) --------
  const paths = [];

  function dfs(id, path, total) {
    const t = taskMap[id];
    const succs = successorsMap[id] || [];
    const newTotal = total + t.duration;
    const newPath = [...path, id];
    if (succs.length === 0) {
      paths.push({ path: newPath, total: newTotal });
      return;
    }
    succs.forEach((sid) => dfs(sid, newPath, newTotal));
  }

  const startTasks = Object.values(taskMap).filter(
    (t) => t.predecessors.length === 0
  );
  startTasks.forEach((t) => dfs(t.id, [], 0));

  let best = paths[0] || { path: [], total: 0 };
  paths.forEach((p) => {
    if (p.total > best.total) best = p;
  });

  const criticalPath = best.path;

  return {
    projectDuration,
    perTask,
    criticalPath,
  };
}
