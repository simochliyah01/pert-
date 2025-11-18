// src/components/TaskTable.jsx
import TaskRow from "./TaskRow";

function TaskTable({ tasks, onChangeField, onAddTask, onDeleteTask, onReset }) {
  return (
    <div className="card">
      <div className="task-header-row">
        <span>Tâche</span>
        <span>Description</span>
        <span>Durée</span>
        <span>Unité</span>
        <span>Prédécesseurs</span>
        <span></span>
      </div>

      {tasks.map((task, index) => (
        <TaskRow
          key={index}
          task={task}
          index={index}
          onChangeField={onChangeField}
          onDelete={onDeleteTask}
        />
      ))}

      <div className="task-actions-row">
        <button className="btn btn-primary" onClick={onAddTask}>
          Ajouter une tâche
        </button>
        <button className="btn btn-secondary" onClick={onReset}>
          Réinitialiser
        </button>
      </div>
    </div>
  );
}

export default TaskTable;
