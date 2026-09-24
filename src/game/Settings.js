const KEY = "blobtide_settings";

export const DEFAULT_SETTINGS = {
  muted: false,
};

export function normalizeSettings(raw) {
  return { ...DEFAULT_SETTINGS, ...(raw && typeof raw === "object" ? raw : {}) };
}

export const SettingsStore = {
  load() {
    try {
      return normalizeSettings(JSON.parse(localStorage.getItem(KEY) || "null"));
    } catch {
      return normalizeSettings(null);
    }
  },
  save(state) {
    localStorage.setItem(KEY, JSON.stringify(normalizeSettings(state)));
  },
};
