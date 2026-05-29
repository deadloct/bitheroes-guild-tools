import { getEnv } from "./envLocal.js";

const DEFAULT_GREEN = 500_000;
const DEFAULT_YELLOW = 250_000;

function parseThreshold(name, fallback) {
  const raw = getEnv(name);
  if (raw == null || raw === "") return fallback;
  const n = Number(raw.replace(/[_,]/g, ""));
  if (!Number.isFinite(n)) {
    throw new Error(`Invalid number for ${name} in .env.local: ${raw}`);
  }
  return n;
}

export function loadThresholds() {
  return {
    green: parseThreshold("CONTRIBUTION_GREEN_THRESHOLD", DEFAULT_GREEN),
    yellow: parseThreshold("CONTRIBUTION_YELLOW_THRESHOLD", DEFAULT_YELLOW),
  };
}
