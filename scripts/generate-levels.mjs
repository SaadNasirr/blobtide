import { writeFileSync, mkdirSync } from "node:fs";
import { createLevels } from "../src/content/levels.js";

const levels = createLevels();
mkdirSync("public", { recursive: true });
mkdirSync("unity/Assets/StreamingAssets", { recursive: true });
const json = JSON.stringify({ version: 1, levels }, null, 2);
writeFileSync("public/levels.json", json);
writeFileSync("unity/Assets/StreamingAssets/levels.json", json);
writeFileSync("content/levels.json", json);
console.log(`Wrote ${levels.length} levels`);
