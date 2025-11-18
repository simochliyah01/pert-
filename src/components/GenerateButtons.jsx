// src/components/GenerateButtons.jsx
function GenerateButtons({ onGeneratePert, onGenerateGantt }) {
    return (
      <div className="generate-row">
        <button className="btn btn-primary wide" onClick={onGeneratePert}>
          Générer PERT & Chemin Critique
        </button>
      </div>
    );
  }
  
  export default GenerateButtons;
  