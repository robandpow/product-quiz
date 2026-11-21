# Verification record — 2026-11-21

## Latest image presentation revision

Replaced the grey-backed Nitelite photo with LIEWOOD's original Winston Rabbit packshot, and the prominently branded Flextail pump with Wildo's original Fold-A-Cup photo. Sources updated without changing answer IDs/classifications. Sixteen generated companions were remade using the relevant original catalogue image as a photographic style reference. Both before/after contact sheets were visually inspected across all eight rounds.

All 32 active images receive the same recorded rectangular crop/resize/padding treatment. Originals are preserved; no segmentation, repainting, logo removal or AI edits were applied to sourced products. Final WebP images total 1,014,776 bytes. `content/presentation.json` records source and output hashes, dimensions, crop and method. This addresses presentation bias; it does not establish equal difficulty or human detection rates.

Confidence ratings were removed at the user's request. Existing saved progress is accepted and the obsolete field dropped. Selection or an explicit alternative now enables reveal immediately; all eight rounds still complete. The original verification notes below describe the initial build where applicable.

## Automated model and asset checks

`npm test`: 7 passing tests. Four assets per round, eight rounds and eight documented products; image files present; evidence links; zero-real and multi-real evaluation; confidence requirements; uncertainty distinct from rejection; confidence aggregation; shuffled session validation; corrupt/blocked storage recovery.

The sandbox prevented Node's default test runner from spawning child processes (`EPERM`). The test command runs the same `node:test` suite directly in one process, with all seven checks passing.

## Browser checks

Chromium desktop 1440×1000, mobile 390×844, narrow 320×740. A full eight-round playthrough tested an incorrect confident answer, both real selections, uncertainty, none, partial selections, all-fictional rounds, advertisement reveal and results. All rounds rendered four loaded images, with no horizontal overflow. Results accurately aggregated the selections. Asset provenance is deliberately not hidden from browser developer tools.

- Refresh preserved ordering, selections and confidence exactly.
- Image enlargement opened as a native modal. Escape closed it and restored focus to the invoking zoom control.
- Keyboard Space toggled a product; arrow keys changed confidence.
- Restart cancellation retained results; confirmed restart cleared answers after the dialog close event.
- Blocked localStorage showed a useful notice and allowed completion of a round.
- Corrupt saved JSON fell back to a fresh start.
- Local sharing control explained that localhost cannot be shared as a public URL.
- Expanded answer review loaded all thumbnails. A first full-page capture missed lazy images; recapture after decoding verified this was a screenshot artifact.

## Visual and source review

All 24 generated concepts and eight sourced images visually inspected. Independent finish reviewer: **ship for local use**, no material findings after the expanded-review evidence was repaired. Desktop/mobile intro, quiz, reveal and results captured in `.impeccable/review/` (not part of build).

Design hook's missing image-source finding was fixed by setting a real initial lightbox source. No suppressions or standing hook findings.

Modern-web-guidance package was unavailable in the offline npm cache. The official web-published Dialog guide was read instead: https://developer.chrome.com/docs/modern-web-guidance/guides/ui-components/dialog . Native `showModal`, form-based close, progressive `closedby`, native focus/escape behavior and overscroll containment follow that guidance. No hand-written focus trap or body-scroll locking.

## Image restoration — 2026-11-21

Kept the four revised images in the first round. Restored all 28 original image paths and framing in rounds 2–8, including the Flextail pump and its original source/reveal metadata. The assembler applies revised presentation only to `baby`. All seven tests and the static build pass. An isolated browser session decoded all 32 active images successfully at http://localhost:5173; the preview server remains running.

## Limits

No physical product testing, screen-reader session, Safari/Firefox run, external family pilot, or public image-reuse clearance. Retailer/product corroboration and exact source URLs are recorded in `content/real-products.json`. Generated image provenance establishes that these pictures were made for the quiz, not universal nonexistence of similar products. No deployment has been performed.
