# HyperFrames Direction — Backyards for Canadians

This composition follows `../DESIGN.md`.

- Portrait canvas: 1080×1920 at 30fps.
- Use League Gothic for provocations, Newsreader for human copy, and IBM Plex Mono for labels/data.
- Palette: paper `#F8F7F5`, ink `#08090A`, signal lime `#96EC18`, blueprint `#002949`.
- Every multi-scene film uses GSAP entrances and transitions. Intermediate scenes remain fully composed until the transition performs the handoff.
- The final three-line provocation uses a 144px optical display step so the longest Canadian-English word remains inside the 44px title-safe frame.
- All timelines are synchronous, paused, deterministic, and registered in `window.__timelines`.
- No unbounded loops, runtime fetches, CSS keyframes, or ambient motion without narrative purpose.
