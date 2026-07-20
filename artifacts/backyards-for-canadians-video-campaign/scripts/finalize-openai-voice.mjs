import {execFile} from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {promisify} from "node:util";

const exec = promisify(execFile);
const root = path.resolve(import.meta.dirname, "..");
const voiceDirectory = path.join(root, "audio", "voice");
const whisperDirectory = path.join(root, "audio", "whisper-openai");
const remotionAudio = path.join(root, "remotion", "public", "audio");
const remotionCaptions = path.join(root, "remotion", "public", "captions");
const projectRoot = path.join(root, "hyperframes", "projects");

const projects = [
  {
    directory: "01-neighbours-not-tourists",
    voice: "01-neighbours-not-tourists.wav",
    audioId: "voice-neighbours",
  },
  {
    directory: "03-backyard-to-work",
    voice: "03-backyard-to-work.wav",
    audioId: "voice-movement",
  },
  {
    directory: "05-one-more-home",
    voice: "05-one-more-home.wav",
    audioId: "voice-proof",
  },
];

const run = async (command, args, options = {}) => {
  process.stdout.write(`\n> ${command} ${args.join(" ")}\n`);
  const result = await exec(command, args, {cwd: root, maxBuffer: 20 * 1024 * 1024, ...options});
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
};

const copyDirectoryFiles = async (source, destination, extension) => {
  await fs.mkdir(destination, {recursive: true});
  const files = (await fs.readdir(source)).filter((file) => file.endsWith(extension));
  await Promise.all(files.map((file) => fs.copyFile(path.join(source, file), path.join(destination, file))));
};

await run(process.execPath, [path.join(root, "scripts", "generate-openai-tts.mjs")]);

await fs.rm(whisperDirectory, {recursive: true, force: true});
await fs.mkdir(whisperDirectory, {recursive: true});
const voiceFiles = (await fs.readdir(voiceDirectory)).filter((file) => file.endsWith(".wav"));
await run("whisper", [
  ...voiceFiles.map((file) => path.join(voiceDirectory, file)),
  "--model", "small.en",
  "--language", "en",
  "--task", "transcribe",
  "--output_format", "json",
  "--output_dir", whisperDirectory,
  "--verbose", "False",
]);
await run(process.execPath, [path.join(root, "scripts", "normalize-whisper-captions.mjs"), whisperDirectory]);

await copyDirectoryFiles(voiceDirectory, remotionAudio, ".wav");
for (const project of projects) {
  const target = path.join(projectRoot, project.directory);
  await copyDirectoryFiles(voiceDirectory, path.join(target, "assets", "audio"), ".wav");
  await copyDirectoryFiles(remotionCaptions, path.join(target, "assets", "captions"), ".json");

  const voicePath = path.join(voiceDirectory, project.voice);
  const {stdout} = await exec("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    voicePath,
  ]);
  const duration = Number.parseFloat(stdout.trim()).toFixed(2);
  const htmlPath = path.join(target, "index.html");
  const html = await fs.readFile(htmlPath, "utf8");
  const matcher = new RegExp(`(<audio id="${project.audioId}"[^>]*data-duration=")[^"]+("[^>]*>)`);
  if (!matcher.test(html)) throw new Error(`Could not find ${project.audioId} in ${htmlPath}`);
  await fs.writeFile(htmlPath, html.replace(matcher, `$1${duration}$2`));
}

await fs.rm(path.join(voiceDirectory, ".scratch-voice"), {force: true});
process.stdout.write("\nOpenAI voice masters, Whisper timings, framework copies, and HyperFrames durations are synchronized. Re-render all six compositions before distribution.\n");
