// src/components/PertDiagram.jsx
import { formatValueByUnit } from "../utils/units";

/**
 * Diagramme PERT / CPM (activité sur les flèches)
 * - Les cercles = événements numérotés 0, 1, 2, ...
 * - Les flèches = tâches (A, B, C...) + durée: "A (30)" ...
 * - Dans chaque cercle:
 *      haut: numéro de l'événement
 *      bas gauche: date au plus tôt
 *      bas droite: date au plus tard
 * - On utilise les ES/EF/LS/LF déjà calculés pour les tâches.
 */

function PertDiagram({ pertResult, displayUnit }) {
  if (!pertResult) return null;

  const { perTask } = pertResult;
  const tasks = Object.values(perTask || {});
  if (!tasks.length) return <p>Aucune tâche à afficher.</p>;

  // ---------- Helpers de base ----------
  const successors = {};
  tasks.forEach((t) => {
    if (!successors[t.id]) successors[t.id] = [];
  });
  tasks.forEach((t) => {
    (t.predecessors || []).forEach((p) => {
      if (!successors[p]) successors[p] = [];
      successors[p].push(t.id);
    });
  });

  // Reachability
  function canReach(fromId, toId, visited = new Set()) {
    if (fromId === toId) return true;
    if (visited.has(fromId)) return false;
    visited.add(fromId);
    const succ = successors[fromId] || [];
    for (const s of succ) {
      if (canReach(s, toId, visited)) return true;
    }
    return false;
  }

  // slack pour chaque tâche
  const slackOf = {};
  tasks.forEach((t) => {
    slackOf[t.id] = (t.LS ?? 0) - (t.ES ?? 0);
  });

  // ---------- 1) Construction des événements ----------
  const sortedByEF = [...tasks].sort((a, b) => a.EF - b.EF);

  const events = [];
  const endEventByTaskId = {};

  // événement 0 (début)
  const startEvent = {
    index: 0,
    earliest: 0,
    latest: 0,
    label: "0",
    isStart: true,
    isEnd: false,
  };
  events.push(startEvent);

  sortedByEF.forEach((t, idx) => {
    const ev = {
      index: idx + 1, // 1..N
      earliest: t.EF,
      latest: t.LF,
      label: String(idx + 1),
      taskId: t.id,
      isStart: false,
      isEnd: false,
    };
    events.push(ev);
    endEventByTaskId[t.id] = ev;
  });

  // dernier événement = fin
  const lastEvent = events[events.length - 1];
  lastEvent.isEnd = true;

  // ---------- 2) Construction des arcs (tâches + dummies) ----------
  const arcs = [];

  tasks.forEach((t) => {
    const preds = t.predecessors || [];
    let mainPred = null;

    if (preds.length === 0) {
      mainPred = null; // part de 0
    } else if (preds.length === 1) {
      mainPred = preds[0];
    } else {
      // prédécesseur qui donne ES (plus grand EF)
      let bestId = preds[0];
      let bestEF = perTask[bestId].EF;
      preds.forEach((pid) => {
        const ef = perTask[pid].EF;
        if (ef > bestEF) {
          bestEF = ef;
          bestId = pid;
        }
      });
      mainPred = bestId;
    }

    const endEv = endEventByTaskId[t.id];
    const fromEv = mainPred ? endEventByTaskId[mainPred] : startEvent;
    if (!endEv || !fromEv) return;

    const isCritical = Math.abs(slackOf[t.id] || 0) < 1e-6;

    // arc principal: tâche réelle
    arcs.push({
      from: fromEv,
      to: endEv,
      label: `${t.id} (${formatValueByUnit(t.duration, displayUnit)})`,
      critical: isCritical,
      dashed: false,
    });

    // arcs fictifs 
    if (preds.length > 1) {
      preds.forEach((pid) => {
        if (pid === mainPred) return;

    
        if (canReach(pid, mainPred)) return;

        const fromEvDummy = endEventByTaskId[pid];
        const toEvDummy = endEventByTaskId[mainPred];
        if (!fromEvDummy || !toEvDummy) return;

        arcs.push({
          from: fromEvDummy,
          to: toEvDummy,
          label: "",
          critical: false,
          dashed: true,
        });
      });
    }
  });

  // ---------- 3) Positions des événements ----------
  const circleR = 40; // cercle kbiiir
  const xStep = 150;
  const yCenter = 180;
  const altOffset = 80;

  const eventPos = new Map();
  events.forEach((ev) => {
    const idx = ev.index;
    const x = 80 + idx * xStep;

    let y = yCenter;
    if (!ev.isStart && !ev.isEnd) {
      const tId = ev.taskId;
      const s = tId != null ? slackOf[tId] || 0 : 0;
      if (s > 0) {
        y = yCenter + (ev.index % 2 === 0 ? altOffset : -altOffset);
      }
    }
    eventPos.set(ev, { x, y });
  });

  const width = 80 + events.length * xStep + 40;
  const height = yCenter * 2;

  // ---------- 4) Rendu SVG ----------
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", maxHeight: "360px" }}
    >
      <defs>
        <marker
          id="arrowhead-red"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L6,3 z" fill="#ef4444" />
        </marker>
        <marker
          id="arrowhead-gray"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L6,3 z" fill="#9ca3af" />
        </marker>
      </defs>

      {/* ARCS (tâches + dummies) */}
      {arcs.map((a, idx) => {
        const fromPos = eventPos.get(a.from);
        const toPos = eventPos.get(a.to);
        if (!fromPos || !toPos) return null;

        const sameLane = fromPos.y === toPos.y;
        const yOffset = sameLane ? 0 : fromPos.y < toPos.y ? 10 : -10;

        const x1 = fromPos.x + circleR;
        const y1 = fromPos.y + yOffset;
        const x2 = toPos.x - circleR;
        const y2 = toPos.y + yOffset;

        const color = a.critical ? "#ef4444" : "#9ca3af";
        const dash = a.dashed ? "4 4" : "0";
        const markerId = a.critical ? "arrowhead-red" : "arrowhead-gray";

        return (
          <g key={idx}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth="2"
              strokeDasharray={dash}
              markerEnd={`url(#${markerId})`}
            />
            {a.label && !a.dashed && (
              <text
                x={(x1 + x2) / 2}
                y={(y1 + y2) / 2 - 8}
                fontSize="11"
                fill={color}
                textAnchor="middle"
              >
                {a.label}
              </text>
            )}
          </g>
        );
      })}

      {/* ÉVÉNEMENTS */}
      {events.map((ev, idx) => {
        const pos = eventPos.get(ev);
        if (!pos) return null;

        const strokeColor =
          ev.isStart || ev.isEnd ? "#ef4444" : "#111827";

        return (
          <g key={idx} transform={`translate(${pos.x}, ${pos.y})`}>
            {/* cercle */}
            <circle
              cx="0"
              cy="0"
              r={circleR}
              fill="#ffffff"
              stroke={strokeColor}
              strokeWidth="2"
            />

            {/* ligne horizontale  */}
            <line
              x1={-circleR}
              y1="0"
              x2={circleR}
              y2="0"
              stroke={strokeColor}
              strokeWidth="1"
            />

            {/* ligne verticale */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2={circleR}
              stroke={strokeColor}
              strokeWidth="1"
            />

            {/* numéro de l'événement  */}
            <text
              x="0"
              y={-10}
              fontSize="13"
              fontWeight="600"
              textAnchor="middle"
              fill="#111827"
            >
              {ev.label}
            </text>

            {/* bas gauche: date au plus tôt */}
            <text
              x={-circleR + 8}
              y={20}
              fontSize="11"
              fill="#111827"
            >
              {formatValueByUnit(ev.earliest, displayUnit)}
            </text>

            {/* bas droite: date au plus tard */}
            <text
              x={circleR - 8}
              y={20}
              fontSize="11"
              textAnchor="end"
              fill="#111827"
            >
              {formatValueByUnit(ev.latest, displayUnit)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default PertDiagram;
