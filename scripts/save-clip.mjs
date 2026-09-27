import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const dest = path.resolve("store/covers/blobtide-preview-raw.webm");
fs.mkdirSync(path.dirname(dest), { recursive: true });

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  if (req.method !== "POST" || req.url !== "/clip") {
    res.writeHead(404);
    res.end("no");
    return;
  }
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    const buf = Buffer.concat(chunks);
    fs.writeFileSync(dest, buf);
    console.log("saved", dest, buf.length);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ok");
  });
});

server.listen(9876, "127.0.0.1", () => {
  console.log("clip saver on 9876");
});
