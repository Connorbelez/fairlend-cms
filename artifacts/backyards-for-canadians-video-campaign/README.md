# Backyards for Canadians — Video Campaign System

Six production-ready video concepts derived from the approved campaign proposal:

1. `Homes for Neighbours, Not Tourists` — 15s vertical launch provocation (HyperFrames)
2. `Canada Needs Hosts` — 8s vertical kinetic bumper (Remotion)
3. `Put Your Backyard to Work` — 20s vertical movement launch (HyperFrames)
4. `Build Wealth. Build Housing.` — 30s vertical rational explainer (Remotion)
5. `One Backyard. One More Toronto Home.` — 20s vertical proof film (HyperFrames)
6. `The Campaign in Motion` — 82s landscape stakeholder pitch (Remotion, including HyperFrames excerpts)

The system uses FairLend's Toronto Financing Field Guide identity: paper, ink, blueprint geometry, engraved imagery, and electric-lime route signals. Every public claim stays property-specific and avoids income guarantees. Financing and project feasibility are presented as subject to review and approval.

## Directories

- `creative/` — strategy, scripts, and frame-accurate storyboards
- `hyperframes/` — HTML/GSAP source for concepts 1, 3, and 5
- `remotion/` — React/Remotion source for concepts 2, 4, and 6
- `audio/` — voice WAVs and caption-timing inputs
- `renders/` — visual masters, review frames, and contact sheets
- `scripts/` — deterministic TTS and rendering utilities

## Current production status

The compositions, purpose-built art, motion, captions, claim language, and visual masters are complete. The WAVs currently carry a local scratch voice for timing because every discoverable workspace OpenAI key returned `429 insufficient_quota` during production. Files named `visual-master` are therefore **not distribution audio masters** even though they show the intended OpenAI TTS disclosure treatment.

Once a funded key is available locally, run:

```bash
cd artifacts/backyards-for-canadians-video-campaign
OPENAI_API_KEY="..." node scripts/finalize-openai-voice.mjs
```

The finalizer calls the official `/v1/audio/speech` endpoint with `gpt-4o-mini-tts` and the `marin` voice, regenerates Whisper caption timing, synchronizes both frameworks, updates HyperFrames clip durations, and removes the scratch marker. Do not paste the key into source control; set it in the shell or use the supported `OPENAI_ENV_FILE` flow in `generate-openai-tts.mjs`.

## Voice disclosure

Distribution voiceover is specified for OpenAI TTS. Final masters carry an on-screen disclosure, and paid/organic post copy must repeat that disclosure. Current visual masters use timing-proxy audio and must be re-rendered after the OpenAI generation step above.

## Claim discipline

- No generic Airbnb or rental-income guarantee.
- Economics and eligibility are property-specific.
- Financing is subject to fit, qualification, underwriting, approval, program rules, and available capital.
- Any live ad containing rates, payments, or non-interest charges requires broker/compliance review and the applicable APR/term disclosures.
- Counts must identify their verified stage: pledged, reviewed, financed, under construction, or completed.
