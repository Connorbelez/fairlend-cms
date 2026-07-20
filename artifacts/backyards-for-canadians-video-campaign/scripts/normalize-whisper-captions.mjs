import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const inputDirectory = path.resolve(process.argv[2] ?? "/tmp/fairlend-whisper-scratch");
const root = path.resolve(import.meta.dirname, "..");
const remotionOutput = path.join(root, "remotion", "public", "captions");
const hyperframesOutput = path.join(root, "hyperframes", "assets", "captions");
await fs.mkdir(remotionOutput, {recursive: true});
await fs.mkdir(hyperframesOutput, {recursive: true});

const normalize = (value) =>
  value
    .trim()
    .replaceAll(/Fairland/gi, "FairLend")
    .replaceAll(/neighbor\b/gi, "neighbour")
    .replaceAll(/neighborhood\b/gi, "neighbourhood")
    .replaceAll(/city builder/gi, "city-builder")
    .replaceAll(/backyards for Canadians/gi, "Backyards for Canadians");

const files = (await fs.readdir(inputDirectory)).filter((file) => file.endsWith(".json"));
for (const file of files) {
  const input = JSON.parse(await fs.readFile(path.join(inputDirectory, file), "utf8"));
  const captions = input.segments.map((segment) => ({
    text: normalize(segment.text),
    startMs: Math.round(segment.start * 1000),
    endMs: Math.round(segment.end * 1000),
    timestampMs: null,
    confidence: null,
  }));
  const output = `${JSON.stringify(captions, null, 2)}\n`;
  await fs.writeFile(path.join(remotionOutput, file), output);
  await fs.writeFile(path.join(hyperframesOutput, file), output);
  process.stdout.write(`normalized ${file}\n`);
}

