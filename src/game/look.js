import * as THREE from "three";

import { worldForLevel } from "../content/themes.js";

function tex(w, h, paint) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  paint(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 1;
  t.needsUpdate = true;
  return t;
}

const cache = new Map();
function cached(key, build) {
  if (!cache.has(key)) cache.set(key, build());
  return cache.get(key);
}

export function makeGridTexture(world) {
  const w = world || worldForLevel(1);
  return cached("grid:" + w.id, () => {
    const t = tex(512, 512, (g, s) => {
      g.fillStyle = w.grassB;
      g.fillRect(0, 0, s, s);
      const cell = 64;
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          g.fillStyle = (x + y) % 2 === 0 ? w.grassA : w.grassB;
          g.fillRect(x * cell, y * cell, cell, cell);
        }
      }
      for (let i = 0; i < 220; i++) {
        const n = ((i * 73) % 40) - 20;
        g.fillStyle = `rgba(0,0,0,${0.04 + (i % 5) * 0.012})`;
        g.beginPath();
        g.arc((i * 47) % s, (i * 91) % s, 3 + (i % 4), 0, Math.PI * 2);
        g.fill();
        g.fillStyle = `rgba(255,255,255,${0.03 + (i % 3) * 0.01})`;
        g.fillRect((i * 29 + n) % s, (i * 53) % s, 2, 6);
      }
      if (w.id === "crown") {
        for (let i = 0; i < 90; i++) {
          g.fillStyle = i % 3 ? "#3a3438" : "#4a3030";
          g.beginPath();
          g.arc((i * 53) % s, (i * 71) % s, 8 + (i % 4) * 5, 0, Math.PI * 2);
          g.fill();
        }
        for (let y = 0; y < s; y++) {
          const wobble = Math.sin(y * 0.055) * 36;
          g.fillStyle = w.path;
          g.fillRect(228 + wobble, y, 56, 1);
          if (y % 36 < 16) {
            g.fillStyle = w.dash;
            g.fillRect(252 + wobble, y, 8, 1);
          }
        }
      } else {
        const path = g.createLinearGradient(168, 0, 344, 0);
        path.addColorStop(0, "rgba(0,0,0,0)");
        path.addColorStop(0.18, w.path);
        path.addColorStop(0.5, w.path);
        path.addColorStop(0.82, w.path);
        path.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = path;
        g.fillRect(176, 0, 160, s);
        g.fillStyle = w.dash;
        for (let y = 8; y < s; y += 48) g.fillRect(248, y, 16, 22);
      }
    });
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    return t;
  });
}

export function makeSideTexture(world) {
  const w = world || worldForLevel(1);
  return cached("side:" + w.id, () => {
    const t = tex(256, 256, (g, s) => {
      g.fillStyle = w.grassB;
      g.fillRect(0, 0, s, s);
      for (let i = 0; i < 36; i++) {
        g.fillStyle = i % 2 === 0 ? w.grassA : w.grassB;
        g.beginPath();
        g.arc((i * 47) % s, (i * 73) % s, 10 + (i % 5) * 6, 0, Math.PI * 2);
        g.fill();
      }
    });
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    return t;
  });
}

export function makeSkyTexture(world) {
  const w = world || worldForLevel(1);
  return cached("sky:" + w.id, () =>
    tex(32, 512, (g, cw, h) => {
      const grd = g.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, w.sky[0]);
      grd.addColorStop(0.42, w.sky[1]);
      grd.addColorStop(0.78, w.sky[2]);
      grd.addColorStop(1, w.sky[2]);
      g.fillStyle = grd;
      g.fillRect(0, 0, cw, h);
      g.fillStyle = "rgba(255,255,255,0.12)";
      for (let i = 0; i < 7; i++) {
        g.beginPath();
        g.ellipse(4 + (i % 3) * 8, 40 + i * 28, 10, 4, 0, 0, Math.PI * 2);
        g.fill();
      }
    })
  );
}

export const BLOB_TEAL = 0x2ec8d4;
export const POISON_RUST = 0x7f3f3f;

export function blobBreathGlow(time) {
  return 0.3 + 0.1 * Math.sin(time * 2);
}

export function gateLabelColor(op) {
  if (op === "add") return "#ffffff";
  if (op === "sub") return "#ffffff";
  if (op === "mul") return "#ffffff";
  if (op === "div") return "#ffffff";
  return "#ffffff";
}

export function gateLabelSize(op, value) {
  const digits = String(Math.abs(Math.floor(Number(value) || 1))).length;
  return Math.round(Math.max(108, Math.min(196, 200 - digits * 18)));
}

export function gateFaceColor(op, trap = false) {
  if (trap) return "#b00000";
  if (op === "add") return "#1aa34a";
  if (op === "mul") return "#0f8f8a";
  if (op === "sub") return "#d1262e";
  if (op === "div") return "#c45a12";
  return "#1aa34a";
}

export function makeGateLabelTexture(op, value, extra = {}) {
  const trap = !!extra.trap;
  const label = String(extra.text || `+${value}`).replace(/[^\x20-\x7E]/g, "");
  const key = `glab2:${op}:${value}:${trap}:${extra.side || ""}:${label}`;
  const face = gateFaceColor(op, trap);
  return cached(key, () =>
    tex(512, 320, (g, w, h) => {
      g.fillStyle = trap ? "#7a0000" : face;
      g.fillRect(0, 0, w, h);
      g.fillStyle = "rgba(255,255,255,0.14)";
      g.fillRect(18, 18, w - 36, 22);
      g.strokeStyle = trap ? "#ffd54a" : "rgba(0,0,0,0.35)";
      g.lineWidth = trap ? 18 : 14;
      g.strokeRect(10, 10, w - 20, h - 20);

      let size = gateLabelSize(op, value);
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.font = `800 ${size}px Nunito, Arial, sans-serif`;
      const maxW = w - 48;
      while (size > 80 && g.measureText(label).width > maxW) {
        size -= 6;
        g.font = `800 ${size}px Nunito, Arial, sans-serif`;
      }
      const x = w / 2;
      const y = h / 2 + 6;
      g.lineJoin = "round";
      g.miterLimit = 2;
      g.strokeStyle = "rgba(0,0,0,0.85)";
      g.lineWidth = Math.max(10, size * 0.14);
      g.strokeText(label, x, y);
      g.fillStyle = "#ffffff";
      g.fillText(label, x, y);
    })
  );
}

export function makeBrushedMetalTexture() {
  return cached("brushed-metal", () => {
    const t = tex(128, 128, (g, s) => {
      g.fillStyle = "#2ec8d4";
      g.fillRect(0, 0, s, s);
      for (let i = 0; i < 48; i++) {
        g.strokeStyle = i % 2 ? "rgba(255,255,255,0.14)" : "rgba(10,40,50,0.12)";
        g.lineWidth = 1.2;
        g.beginPath();
        g.moveTo(-20 + i * 6, 0);
        g.lineTo(i * 6 + 40, s);
        g.stroke();
      }
    });
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(2, 2);
    return t;
  });
}

export function makeRustTexture() {
  return cached("rust-corr", () => {
    const t = tex(128, 128, (g, s) => {
      g.fillStyle = "#cc3333";
      g.fillRect(0, 0, s, s);
      for (let i = 0; i < 80; i++) {
        g.fillStyle = i % 3 === 0 ? "#8a2020" : i % 3 === 1 ? "#aa4422" : "#5a1810";
        g.beginPath();
        g.arc((i * 37) % s, (i * 53) % s, 3 + (i % 7), 0, Math.PI * 2);
        g.fill();
      }
    });
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(2, 2);
    return t;
  });
}

export function makeSkullOverlay() {
  return cached("skull-fade", () =>
    tex(256, 256, (g, s) => {
      g.clearRect(0, 0, s, s);
      g.globalAlpha = 0.28;
      g.fillStyle = "#1a0000";
      g.beginPath();
      g.ellipse(s / 2, s * 0.4, 48, 56, 0, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#aa0000";
      g.beginPath();
      g.arc(s / 2 - 18, s * 0.38, 10, 0, Math.PI * 2);
      g.arc(s / 2 + 18, s * 0.38, 10, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#2a0000";
      g.lineWidth = 8;
      g.beginPath();
      g.moveTo(s / 2 - 40, s * 0.72);
      g.lineTo(s / 2 + 40, s * 0.88);
      g.moveTo(s / 2 + 40, s * 0.72);
      g.lineTo(s / 2 - 40, s * 0.88);
      g.stroke();
    })
  );
}

export function makeWarningSpiral() {
  return cached("warn-spiral", () => {
    const t = tex(256, 256, (g, s) => {
      g.fillStyle = "#2a0000";
      g.fillRect(0, 0, s, s);
      g.translate(s / 2, s / 2);
      for (let i = 0; i < 28; i++) {
        g.rotate(0.28);
        g.fillStyle = i % 2 ? "#aa0000" : "#440000";
        g.fillRect(0, -6, 110, 12);
      }
    });
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    return t;
  });
}

export function makeGateTexture(text, good) {
  const raw = String(text || "");
  const op = raw.startsWith("x") || raw.startsWith("×") ? "mul" : raw.startsWith("/") || raw.startsWith("÷") ? "div" : raw.startsWith("-") || raw.startsWith("−") ? "sub" : "add";
  const value = Math.abs(parseInt(raw.replace(/[^\d]/g, ""), 10) || 1);
  return makeGateLabelTexture(op, value, { text: raw.replace(/[^\x20-\x7E]/g, "") });
}

export function createBlobGlowUniforms() {
  return {
    uTime: { value: 0 },
    uGlowArr: { value: new Float32Array([0.3, 0.45, 0, 0, 0, 0, 0, 0]) },
  };
}

export function patchBlobGlowMaterial(mat, uniforms) {
  mat.userData.glowU = uniforms;
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uGlowArr = uniforms.uGlowArr;
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
uniform float uTime;
uniform float uGlowArr[8];
varying float vRim;`
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
transformed += objectNormal * uGlowArr[3] * 0.075 * sin(uTime * 8.4 + position.y * 16.0);`
      )
      .replace(
        "#include <project_vertex>",
        `#include <project_vertex>
{
  vec3 rimN = normalize(transformedNormal);
  vec3 rimV = normalize(-mvPosition.xyz);
  vRim = pow(1.0 - abs(dot(rimV, rimN)), 2.35);
}`
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
uniform float uTime;
uniform float uGlowArr[8];
varying float vRim;`
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
{
  vec3 rimCol = mix(vec3(0.95, 0.98, 1.0), vec3(1.0, 0.82, 0.25), uGlowArr[6]);
  rimCol = mix(rimCol, vec3(0.35, 0.95, 1.0), uGlowArr[7]);
  rimCol = mix(rimCol, vec3(0.85, 0.12, 0.1), uGlowArr[4]);
  totalEmissiveRadiance += rimCol * vRim * uGlowArr[1];
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.498, 0.247, 0.247), clamp(uGlowArr[2], 0.0, 1.0));
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.82, 0.16, 0.18), clamp(uGlowArr[5], 0.0, 1.0) * 0.72);
}`
      );
  };
  mat.customProgramCacheKey = () => "blob-glow-rim-v3";
  return mat;
}

export function makeDoorTexture(hp) {
  return tex(512, 280, (g, w, h) => {
    g.fillStyle = "#e8a020";
    roundRect(g, 10, 10, w - 20, h - 20, 28);
    g.fill();
    g.lineWidth = 10;
    g.strokeStyle = "#fff6c8";
    g.stroke();
    g.fillStyle = "#3a2200";
    g.font = "900 48px Nunito, Trebuchet MS, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("SMASH", w / 2, 78);
    g.fillStyle = "#fffdf2";
    g.font = "900 118px Nunito, Trebuchet MS, sans-serif";
    g.fillText(String(hp), w / 2, 178);
  });
}

export function makeStripeTexture() {
  return cached("stripe", () =>
    tex(128, 128, (g, w) => {
      g.fillStyle = "#3a2a18";
      g.fillRect(0, 0, w, w);
      g.save();
      g.translate(w / 2, w / 2);
      g.rotate(-0.72);
      g.fillStyle = "#ffd24a";
      for (let i = -5; i < 6; i++) g.fillRect(-w, i * 26 - 7, w * 3, 13);
      g.restore();
    })
  );
}

export function makeSwirlTexture() {
  return cached("swirl", () =>
    tex(256, 256, (g, w) => {
      const r = w / 2;
      g.clearRect(0, 0, w, w);
      const voidGrad = g.createRadialGradient(r, r, 2, r, r, r);
      voidGrad.addColorStop(0, "#1a0800");
      voidGrad.addColorStop(0.45, "#8a3a10");
      voidGrad.addColorStop(0.78, "#e07020");
      voidGrad.addColorStop(1, "rgba(40, 16, 0, 0)");
      g.fillStyle = voidGrad;
      g.beginPath();
      g.arc(r, r, r - 2, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#120400";
      g.beginPath();
      g.arc(r, r, r * 0.28, 0, Math.PI * 2);
      g.fill();
    })
  );
}

export function makeCoinTexture() {
  return cached("coin", () =>
    tex(256, 256, (g, w) => {
      const r = w / 2;
      g.fillStyle = "#f0c43a";
      g.beginPath();
      g.arc(r, r, r - 2, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#fff3a0";
      g.lineWidth = 10;
      g.beginPath();
      g.arc(r, r, r - 12, 0, Math.PI * 2);
      g.stroke();
      g.fillStyle = "#7a4a00";
      g.font = "900 118px Trebuchet MS, Arial Black, sans-serif";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText("B", r, r + 6);
    })
  );
}

export function leechAmount(n) {
  const v = Number(n) || 20;
  if (v <= 14) return 10;
  if (v >= 26) return 30;
  return 20;
}

export function leechLabel(n) {
  return `-${leechAmount(n)}`;
}

export function makeLeechCoinTexture(amount = 20) {
  const n = leechAmount(amount);
  return cached(`leech-coin:${n}`, () =>
    tex(256, 256, (g, w) => {
      const r = w / 2;
      const fill = g.createRadialGradient(r * 0.62, r * 0.42, 12, r, r, r - 4);
      fill.addColorStop(0, "#ff6a7c");
      fill.addColorStop(0.45, "#e01838");
      fill.addColorStop(1, "#8a0818");
      g.fillStyle = fill;
      g.beginPath();
      g.arc(r, r, r - 2, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#ffd0d8";
      g.lineWidth = 14;
      g.beginPath();
      g.arc(r, r, r - 16, 0, Math.PI * 2);
      g.stroke();
      g.strokeStyle = "#5a0010";
      g.lineWidth = 6;
      g.beginPath();
      g.arc(r, r, r - 16, 0, Math.PI * 2);
      g.stroke();
      g.fillStyle = "#fff7f8";
      g.strokeStyle = "rgba(80, 0, 16, 0.7)";
      g.lineWidth = 12;
      g.font = "900 108px Trebuchet MS, Arial Black, sans-serif";
      g.textAlign = "center";
      g.textBaseline = "middle";
      const label = `-${n}`;
      g.strokeText(label, r, r + 4);
      g.fillText(label, r, r + 4);
    })
  );
}

export function makeLeechSignTexture(amount) {
  const n = leechAmount(amount);
  const label = leechLabel(n);
  return cached(`leech-sign:${n}`, () =>
    tex(384, 160, (g, w, h) => {
      g.clearRect(0, 0, w, h);
      g.fillStyle = "rgba(90, 8, 18, 0.92)";
      const rr = 28;
      g.beginPath();
      g.moveTo(rr, 12);
      g.arcTo(w - 12, 12, w - 12, h - 12, rr);
      g.arcTo(w - 12, h - 12, 12, h - 12, rr);
      g.arcTo(12, h - 12, 12, 12, rr);
      g.arcTo(12, 12, w - 12, 12, rr);
      g.closePath();
      g.fill();
      g.strokeStyle = "#ffd54a";
      g.lineWidth = 8;
      g.stroke();
      g.fillStyle = "#ffffff";
      g.font = "900 78px Arial Black, Trebuchet MS, sans-serif";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.strokeStyle = "rgba(0,0,0,0.55)";
      g.lineWidth = 10;
      g.strokeText(label, w / 2, h / 2 + 4);
      g.fillText(label, w / 2, h / 2 + 4);
    })
  );
}

export function makeBeastBadge(n) {
  return tex(320, 160, (g, w, h) => {
    g.fillStyle = "#c45018";
    roundRect(g, 8, 10, w - 16, h - 20, 22);
    g.fill();
    g.strokeStyle = "#ffe08a";
    g.lineWidth = 6;
    g.stroke();
    g.fillStyle = "#fff4d0";
    g.font = "800 22px Nunito, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("WARDEN", w / 2, 38);
    g.fillStyle = "#ffffff";
    g.font = "900 78px Nunito, sans-serif";
    g.fillText(String(Math.max(0, n | 0)), w / 2, 100);
  });
}

export function makeRivalBadge(n, finish = false) {
  return tex(320, 160, (g, w, h) => {
    g.fillStyle = finish ? "#d45a18" : "#e24a28";
    roundRect(g, 8, 10, w - 16, h - 20, 22);
    g.fill();
    g.strokeStyle = finish ? "#ffd166" : "#ffb088";
    g.lineWidth = 6;
    g.stroke();
    g.fillStyle = "#fff6e8";
    g.font = "800 22px Nunito, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(finish ? "WARDEN" : "SEPOYS", w / 2, 38);
    g.fillStyle = "#ffffff";
    g.font = "900 78px Nunito, sans-serif";
    g.fillText(String(Math.max(0, n | 0)), w / 2, 100);
  });
}

/** White sclera + black pupil on a gel body so Crowd can retint the material. */
export function paintLeaderEyes(g, w, h, state = {}) {
  const pupil = state.pupil ?? 1;
  const lookX = state.lookX ?? 0;
  const lookY = state.lookY ?? -0.16;
  const brow = state.brow ?? 0;
  const lid = Math.max(0, Math.min(1, state.lid ?? 0));
  const sparkle = state.sparkle ?? 0;
  const gel = g.createRadialGradient(w * 0.38, h * 0.28, 4, w * 0.5, h * 0.52, w * 0.62);
  gel.addColorStop(0, "#ffffff");
  gel.addColorStop(0.42, "#f2f7fb");
  gel.addColorStop(0.78, "#d5e0e8");
  gel.addColorStop(1, "#9aafbc");
  g.fillStyle = gel;
  g.fillRect(0, 0, w, h);
  g.fillStyle = "rgba(255,255,255,0.35)";
  g.beginPath();
  g.ellipse(w * 0.36, h * 0.26, w * 0.18, h * 0.1, -0.4, 0, Math.PI * 2);
  g.fill();
  const ey = h * 0.34;
  const rx = w * 0.14;
  const ry = h * 0.13;
  const eyes = [w * 0.36, w * 0.64];
  for (let i = 0; i < eyes.length; i++) {
    const ex = eyes[i];
    g.fillStyle = "#f8fcff";
    g.beginPath();
    g.ellipse(ex, ey, rx, ry, 0, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "#c5d4de";
    g.lineWidth = Math.max(1.4, w / 48);
    g.stroke();
    const ir = rx * 0.62;
    const px = ex + lookX * rx * 0.9;
    const py = ey + lookY * ry;
    const iris = g.createRadialGradient(px, py, 1, px, py, ir);
    iris.addColorStop(0, "#5edce0");
    iris.addColorStop(0.45, "#1a7a7f");
    iris.addColorStop(1, "#0a3034");
    g.fillStyle = iris;
    g.beginPath();
    g.ellipse(px, py, ir, ir * 1.02, 0, 0, Math.PI * 2);
    g.fill();
    const pr = rx * (0.34 * pupil);
    g.fillStyle = "#05080c";
    g.beginPath();
    g.ellipse(px, py, pr, pr * 1.05, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#ffffff";
    g.beginPath();
    g.ellipse(px - pr * 0.32, py - pr * 0.38, pr * 0.38, pr * 0.32, 0, 0, Math.PI * 2);
    g.fill();
    g.beginPath();
    g.ellipse(px + pr * 0.22, py + pr * 0.18, pr * 0.12, pr * 0.1, 0, 0, Math.PI * 2);
    g.fill();
    const bx = ex;
    const by = ey - ry * 1.55 - brow * 5;
    g.strokeStyle = "#1a2430";
    g.lineWidth = 2.4;
    g.beginPath();
    const tilt = (i === 0 ? -1 : 1) * (-0.35 * brow);
    g.ellipse(bx, by, rx * 0.72, 3.2, tilt, Math.PI * 1.12, Math.PI * 1.88);
    g.stroke();
    if (lid > 0) {
      g.fillStyle = `rgba(210, 228, 236,${lid})`;
      g.beginPath();
      g.ellipse(ex, ey - ry * 0.15, rx * 1.02, ry * (0.2 + lid * 0.95), 0, 0, Math.PI * 2);
      g.fill();
    }
    if (sparkle > 0) {
      g.fillStyle = `rgba(255,255,255,${0.65 * sparkle})`;
      const sx = ex + rx * 0.95;
      const sy = ey - ry * 1.1;
      g.fillRect(sx - 1, sy - 4 * sparkle, 2, 8 * sparkle);
      g.fillRect(sx - 4 * sparkle, sy - 1, 8 * sparkle, 2);
    }
  }
}

function paintBlobGel(g, s) {
  const grd = g.createRadialGradient(s * 0.36, s * 0.28, 8, s * 0.5, s * 0.55, s * 0.72);
  grd.addColorStop(0, "#ffffff");
  grd.addColorStop(0.35, "#e8f4f8");
  grd.addColorStop(0.72, "#9eb8c4");
  grd.addColorStop(1, "#5a7380");
  g.fillStyle = grd;
  g.fillRect(0, 0, s, s);
  g.fillStyle = "rgba(255,255,255,0.28)";
  g.beginPath();
  g.ellipse(s * 0.34, s * 0.26, s * 0.22, s * 0.12, -0.45, 0, Math.PI * 2);
  g.fill();
}

export function createBlobGelMap() {
  return cached("blob-gel", () => tex(256, 256, paintBlobGel));
}

export function blobSkinMap(pattern = "gel") {
  const key = pattern || "gel";
  return cached(`blob-skin:${key}`, () =>
    tex(256, 256, (g, s) => {
      paintBlobGel(g, s);
      if (key === "stripes") {
        g.fillStyle = "rgba(20, 12, 8, 0.38)";
        for (let i = -2; i < 12; i++) {
          g.save();
          g.translate(s * 0.5, s * 0.5);
          g.rotate(-0.45);
          g.fillRect(-s, i * 28 - s, s * 2, 13);
          g.restore();
        }
      } else if (key === "spots") {
        g.fillStyle = "rgba(20, 10, 30, 0.32)";
        for (let i = 0; i < 18; i++) {
          const x = (i * 73) % s;
          const y = (i * 97) % s;
          g.beginPath();
          g.arc(x, y, 10 + (i % 4) * 4, 0, Math.PI * 2);
          g.fill();
        }
      } else if (key === "sparkle") {
        g.fillStyle = "rgba(255, 255, 255, 0.55)";
        for (let i = 0; i < 22; i++) {
          const x = (i * 47) % s;
          const y = (i * 89) % s;
          g.fillRect(x, y, 3, 10);
          g.fillRect(x - 3, y + 4, 10, 3);
        }
      } else if (key === "grid") {
        g.strokeStyle = "rgba(8, 20, 40, 0.35)";
        g.lineWidth = 6;
        for (let i = 0; i < 8; i++) {
          g.beginPath();
          g.moveTo(i * 32, 0);
          g.lineTo(i * 32, s);
          g.moveTo(0, i * 32);
          g.lineTo(s, i * 32);
          g.stroke();
        }
      } else if (key === "lava") {
        g.fillStyle = "rgba(255, 80, 20, 0.28)";
        for (let i = 0; i < 7; i++) {
          g.beginPath();
          g.ellipse((i * 41) % s, (i * 67) % s, 40, 16, i, 0, Math.PI * 2);
          g.fill();
        }
      }
    })
  );
}

export function createLeaderEyeMap() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const g = c.getContext("2d");
  paintLeaderEyes(g, 128, 128, {});
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.ClampToEdgeWrapping;
  t.wrapT = THREE.ClampToEdgeWrapping;
  t.anisotropy = 1;
  t.needsUpdate = true;
  return {
    canvas: c,
    ctx: g,
    texture: t,
    paint(state) {
      paintLeaderEyes(g, 128, 128, state);
      t.needsUpdate = true;
    },
  };
}

export function makeSteelTexture() {
  return cached("steel", () => {
    const t = tex(256, 256, (g, s) => {
      g.fillStyle = "#9aa3ab";
      g.fillRect(0, 0, s, s);
      for (let y = 0; y < s; y++) {
        const n = 0.78 + ((y * 17 + (y % 5) * 9) % 13) / 80;
        g.fillStyle = `rgb(${Math.floor(155 * n)},${Math.floor(162 * n)},${Math.floor(170 * n)})`;
        g.fillRect(0, y, s, 1);
      }
      g.globalAlpha = 0.18;
      for (let i = 0; i < 28; i++) {
        g.fillStyle = i % 2 ? "#e8eef2" : "#6a7278";
        g.fillRect((i * 37) % s, 0, 1 + (i % 2), s);
      }
      g.globalAlpha = 1;
    });
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(2, 2);
    return t;
  });
}

export function makePitTexture() {
  return cached("pit", () =>
    tex(256, 256, (g, s) => {
      const grd = g.createRadialGradient(s / 2, s / 2, 8, s / 2, s / 2, s / 2);
      grd.addColorStop(0, "#000000");
      grd.addColorStop(0.45, "#07040e");
      grd.addColorStop(0.78, "#1a0824");
      grd.addColorStop(1, "#3a1028");
      g.fillStyle = grd;
      g.fillRect(0, 0, s, s);
    })
  );
}

export function makeCountBadge(n, bg = "#1a6a78", fg = "#ffffff") {
  return tex(256, 128, (g, w, h) => {
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
