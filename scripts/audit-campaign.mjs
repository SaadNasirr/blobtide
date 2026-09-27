import { LEVELS, simulatePlay } from "../src/content/levels.js";

function drain(n, hp) {
  let c = Math.max(0, n | 0);
  let left = Math.max(1, hp | 0);
  let ticks = 0;
  while (c > 0 && left > 0) {
    const take = Math.min(1, left, c);
    left -= take;
    c -= take;
    ticks += 1;
    if (c <= 0) return { win: false, c, left, ticks, tieWipe: left <= 0 };
    if (left <= 0) return { win: true, c, left, ticks, tieWipe: false };
  }
  return { win: false, c, left, ticks, tieWipe: false };
}

const HAZ = new Set(["saw", "wall", "spinner", "crusher", "geyser", "pendulum", "orbit", "slam", "beam"]);
const summary = { levels: LEVELS.length, simFail: [], tieDoor: [], drainFail: [], centerPulse: [], closeMargin: [] };

for (const level of LEVELS) {
  const sim = simulatePlay(level);
  const finish = level.pieces.find((p) => p.type === "finish");
  const hp = finish?.hp || 1;
  const live = drain(sim.n, hp);
  const centerPulse = level.pieces.filter(
    (p) => HAZ.has(p.type) && (p.pulse || p.move) && Math.abs(p.x || 0) < 0.55
  );
  const leech = level.pieces.filter((p) => p.type === "leech");
  const armies = level.pieces.filter((p) => p.type === "army" || p.type === "beast");
  const row = {
    id: level.id,
    start: level.startCount,
    simOk: !!sim.ok,
    simN: sim.n,
    hp,
    margin: (sim.n | 0) - hp,
    drainWin: live.win,
    tieWipe: live.tieWipe,
    equalDoor: sim.n === hp,
    centerPulse: centerPulse.map((p) => p.type),
    leech: leech.length,
    armies: armies.map((p) => ({ t: p.type, hp: p.count || p.hp })),
    at: sim.at || null,
  };
  if (!sim.ok) summary.simFail.push(row);
  if (row.equalDoor) summary.tieDoor.push(row);
  if (sim.ok && !live.win) summary.drainFail.push(row);
  if (centerPulse.length) summary.centerPulse.push({ id: level.id, types: row.centerPulse, margin: row.margin });
  if (sim.ok && row.margin <= 3) summary.closeMargin.push({ id: level.id, margin: row.margin, n: sim.n, hp });
}

console.log(JSON.stringify(summary, null, 2));
