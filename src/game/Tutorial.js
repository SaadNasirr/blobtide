const KEY = "blobtide_tutorial";

export const DEFAULT_TUTORIAL = {
  sessionsStarted: 0,
  skipped: false,
  completedFull: false,
  completedRefresher: false,
  hideInstructions: false,
};

export function normalizeTutorial(raw) {
  return {
    ...DEFAULT_TUTORIAL,
    ...(raw && typeof raw === "object" ? raw : {}),
  };
}

/**
 * Decide what onboarding to show when the player hits Play.
 * replay: settings "Replay tutorial" forces a full run without changing skip flags until they finish/skip.
 */
export function decideTutorialMode(state, { replay = false } = {}) {
  const s = normalizeTutorial(state);
  if (s.hideInstructions && !replay) return "none";
  if (replay) return "full";
  if (s.skipped) return "none";
  if (s.sessionsStarted <= 0) return "full";
  if (s.sessionsStarted === 1 && !s.completedRefresher) return "refresher";
  return "none";
}

export function beginPlaySession(state, { replay = false } = {}) {
  const s = normalizeTutorial(state);
  const mode = decideTutorialMode(s, { replay });
  if (!replay && (mode === "full" || mode === "refresher")) {
    s.sessionsStarted = Math.min(2, s.sessionsStarted + 1);
  }
  if (replay) {
    s.hideInstructions = false;
  }
  return { state: s, mode };
}

export function applyTutorialEvent(state, event) {
  const s = normalizeTutorial(state);
  if (event === "skip") {
    s.skipped = true;
    s.completedFull = true;
    s.completedRefresher = true;
  } else if (event === "complete-full") {
    s.completedFull = true;
  } else if (event === "complete-refresher") {
    s.completedRefresher = true;
  } else if (event === "hide") {
    s.hideInstructions = true;
  } else if (event === "show") {
    s.hideInstructions = false;
  }
  return s;
}

export function createTutorialPersistence(storage) {
  return {
    load() {
      try {
        return normalizeTutorial(JSON.parse(storage.getItem(KEY) || "null"));
      } catch {
        return normalizeTutorial(null);
      }
    },
    save(state) {
      storage.setItem(KEY, JSON.stringify(normalizeTutorial(state)));
    },
  };
}

const memoryFallback = {
  _data: null,
  getItem() {
    return this._data;
  },
  setItem(_, value) {
    this._data = value;
  },
};

export const TutorialStore = createTutorialPersistence({
  getItem(key) {
    try {
      if (typeof localStorage === "undefined") return memoryFallback.getItem(key);
      return localStorage.getItem(key);
    } catch {
      return memoryFallback.getItem(key);
    }
  },
  setItem(key, value) {
    try {
      if (typeof localStorage === "undefined") return memoryFallback.setItem(key, value);
      localStorage.setItem(key, value);
    } catch {
      memoryFallback.setItem(key, value);
    }
  },
});

export const FULL_STEPS = [
  {
    id: "move",
    title: "Swipe",
    body: "Drag to swerve. Green grows you.",
  },
  {
    id: "gates",
    title: "Pick a side",
    body: "Hit + / x. Dodge red.",
  },
  {
    id: "door",
    title: "Fight",
    body: "If your number is bigger, you win the clash.",
  },
];

export const REFRESHER_STEP = {
  id: "refresher",
  title: "Quick reminder",
  body: "Hit green gates. Dodge red. Fight if you are bigger.",
};
