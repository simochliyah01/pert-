// src/utils/units.js

const MINUTES_PER_DAY = 24 * 60;

export function formatValueByUnit(valueInMinutes, displayUnit) {
  let value = valueInMinutes;

  // Conversion selon unité
  if (displayUnit === "jours") {
    value = valueInMinutes / MINUTES_PER_DAY;
  }

  // Arrondir à 2 décimales
  const rounded = Math.round(value * 100) / 100;

  // Si entier -> sans .00
  if (Number.isInteger(rounded)) {
    return String(rounded);
  }

  // Sinon -> 2 décimales
  return rounded.toFixed(2);
}

export function unitLabel(displayUnit) {
  return displayUnit === "jours" ? "jours" : "minutes";
}
