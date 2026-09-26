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
  if (op === "mul") return `×${v}`;
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
    } else if (p.type === "saw" || p.type === "wall" || p.type === "spinner" || p.type === "crusher") {
      if (p.move) continue;
      if (Math.abs(p.x || 0) < 0.55) n = Math.max(0, n - (p.damage || 2));
    } else if (p.type === "hole") {
      if (Math.abs(p.x || 0) < 0.55) n = Math.max(0, Math.floor(n * 0.7));
    }     else if (p.type === "grow") n += Math.max(1, Math.floor(p.amount || 8));
    else if (p.type === "army") n = n > p.count ? n - p.count : 0;
    else if (p.type === "finish") return { count: n, hp: p.hp };
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
function finish(z, hp) {
  return { z, type: "finish", hp };
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
        coin(80, 0, 8),
        dual(92, { op: "mul", value: 2 }, { op: "add", value: 5 }),
        coin(104, 0, 8),
        army(118, 8),
        gate(132, "add", 8),
        coin(142, 0, 8),
        spinner(154, 1.65, 4),
        coin(164, -1.2, 8),
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
        finish(186, 12),
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
        crusher(164, 1.5, 5),
        finish(180, 14),
      ],
    },
    {
      id: 4,
      startCount: 5,
      pieces: [
        coin(8, -1.2, 8),
        dual(18, { op: "mul", value: 2 }, { op: "add", value: 6 }),
        coin(30, -1.4, 8),
        magnet(40, 0),
        coin(48, 1.3, 8),
        mover(60, 0, 5, 1.7),
        boost(72, -0.8),
        grow(82, 0.6, 8),
        gate(94, "add", 4),
        army(108, 8),
        star(120, 0),
        coin(128, -1.2, 10),
        spinner(140, 1.6, 5),
        hole(152, 1.6, 1.9),
        finish(168, 12),
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
        dual(70, { op: "mul", value: 2 }, { op: "sub", value: 4 }),
        magnet(82, -1.2),
        coin(90, 1.4, 10),
        army(104, 10),
        grow(116, 0, 8),
        star(126, -0.8),
        coin(134, 0, 10),
        spinner(146, -1.6, 6),
        crusher(158, 1.5, 6),
        mover(170, 0, 7, 1.75),
        finish(186, 14),
      ],
    },
    {
      id: 6,
      startCount: 8,
      pieces: [
        coin(8, 1.2, 8),
        dual(18, { op: "add", value: 5 }, { op: "div", value: 2 }),
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
        dual(164, { op: "add", value: 4 }, { op: "sub", value: 8 }),
        finish(180, 22),
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
        coin(56, 1.4, 10),
        dual(68, { op: "add", value: 8 }, { op: "sub", value: 6 }),
        army(82, 10),
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
        dual(18, { op: "div", value: 2 }, { op: "add", value: 6 }),
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

function generated(id) {
  const startCount = 4 + Math.floor(id / 8);
  const pieces = [];
  let z = 8;
  pieces.push(coin(z, 0, 6 + (id % 4)));
  z += 6;
  pieces.push(coin(z, 1.25, 6));
  z += 5;
  pieces.push(coin(z, -1.25, 6));
  z += 10;
  pieces.push(gate(z, "add", 3 + (id % 5)));
  z += 12;
  pieces.push(dual(z, { op: "mul", value: 2 }, { op: "add", value: 4 + (id % 4) }));
  z += 12;
  pieces.push(saw(z, 1.68, 4 + (id % 6), 1.4));
  z += 11;
  pieces.push(coin(z, 0, 8));
  z += 8;
  pieces.push(spinner(z, -1.62, 4 + (id % 5)));
  z += 12;
  pieces.push(coin(z, 1.2, 8));
  z += 9;
  pieces.push(army(z, 6 + (id % 10) + Math.floor(id / 12)));
  z += 14;
  pieces.push(gate(z, "add", 5 + (id % 6)));
  z += 12;
  pieces.push(crusher(z, 1.55, 5 + (id % 5)));
  z += 12;
  pieces.push(dual(z, { op: "add", value: 6 }, { op: "sub", value: 3 }));
  z += 12;
  pieces.push(hole(z, 1.62, 1.85));
  z += 10;
  pieces.push(coin(z, 0, 10));
  z += 8;
  if (id > 14) {
    pieces.push(mover(z, 0, 5 + (id % 6), 1.5));
    z += 12;
    pieces.push(boost(z, 0));
    z += 10;
  }
  if (id > 22) {
    pieces.push(spinner(z, 1.7, 6));
    z += 12;
    pieces.push(grow(z, 0, 8));
    z += 10;
    pieces.push(wall(z, -1.85, 1.5, 4 + (id % 5)));
    z += 12;
  }
  if (id > 34) {
    pieces.push(magnet(z, 0));
    z += 8;
    pieces.push(star(z, 1));
    z += 8;
    pieces.push(crusher(z, -1.52, 6));
    z += 12;
  }
  const extra = 1 + Math.floor(id / 10);
  for (let e = 0; e < extra; e++) {
    pieces.push(coin(z, (e % 2 ? 1 : -1) * 1.2, 8));
    z += 7;
    pieces.push(gate(z, e % 2 ? "add" : "mul", e % 2 ? 4 : 2));
    z += 12;
    pieces.push(saw(z, (e % 2 ? 1 : -1) * 1.7, 5, 1.4));
    z += 11;
  }
  pieces.push(coin(z, 0, 10));
  z += 10;
  const draft = { id, startCount, pieces: [...pieces, finish(z + 8, 1)] };
  const sim = simulateBest(draft);
  const t = Math.min(1, (id - 8) / 48);
  const ratio = 0.78 + t * 0.16;
  const hp = Math.min(sim.count, Math.max(startCount + 4, Math.floor(sim.count * ratio)));
  pieces.push(finish(z + 8, hp));
  return { id, startCount, pieces };
}

export function createLevels() {
  const list = handcrafted();
  for (let id = 9; id <= 56; id++) list.push(generated(id));
  return list;
}

export const LEVELS = createLevels();
