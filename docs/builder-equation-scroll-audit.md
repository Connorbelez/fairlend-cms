# Builder equation scroll audit

Source: `CleanShot 2026-07-13 at 20.35.50.gif` — 78 frames at approximately 70 ms per frame (about 5.46 seconds).

## Frame breakdown

| Frames | Observed state | Timing, layout, and aesthetic defects | Implemented correction |
| --- | --- | --- | --- |
| 0–11 | 2019 row and equation premise | The narrative is anchored against the lower panel rule, leaving most of the equation surface empty. The final line is clipped behind the panel/bottom strip. Loose centered serif and sans type has no containing artifact and reads as an afterthought. | Place one lime annotation card in the optical center of the open equation surface. Use the existing `Card` primitive, square corners, a two-pixel ink rule, hard offset shadow, and a stepped corner detail. |
| 12–17 | Premise begins leaving while 2019 still dominates | The copy becomes a low-opacity ghost before the 2023 state is legible, producing an indecisive intermediate state. | Keep the card shell fixed and roll a two-panel content track from the lime premise to the loss-red 2023 state between timeline positions `0.20–0.38`. |
| 18–23 | 2019 → 2023 transition | The left headline, top equation row, and center copy are briefly on three different states. The incoming loss statement rises through the lower border and is visibly cropped. | Keep both messages in equal-height rows inside one fixed clipping viewport and align the vertical roll to the existing 2019 → 2023 timeline handoff. |
| 24–43 | Stable 2023 loss state | The loss statement sits on the panel floor with excessive dead space above it. Its line length is wide, hierarchy is flat, and it feels disconnected from the equation row. | Use left-aligned, high-contrast utility typography inside the centered annotation card; enlarge “By 2023” as the state marker and switch the panel fill to the existing loss token. |
| 44–49 | 2023 → 2026 transition | The narrative disappears before the opportunity rows arrive, creating a blank valley with only the single-family row visible. | Start the whole-card exit with the 2026 handoff at `0.56`, finish it at `0.70`, and begin the two new rows at `0.70`. |
| 50–77 | Three-row 2026 comparison | The final state is structurally clear, but its entrance inherits the preceding dead frame and therefore feels abrupt rather than causally connected. | Shorten the row reveal to `0.24` with a `0.035` stagger so the three-row comparison replaces the card immediately and reads as the answer to the preceding statement. |

## Resulting choreography

1. The 2019 premise is presented as an underwriting annotation card centered in the open equation surface.
2. The card remains fixed while its content rolls vertically to the 2023 loss statement: “By 2023, higher land, construction, and soft costs—plus lower end values—turned modeled profit into a loss.”
3. The card clips upward and clears completely.
4. The multiplex and garden-suite rows enter immediately afterward; the three-row state contains no overlapping narrative copy.

## Transcript synthesis

The 2023 sentence consolidates the meeting’s repeated points rather than quoting a single run: land acquisition rose to approximately `$1.46M`, hard costs rose to approximately `$450/ft²`, soft costs rose to approximately `$60/ft²`, and the modeled end value fell. The meeting repeatedly summarized the outcome as previously expected profit turning into a significant loss.
