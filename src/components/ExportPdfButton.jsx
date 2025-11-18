// src/components/ExportPdfButton.jsx
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import CriticalPath from "./CriticalPath";
import PertDiagram from "./PertDiagram";
import { formatValueByUnit, unitLabel } from "../utils/units";

function ExportPdfButton({ tasks, pertResult, displayUnit }) {
  const pdfRef = useRef(null);

  const handleExport = async () => {
    if (!pdfRef.current) return;

    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save("rapport_pert.pdf");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la génération du PDF.");
    }
  };

  if (!pertResult) return null;

  const { perTask } = pertResult;

  return (
    <>
      <button
        className="btn btn-secondary"
        style={{ marginTop: "16px" }}
        onClick={handleExport}
      >
        Exporter en PDF
      </button>

      {/* Bloc caché pour la version PDF uniquement */}
      <div
        ref={pdfRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "800px",
          background: "#ffffff",
          padding: "16px",
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {/* 1) TABLE DES DATES (version PDF spéciale) */}
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#2a4b7c",
            marginBottom: "8px",
          }}
        >
          Dates au plus tôt / au plus tard
        </h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12px",
            border: "1px solid #e5e7eb",
          }}
        >
          <thead>
            <tr>
              {[
                "Tâche",
                "Durée",
                "ES (Début tôt)",
                "EF (Fin tôt)",
                "LS (Début tard)",
                "LF (Fin tard)",
                "Marge totale",
              ].map((title) => (
                <th
                  key={title}
                  style={{
                    padding: "6px",
                    background: "#e8f0fe",
                    color: "#1e3a8a",
                    fontWeight: 600,
                    borderBottom: "2px solid #d0d7e6",
                    borderRight: "1px solid #d0d7e6",
                    textAlign: "center",
                  }}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tasks.map((t, idx) => {
              const row = perTask[t.id];
              if (!row) return null;

              const slack = formatValueByUnit(
                row.LS - row.ES,
                displayUnit
              );

              const baseRowStyle = {
                padding: "6px",
                borderBottom: "1px solid #f1f5f9",
                borderRight: "1px solid #f1f5f9",
                textAlign: "center",
              };

              const isEven = idx % 2 === 1;
              const rowBg = isEven ? "#f9fafc" : "#ffffff";

              return (
                <tr key={t.id} style={{ background: rowBg }}>
                  <td
                    style={{
                      ...baseRowStyle,
                      fontWeight: 700,
                      color: "#1e40af",
                    }}
                  >
                    {t.id}
                  </td>
                  <td style={baseRowStyle}>
                    {formatValueByUnit(row.duration, displayUnit)}{" "}
                    {unitLabel(displayUnit)}
                  </td>
                  <td style={baseRowStyle}>
                    {formatValueByUnit(row.ES, displayUnit)}
                  </td>
                  <td style={baseRowStyle}>
                    {formatValueByUnit(row.EF, displayUnit)}
                  </td>
                  <td style={baseRowStyle}>
                    {formatValueByUnit(row.LS, displayUnit)}
                  </td>
                  <td style={baseRowStyle}>
                    {formatValueByUnit(row.LF, displayUnit)}
                  </td>
                  <td style={baseRowStyle}>{slack}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* 2) CHEMIN CRITIQUE */}
        <div style={{ marginTop: "24px" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#2a4b7c",
              marginBottom: "8px",
            }}
          >
            Chemin critique
          </h2>
          <CriticalPath
            pertResult={pertResult}
            displayUnit={displayUnit}
          />
        </div>

        {/* 3) DIAGRAMME PERT */}
        <div style={{ marginTop: "24px" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#2a4b7c",
              marginBottom: "8px",
            }}
          >
            Diagramme PERT
          </h2>
          <PertDiagram
            pertResult={pertResult}
            displayUnit={displayUnit}
          />
        </div>
      </div>
    </>
  );
}

export default ExportPdfButton;
