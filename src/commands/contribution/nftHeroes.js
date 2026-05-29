import { getEnv } from "./envLocal.js";

export function loadNftHeroes() {
  const raw = getEnv("NFT_HEROES");
  if (!raw) return new Set();
  return new Set(
    raw
      .split(",")
      .map((n) => n.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function makeIsNft(nftHeroes) {
  return (name) => nftHeroes.has(name.toLowerCase());
}
