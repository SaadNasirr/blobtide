import * as THREE from "three";

function tex(w, h, paint) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  paint(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  t.needsUpdate = true;
  return t;
}

export function makeGridTexture() {
  const t = tex(512, 512, (g, w) => {
    g.fillStyle = "#17124a";
    g.fillRect(0, 0, w, w);
    const cell = 64;
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        g.fillStyle = (x + y) % 2 === 0 ? "#1c1658" : "#151045";
        g.fillRect(x * cell, y * cell, cell, cell);
      }
    }
    g.strokeStyle = "rgba(120, 210, 255, 0.16)";
    g.lineWidth = 2;
    for (let i = 0; i <= 8; i++) {
      const p = (i / 8) * w;
      g.beginPath();
      g.moveTo(p, 0);
      g.lineTo(p, w);
      g.stroke();
      g.beginPath();
      g.moveTo(0, p);
      g.lineTo(w, p);
      g.stroke();
    }
    const lane = g.createLinearGradient(214, 0, 298, 0);
    lane.addColorStop(0, "rgba(255, 214, 70, 0)");
    lane.addColorStop(0.35, "rgba(255, 224, 90, 0.55)");
    lane.addColorStop(0.5, "rgba(255, 236, 120, 0.95)");
    lane.addColorStop(0.65, "rgba(255, 224, 90, 0.55)");
    lane.addColorStop(1, "rgba(255, 214, 70, 0)");
    g.fillStyle = lane;
    g.fillRect(222, 0, 68, w);
    g.fillStyle = "rgba(12, 10, 40, 0.55)";
    for (let y = 8; y < w; y += 48) g.fillRect(244, y, 24, 22);
  });
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  return t;
}

export function makeGateTexture(text, good) {
  return tex(512, 320, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.fillStyle = good ? "rgba(36, 255, 130, 0.22)" : "rgba(255, 48, 88, 0.26)";
    roundRect(g, 18, 18, w - 36, h - 36, 36);
    g.fill();
    g.strokeStyle = good ? "rgba(210, 255, 230, 0.95)" : "rgba(255, 210, 220, 0.95)";
    g.lineWidth = 14;
    g.stroke();
    g.strokeStyle = good ? "rgba(0, 80, 40, 0.35)" : "rgba(80, 0, 20, 0.35)";
    g.lineWidth = 4;
    roundRect(g, 32, 32, w - 64, h - 64, 26);
    g.stroke();
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.font = "900 128px Trebuchet MS, Arial Black, sans-serif";
    g.lineJoin = "round";
    g.miterLimit = 2;
    g.strokeStyle = good ? "rgba(0, 50, 20, 0.7)" : "rgba(60, 0, 16, 0.7)";
    g.lineWidth = 18;
    g.strokeText(text, w / 2, h / 2 + 6);
    g.fillStyle = "#fffef8";
    g.fillText(text, w / 2, h / 2 + 6);
  });
}

export function makeDoorTexture(hp) {
  return tex(512, 280, (g, w, h) => {
    const bg = g.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#ffe9a0");
    bg.addColorStop(0.4, "#f0b020");
    bg.addColorStop(1, "#8a4a00");
    g.fillStyle = bg;
    roundRect(g, 10, 10, w - 20, h - 20, 28);
    g.fill();
    g.lineWidth = 10;
    g.strokeStyle = "#fff6c8";
    g.stroke();
    g.fillStyle = "rgba(255,255,255,0.18)";
    roundRect(g, 28, 22, w - 56, 40, 12);
    g.fill();
    g.fillStyle = "#3a2200";
    g.font = "900 48px Nunito, Trebuchet MS, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("SMASH", w / 2, 78);
    g.fillStyle = "#fffdf2";
    g.font = "900 118px Nunito, Trebuchet MS, sans-serif";
    g.shadowColor = "rgba(90,40,0,0.5)";
    g.shadowBlur = 10;
    g.fillText(String(hp), w / 2, 178);
  });
}

export function makeStripeTexture() {
  return tex(128, 128, (g, w) => {
    g.fillStyle = "#141018";
    g.fillRect(0, 0, w, w);
    g.save();
    g.translate(w / 2, w / 2);
    g.rotate(-0.72);
    g.fillStyle = "#ffd24a";
    for (let i = -5; i < 6; i++) g.fillRect(-w, i * 26 - 7, w * 3, 13);
    g.restore();
    g.strokeStyle = "rgba(255,255,255,0.18)";
    g.lineWidth = 6;
    g.strokeRect(4, 4, w - 8, w - 8);
  });
}

export function makeSwirlTexture() {
  return tex(256, 256, (g, w) => {
    const r = w / 2;
    g.clearRect(0, 0, w, w);
    const voidGrad = g.createRadialGradient(r, r, 2, r, r, r);
    voidGrad.addColorStop(0, "#000000");
    voidGrad.addColorStop(0.22, "#05010a");
    voidGrad.addColorStop(0.48, "#1a0838");
    voidGrad.addColorStop(0.72, "#4a1a88");
    voidGrad.addColorStop(0.88, "#7a5cff");
    voidGrad.addColorStop(1, "rgba(20, 8, 40, 0)");
    g.fillStyle = voidGrad;
    g.beginPath();
    g.arc(r, r, r - 2, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "rgba(180, 150, 255, 0.55)";
    g.lineWidth = 5;
    for (let arm = 0; arm < 5; arm++) {
      g.beginPath();
      for (let i = 0; i <= 42; i++) {
        const u = i / 42;
        const a = u * Math.PI * 3.2 + (arm / 5) * Math.PI * 2;
        const rad = 10 + u * (r - 16);
        const x = r + Math.cos(a) * rad;
        const y = r + Math.sin(a) * rad;
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.stroke();
    }
    g.fillStyle = "#000000";
    g.beginPath();
    g.arc(r, r, r * 0.28, 0, Math.PI * 2);
    g.fill();
  });
}

export function makeCoinTexture() {
  return tex(256, 256, (g, w) => {
    const r = w / 2;
    const metal = g.createRadialGradient(r * 0.42, r * 0.38, 8, r, r, r - 2);
    metal.addColorStop(0, "#fff8c8");
    metal.addColorStop(0.18, "#ffe566");
    metal.addColorStop(0.45, "#ffd24a");
    metal.addColorStop(0.72, "#f0b429");
    metal.addColorStop(1, "#d49a12");
    g.fillStyle = metal;
    g.beginPath();
    g.arc(r, r, r - 2, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "#fff3a0";
    g.lineWidth = 10;
    g.beginPath();
    g.arc(r, r, r - 12, 0, Math.PI * 2);
    g.stroke();
    g.strokeStyle = "#e0a020";
    g.lineWidth = 4;
    g.beginPath();
    g.arc(r, r, r - 22, 0, Math.PI * 2);
    g.stroke();
    g.strokeStyle = "rgba(255,230,140,0.7)";
    g.lineWidth = 3;
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      g.beginPath();
      g.moveTo(r + Math.cos(a) * (r - 8), r + Math.sin(a) * (r - 8));
      g.lineTo(r + Math.cos(a) * (r - 16), r + Math.sin(a) * (r - 16));
      g.stroke();
    }
    g.fillStyle = "#7a4a00";
    g.font = "900 118px Trebuchet MS, Arial Black, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("B", r, r + 6);
    g.fillStyle = "rgba(255,248,200,0.7)";
    g.fillText("B", r - 3, r + 2);
  });
}

export function makeRivalBadge(n, finish = false) {
  return tex(320, 160, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    const bg = g.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, finish ? "#5a1808" : "#3a0c14");
    bg.addColorStop(1, "#120408");
    g.fillStyle = bg;
    roundRect(g, 8, 10, w - 16, h - 20, 22);
    g.fill();
    g.strokeStyle = finish ? "#ffd166" : "#ff6b8a";
    g.lineWidth = 6;
    g.stroke();
    g.fillStyle = finish ? "#ffe08a" : "#ff9ab0";
    g.font = "800 22px Nunito, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(finish ? "FINAL RIVALS" : "RIVALS", w / 2, 38);
    g.fillStyle = "#fff5f2";
    g.font = "900 78px Nunito, sans-serif";
    g.fillText(String(Math.max(0, n | 0)), w / 2, 100);
  });
}

export function makeCountBadge(n, bg = "#1a1a1a", fg = "#ffffff") {
  return tex(256, 128, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.fillStyle = bg;
    roundRect(g, 8, 16, w - 16, h - 32, 28);
    g.fill();
    g.strokeStyle = fg;
    g.lineWidth = 8;
    g.stroke();
    g.fillStyle = fg;
    g.font = "900 72px Nunito, Trebuchet MS, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(String(Math.max(0, n | 0)), w / 2, h / 2 + 2);
  });
}

function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}
