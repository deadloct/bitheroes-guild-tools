import { getEnv } from "./envLocal.js";

export function loadIgnoredHeroes() {
  const raw =
    getEnv("IGNORE_HEROES") ??
    getEnv("IGNORED_HEROES") ??
    getEnv("IGNORE_MEMBERS") ??
    getEnv("IGNORED_MEMBERS");
  if (!raw) return new Set();
  return new Set(
    raw
      .split(",")
      .map((n) => n.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function makeIsIgnored(ignoredHeroes) {
  return (name) => ignoredHeroes.has(name.toLowerCase());
}
