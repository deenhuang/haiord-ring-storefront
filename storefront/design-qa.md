# NOOR Ring Frontend QA

## Comparison Target

- Source: `/var/folders/wk/p4krcvk532d0v7_jqb6_bpyc0000gn/T/codex-clipboard-ccced01d-362b-4635-9184-a09108375fd2.png` (3383 x 30048).
- Source intent: Cybopal's presale sales structure, not a pixel-identical brand clone.
- Implementation: `http://localhost:5180/`, default USD, Champagne Gold, quantity 1, sizing kit.
- Desktop: 1440 x 1000 CSS pixels, device scale factor 1.
- Other verified viewports: 390 x 844, 320 x 760, 768 x 1024.
- Browser evidence: `qa/desktop.png`, `qa/desktop-first-screen.png`, `qa/mobile.png`, `qa/mobile-first-screen.png`, `qa/reservation.png`, `qa/mobile-reservation.png`.
- Focused comparison: `qa/comparison-purchase.png`. Source top 3100px and rendered desktop normalized to 720px wide, paired in one image.
- Full-page composition comparison: `qa/comparison-overview.png`. Differing lengths and products are intentional; this is not a pixel-difference test.

## Findings And Repairs

- [P2, repaired] Full-width collection crop hid parts of the rings on desktop. Replaced the fixed-height cover crop with a proportional, width-constrained image. Post-fix screenshot `qa/desktop.png` and combined `qa/comparison-overview.png` show all four rings.
- [P2, repaired] A keyboard Tab immediately after form completion could leave the dialog after the submit button was unmounted. Added a focus-containment guard and a browser regression assertion.

## Fidelity Surfaces

- Typography: restrained sans-serif hierarchy, similar to the reference. NOOR is explicit in the first viewport. No negative letter spacing or viewport-scaled type. Responsive wrapping checked.
- Rhythm: reference two-column gallery and reservation control surface is retained on desktop; mobile stacks them and exposes a persistent reservation CTA. No horizontal overflow at all four viewports.
- Colors: neutral white, charcoal, pale sage and gold replace Cybopal's blue accents. Six wellness modules use sage tones; Qibla/prayer features use gold below them.
- Assets: real supplied ring imagery, lifestyle photos and two original product videos. H.264 versions were created for browser compatibility. All 13 displayed images load. No fabricated customer reviews or ratings.
- Copy: NOOR-specific wellness content replaces Cybopal claims. No Cybopal shipping/refund guarantees were copied. Prices and presale terms remain proposals. Qibla and prayer reminders are labeled planned app features; no unsupported on-ring feature is claimed.

## Functional Verification

- Three currencies and quote totals.
- Four finish selections and product gallery controls.
- Quantity, ring size and sizing kit selection.
- Reservation validation, completion, Escape dismissal and focus containment.
- Mobile navigation, FAQ accordion and mobile CTA.
- Both video files play with nonzero time and valid frame dimensions.
- No JavaScript page errors; no horizontal overflow.
- Production build and three pricing/validation unit tests pass.

## Intentional Differences And Limits

- NOOR wellness content and original media replace the reference product sections.
- Product films replace influencer reviews because no verified review material was supplied.
- No launch date, paid checkout, CRM, order database, email delivery or analytics integration.
- Safari/iOS hardware playback and live payment flows remain untested; Chrome responsive emulation is not a real-device test.
- Feishu user authorization expired. No Feishu content was edited, and no GitHub repository was overwritten or deployed.

final result: passed
