// src/components/ResultsTabs.jsx
import DatesTable from "./DatesTable";
import CriticalPath from "./CriticalPath";
import PertDiagram from "./PertDiagram";

function ResultsTabs({
  tasks,
  pertResult,
  activeTab,
  onTabChange,
  displayUnit,
}) {
  if (!pertResult) return null;

  return (
    <div className="card results-card">
      {/* Onglets */}
      <div className="tabs-header">
        <button
          className={
            "tab-button " +
            (activeTab === "dates" ? "tab-button-active" : "")
          }
          onClick={() => onTabChange("dates")}
        >
          Dates au plus tôt / au plus tard
        </button>

        <button
          className={
            "tab-button " +
            (activeTab === "critical" ? "tab-button-active" : "")
          }
          onClick={() => onTabChange("critical")}
        >
          Chemin critique
        </button>

        <button
          className={
            "tab-button " +
            (activeTab === "pert" ? "tab-button-active" : "")
          }
          onClick={() => onTabChange("pert")}
        >
          Diagramme PERT
        </button>
      </div>

      {/* Contenu onglets */}
      {activeTab === "dates" && (
        <DatesTable
          tasks={tasks}
          pertResult={pertResult}
          displayUnit={displayUnit}
        />
      )}

      {activeTab === "critical" && (
        <CriticalPath pertResult={pertResult} displayUnit={displayUnit} />
      )}

      {activeTab === "pert" && (
        <PertDiagram pertResult={pertResult} displayUnit={displayUnit} />
      )}
    </div>
  );
}

export default ResultsTabs;
