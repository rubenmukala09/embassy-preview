# Embassy of the Democratic Republic of the Congo — Digital Brand System

This system governs every public page in the Embassy preview. It is designed to feel authoritative, calm, precise and distinctly Congolese without using national colours as decoration on every component.

## Brand principles

1. **Authority through restraint.** Navy, paper and disciplined spacing carry the interface.
2. **National identity through precision.** Clean gold marks priority and ceremony. DRC blue marks navigation, digital action and official alerts. Red appears only inside authentic flags, seals and photography—not as a routine interface colour.
3. **One action hierarchy.** Gold is the primary task action, navy is the standard navigation action, and outline is secondary. A component never presents two competing primary actions.
4. **Information before ornament.** Photography, the Embassy seal and official content provide richness. Repeated cards do not need unrelated gradients, glows or decorative geometry.
5. **Bilingual by construction.** Components allow French expansion and never depend on fixed text widths.

## Semantic colour tokens

| Token | Value | Use |
| --- | --- | --- |
| `--brand-navy-950` | `#011a35` | Deep institutional backgrounds |
| `--brand-navy-900` | `#052f57` | Primary brand surface and text |
| `--brand-navy-700` | `#075d96` | Navigation actions, alerts and hover |
| `--brand-blue-600` | `#0c8fd3` | Links, focus and digital navigation |
| `--brand-gold-500` | `#f2ce4f` | Primary action and ceremonial accent |
| `--brand-sky-100` | `#def3fd` | Quiet information and grouped surfaces |
| `--brand-paper` | `#ffffff` | Cards and primary reading surfaces |
| `--brand-canvas` | `#f2f8fc` | Page canvas and grouped sections |
| `--brand-ink` | `#082b4b` | Primary text |
| `--brand-muted` | `#486a84` | Secondary text |
| `--brand-line` | `rgba(5,47,87,.17)` | Standard border and divider |

National-flag colour combinations may appear in photography, the official flag and the seal. Interface rule lines, card accents, alerts and status surfaces use only navy, DRC blue, pale sky and clean gold.

## Typography

- **Display and institutional headings:** Merriweather, 700.
- **Interface and body copy:** Public Sans, 400–800.
- Page headings use a maximum measure of 18 characters when practical.
- Body copy uses a maximum measure of 70 characters.
- Eyebrows are quiet navigational labels, not decorative headlines.
- Interface text never drops below 12px on desktop or 13px on mobile.

## Spacing and geometry

- Section rhythm: 64–88px desktop; 48–56px mobile.
- Content gutter: 40px desktop; 20px tablet; 16px mobile.
- Standard card radius: 14px.
- Feature panel radius: 20px.
- Button and control radius: 9px.
- Standard grid gap: 16–24px.
- Shadows use neutral navy-black elevation only; no coloured halos.

## Surface hierarchy

1. **Canvas:** cool diplomatic neutral.
2. **Reading surface:** pure paper.
3. **Operational card:** paper, one border, one restrained shadow.
4. **Feature panel:** deep navy with white text and muted-gold accent.
5. **Image feature:** photography supplies variation; its frame follows the same geometry.

Cream and ivory section classes map to these two light surfaces. They must not introduce additional hue families.

## Chromatic rhythm

- Pale-sky fields distinguish grouped reading sections from the white page canvas.
- Cobalt icon shells identify operational tools, downloads, forms and service widgets.
- The shared quick-access dock uses a navy-to-cobalt field with gold reserved for the active or priority state.
- Active navigation uses a pale-sky surface and blue rule; it does not compete with the gold primary CTA.
- Cards use a restrained sky cast at their lower edge, with stronger blue borders only on hover or focus.
- Red remains absent from interface decoration and appears only in authentic national imagery.

## CTA hierarchy

- `.btn-gold`: one primary task per component or section.
- `.btn-navy`: normal navigation and official next steps.
- `.btn-outline`: secondary or reversible navigation.
- `.btn-ghost`: only on dark or photographic surfaces.
- `.widget-action`: a full-width final row that takes the visitor directly to the related system.
- Text links remain DRC blue and always retain a visible underline on hover or focus.

Buttons use a minimum 44px target on desktop and 48px on mobile. CTA labels begin with a verb and name their destination or outcome.

## Component grammar

- Cards share the same border, radius and elevation; content and imagery provide variation.
- Widgets end with exactly one explicit CTA.
- Every principal route opens with the same responsive hero frame: 660px desktop, 560px tablet and one visible screen on phones.
- The six-route consular quick-access system follows every hero and becomes the persistent bottom dock on tablet and phone.
- FAQs use paper rows, navy questions and one gold state marker.
- Forms use persistent labels, white controls and blue focus rings.
- Dark panels use only navy tonal variation; secondary text is blue-tinted white.
- Official alerts use navy/blue contrast, an icon and explicit copy; meaning never depends on a red fill.

## Motion

- Hover lift is limited to 2px.
- Motion uses `cubic-bezier(.2,.75,.25,1)` and lasts 180–220ms.
- Hero photography may transition slowly, but no universal decorative graphic animation is layered over hero content.
- No bounce, pulse or other decorative continuous motion.
- Reduced-motion preferences remove all non-essential transforms.

## Accessibility and localization

- Body contrast meets WCAG AA.
- Focus rings are visible on every interactive component.
- Icon-only controls require an accessible name.
- Layouts allow at least 35% text expansion for French.
- Meaning never depends only on colour, iconography or position.
