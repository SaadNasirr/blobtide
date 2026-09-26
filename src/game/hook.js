import { SKINS } from "../content/skins.js";

export const MISSIONS = [
  { id: "wins", kind: "wins", target: 3, reward: 40, label: "Win 3 levels" },
  { id: "coins", kind: "coins", target: 60, reward: 25, label: "Pocket 60 coins" },
  { id: "combo", kind: "combo", target: 1, reward: 20, label: "Land a x3 combo" },
  { id: "stars", kind: "stars", target: 1, reward: 35, label: "Smash a 3-star" },
];

export function utcDay(ts = Date.now()) {
  return new Date(ts).toISOString().slice(0, 10);
}

/** Come back tomorrow = streak. Miss a day = reset. Same day = no extra claim. */
export function advanceDaily(lastPlayDay, dailyStreak, now = Date.now()) {
  const today = utcDay(now);
  const prev = typeof lastPlayDay === "string" ? lastPlayDay : "";
  const streakWas = Math.max(0, Math.floor(Number(dailyStreak) || 0));
  if (prev === today) return { day: today, streak: Math.max(1, streakWas), claim: 0 };
  const yesterday = utcDay(now - 86400000);
  const streak = prev === yesterday ? streakWas + 1 : 1;
  const claim = 15 + Math.min(7, streak) * 5;
  return { day: today, streak, claim };
}

export function streakBonus(winStreak) {
  const n = Math.max(0, Math.floor(Number(winStreak) || 0));
  return n * 4;
}

export function nearMiss({ reason, crowd = 0, doorHp = 0 } = {}) {
  if (reason !== "door") return { close: false, line: "Swipe and smash. One more go." };
  const hp = Math.max(1, Math.floor(doorHp));
  const n = Math.max(0, Math.floor(crowd));
  const close = n >= Math.ceil(hp * 0.65);
  if (close) return { close: true, line: `SO CLOSE · ${n} / ${hp}` };
  return { close: false, line: `Need ${hp}. You had ${n}.` };
}

export function nextSkinGoal(ownedSkins, coins) {
  const owned = new Set(ownedSkins || []);
  const next = SKINS.find((s) => !s.iap && s.price > 0 && !owned.has(s.id));
  if (!next) return null;
  return {
    id: next.id,
    name: next.name,
    price: next.price,
    have: Math.max(0, Math.floor(Number(coins) || 0)),
  };
}

export function applyMission(missionIndex, progress, kind, amount = 1) {
  const list = MISSIONS;
  const idx = ((Math.floor(Number(missionIndex) || 0) % list.length) + list.length) % list.length;
  const mission = list[idx];
  let p = Math.max(0, Math.floor(Number(progress) || 0));
  if (mission.kind === kind) p += Math.max(0, Math.floor(Number(amount) || 0));
  if (p < mission.target) {
    return { missionIndex: idx, progress: p, completed: false, reward: 0, mission };
  }
  const next = (idx + 1) % list.length;
  return { missionIndex: next, progress: 0, completed: true, reward: mission.reward, mission };
}
