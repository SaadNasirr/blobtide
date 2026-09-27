import { attachWorld } from "./themes.js";

/** Apply a gate to the whole crowd once. */
export function applyOp(op, count, value) {
  const v = Math.max(1, Math.floor(value));
  let n = Math.max(0, Math.floor(count));
  if (op === "add") n += v;
  else if (op === "sub") n = Math.max(0, n - v);
  else if (op === "mul") n *= v;
  else if (op === "div") n = Math.floor(n / v);
  return Math.min(n, 99999);
}

export function opLabel(op, value) {
  const v = Math.max(1, Math.floor(value));
  if (op === "add") return `+${v}`;
  if (op === "sub") return `-${v}`;
  if (op === "mul") return `x${v}`;
  if (op === "div") return `/${v}`;
  return `+${v}`;
}

export function simulateBest(level) {
  let n = level.startCount;
  const pieces = [...level.pieces].sort((a, b) => a.z - b.z);
  for (const p of pieces) {
    if (p.type === "gate") {
      if ((p.op === "sub" || p.op === "div") && ((p.width || 2.2) < 1.85 || Math.abs(p.x || 0) > 0.45)) continue;
      n = applyOp(p.op, n, p.value);
    }
    else if (p.type === "dualgate") {
      const l = applyOp(p.left.op, n, p.left.value);
      const r = applyOp(p.right.op, n, p.right.value);
      n = Math.max(l, r);
    } else if (p.type === "saw" || p.type === "wall" || p.type === "spinner" || p.type === "crusher" || p.type === "geyser" || p.type === "pendulum" || p.type === "orbit" || p.type === "slam" || p.type === "beam") {
      if (p.move) continue;
      if (p.pulse) continue;
      if (Math.abs(p.x || 0) < 0.55) n = Math.max(0, n - (p.damage || 2));
    } else if (p.type === "hole") {
      if (Math.abs(p.x || 0) < 0.55) n = Math.max(0, Math.floor(n * 0.7));
    }     else if (p.type === "grow") n += Math.max(1, Math.floor(p.amount || 8));
    else if (p.type === "army") {
      if (n <= p.count) return { count: 0, hp: (p.count || 1) + 1 };
      n -= p.count;
    } else if (p.type === "beast") {
      const hp = p.hp || p.count;
      if (n <= hp) return { count: 0, hp: hp + 1 };
      n -= hp;
    } else if (p.type === "finish") return { count: n, hp: p.hp };
  }
  return { count: n, hp: 1 };
}

/** Greedy playtest: best or trap dual, dodge off-center traps, fight if bigger. */
export function simulatePlay(level, opts = {}) {
  const pickWorst = !!opts.worst;
  let n = Math.max(0, level.startCount | 0);
  let x = 0;
  const pieces = [...level.pieces].sort((a, b) => a.z - b.z);
  for (const p of pieces) {
    if (p.type === "gate") {
      const reach = (p.width || 2.2) * 0.5 + 0.2;
      if (Math.abs(x - (p.x || 0)) > reach) continue;
      n = applyOp(p.op, n, p.value);
    } else if (p.type === "dualgate") {
      const l = applyOp(p.left.op, n, p.left.value);
      const r = applyOp(p.right.op, n, p.right.value);
      if (pickWorst) {
        n = Math.min(l, r);
        x = l <= r ? -1.12 : 1.12;
      } else {
        n = Math.max(l, r);
        x = l >= r ? -1.12 : 1.12;
      }
    } else if (p.type === "grow") n += Math.max(1, Math.floor(p.amount || 8));
    else if (p.type === "saw" || p.type === "wall" || p.type === "spinner" || p.type === "crusher" || p.type === "geyser" || p.type === "pendulum" || p.type === "orbit" || p.type === "slam" || p.type === "beam") {
      if (p.move || p.pulse) {
        x = Math.abs(x) > 1 ? x : 1.8;
        continue;
      }
      const hx = p.x || 0;
      if (Math.abs(hx) > 0.45) x = -Math.sign(hx || 1) * 1.85;
      else n = Math.max(0, n - (p.damage || 3));
    } else if (p.type === "hole") {
      const hx = p.x || 0;
      if (Math.abs(hx) > 0.45) x = -Math.sign(hx || 1) * 1.85;
      else n = Math.max(0, Math.floor(n * 0.7));
    } else if (p.type === "army" || p.type === "beast") {
      const hp = Math.max(1, (p.count || p.hp || 1) | 0);
      if (n > hp) n -= hp;
      else return { ok: false, n, hp, at: p.type };
    } else if (p.type === "chaser") {
      continue;
    } else if (p.type === "finish") {
      return { ok: n >= p.hp, n, hp: p.hp };
    }
  }
  return { ok: false, n };
}

function gate(z, op, value, x = 0) {
  return { z, type: "gate", op, value, x };
}
function dual(z, left, right) {
  return { z, type: "dualgate", left, right };
}
/** One side grows the crowd; the other shrinks it. */
function trapSplit(z, seed) {
  const goods = [
    { op: "mul", value: 2 },
    { op: "add", value: 5 + (seed % 5) },
    { op: "add", value: 8 },
  ];
  const bads = [
    { op: "sub", value: 12 + (seed % 8) },
    { op: "div", value: 2 },
    { op: "sub", value: 16 },
    { op: "div", value: 3 },
    { op: "sub", value: 10 + (seed % 7) },
  ];
  const good = goods[seed % goods.length];
  const bad = bads[(seed * 3 + 1) % bads.length];
  return seed % 2 === 0 ? dual(z, good, bad) : dual(z, bad, good);
}
function saw(z, x, damage, width = 1.4) {
  return { z, type: "saw", x, damage, width };
}
function hole(z, x, width = 2) {
  return { z, type: "hole", x, width };
}
function wall(z, x, width = 1.3, damage = 3) {
  return { z, type: "wall", x, width, damage };
}
function mover(z, x, damage, amp = 1.55, speed = 2.8) {
  return { z, type: "saw", x, damage, width: 1.35, move: true, amp, speed };
}
function army(z, count, x = 0) {
  return { z, type: "army", x, count };
}
function coin(z, x, amount = 6) {
  return { z, type: "coin", x, amount };
}
function boost(z, x = 0) {
  return { z, type: "boost", x };
}
function shield(z, x = 0) {
  return { z, type: "shield", x };
}
function magnet(z, x = 0) {
  return { z, type: "magnet", x };
}
function star(z, x = 0) {
  return { z, type: "star", x };
}
function grow(z, x = 0, amount = 8) {
  return { z, type: "grow", x, amount };
}
function spinner(z, x, damage, width = 1.7) {
  return { z, type: "spinner", x, damage, width };
}
function crusher(z, x, damage, width = 2.2) {
  return { z, type: "crusher", x, damage, width };
}
function geyser(z, x, damage) {
  return { z, type: "geyser", x, damage, width: 1.55, pulse: true, period: 3 };
}
function pendulum(z, x, damage) {
  return { z, type: "pendulum", x, damage, width: 1.4, move: true, amp: 1.05, speed: 2.15 };
}
function orbit(z, x, damage) {
  return { z, type: "orbit", x, damage, width: 1.2, pulse: true };
}
function slam(z, x, damage) {
  return { z, type: "slam", x, damage, width: 1.7, pulse: true };
}
function beam(z, x, damage) {
  return { z, type: "beam", x, damage, width: 1.25, move: true, amp: 1.7, speed: 2.35 };
}
function leech(z, x, amount = 20) {
  const v = Number(amount) || 20;
  return { z, type: "leech", x, amount: v <= 14 ? 10 : v >= 26 ? 30 : 20 };
}
function snare(z, x = 0) {
  return { z, type: "snare", x };
}
function chaser(z, damage = 4) {
  return { z, type: "chaser", x: 0, damage, width: 1.5 };
}
function redSide(z, x, seed) {
  const sub = seed % 2 === 0;
  return { z, type: "gate", op: sub ? "sub" : "div", value: sub ? 8 + (seed % 7) : 2 + (seed % 2), x: 0, width: 1.02 };
}
function beast(z, hp, x = 0) {
  return { z, type: "beast", x, hp, count: hp };
}
function finish(z, hp, extra = {}) {
  return { z, type: "finish", hp, beast: !!extra.beast };
}

function handcrafted() {
  return [
    {
      id: 1,
      startCount: 2,
      pieces: [
        coin(8, 0, 6),
        coin(12, 1.2, 6),
        coin(16, -1.2, 6),
        gate(26, "add", 4),
        coin(36, 0, 8),
        gate(48, "add", 6),
        coin(58, 1.3, 8),
        saw(70, 1.7, 4, 1.4),
        geyser(82, 0, 5),
        coin(94, 1.3, 8),
        trapSplit(106, 1),
        coin(118, 0, 8),
        army(132, 8),
        gate(146, "add", 8),
        coin(156, 0, 8),
        spinner(168, 1.65, 4),
        coin(178, -1.2, 8),
        finish(178, 12),
      ],
    },
    {
      id: 2,
      startCount: 4,
      pieces: [
        coin(8, 0, 6),
        gate(18, "mul", 2),
        coin(28, -1.4, 8),
        coin(32, 0, 6),
        coin(36, 1.4, 6),
        gate(48, "add", 8),
        saw(60, 1.7, 5, 1.45),
        coin(70, 0, 8),
        army(84, 10),
        gate(98, "add", 10),
        star(108, 0),
        coin(116, 0, 8),
        spinner(128, -1.6, 5),
        boost(140, 0.4),
        magnet(150, 0),
        coin(158, 1.3, 10),
        crusher(170, 1.55, 5),
        pendulum(178, 0, 6),
        finish(194, 12),
      ],
    },
    {
      id: 3,
      startCount: 5,
      pieces: [
        coin(8, 0, 8),
        gate(18, "add", 4),
        boost(28, 0),
        coin(36, 1.3, 8),
        saw(48, 1.65, 5, 1.5),
        coin(58, -1.6, 8),
        magnet(68, -0.4),
        coin(76, 1.5, 8),
        gate(88, "add", 5),
        army(102, 6),
        grow(114, 0, 8),
        star(118, 1.1),
        coin(128, 0, 10),
        spinner(140, -1.65, 5),
        wall(152, -1.95, 1.5, 5),
        orbit(160, 0, 6),
        crusher(172, 1.5, 5),
        finish(188, 14),
      ],
    },
    {
      id: 4,
      startCount: 5,
      pieces: [
        coin(8, -1.2, 8),
        trapSplit(18, 3),
        coin(30, -1.4, 8),
        magnet(40, 0),
        coin(48, 1.3, 8),
        mover(60, 0, 5, 1.7),
        boost(72, -0.8),
        grow(82, 0.6, 8),
        gate(94, "add", 4),
        beast(108, 9),
        star(120, 0),
        coin(128, -1.2, 10),
        spinner(140, 1.6, 5),
        hole(152, 1.6, 1.9),
        slam(160, 0, 7),
        finish(176, 12),
      ],
    },
    {
      id: 5,
      startCount: 7,
      pieces: [
        coin(8, 0, 8),
        gate(16, "add", 3),
        shield(26, 1.5),
        hole(38, 1.55, 2.1),
        coin(48, -1.5, 8),
        boost(58, 0),
        trapSplit(70, 5),
        magnet(82, -1.2),
        coin(90, 1.4, 10),
        army(104, 10),
        grow(116, 0, 8),
        star(126, -0.8),
        coin(134, 0, 10),
        spinner(146, -1.6, 6),
        crusher(158, 1.5, 6),
        mover(170, 0, 7, 1.75),
        beam(182, 0, 7),
        leech(190, 0, 10),
        finish(206, 14),
      ],
    },
    {
      id: 6,
      startCount: 8,
      pieces: [
        coin(8, 1.2, 8),
        trapSplit(18, 6),
        boost(28, -1.2),
        saw(40, 1.55, 6),
        magnet(50, 0),
        coin(58, 1.5, 10),
        gate(70, "mul", 2),
        army(84, 12),
        wall(96, -1.8, 1.6, 4),
        star(108, 1.2),
        grow(118, 0, 10),
        spinner(130, 1.65, 6),
        coin(140, 1.6, 12),
        crusher(152, -1.5, 6),
        trapSplit(164, 16),
        chaser(172, 5),
        finish(188, 22),
      ],
    },
    {
      id: 7,
      startCount: 6,
      pieces: [
        coin(8, 0, 8),
        gate(16, "mul", 3),
        wall(28, 1.9, 1.7, 5),
        boost(38, 0),
        magnet(48, -0.6),
        snare(54, 1.1),
        coin(56, 1.4, 10),
        trapSplit(68, 7),
        beast(82, 11),
        mover(96, 0, 6, 1.8),
        star(108, 0.8),
        grow(118, -0.8, 10),
        spinner(130, -1.65, 6),
        shield(142, 1.2),
        coin(150, 0, 12),
        crusher(162, 1.5, 6),
        saw(174, -1.7, 7, 1.5),
        finish(190, 22),
      ],
    },
    {
      id: 8,
      startCount: 10,
      pieces: [
        coin(8, 0, 8),
        trapSplit(18, 8),
        shield(28, -1.4),
        gate(40, "mul", 2),
        magnet(50, 0),
        coin(58, -1.3, 10),
        saw(70, 1.75, 7),
        army(84, 12),
        boost(96, 0),
        grow(106, 0, 10),
        spinner(118, -1.6, 6),
        hole(130, -1.5, 1.9),
        star(142, 1.1),
        coin(150, 0, 12),
        crusher(162, 1.5, 7),
        mover(174, 0, 8, 1.85),
        finish(192, 24),
      ],
    },
  ];
}


function retuneEncounters(id, startCount, pieces) {
  let n = startCount;
  let x = 0;
  const frac = 0.2 + Math.min(0.14, (id / 56) * 0.14);
  for (const p of pieces) {
    if (p.type === "gate") {
      const reach = (p.width || 2.2) * 0.5 + 0.2;
      if (Math.abs(x - (p.x || 0)) > reach) continue;
      n = applyOp(p.op, n, p.value);
    } else if (p.type === "dualgate") {
      const l = applyOp(p.left.op, n, p.left.value);
      const r = applyOp(p.right.op, n, p.right.value);
      n = Math.max(l, r);
      x = l >= r ? -1.12 : 1.12;
    } else if (p.type === "grow") n += Math.max(1, Math.floor(p.amount || 8));
    else if (p.type === "saw" || p.type === "wall" || p.type === "spinner" || p.type === "crusher" || p.type === "geyser" || p.type === "pendulum" || p.type === "orbit" || p.type === "slam" || p.type === "beam") {
      if (p.move || p.pulse) {
        x = Math.abs(x) > 1 ? x : 1.8;
        continue;
      }
      const hx = p.x || 0;
      if (Math.abs(hx) > 0.45) x = -Math.sign(hx || 1) * 1.85;
      else n = Math.max(0, n - (p.damage || 3));
    } else if (p.type === "hole") {
      const hx = p.x || 0;
      if (Math.abs(hx) > 0.45) x = -Math.sign(hx || 1) * 1.85;
      else n = Math.max(0, Math.floor(n * 0.7));
    } else if (p.type === "army" || p.type === "beast") {
      const want = Math.max(3, Math.floor(n * frac));
      const cap = Math.max(2, n - 1);
      const hp = Math.min(cap, want);
      p.count = hp;
      p.hp = hp;
      n -= hp;
    }
  }
}

function generated(id) {
  const startCount = 4 + Math.floor(id / 12);
  const side = id % 2 === 0 ? 1 : -1;
  const family = (id * 5 + Math.floor(id / 4)) % 16;
  const dmg = 5 + Math.floor(id / 8) + (id % 4);
  const add = 2 + (id % 4);
  const pieces = [];
  let z = 8;
  const push = (piece, gap = 12) => {
    pieces.push(piece);
    z += gap;
  };
  const special = (at) => {
    const kind = (id + at) % 7;
    if (kind === 0) push(geyser(z, 0, dmg), 13);
    else if (kind === 1) push(pendulum(z, 0, dmg + 1), 13);
    else if (kind === 2) push(orbit(z, 0, dmg), 13);
    else if (kind === 3) push(slam(z, 0, dmg + 2), 13);
    else if (kind === 4) push(beam(z, 0, dmg + 1), 13);
    else if (kind === 5) push(leech(z, 0, 28 + id), 9);
    else push(snare(z, side * 0.45), 10);
  };

  if (id % 3 === 0) {
    push(coin(z, 0, 8), 5);
    push(coin(z, side * 1.35, 8), 5);
    push(coin(z, -side * 1.35, 8), 8);
  } else if (id % 3 === 1) {
    for (let i = 0; i < 5; i++) push(coin(z, ((i % 2) * 2 - 1) * side * 1.4, 8), 5);
  } else {
    push(coin(z, -1.45, 8), 5);
    push(coin(z, 0, 10), 5);
    push(coin(z, 1.45, 8), 8);
  }

  if (family === 0) {
    push(gate(z, "add", add), 12);
    push(saw(z, side * 1.72, dmg), 12);
    special(0);
    push(trapSplit(z, id), 14);
    push(army(z, 6), 16);
    push(gate(z, "add", 3 + (id % 3)), 13);
    push(crusher(z, -side * 1.5, dmg), 13);
  } else if (family === 1) {
    push(gate(z, "add", add), 12);
    push(boost(z, -side * 0.8), 10);
    push(trapSplit(z, id + 1), 14);
    special(1);
    push(beast(z, 6), 18);
    push(grow(z, 0, 6 + (id % 3)), 11);
    push(wall(z, -side * 1.9, 1.5, dmg), 13);
  } else if (family === 2) {
    push(shield(z, side * 1.1), 10);
    push(gate(z, "add", add + 1), 12);
    push(hole(z, side * 1.58, 1.9), 12);
    special(2);
    push(trapSplit(z, id + 2), 14);
    push(army(z, 7), 16);
    push(spinner(z, side * 1.6, dmg), 13);
  } else if (family === 3) {
    push(trapSplit(z, id + 3), 14);
    push(spinner(z, side * 1.65, dmg), 12);
    special(3);
    push(gate(z, "mul", 2), 14);
    push(army(z, 8), 16);
    push(crusher(z, side * 1.5, dmg), 13);
  } else if (family === 4) {
    push(gate(z, "add", add), 12);
    push(mover(z, 0, dmg, 1.7), 13);
    special(4);
    push(trapSplit(z, id + 4), 14);
    push(army(z, 7), 16);
    push(wall(z, -side * 1.85, 1.55, dmg), 13);
  } else if (family === 5) {
    push(gate(z, "mul", 2), 14);
    special(5);
    push(trapSplit(z, id + 5), 14);
    push(army(z, 8), 16);
    push(saw(z, side * 1.7, dmg), 12);
    push(magnet(z, 0), 10);
  } else if (family === 6) {
    push(gate(z, "add", add + 1), 12);
    push(trapSplit(z, id + 6), 14);
    special(6);
    push(army(z, 7), 16);
    push(spinner(z, side * 1.6, dmg), 13);
    push(grow(z, 0, 6), 11);
  } else if (family === 7) {
    push(trapSplit(z, id + 7), 14);
    push(wall(z, side * 1.9, 1.6, dmg), 12);
    special(7);
    push(beast(z, 7), 18);
    push(hole(z, side * 1.55, 1.8), 12);
  } else if (family === 8) {
    push(gate(z, "add", add), 12);
    push(saw(z, -side * 1.68, dmg), 12);
    special(8);
    push(trapSplit(z, id + 8), 14);
    push(army(z, 8), 16);
    push(spinner(z, -side * 1.58, dmg), 13);
  } else if (family === 9) {
    push(boost(z, 0), 10);
    push(gate(z, "mul", 2), 14);
    special(9);
    push(trapSplit(z, id + 9), 14);
    push(beast(z, 8), 18);
    push(crusher(z, side * 1.48, dmg), 13);
  } else if (family === 10) {
    push(gate(z, "add", add + 2), 12);
    special(10);
    push(trapSplit(z, id + 10), 14);
    push(army(z, 8), 16);
    push(mover(z, 0, dmg, 1.6), 13);
    push(wall(z, -side * 1.88, 1.5, dmg), 13);
  } else if (family === 11) {
    push(shield(z, 0), 10);
    push(trapSplit(z, id + 11), 14);
    push(orbit(z, 0, dmg), 13);
    push(geyser(z, side * 0.2, dmg), 13);
    push(army(z, 9), 16);
    push(beam(z, 0, dmg), 13);
  } else if (family === 12) {
    push(gate(z, "add", add), 12);
    push(pendulum(z, 0, dmg), 13);
    push(trapSplit(z, id + 12), 14);
    push(slam(z, 0, dmg + 1), 13);
    push(beast(z, 8), 18);
    push(spinner(z, side * 1.6, dmg), 13);
  } else if (family === 13) {
    push(gate(z, "mul", 2), 14);
    push(hole(z, -side * 1.55, 1.85), 12);
    special(13);
    push(trapSplit(z, id + 13), 14);
    push(army(z, 9), 16);
    push(crusher(z, -side * 1.5, dmg), 13);
  } else if (family === 14) {
    push(coin(z, side * 1.4, 10), 7);
    push(trapSplit(z, id + 14), 14);
    push(beam(z, 0, dmg), 13);
    push(pendulum(z, 0, dmg), 13);
    push(beast(z, 9), 18);
    push(wall(z, side * 1.9, 1.6, dmg), 13);
  } else {
    push(gate(z, "add", add + 1), 12);
    push(slam(z, 0, dmg + 2), 13);
    push(orbit(z, 0, dmg), 13);
    push(trapSplit(z, id + 15), 14);
    push(army(z, 9), 16);
    push(geyser(z, 0, dmg), 13);
  }

  const waves = 3 + Math.floor(id / 7);
  for (let i = 0; i < waves; i++) {
    const lx = ((i + id) % 2 ? side : -side) * (1.2 + (i % 3) * 0.1);
    push(coin(z, lx, 8 + (id % 3)), 6);
    if (i % 2 === 0) push(redSide(z, -side * 1.18, id + i), 9);
    if (i === 0 && id > 4) push(chaser(z, 3 + (id % 4)), 8);
    if (i === 2) push(leech(z, ((id % 2) * 2 - 1) * 0.15, 32 + id), 8);
    if (i % 4 === 0) {
      if (i % 8 === 0) push(gate(z, i % 2 ? "mul" : "add", i % 2 ? 2 : 2 + (id % 3)), 13);
      else push(redSide(z, side * 1.18, id + i + 3), 9);
    } else if (i % 4 === 1) special(i + 20);
    else if (i % 4 === 2) push(saw(z, -side * 1.68, dmg), 12);
    else push(spinner(z, side * 1.62, dmg), 12);
    if (i % 5 === 3 && id > 22 && i === 3) push(army(z, 6 + (i % 3)), 16);
  }
  if (id > 16) {
    push(trapSplit(z, id + 70), 14);
    special(40);
  }
  if (id > 28) {
    push(mover(z, 0, dmg, 1.62), 13);
    push(beast(z, 8), 18);
  }
  if (id > 40) {
    push(trapSplit(z, id + 90), 14);
    push(slam(z, 0, 8), 13);
    push(beam(z, 0, 8), 13);
  }
  if (id > 48) {
    push(orbit(z, 0, 9), 13);
    push(pendulum(z, 0, 9), 13);
  }
  push(coin(z, ((id % 3) - 1) * 1.2, 10), 9);
  return attachWorld(sealLevel(id, startCount, pieces, family === 6 || id >= 48));
}

function sealLevel(id, startCount, pieces, beastFinish = false) {
  retuneEncounters(id, startCount, pieces);
  const z = (pieces.at(-1)?.z || 8) + 16;
  const draft = { id, startCount, pieces: [...pieces, finish(z, 1)] };
  const best = simulatePlay(draft);
  const worst = simulatePlay(draft, { worst: true });
  const bestN = Math.max(1, best.n | 0);
  const tight = 0.9 + Math.min(0.06, id * 0.001);
  let hp = Math.max(2, Math.min(bestN, Math.floor(bestN * tight) || 1));
  if (!worst.ok && worst.at) {
    hp = Math.max(2, Math.min(hp, Math.floor(bestN * (0.78 + id * 0.002)) || 1));
  } else {
    const w = Math.max(0, worst.n | 0);
    if (w >= hp) hp = Math.min(bestN, w + 1);
  }
  if (hp >= bestN) hp = Math.max(1, bestN - 1);
  if (bestN < 2) hp = 1;
  if (pieces.some((p) => p.type === "chaser") && bestN >= 4) hp = Math.min(hp, bestN - 2);
  pieces.push(finish(z, hp, { beast: beastFinish }));
  return { id, startCount, pieces };
}

export function createLevels() {
  const list = handcrafted().map((l) => {
    const last = l.pieces.at(-1);
    return attachWorld(sealLevel(l.id, l.startCount, l.pieces.filter((p) => p.type !== "finish"), !!last.beast));
  });
  for (let id = 9; id <= 56; id++) list.push(generated(id));
  return list;
}

export const LEVELS = createLevels();
