// src/components/PertExplanation.jsx

function PertExplanation() {
    return (
      <div className="card" style={{ marginTop: "24px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
          Rappel sur la méthode PERT
        </h2>
  
        <p style={{ fontSize: "14px", marginBottom: "8px" }}>
          La méthode PERT est un outil de gestion de projet qui permet de
          représenter les tâches, leurs dépendances et la durée globale du
          projet. Elle sert à visualiser l&apos;enchaînement des tâches, à
          identifier le chemin critique et à connaître les marges de temps
          disponibles.
        </p>
  
        <h3 style={{ fontSize: "16px", fontWeight: 600, marginTop: "12px" }}>
          1. Éléments d&apos;un diagramme PERT
        </h3>
        <ul style={{ fontSize: "14px", marginLeft: "18px" }}>
          <li>
            <strong>Les étapes (nœuds)</strong> : les cercles numérotés
            (0, 1, 2, ...). Chaque étape correspond à un &quot;événement&quot; :
            un point où une ou plusieurs tâches se terminent.
          </li>
          <li>
            <strong>Les tâches (flèches)</strong> : elles relient deux
            étapes et sont identifiées par une lettre (A, B, C, ...). La
            durée de la tâche est écrite sur la flèche.
          </li>
          <li>
            <strong>Les antériorités</strong> : une tâche ne peut démarrer
            que si toutes ses tâches précédentes sont terminées.
          </li>
        </ul>
  
        <h3 style={{ fontSize: "16px", fontWeight: 600, marginTop: "12px" }}>
          2. Dates au plus tôt
        </h3>
        <p style={{ fontSize: "14px" }}>
          La <strong>date au plus tôt</strong> d&apos;une étape est la date
          la plus rapprochée à laquelle cette étape peut être atteinte si
          toutes les tâches précédentes sont réalisées dès que possible.
        </p>
        <ul style={{ fontSize: "14px", marginLeft: "18px" }}>
          <li>
            On part de l&apos;étape de début avec une date au plus tôt égale
            à 0.
          </li>
          <li>
            Pour une tâche, on ajoute sa durée à la date au plus tôt de
            l&apos;étape de départ.
          </li>
          <li>
            Pour une étape qui a plusieurs tâches entrantes, sa date au plus
            tôt est le <strong>maximum</strong> des dates d&apos;arrivée de
            ces tâches.
          </li>
        </ul>
  
        <h3 style={{ fontSize: "16px", fontWeight: 600, marginTop: "12px" }}>
          3. Dates au plus tard
        </h3>
        <p style={{ fontSize: "14px" }}>
          La <strong>date au plus tard</strong> d&apos;une étape est la date
          limite à laquelle cette étape doit être atteinte pour ne pas
          retarder la fin du projet.
        </p>
        <ul style={{ fontSize: "14px", marginLeft: "18px" }}>
          <li>
            On part de l&apos;étape de fin avec une date au plus tard égale à
            la durée totale du projet.
          </li>
          <li>
            On remonte vers le début en soustrayant les durées des tâches.
          </li>
          <li>
            Pour une étape qui a plusieurs tâches sortantes, sa date au plus
            tard est le <strong>minimum</strong> des dates de début au plus
            tard de ces tâches.
          </li>
        </ul>
  
        <h3 style={{ fontSize: "16px", fontWeight: 600, marginTop: "12px" }}>
          4. Le chemin critique
        </h3>
        <p style={{ fontSize: "14px" }}>
          Le <strong>chemin critique</strong> est la suite de tâches qui
          détermine directement la durée totale du projet. Toutes les tâches
          de ce chemin ont une marge totale nulle :
        </p>
        <ul style={{ fontSize: "14px", marginLeft: "18px" }}>
          <li>
            Si une tâche du chemin critique est en retard, tout le projet est
            en retard.
          </li>
          <li>
            La durée du projet est égale à la somme des durées sur le chemin
            critique.
          </li>
        </ul>
  
        <h3 style={{ fontSize: "16px", fontWeight: 600, marginTop: "12px" }}>
          5. La marge
        </h3>
        <p style={{ fontSize: "14px" }}>
          La <strong>marge</strong> d&apos;une tâche correspond au temps
          dont on dispose pour la décaler sans repousser la fin du projet.
        </p>
        <ul style={{ fontSize: "14px", marginLeft: "18px" }}>
          <li>
            <strong>Marge totale</strong> : différence entre la date de début
            au plus tard et la date de début au plus tôt de la tâche.
          </li>
          <li>
            <strong>Marge libre</strong> (non calculée dans cet outil) :
            retard possible d&apos;une tâche sans modifier les dates au plus
            tôt des tâches suivantes.
          </li>
          <li>
            Sur le chemin critique, la marge totale est égale à 0.
          </li>
        </ul>
  
        <h3 style={{ fontSize: "16px", fontWeight: 600, marginTop: "12px" }}>
          6. Comment cet outil utilise PERT ?
        </h3>
        <ul style={{ fontSize: "14px", marginLeft: "18px" }}>
          <li>
            Vous saisissez les tâches, leurs durées et leurs prédécesseurs
            (antériorités).
          </li>
          <li>
            L&apos;application calcule automatiquement les dates au plus tôt
            et au plus tard (ES, EF, LS, LF) pour chaque tâche.
          </li>
          <li>
            Elle détermine le chemin critique et la durée totale du projet.
          </li>
          <li>
            Elle trace le diagramme PERT au format CPM (événements dans les
            cercles, tâches sur les flèches) avec les dates au plus tôt / au
            plus tard comme dans le cours.
          </li>
        </ul>
  
        <p
          style={{
            fontSize: "13px",
            marginTop: "12px",
            color: "#6b7280",
            fontStyle: "italic",
          }}
        >
          Astuce : vous pouvez comparer les dates et le chemin critique
          affichés par l&apos;outil avec les calculs du cours pour vérifier
          et mieux comprendre chaque étape.
        </p>
      </div>
    );
  }
  
  export default PertExplanation;
  