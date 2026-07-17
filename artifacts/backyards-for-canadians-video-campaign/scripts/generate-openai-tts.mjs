import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const manifestPath = path.join(root, "creative", "tts-manifest.json");
const outputDirectory = path.join(root, "audio", "voice");

const parseEnvFile = async (filePath) => {
  const source = await fs.readFile(filePath, "utf8");
  const values = {};
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
};

const resolveApiKey = async () => {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  if (!process.env.OPENAI_ENV_FILE) {
    throw new Error(
      "OPENAI_API_KEY is missing. Set it directly or provide OPENAI_ENV_FILE pointing to a user-owned env file.",
    );
  }
  const env = await parseEnvFile(path.resolve(process.env.OPENAI_ENV_FILE));
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_ENV_FILE does not contain OPENAI_API_KEY.");
  }
  return env.OPENAI_API_KEY;
};

const apiKey = await resolveApiKey();
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
await fs.mkdir(outputDirectory, { recursive: true });

for (const item of manifest) {
  const outputPath = path.join(outputDirectory, `${item.id}.wav`);
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      voice: item.voice,
      speed: item.speed,
      instructions: item.instructions,
      input: item.input,
      response_format: "wav",
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`${item.id}: OpenAI TTS failed (${response.status}): ${message}`);
  }

  await fs.writeFile(outputPath, Buffer.from(await response.arrayBuffer()));
  process.stdout.write(`generated ${path.relative(root, outputPath)}\n`);
}

