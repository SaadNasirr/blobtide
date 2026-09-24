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

export const TutorialStore = createTutorialPersistence(
  typeof localStorage === "undefined" ? memoryFallback : localStorage
);

export const FULL_STEPS = [
  {
    id: "move",
    title: "Swerve",
    body: "Swipe left or right from your finger. On a keyboard, hold A / D or the arrows to steer.",
  },
  {
    id: "gates",
    title: "Gates",
    body: "Green + and x grow your slime. Red − and ÷ shrink it. Pick the bigger path.",
  },
  {
    id: "hazards",
    title: "Hazards",
    body: "Saws, holes, and walls steal slime. Gold coins, cyan boosts, and ice shields are worth grabbing. Tap for nitro.",
  },
  {
    id: "door",
    title: "Smash the door",
    body: "If your crowd number is at least as big as the golden door, you smash it and win coins.",
  },
  {
    id: "meta",
    title: "Pause & skins",
    body: "P or Esc pauses. Coins buy skins. Optional ads can continue a fail or double coins.",
  },
];

export const REFRESHER_STEP = {
  id: "refresher",
  title: "Quick reminder",
  body: "Swerve into green gates. Dodge saws. Smash the door if you are big enough.",
};
