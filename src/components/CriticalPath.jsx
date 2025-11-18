// src/components/CriticalPath.jsx
import { formatValueByUnit, unitLabel } from "../utils/units";

function CriticalPath({ pertResult, displayUnit }) {
  const { criticalPath, projectDuration } = pertResult;

  const pathString = criticalPath.join(" → ");
  const durationFormatted = formatValueByUnit(
    projectDuration,
    displayUnit
  );

  return (
    <div>
      <p className="critical-title">Chemin critique</p>
      <p>{pathString || "—"}</p>

      <p className="critical-title" style={{ marginTop: "16px" }}>
        Durée totale du projet
      </p>
      <p>
        {durationFormatted} {unitLabel(displayUnit)}
      </p>

      <p className="critical-title" style={{ marginTop: "16px" }}>
        Tâches critiques
      </p>
      <div>
        {criticalPath.map((id) => (
          <span key={id} className="chip-critical">
            {id}
          </span>
        ))}
      </div>
    </div>
  );
}

export default CriticalPath;
