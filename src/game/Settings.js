import { readJson, writeJson } from "./storage.js";

const KEY = "blobtide_settings";

export const DEFAULT_SETTINGS = {
  muted: false,
  music: 0.7,
  sfx: 1,
};

function clamp01(n, fallback) {
  const v = Number(n);
  if (!Number.isFinite(v)) return fallback;
  return Math.min(1, Math.max(0, v));
}

export function normalizeSettings(raw) {
  const data = raw && typeof raw === "object" ? raw : {};
  return {
    muted: data.muted === true,
    music: clamp01(data.music, DEFAULT_SETTINGS.music),
    sfx: clamp01(data.sfx, DEFAULT_SETTINGS.sfx),
  };
}

export const SettingsStore = {
  load() {
    return normalizeSettings(readJson(KEY, null));
  },
  save(state) {
    writeJson(KEY, normalizeSettings(state));
  },
};
