# Agent skill stack for release and explainer videos

Research date: 2026-07-17

## Executive recommendation

Keep the enabled HyperFrames and Remotion plugins as the rendering core. Add only:

1. **`browser-use/video-use`** for transcript-led editing, grading, compositing, subtitle burn-in and output QA.
2. **Three official ElevenLabs skills — `music`, `sound-effects` and `voice-isolator`** — for an authored score, designed sonic accents and cleanup of recorded dialogue.

Do not install another generic storyboard, Remotion, animation or “video producer” skill. The current HyperFrames workflow already covers brand capture, design direction, message and narrative definition, storyboard/script, voiceover timing, captions, production and visual QA. The Remotion plugin already provides a second programmatic renderer with deep rules for animation, audio, captions, 3D, charts, typography and transitions. More overlapping prompt packs would create routing ambiguity without adding production capability. [HyperFrames website-to-video skill](https://github.com/heygen-com/hyperframes/blob/main/skills/website-to-hyperframes/SKILL.md), [Remotion agent skill](https://github.com/remotion-dev/skills/blob/main/skills/remotion/SKILL.md)

The resulting workflow is:

> visual concept and style frames → storyboard/script → deterministic motion build → bespoke music/SFX and clean dialogue → edit, grade, caption and frame-level QA

That sequence is more likely to produce work with a coherent point of view than adding more generators. “Stunning” comes from one visual thesis carried through the entire piece, then disciplined editorial and audio finishing.

## Recommended additions

### 1. `browser-use/video-use` — install

Exact source: [`browser-use/video-use`, root `SKILL.md`](https://github.com/browser-use/video-use/blob/main/SKILL.md)

This is the strongest complement to HyperFrames and Remotion because it owns the part neither renderer should own: editing real footage and assembling a finished master. Its source workflow includes:

- word-level transcription and audio-first cut selection;
- edit decision lists, per-segment grading and lossless concatenation;
- HyperFrames, Remotion, bundled Manim or PIL/FFmpeg animation overlays;
- output-timeline subtitle generation and subtitle-last compositing;
- 30 ms audio fades at every edit boundary;
- preview renders followed by visual/waveform inspection at every cut, samples across the timeline and `ffprobe` duration verification;
- fix/re-render/re-evaluate loops before the preview is shown.

Those are explicit production rules in the skill rather than generic advice. [Video Use hard rules and workflow](https://github.com/browser-use/video-use/blob/main/SKILL.md#hard-rules-production-correctness--non-negotiable)

It also bundles a Manim skill for formal diagrams, state machines, graph morphs and equation-style explainers, while routing product/UI motion to the already installed HyperFrames or Remotion engines. [Video Use animation routing](https://github.com/browser-use/video-use/blob/main/SKILL.md#animations-when-requested)

Installation is intentionally a whole-repository symlink, not a copied `SKILL.md`, because the helper scripts must remain adjacent to the skill. The first-party instructions require a stable clone, Python dependencies, FFmpeg/FFprobe and an ElevenLabs API key for Scribe transcription. [Official Video Use install instructions](https://github.com/browser-use/video-use/blob/main/install.md)

Local status on 2026-07-17: not present in either `~/.codex/skills/video-use` or `~/.agents/skills/video-use`.

### 2. `elevenlabs/skills` — install a focused subset

Exact source: [`elevenlabs/skills`](https://github.com/elevenlabs/skills)

Install these three skills:

- [`music`](https://github.com/elevenlabs/skills/blob/main/music/SKILL.md) — generates instrumental/background music and supports composition plans for section-level duration, style and structure. It can also generate music from uploaded video, which is useful for fitting a score to the finished cut.
- [`sound-effects`](https://github.com/elevenlabs/skills/blob/main/sound-effects/SKILL.md) — creates cinematic impacts, UI sounds, ambiences and seamless loops with duration and prompt-influence control.
- [`voice-isolator`](https://github.com/elevenlabs/skills/blob/main/voice-isolator/SKILL.md) — removes background noise or mixed ambience from dialogue before transcription and editorial work.

The official repository follows the Agent Skills specification, documents `npx skills add elevenlabs/skills`, and includes trigger and functional evaluations. Every skill requires `ELEVENLABS_API_KEY`. [ElevenLabs skills README](https://github.com/elevenlabs/skills#readme)

Do **not** add `text-to-speech` or `speech-to-text` by default. HyperFrames already routes voiceover through HeyGen TTS, ElevenLabs or Kokoro and owns caption timing; Video Use already wraps ElevenLabs Scribe with the word-level transcript format required by its editor. Adding the standalone TTS/STT skills would be redundant unless direct ad-hoc audio generation outside those workflows becomes a recurring need. [HyperFrames voiceover stage](https://github.com/heygen-com/hyperframes/blob/main/skills/website-to-hyperframes/SKILL.md#step-4-vo-timing--captions), [Video Use setup](https://github.com/browser-use/video-use/blob/main/SKILL.md#setup)

Local status on 2026-07-17: `music`, `sound-effects` and `voice-isolator` are not present under either `~/.codex/skills` or `~/.agents/skills`.

## Existing capabilities to retain

### HyperFrames — already enabled; primary release-video workflow

The plugin is enabled in the local Codex configuration. [Local Codex config](/Users/connor/.codex/config.toml:881)

Its `website-to-hyperframes` skill is unusually complete: it captures brand identity, locks audience/message/narrative, produces a concept-first storyboard and narration script, generates and transcribes voiceover, maps real timestamps to beats, builds compositions, and requires lint, validation and length-scaled snapshot review. Quality-verification gates remain mandatory even in autonomous mode. [Official HyperFrames workflow](https://github.com/heygen-com/hyperframes/blob/main/skills/website-to-hyperframes/SKILL.md)

The core skill includes motion principles, beat direction, typography, caption choreography, audio-reactive animation, kinetic type, SVG/Canvas/CSS 3D/Lottie/WebGL techniques, transitions and deterministic rendering rules. [Official HyperFrames skill](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/SKILL.md)

Use this as the default for product launches, website-to-video, interface animation, kinetic typography and branded explainers.

### Remotion — already enabled; alternate React renderer

The curated Remotion plugin is enabled locally. [Local Codex config](/Users/connor/.codex/config.toml:878)

Its official skill covers animation, assets, audio, captions/subtitles, sequencing, text animation, transitions, 3D, charts, Lottie, light leaks, media inspection and parameterized compositions. [Official Remotion skill](https://github.com/remotion-dev/skills/blob/main/skills/remotion/SKILL.md)

Use Remotion when React composition, reusable React primitives or an existing Remotion brand system is the simpler architecture. Do not install `remotion-dev/skills` separately: the curated plugin already contains that skill, and the older standalone `~/.agents/skills/remotion-best-practices` entry is explicitly disabled. [Local Codex config](/Users/connor/.codex/config.toml:390)

### Creative Production — already available; use for art direction and assets

The OpenAI-maintained Creative Production package is already cached and exposed in the current Codex environment. Its `produce` skill generates four to six distinct visual directions and routes modes for ads, scenes, offers, shot variants, styles, positioning and charts, with contracts for source preservation, exact copy/data and deterministic exports. Use it for style frames, campaign key art, visual-system exploration and launch assets before animation. [Local package manifest](/Users/connor/.codex/plugins/cache/openai-curated-remote/creative-production/0.1.25/.codex-plugin/plugin.json), [local `produce` skill](/Users/connor/.codex/plugins/cache/openai-curated-remote/creative-production/0.1.25/skills/produce/SKILL.md)

It is an art-direction and asset-generation layer, not a video renderer or editor.

## Production coverage

| Capability | Creative Production | HyperFrames | Remotion | Video Use | ElevenLabs subset |
| --- | --- | --- | --- | --- | --- |
| Art direction / visual exploration | Core | Core | Supporting | Supporting | — |
| Messaging, storyboard and script | Supporting | Core | — | Supporting for edits | — |
| Motion design / animation | — | Core | Core | Routes to engines | — |
| Deterministic rendering | — | Core | Core | Final assembly | — |
| Voiceover / captions | — | Core | Core | Core for recorded footage | — |
| Music / SFX / dialogue cleanup | — | Supporting | Supporting | Mix/assembly | Core |
| Visual assets / style frames | Core | Supporting | Supporting | — | — |
| QA / delivery checks | Asset review | Core | Technical checks | Core editorial QA | API-level only |

## Skills deliberately not selected

- **Another Remotion or HyperFrames skill pack:** direct duplication of enabled first-party plugins.
- **Generic AI storyboard/video-producer packs:** most provide shot-list templates and tool routing but no renderer, production helpers or verification loop. HyperFrames already has the stronger concept-first workflow.
- **`kylezantos/design-motion-principles`:** thoughtful for UI interaction motion, but its own source limits scope to web/app UI and says only its frequency framework transfers reliably to video. HyperFrames already contains video-native motion principles, typography, beat direction and anti-patterns. [Skill scope](https://github.com/kylezantos/design-motion-principles/blob/main/skills/design-motion-principles/SKILL.md)
- **HeyGen avatar-video skills:** useful only when an avatar presenter is specifically required; they impose a production style that can make a distinctive product film feel templated.
- **Standalone Manim skill:** Video Use already bundles and routes to a Manim skill for formal explainer graphics.

## Installation acceptance criteria

After installation, verify all of the following:

1. Codex discovers `video-use`, `music`, `sound-effects` and `voice-isolator` on a fresh session.
2. `ffmpeg` and `ffprobe` resolve on `PATH`.
3. Video Use's `timeline_view.py --help` succeeds from the stable clone.
4. The Video Use symlink points to the whole repository, preserving `helpers/` and bundled `skills/manim-video/`.
5. `ELEVENLABS_API_KEY` is either already configured or clearly reported as the only remaining credential step; do not consume paid transcription/generation credits merely to verify installation.
6. The disabled legacy standalone Remotion skill remains disabled, preventing duplicate triggers.

