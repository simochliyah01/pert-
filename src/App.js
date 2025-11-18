// src/App.js
import { useState } from "react";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import TaskTable from "./components/TaskTable";
import GenerateButtons from "./components/GenerateButtons";
import ResultsTabs from "./components/ResultsTabs";
import ExportPdfButton from "./components/ExportPdfButton";
import PertExplanation from "./components/PertExplanation";

import { computePert } from "./utils/pert";

function App() {
  const [tasks, setTasks] = useState([
    {
      id: "",
      description: "",
      durationValue: "",
      durationUnit: "min",
      predecessors: "",
    },
  ]);

  const [pertResult, setPertResult] = useState(null);
  const [activeTab, setActiveTab] = useState("dates");
  const [displayUnit, setDisplayUnit] = useState("min"); // "min" | "jours"

  const updateTaskField = (index, field, value) => {
    setTasks((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addTask = () => {
    setTasks((prev) => [
      ...prev,
      {
        id: "",
        description: "",
        durationValue: "",
        durationUnit: "min",
        predecessors: "",
      },
    ]);
  };

  const deleteTask = (index) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const resetTasks = () => {
    setTasks([
      {
        id: "",
        description: "",
        durationValue: "",
        durationUnit: "min",
        predecessors: "",
      },
    ]);
    setPertResult(null);
    setActiveTab("dates");
  };

  const runPertComputation = () => {
    const cleaned = tasks.filter(
      (t) =>
        t.id &&
        t.durationValue !== "" &&
        !Number.isNaN(Number(t.durationValue))
    );
    if (cleaned.length === 0) {
      throw new Error("Aucune tâche valide à calculer.");
    }
    return computePert(cleaned);
  };

  const handleGeneratePert = () => {
    try {
      const res = runPertComputation();
      setPertResult(res);
      setActiveTab("dates");
    } catch (e) {
      console.error(e);
      alert(
        "Erreur dans les données des tâches (IDs, durées ou prédécesseurs)."
      );
    }
  };

  return (
    <div className="app-root">
      <Header />

      <TaskTable
        tasks={tasks}
        onChangeField={updateTaskField}
        onAddTask={addTask}
        onDeleteTask={deleteTask}
        onReset={resetTasks}
      />

      <GenerateButtons onGeneratePert={handleGeneratePert} />

      {pertResult && (
        <>
          {/* choix unité d'affichage */}
          <div style={{ marginTop: "16px", marginBottom: "-8px" }}>
            <label style={{ marginRight: "8px" }}>
              Unité d&apos;affichage :
            </label>
            <select
              value={displayUnit}
              onChange={(e) => setDisplayUnit(e.target.value)}
            >
              <option value="min">Minutes</option>
              <option value="jours">Jours</option>
            </select>
          </div>

          <ResultsTabs
            tasks={tasks}
            pertResult={pertResult}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            displayUnit={displayUnit}
          />

          <ExportPdfButton
            tasks={tasks}
            pertResult={pertResult}
            displayUnit={displayUnit}
          />

          <PertExplanation />
        </>
        
      )}

      <Footer />
    </div>
  );
}

export default App;
