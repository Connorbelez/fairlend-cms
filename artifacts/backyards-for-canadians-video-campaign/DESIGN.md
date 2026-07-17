# Campaign Motion Design System

## North star

`Toronto Financing Field Guide in motion`: public-interest urgency rendered with the precision of a financing file. The work should feel authored, local, and useful—not like a generic real-estate montage.

## Visual grammar

- Paper base: `#F8F7F5`, `#FBFAF8`, `#FFFDF9`
- Ink: `#08090A`, `#030405`, `#494944`
- Signal lime: `#96EC18`, `#8DFF00`, `#9CFF00`
- Blueprint: `#002949`; forest: `#002416`; rules: `#DEDED8`
- Keep a 90/10 ink-to-lime ratio. Lime only marks action, state, proof, or the route forward.
- Use engraved Toronto/property imagery, survey marks, route lines, stamps, property files, and verified-stage counters.
- Avoid glassmorphism, generic gradient blobs, rounded SaaS cards, stock-footage sentimentality, and decorative motion without narrative meaning.

## Type registers

- Public provocation: League Gothic, uppercase, frame-filling, tight tracking.
- Human/homeowner voice: Newsreader or a restrained editorial serif.
- Data/process labels: Oxanium or IBM Plex Mono, tabular numbers, uppercase.
- On-screen text must be readable in two-thirds of its hold time; body text never below 28px at 1080×1920.
- Motion-display type uses an optical, shot-specific scale rather than a web UI token ramp: 72–92px supporting labels, 118–176px scene headlines, and 194–290px frame-filling provocations. These values are intentionally tuned per line length and title-safe area.

## Motion grammar

- `Trace` — a lime route line reveals the next action.
- `File` — paper panels push like documents advancing through review.
- `Stamp` — decisive proof or stage confirmation lands with controlled weight.
- `Build` — blueprint geometry resolves into a finished home.
- `Count` — verified-stage numbers advance with tabular numerals.
- `Handoff` — transitions carry one fully formed scene into the next; intermediate scenes do not self-exit.

## Pace

- High-energy public hooks: 0.18–0.32s entrances, hard editorial cuts, fast route wipes.
- Explainers: 0.35–0.65s entrances, page pushes and blueprint reveals.
- Stakeholder film: varied rhythm; provocation is fast, proof and operating model breathe.

## Sound

- OpenAI `gpt-4o-mini-tts`, `marin` voice, WAV output.
- Neutral Canadian English, assured and conversational; never announcer-cheesy.
- Original restrained sonic bed: paper impacts, pencil ticks, key turn, route pulse, low architectural percussion.
- Voiceover remains the priority; music and SFX duck under speech.

## Accessibility and compliance

- Burned-in high-contrast captions; highlighted words use signal lime plus weight/underline, never colour alone.
- Maintain title-safe and platform UI-safe zones.
- On-screen disclosure: `AI-GENERATED VOICE • OPENAI TTS`.
- Financial and project claims use qualifying language in-frame, not only in post copy.
