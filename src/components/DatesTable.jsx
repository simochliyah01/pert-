// src/components/DatesTable.jsx
import { formatValueByUnit } from "../utils/units";

function DatesTable({ tasks, pertResult, displayUnit }) {
  return (
    <div>
      <div className="dates-header-row">
        <span>Tâche</span>
        <span>ES (Début au plus tôt)</span>
        <span>EF (Fin au plus tôt)</span>
        <span>LS (Début au plus tard)</span>
        <span>LF (Fin au plus tard)</span>
        <span>Marge</span>
      </div>

      {tasks
        .filter((t) => t.id && pertResult.perTask[t.id])
        .map((t) => {
          const row = pertResult.perTask[t.id];
          const isCritical = row.slack === 0;
          return (
            <div
              key={t.id}
              className={
                "dates-row " + (isCritical ? "dates-row-critical" : "")
              }
            >
              <span>{t.id}</span>
              <span>{formatValueByUnit(row.ES, displayUnit)}</span>
              <span>{formatValueByUnit(row.EF, displayUnit)}</span>
              <span>{formatValueByUnit(row.LS, displayUnit)}</span>
              <span>{formatValueByUnit(row.LF, displayUnit)}</span>
              <span>{formatValueByUnit(row.slack, displayUnit)}</span>
            </div>
          );
        })}
    </div>
  );
}

export default DatesTable;
