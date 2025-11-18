// src/components/TaskRow.jsx
function TaskRow({ task, index, onChangeField, onDelete }) {
    const handleChange = (field) => (e) => {
      onChangeField(index, field, e.target.value);
    };
  
    return (
      <div className="task-row">
        <input
          type="text"
          value={task.id}
          onChange={handleChange("id")}
          placeholder="A"
          className="input"
        />
  
        <input
          type="text"
          value={task.description}
          onChange={handleChange("description")}
          placeholder="Description de la tâche"
          className="input"
        />
  
        <input
          type="number"
          min="0"
          value={task.durationValue}
          onChange={handleChange("durationValue")}
          placeholder="Durée"
          className="input"
        />
  
        <select
          value={task.durationUnit}
          onChange={handleChange("durationUnit")}
          className="input"
        >
          <option value="min">Minutes</option>
          <option value="jours">Jours</option>
        </select>
  
        <input
          type="text"
          value={task.predecessors}
          onChange={handleChange("predecessors")}
          placeholder="ex: A, B, C"
          className="input"
        />
  
        <button
          className="icon-button"
          onClick={() => onDelete(index)}
          title="Supprimer"
        >
          🗑
        </button>
      </div>
    );
  }
  
  export default TaskRow;
  