import fs from "fs";
import path from "path";
import { REPO_ROOT } from "./paths.js";

const ENV_LOCAL = path.join(REPO_ROOT, ".env.local");
let cached = null;

function parseEnvFile(text) {
  const env = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function loadFile() {
  if (cached) return cached;
  cached = fs.existsSync(ENV_LOCAL)
    ? parseEnvFile(fs.readFileSync(ENV_LOCAL, "utf8"))
    : {};
  return cached;
}

export function getEnv(name) {
  if (process.env[name] != null) return process.env[name];
  return loadFile()[name];
}
