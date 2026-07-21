# Rigid-Motion Hero Concepts

Eight Garden Suite hero directions with deliberately encapsulated animation assets. Each moving island should export as one transparent raster/SVG and animate through a single DOM wrapper. No Lottie files or internal illustration rigging are required.

| File | Animated island(s) | Allowed motion | Bake together |
| --- | --- | --- | --- |
| `01-drone-pass.png` | Drone; capture slip | `translateX`, `translateY`, opacity | Drone body, rotors, camera and status ring |
| `02-permit-drop.png` | Permit sheet; approval seal | `translateY`, rotate, scale, opacity | Entire permit as one rectangle; entire seal as one disk |
| `03-prefab-arrival.png` | Truck/module; verification slip | `translateX`, scale, opacity | Cab, trailer, prefab module, straps and wheels |
| `04-site-walk.png` | Inspector; milestone placard | `translateX`, scale, opacity | Person, hardhat, clipboard, clothing and boots |
| `05-model-rise.png` | Garden Suite model; locator ring; title slip | `translateY`, scale, opacity | Complete building, roof, doors, planting and plinth |
| `06-material-release.png` | Three material pallets; release slip | `translateY`, scale, opacity | Each pallet with all contents, straps and label |
| `07-takeout-key.png` | Key/tag; target marker | `translateX`, rotate, scale, opacity | Key, ring and TAKEOUT READY tag |
| `08-team-assembly.png` | Four professional cutouts; TEAM READY placard | `translateY`, scale, opacity | Each person and everything they hold |

## Implementation contract

- Keep the background architecture, routes, dimensions, labels and all marketing copy static/live.
- Give each animated island one positioned wrapper and one transform origin. Do not split its internal illustration into parts.
- Use `transform: translate3d(...) rotate(...) scale(...)` and opacity only. The concepts do not require path morphing, skeletal animation or frame sequences.
- Preserve clear space around every exported island so transforms do not reveal clipping or collide with live copy.
- Use exponential ease-out without bounce. Under `prefers-reduced-motion`, render every island at its final position and full opacity.
- Lime activation may scale or fade separately only where the concept identifies a dedicated verification marker.
