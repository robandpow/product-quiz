---
name: "Ekte vare?"
description: "A Norwegian product-image quiz with forest-green framing and white product stages."
colors:
  ink: "#193b32"
  muted: "#50645c"
  paper: "#f3f5f1"
  white: "#fff"
  line: "#d3dcd5"
  accent: "#a93e24"
  peach: "#f8a78d"
  pale: "#fff2eb"
  green-soft: "#e5eee5"
  purple: "#61436a"
  purple-soft: "#f2eaf3"
  primary-hover: "#2a5144"
  primary-disabled: "#dce3dc"
  disabled-text: "#5c6c61"
  intro-button-hover: "#ffc5ae"
typography:
  display:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "clamp(2.5rem, 5.3vw, 4.5rem)"
    fontWeight: 750
    lineHeight: 1.06
    letterSpacing: "-.04em"
  headline:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "clamp(1.8rem, 3.2vw, 2.75rem)"
    fontWeight: 750
    lineHeight: 1.15
    letterSpacing: "-.035em"
  title:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "1.12rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-.015em"
  body:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: ".875rem"
    fontWeight: 650
    lineHeight: 1.6
rounded:
  status: "5px"
  category: "6px"
  control: "8px"
  banner: "12px"
  card: "14px"
  intro: "16px"
spacing:
  compact: "8px"
  control-gap: "12px"
  card-gap: "16px"
  group-gap: "20px"
  section-gap: "24px"
  inset: "32px"
  desktop-gutter: "44px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    padding: "13px 25px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-primary-disabled:
    backgroundColor: "{colors.primary-disabled}"
    textColor: "{colors.disabled-text}"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "13px 25px"
  button-secondary-hover:
    backgroundColor: "{colors.green-soft}"
  button-intro:
    backgroundColor: "{colors.peach}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "13px 25px"
  button-intro-hover:
    backgroundColor: "{colors.intro-button-hover}"
  button-text:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "10px 0"
  product-card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.card}"
  product-card-selected:
    backgroundColor: "{colors.pale}"
  status-documented:
    backgroundColor: "{colors.green-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.status}"
    padding: "5px 8px"
  status-concept:
    backgroundColor: "{colors.purple-soft}"
    textColor: "{colors.purple}"
    rounded: "{rounded.status}"
    padding: "5px 8px"
  icon-button:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    width: "44px"
    height: "44px"
---

# Design System: Ekte vare?

## Overview

**Creative North Star: "A calm family tabletop quiz"**

This describes the implemented visual world recorded in the quiz surface brief, rather than an additional user preference. Forest-green framing, peach emphasis and white product stages place isolated product images at the center of the experience. Manrope carries both the compact navigation and the large opening statement.

The interface uses tonal surfaces and borders for hierarchy. During play, four product cards keep their positions as selections become evidence cards. Readable controls, explicit uncertainty and an untimed flow support the family audience described in PRODUCT.md.

**Key Characteristics:**
- White product stages with contained, uncropped images.
- Forest-green text and actions with rust selection and focus emphasis.
- Persistent card positions between selection and reveal.
- Large controls, visible keyboard focus and reduced-motion support.

## Colors

The palette combines forest green and warm peach with pale gray-green surroundings.

### Primary
- **Forest ink** supplies body text, primary actions, the opening panel and the results takeaway.
- **Rust accent** marks selected-card borders, keyboard focus, current progress and selected text emphasis.
- **Peach** highlights the opening headline and its primary action against forest ink.

### Secondary
- **Concept purple** and **soft purple** distinguish generated concepts after reveal. They are provenance labels, not error styling.
- **Soft green** supports documented-product labels and quiet supporting surfaces.

### Neutral
- **Paper** is the page background; **white** is the product and dialog surface.
- **Muted green** carries secondary prose; **line** separates controls and content.
- **Pale peach** fills selected product cards while their image stages remain white.

**The Evidence Label Rule.** Color supplements explicit provenance and selection text; it never carries the answer alone.

## Typography

The single family is self-hosted variable Manrope, with Segoe UI and sans-serif fallbacks. The local WOFF2 declares weights 200–800 and uses `font-display: swap`. The hierarchy uses weight, tight headline tracking and restrained size changes; it is not a mathematical modular scale.

The frontmatter display role describes the introductory headline; headline describes the round question; title describes product reveal headings. Body copy uses a generous line height, while supporting labels are smaller and heavier. Main headings use balanced wrapping; paragraphs use pretty wrapping. Counters and prices use tabular numerals.

Introductory supporting copy is constrained to 34 characters on desktop and 42 on smaller screens. Longer results and source explanations use separate widths up to 70 characters. UI copy is Norwegian Bokmål and uses sentence case.

## Layout

Header, footer and introduction share a maximum outer width of 1280px. The quiz uses 1032px and results 1000px. Their desktop horizontal padding is the desktop-gutter token. The introduction has a 1.08:1 split between text and imagery; the play grid remains two columns throughout.

At 760px and below, content gutters become 22px, the introduction stacks, its four-image gallery becomes one horizontal row, the category moves above the question, and answer actions stack. Submission and reflection actions stack and expand to the available width. Results review cards become one column. Header edition text is hidden; footer content stacks.

At 420px and below, content gutters become 16px, the introduction's lower prose stacks, and product grid gaps shrink to 10px. Product stages use fixed responsive heights: 190px at the first breakpoint and 158px at the second; reveal stages use 170px and 145px. Zoom remains a 44px control. The two-column product comparison remains intact.

Images use `object-fit: contain` inside white stages. Width and height attributes reserve image space, and wrappers fix each stage's height. Text can expand vertically; reveal headings permit wrapping within narrow columns.

## Elevation & Depth

Content cards are flat, with borders and tonal backgrounds providing separation. Only modal dialogs use a shadow (`0 20px 80px #10271e40`) and dark translucent backdrop (`#10271eb5`). Product cards transition border and background colors over 150ms with ease-out. Reduced-motion preference removes animations and transitions and restores automatic scrolling.

## Shapes

Controls have modest rounded corners; product cards and dialogs have larger shared corners. Introductory and takeaway panels are broader rounded containers. Status labels and categories have smaller corners rather than full pill shapes. Selection cards use a 2px border; most controls and dividers use 1px. The segmented progress bar uses short rounded horizontal marks.

## Components

### Actions and navigation

Primary and secondary buttons have a minimum height of 52px and bold labels. Primary actions darken on hover; secondary and icon buttons gain a soft-green fill. The opening action uses peach against forest ink. Disabled submission uses muted neutral fill and text. Underlined text buttons provide supporting navigation. The wordmark is a button back to the introduction, with its question mark colored rust.

Keyboard focus is a 3px rust outline, generally offset by 5px. Product controls transfer visible focus to their enclosing card. A skip link becomes visible on focus. Page transitions move focus to the main heading; updates announce selection counts through a polite status region.

### Product selection and reveal cards

Native checkboxes remain visible, and each product's label is clickable. Selection changes the card border and fill and adds the word “Valgt.” The zoom action is a separate labeled button opening a native image dialog. Image-load failure supplies retry text and blocks answer submission until the images are available.

The same ordered product positions are used for reveal. Reveal cards retain selection history in text, add documented/concept badges, and show source links for documented products. The badges combine text with icons except at the narrowest breakpoint, where text remains. Source links announce that they open a new tab.

### Alternative answers and submission

“Ingen av dem” and “Vet ikke” are toggle buttons with `aria-pressed`. Their active state is forest ink with white text; choosing either clears product selection. Submission becomes available immediately after selecting products or either alternative answer. There is no countdown.

### Progress, results and dialogs

Progress combines a textual round counter with an accessible label for the segmented visual track. Completed segments are forest ink and the current segment is rust. Results pair a short reflection with counts and native disclosure elements for reviewing each round.

Image and information dialogs have labeled headings and 44px close controls. Native modal behavior supplies focus containment and Escape dismissal. Restart confirmation puts the preserving action first and gives it autofocus. Dialog width and height are constrained to the viewport; enlarged images use containment and a 72svh maximum height.

## Do's and Don'ts

### Do:
- **Do** preserve white image stages and uncropped product silhouettes.
- **Do** retain product order and written selection history through reveal.
- **Do** pair status colors with text, preserve native control semantics and visible keyboard focus.
- **Do** describe source provenance separately from claims about product safety or image origin.
- **Do** retain explicit uncertainty, image enlargement and an untimed flow.

### Don't:
- **Don't** expose per-product provenance before the answer is revealed.
- **Don't** equate a documented listing with photographic authenticity, tested efficacy or safety verification.
- **Don't** claim a generated concept proves that similar products cannot exist.
- **Don't** add hover lifts or decorative card shadows to the current flat comparison grid.

<!-- Extracted from styles.css, index.html, app.js, PRODUCT.md and .impeccable/surfaces/quiz.md. Sidecar extensions and component previews: .impeccable/design.json. -->
