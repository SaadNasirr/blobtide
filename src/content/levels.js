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
  const v = Math.floor(value);
  if (op === "add") return `+${v}`;
  if (op === "sub") return `-${v}`;
  if (op === "mul") return `x${v}`;
  if (op === "div") return `÷${v}`;
  return "?";
}

export function simulateBest(level) {
  let n = level.startCount;
  const pieces = [...level.pieces].sort((a, b) => a.z - b.z);
  for (const p of pieces) {
    if (p.type === "gate") n = applyOp(p.op, n, p.value);
    else if (p.type === "dualgate") {
      const l = applyOp(p.left.op, n, p.left.value);
      const r = applyOp(p.right.op, n, p.right.value);
      n = Math.max(l, r);
    } else if (p.type === "saw" || p.type === "wall") {
      if (p.move) continue;
      if (Math.abs(p.x || 0) < 0.55) n = Math.max(0, n - (p.damage || 2));
    } else if (p.type === "hole") {
      if (Math.abs(p.x || 0) < 0.55) n = Math.max(0, Math.floor(n * 0.7));
    } else if (p.type === "finish") return { count: n, hp: p.hp };
  }
  return { count: n, hp: 1 };
}

function gate(z, op, value, x = 0) {
  return { z, type: "gate", op, value, x };
}
function dual(z, left, right) {
  return { z, type: "dualgate", left, right };
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
function coin(z, x, amount = 6) {
  return { z, type: "coin", x, amount };
}
function boost(z, x = 0) {
  return { z, type: "boost", x };
}
function shield(z, x = 0) {
  return { z, type: "shield", x };
}
function mover(z, x, damage, amp = 1.55) {
  return { z, type: "saw", x, damage, width: 1.35, move: true, amp };
}
function finish(z, hp) {
  return { z, type: "finish", hp };
}

function handcrafted() {
  return [
    {
      id: 1,
      startCount: 3,
      pieces: [gate(14, "add", 3), coin(20, 1.4, 5), gate(26, "add", 4), finish(40, 8)],
    },
    {
      id: 2,
      startCount: 4,
      pieces: [gate(16, "mul", 2), coin(24, -1.5, 8), finish(36, 8)],
    },
    {
      id: 3,
      startCount: 5,
      pieces: [gate(14, "add", 4), boost(20, 0), saw(28, 0.55, 5, 1.5), coin(32, -1.6, 8), finish(42, 8)],
    },
    {
      id: 4,
      startCount: 5,
      pieces: [
        dual(16, { op: "mul", value: 2 }, { op: "add", value: 6 }),
        coin(22, -1.4, 8),
        mover(30, 0, 5, 1.7),
        finish(44, 10),
      ],
    },
    {
      id: 5,
      startCount: 7,
      pieces: [
        gate(12, "add", 3),
        shield(18, 1.5),
        hole(24, 1.55, 2.1),
        dual(34, { op: "mul", value: 2 }, { op: "sub", value: 4 }),
        coin(40, -1.5, 10),
        finish(52, 18),
      ],
    },
    {
      id: 6,
      startCount: 8,
      pieces: [
        dual(14, { op: "add", value: 5 }, { op: "div", value: 2 }),
        boost(20, -1.2),
        saw(28, 1.2, 6),
        gate(38, "mul", 2),
        wall(46, -1.8, 1.6, 4),
        coin(50, 1.6, 12),
        finish(62, 24),
      ],
    },
    {
      id: 7,
      startCount: 6,
      pieces: [
        gate(12, "mul", 3),
        wall(22, 1.9, 1.7, 5),
        boost(28, 0),
        dual(36, { op: "add", value: 8 }, { op: "sub", value: 6 }),
        mover(44, 0, 6, 1.8),
        finish(58, 24),
      ],
    },
    {
      id: 8,
      startCount: 10,
      pieces: [
        dual(14, { op: "div", value: 2 }, { op: "add", value: 6 }),
        shield(20, -1.4),
        gate(28, "mul", 2),
        saw(38, 1.75, 7),
        coin(42, 0, 10),
        hole(50, -1.5, 1.9),
        finish(64, 28),
      ],
    },
  ];
}

function generated(id) {
  const startCount = 4 + Math.floor(id / 8);
  const pieces = [];
  let z = 10;
  const waves = 5 + Math.floor(id / 12) + (id % 3);
  for (let w = 0; w < waves; w++) {
    const roll = (id * 23 + w * 13) % 12;
    const side = ((w % 2) * 2 - 1) * (1.2 + (id % 3) * 0.1);
    if (roll < 3) {
      const a = 2 + ((id + w) % 6);
      const b = 2 + ((id * 3 + w) % 5);
      pieces.push(
        dual(
          z,
          {
            op: w % 4 === 0 ? "mul" : roll === 0 ? "div" : "add",
            value: w % 4 === 0 ? 2 + (id % 2) : roll === 0 ? 2 : a,
          },
          {
            op: roll === 2 ? "sub" : "add",
            value: b,
          }
        )
      );
      pieces.push(coin(z + 3.2, roll === 0 ? 1.3 : -1.3, 6 + (id % 5)));
    } else if (roll === 3) {
      pieces.push(gate(z, w === 0 ? "add" : "mul", w === 0 ? 3 + (id % 5) : 2 + (id % 2)));
    } else if (roll === 4) {
      pieces.push(mover(z, 0, 5 + (id % 8), 1.4 + (id % 3) * 0.15));
    } else if (roll === 5) {
      pieces.push(saw(z, side, 5 + (id % 9), 1.35 + (id % 4) * 0.1));
    } else if (roll === 6) {
      pieces.push(hole(z, side * 1.1, 1.85));
      pieces.push(coin(z + 2.4, -side, 8));
    } else if (roll === 7) {
      pieces.push(wall(z, side * 1.05, 1.5, 4 + (id % 6)));
    } else if (roll === 8) {
      pieces.push(boost(z, side * 0.4));
    } else if (roll === 9) {
      pieces.push(shield(z, -side * 0.8));
    } else {
      pieces.push(coin(z, side, 7 + (id % 6)));
      pieces.push(coin(z + 2, 0, 5));
    }
    z += 6.2 + (id % 3) * 0.35;
    if (w === waves - 2) {
      pieces.push(gate(z, id % 4 === 0 ? "div" : "add", id % 4 === 0 ? 2 : 3 + (id % 5)));
      z += 7;
    }
  }
  if (id > 12) {
    pieces.push(mover(z, 0, 6 + (id % 6), 1.7));
    z += 7;
  }
  if (id > 20) {
    pieces.push(boost(z, (id % 2 === 0 ? 1 : -1) * 1.2));
    z += 6;
  }
  const draft = { id, startCount, pieces: [...pieces, finish(z + 6, 1)] };
  const sim = simulateBest(draft);
  const t = Math.min(1, (id - 8) / 48);
  const ratio = 0.78 + t * 0.14;
  const hp = Math.min(sim.count, Math.max(startCount + 3, Math.floor(sim.count * ratio)));
  pieces.push(finish(z + 6, hp));
  return { id, startCount, pieces };
}

export function createLevels() {
  const list = handcrafted();
  for (let id = 9; id <= 56; id++) list.push(generated(id));
  return list;
}

export const LEVELS = createLevels();
