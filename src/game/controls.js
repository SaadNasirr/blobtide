export function canRestart(state, ended, paused) {
  if (state === "menu") return false;
  return !!(ended || paused);
}
