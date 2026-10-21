# Design Language: Embassy of the Democratic Republic of the Congo, Washington, D.C.

> Extracted from `https://rubenmukala09.github.io/embassy-preview/` on October 21, 2026
> 6840 elements analyzed across 7 pages

This document describes the complete design language of the website. It is structured for AI/LLM consumption — use it to faithfully recreate the visual design in any framework.

## Color Palette

### Primary Colors

| Role | Hex | RGB | HSL | Usage Count |
|------|-----|-----|-----|-------------|
| Primary | `#f3d34a` | rgb(243, 211, 74) | hsl(49, 88%, 62%) | 637 |
| Secondary | `#0b2440` | rgb(11, 36, 64) | hsl(212, 71%, 15%) | 2716 |
| Accent | `#9f2732` | rgb(159, 39, 50) | hsl(355, 61%, 39%) | 7 |

### Tonal Ramps

Generated in OKLCH from each role colour, so the steps are perceptually even. The site's own colour keeps its position in the ladder.

| Role | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|------|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| primary | `#fff6ae` | `#feea9a` | **`#f3d34a`** | `#dabf52` | `#bc9e00` | `#9e7f00` | `#866900` | `#6e5300` | `#5b4400` | `#4b3600` | `#2b1d00` |
| secondary | `#e5f8ff` | `#d8ecff` | `#c5dcf7` | `#a9c3e2` | `#86a2c4` | `#6884a6` | `#546e8e` | `#415874` | `#344861` | `#283a4f` | **`#0b2440`** |
| accent | `#ffdddb` | `#ffcfcc` | `#ffbab8` | `#ff9c9b` | `#ee7577` | `#ce5458` | `#b24045` | **`#9f2732`** | `#7c2128` | `#67171e` | `#3e060c` |
| neutral | `#e8f7ff` | `#dbecfe` | `#c8dcf0` | `#adc3da` | `#8ba2bb` | `#6d859d` | **`#5a7189`** | `#45596d` | `#37485a` | `#2b3a4a` | `#16202a` |

### Semantic Pairs

| Role | Background | Foreground | Contrast | Level |
|------|------------|------------|----------|-------|
| `surface.page` | `#ffffff` | `#000000` | 21:1 | AAA |
| `surface.raised` | `#071528` | `#ffffff` | 18.31:1 | AAA |
| `action.primary` | `#f3d34a` | `#000000` | 14.23:1 | AAA |
| `action.secondary` | `#0b2440` | `#ffffff` | 15.66:1 | AAA |
| `action.accent` | `#9f2732` | `#ffffff` | 7.47:1 | AAA |

### Dominance

Share of painted background area — what the page looks like, as opposed to what it declares most often.

- `#ffffff` — 91%
- `#060d1e` — 4%
- `#0b2440` — 2%
- `#011a35` — 1%
- `#eaf7fd` — 1%
- `#052f57` — 0%

### Neutral Colors

| Hex | HSL | Usage Count |
|-----|-----|-------------|
| `#ffffff` | hsl(0, 0%, 100%) | 1334 |
| `#000000` | hsl(0, 0%, 0%) | 729 |
| `#5a7189` | hsl(211, 21%, 45%) | 469 |
| `#91a4bb` | hsl(213, 24%, 65%) | 35 |
| `#52637a` | hsl(215, 20%, 40%) | 34 |
| `#465c74` | hsl(211, 25%, 36%) | 14 |

### Background Colors

Used on large-area elements: `#ffffff`, `#071528`, `#f4f7fb`, `#011a35`, `#052f57`, `#060d1e`, `#0b1f3a`, `#eaf2fd`, `#f8fafc`

### Text Colors

Text color palette: `#000000`, `#092744`, `#ffffff`, `#46506a`, `#163457`, `#0b1f3a`, `#34455e`, `#d9ecf7`, `#f3d34a`, `#eaf7fd`

### Gradients

```css
background-image: linear-gradient(90deg, rgb(248, 252, 255), rgb(231, 241, 255) 52%, rgb(255, 255, 255));
```

```css
background-image: linear-gradient(90deg, rgb(6, 26, 50), rgb(10, 49, 88) 58%, rgb(6, 72, 117));
```

```css
background-image: linear-gradient(rgb(244, 251, 255), rgb(216, 240, 252));
```

```css
background-image: linear-gradient(rgb(255, 227, 123) 0%, rgb(243, 211, 74) 100%);
```

```css
background-image: linear-gradient(90deg, rgb(10, 49, 88), rgb(23, 79, 134) 55%, rgb(8, 111, 174));
```

```css
background-image: linear-gradient(97deg, rgba(6, 13, 30, 0.82) 0%, rgba(7, 17, 38, 0.66) 24%, rgba(8, 20, 44, 0.34) 46%, rgba(8, 20, 44, 0.08) 62%, rgba(0, 0, 0, 0) 78%);
```

```css
background-image: linear-gradient(90deg, rgb(45, 112, 214) 0px, rgb(45, 112, 214) 58%, rgb(243, 211, 74) 58%, rgb(243, 211, 74) 66%, rgb(196, 51, 62) 66%, rgb(196, 51, 62) 82%, rgb(243, 211, 74) 82%, rgb(243, 211, 74) 90%, rgb(45, 112, 214) 90%, rgb(45, 112, 214) 100%);
```

```css
background-image: linear-gradient(rgb(232, 246, 253) 0%, rgb(244, 248, 253) 76%, rgba(0, 0, 0, 0) 100%);
```

```css
background-image: radial-gradient(circle at 50% -80%, rgba(34, 172, 232, 0.42), rgba(0, 0, 0, 0) 54%), linear-gradient(110deg, rgb(6, 26, 50), rgb(10, 49, 88) 48%, rgb(23, 79, 134));
```

```css
background-image: linear-gradient(145deg, rgba(34, 172, 232, 0.3), rgba(255, 255, 255, 0.08));
```

```css
background-image: linear-gradient(rgb(255, 255, 255), rgb(248, 252, 255));
```

```css
background-image: radial-gradient(circle at 90% 0px, rgba(46, 123, 196, 0.14), rgba(0, 0, 0, 0) 28%), linear-gradient(145deg, rgba(7, 52, 92, 0.97) 0%, rgba(8, 43, 80, 0.97) 42%, rgba(3, 26, 51, 0.98) 100%), url("https://rubenmukala09.github.io/embassy-preview/aurora/assets/img/generated/accents-2026/accent-weave.webp");
```

```css
background-image: linear-gradient(145deg, rgba(35, 74, 119, 0.88), rgba(11, 39, 75, 0.94));
```

```css
background-image: linear-gradient(rgb(16, 41, 74), rgb(11, 31, 58));
```

```css
background-image: linear-gradient(90deg, rgba(17, 119, 196, 0.32), rgba(17, 119, 196, 0.08));
```

```css
background-image: linear-gradient(90deg, rgb(217, 158, 0), rgb(255, 206, 31) 40%, rgb(255, 224, 131) 66%, rgb(0, 200, 255));
```

```css
background-image: linear-gradient(145deg, rgb(16, 45, 88) 0%, rgb(7, 26, 53) 70%);
```

```css
background-image: linear-gradient(145deg, rgb(23, 137, 206), rgb(11, 42, 87));
```

```css
background-image: linear-gradient(135deg, rgb(11, 42, 83), rgb(7, 26, 53) 76%);
```

```css
background-image: linear-gradient(rgb(243, 247, 251), rgb(248, 250, 252));
```

```css
background-image: linear-gradient(145deg, rgb(255, 226, 115), rgb(238, 189, 40));
```

```css
background-image: linear-gradient(90deg, rgba(196, 162, 89, 0.18), rgba(196, 162, 89, 0.035));
```

```css
background-image: linear-gradient(to top, rgba(1, 26, 53, 0.82) 0%, rgba(1, 26, 53, 0.5) 55%, rgba(1, 26, 53, 0) 100%);
```

### Full Color Inventory

| Hex | Contexts | Count |
|-----|----------|-------|
| `#0b2440` | text, border, background | 2716 |
| `#d5e2f0` | border, text | 1620 |
| `#011a35` | text, border, background | 1581 |
| `#ffffff` | background, text, border | 1334 |
| `#334763` | text, border | 1129 |
| `#1d5bb8` | text, border | 1032 |
| `#000000` | text, border, background | 729 |
| `#f3d34a` | text, border, background | 637 |
| `#3b5571` | text, border | 633 |
| `#5a7189` | text, border | 469 |
| `#cbddea` | text, border | 399 |
| `#052f57` | text, border, background | 294 |
| `#0a3158` | text, border | 284 |
| `#eaf7fd` | text, border, background | 280 |
| `#6d5508` | text, border | 244 |
| `#075fae` | text, border | 128 |
| `#174f86` | text, border | 113 |
| `#fff0a2` | text, border | 81 |
| `#b7c5d7` | text, border | 70 |
| `#172c46` | text, border | 49 |
| `#ffe47a` | border, text | 43 |
| `#bfe9fb` | border | 42 |
| `#075d96` | border | 39 |
| `#91a4bb` | text, border | 35 |
| `#173b66` | text | 35 |
| `#52637a` | text, border | 34 |
| `#c9a321` | border | 31 |
| `#060d1e` | background | 31 |
| `#ece4d2` | border | 28 |
| `#7a5a00` | text, border | 23 |

## Typography

### Font Families

- **Public Sans** — used for all (2537 elements)
- **Merriweather** — used for all (218 elements)
- **Arial** — used for all (22 elements)

### Type System

- **Scale ratio** — 1.067 (minor second), anchored at 8px · 100% of sizes sit on the ladder
- **Measure** — ~69 characters per line (comfortable)
- **Fluid type** — 83 clamp/viewport font sizes, 7px → 96px

### Named Scale

| Role | Size | Weight | Line Height | Tracking |
|------|------|--------|-------------|----------|
| `h2` | 40px / 2.5rem | 700 | 46.4px | -0.48px |
| `h1` | 38.48px / 2.405rem | 700 | 41.5584px | -1.00048px |
| `title-1` | 34px / 2.125rem | 600 | normal | 1.7px |
| `title-2` | 31px / 1.9375rem | 600 | normal | -0.09px |
| `title-3` | 30.36px / 1.8975rem | 700 | 34.3068px | -0.78936px |
| `title-4` | 30px / 1.875rem | 500 | normal | 0.6px |
| `title-5` | 28.8px / 1.8rem | 700 | 33.12px | -0.288px |
| `title-6` | 28px / 1.75rem | 600 | normal | 1.68px |
| `h3` | 26px / 1.625rem | 700 | 29.9px | -0.09px |
| `title-7` | 24.8px / 1.55rem | 700 | 31px | -0.09px |
| `title-8` | 24px / 1.5rem | 700 | 24px | -0.09px |
| `title-9` | 23.68px / 1.48rem | 700 | 30.784px | -0.1184px |
| `title-10` | 23px / 1.4375rem | 400 | 23px | normal |
| `title-11` | 22.68px / 1.4175rem | 700 | 29.484px | -0.1134px |
| `title-12` | 22.4px / 1.4rem | 700 | 28.672px | -0.112px |

### Fluid Declarations

```css
main .collision-drc::before { font-size: clamp(52px, 7vw, 96px); }
main .kinshasa-intro h2 { font-size: clamp(42px, 6vw, 82px); }
main .tourism-hero h2 { font-size: clamp(45px, 6vw, 76px); }
main .kinshasa-story h3 { font-size: clamp(39px, 5vw, 68px); }
.phead h1 { font-size: clamp(40px, 5vw, 68px); }
.drc-future-copy h2 { font-size: clamp(38px, 4.6vw, 68px); }
main .drc-opening-copy h2, main .drc-section-heading h2 { font-size: clamp(36px, 5vw, 64px); }
main .drc-cta-copy h2 { font-size: clamp(38px, 5vw, 62px); }
body main .drc-cta-copy h2 { font-size: clamp(42px, 4.35vw, 62px); }
main .leader-copy h3 { font-size: clamp(34px, 4.7vw, 60px); }
```

### Type Scale

| Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Used On |
|-----------|------------|--------|-------------|----------------|---------|
| 40px | 2.5rem | 700 | 46.4px | -0.48px | h2 |
| 38.48px | 2.405rem | 700 | 41.5584px | -1.00048px | h1, em |
| 34px | 2.125rem | 600 | normal | 1.7px | text |
| 31px | 1.9375rem | 600 | normal | -0.09px | text |
| 30.36px | 1.8975rem | 700 | 34.3068px | -0.78936px | h2 |
| 30px | 1.875rem | 500 | normal | 0.6px | text |
| 28.8px | 1.8rem | 700 | 33.12px | -0.288px | dd |
| 28px | 1.75rem | 600 | normal | 1.68px | text |
| 26px | 1.625rem | 700 | 29.9px | -0.09px | b, span, h3 |
| 24.8px | 1.55rem | 700 | 31px | -0.09px | span |
| 24px | 1.5rem | 700 | 24px | -0.09px | b, button |
| 23.68px | 1.48rem | 700 | 30.784px | -0.1184px | h3, a, span |
| 23px | 1.4375rem | 400 | 23px | normal | button |
| 22.68px | 1.4175rem | 700 | 29.484px | -0.1134px | h3, span, svg, use |
| 22.4px | 1.4rem | 700 | 28.672px | -0.112px | h3 |

### Heading Scale

```css
h2 { font-size: 40px; font-weight: 700; line-height: 46.4px; }
h1 { font-size: 38.48px; font-weight: 700; line-height: 41.5584px; }
h2 { font-size: 30.36px; font-weight: 700; line-height: 34.3068px; }
h3 { font-size: 26px; font-weight: 700; line-height: 29.9px; }
h3 { font-size: 23.68px; font-weight: 700; line-height: 30.784px; }
h3 { font-size: 22.68px; font-weight: 700; line-height: 29.484px; }
h3 { font-size: 22.4px; font-weight: 700; line-height: 28.672px; }
h3 { font-size: 20px; font-weight: 700; line-height: 26px; }
h3 { font-size: 19px; font-weight: 700; line-height: 24.7px; }
h4 { font-size: 18px; font-weight: 700; line-height: 21.6px; }
h4 { font-size: 17px; font-weight: 400; line-height: 28.22px; }
h4 { font-size: 16px; font-weight: 400; line-height: normal; }
h4 { font-size: 13px; font-weight: 700; line-height: 21.84px; }
h5 { font-size: 11px; font-weight: 500; line-height: 11px; }
```

### Body Text

```css
body { font-size: 16.5px; font-weight: 400; line-height: 26.73px; }
```

### Font Weights in Use

`400` (3904x), `600` (1145x), `700` (1094x), `500` (309x), `750` (279x), `800` (56x), `720` (35x), `900` (10x), `850` (8x)

## Spacing

**Base unit:** 2px

| Token | Value | Rem |
|-------|-------|-----|
| spacing-1 | 1px | 0.0625rem |
| spacing-44 | 44px | 2.75rem |
| spacing-56 | 56px | 3.5rem |
| spacing-62 | 62px | 3.875rem |
| spacing-70 | 70px | 4.375rem |
| spacing-77 | 77px | 4.8125rem |
| spacing-80 | 80px | 5rem |
| spacing-86 | 86px | 5.375rem |
| spacing-96 | 96px | 6rem |
| spacing-100 | 100px | 6.25rem |
| spacing-104 | 104px | 6.5rem |
| spacing-111 | 111px | 6.9375rem |
| spacing-126 | 126px | 7.875rem |
| spacing-147 | 147px | 9.1875rem |
| spacing-163 | 163px | 10.1875rem |
| spacing-194 | 194px | 12.125rem |
| spacing-211 | 211px | 13.1875rem |
| spacing-230 | 230px | 14.375rem |
| spacing-255 | 255px | 15.9375rem |
| spacing-315 | 315px | 19.6875rem |

## Border Radii

| Label | Value | Count |
|-------|-------|-------|
| xs | 1px | 120 |
| sm | 4px | 4 |
| md | 7px | 21 |
| md | 10px | 53 |
| lg | 13px | 1 |
| lg | 16px | 14 |
| xl | 20px | 9 |
| full | 50px | 85 |
| full | 99px | 7 |
| full | 999px | 12 |

## Elevation

8 levels from 31 raw shadows · colored tint

**xs** — blur 2px, y 1px, used 57× · 2 layers · tinted (hue 211°)
```css
box-shadow: rgba(1, 26, 53, 0.05) 0px 1px 2px 0px, rgba(1, 26, 53, 0.03) 0px 1px 1px 0px;
```

**sm** — blur 8px, y 0px, used 7× · tinted (hue 42°)
```css
box-shadow: rgba(200, 164, 77, 0.6) 0px 0px 8px 0px;
```

**md** — blur 12px, y 4px, used 35× · tinted (hue 213°)
```css
box-shadow: rgba(8, 32, 62, 0.7) 0px 4px 12px -10px;
```

**lg** — blur 18px, y 8px, used 7× · tinted (hue 41°)
```css
box-shadow: rgba(132, 91, 0, 0.65) 0px 8px 18px -12px;
```

**xl** — blur 26px, y 10px, used 42× · tinted (hue 213°)
```css
box-shadow: rgba(5, 29, 58, 0.62) 0px 10px 26px -24px;
```

**2xl** — blur 50px, y 22px, used 7× · tinted (hue 218°)
```css
box-shadow: rgba(0, 8, 22, 0.7) 0px 22px 50px -18px;
```

**3xl** — blur 66px, y 32px, used 28× · 2 layers · tinted (hue 223°)
```css
box-shadow: rgba(6, 13, 30, 0.6) 0px 32px 66px -30px, rgba(6, 13, 30, 0.08) 0px 4px 12px 0px;
```

**e8** — blur 90px, y 36px, used 7× · 2 layers · tinted (hue 217°)
```css
box-shadow: rgba(3, 15, 34, 0.82) 0px 36px 90px -34px, rgba(3, 15, 34, 0.52) 0px 12px 34px -20px;
```

## Inset Shadows

```css
box-shadow: rgba(0, 42, 82, 0.055) 0px 1px 0px 0px inset;
```

```css
box-shadow: rgba(255, 255, 255, 0.09) 0px 1px 0px 0px inset;
```

```css
box-shadow: rgb(45, 112, 214) 0px -2px 0px 0px inset;
```

```css
box-shadow: rgb(243, 211, 74) 3px 0px 0px 0px inset;
```

```css
box-shadow: rgba(4, 29, 57, 0.035) 0px 1px 2px 0px inset, rgba(255, 255, 255, 0.6) 0px 1px 0px 0px;
```

```css
box-shadow: rgba(3, 24, 46, 0.5) 0px 10px 24px -18px, rgba(255, 255, 255, 0.6) 0px 1px 0px 0px inset;
```

```css
box-shadow: rgba(255, 255, 255, 0.07) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.8) 0px 18px 42px -30px;
```

```css
box-shadow: rgba(1, 26, 53, 0.82) 0px 22px 44px -30px, rgba(255, 255, 255, 0.12) 0px 1px 0px 0px inset;
```

```css
box-shadow: rgba(4, 14, 32, 0.88) 0px 20px 48px -22px, rgba(255, 255, 255, 0.12) 0px 1px 0px 0px inset;
```

```css
box-shadow: rgba(6, 13, 30, 0.45) -26px 0px 60px 0px, rgba(239, 218, 164, 0.14) 1px 0px 0px 0px inset;
```

```css
box-shadow: rgba(2, 17, 34, 0.18) 0px -90px 120px 0px inset;
```

## CSS Custom Properties

### Colors

```css
--muted: #34455e;
--r-card: 16px;
--brand-muted: #4d677f;
--vs-muted: #5a6d80;
--vs-border: rgba(6, 40, 77, .14);
--color-background-primary: var(--vs-ivory-100);
--color-background-secondary: var(--vs-white);
--color-surface: var(--vs-surface);
--color-surface-glass: var(--vs-surface-glass);
--color-text-primary: var(--vs-ink);
--color-text-secondary: var(--vs-muted);
--color-accent-primary: var(--vs-gold-500);
--color-accent-secondary: var(--vs-blue-600);
--color-border: var(--vs-border);
--color-success: #17815f;
--color-warning: #755d12;
--color-error: var(--brand-red-700);
--vs-card-border: rgba(6, 40, 77, .13);
--vs-card-shadow: 0 12px 34px rgba(3, 26, 51, .075), 0 2px 6px rgba(3, 26, 51, .045);
--vs-card-shadow-active: 0 18px 44px rgba(3, 26, 51, .12), 0 3px 8px rgba(3, 26, 51, .06);
--lux-muted: #5b6d80;
--type-card-title: clamp(18px, calc(.48vw + 15px), 22px);
--deep-muted: #52657c;
--faq-muted: #536b82;
--contrast-on-dark-muted: #c7d7e8;
--contrast-on-dark-accent: #ffe47a;
--contrast-on-light-muted: #465c74;
--std-muted: var(--brand-muted);
--brand-radius-card: 14px;
--brand-shadow-card: 0 1px 2px rgba(4, 20, 39, .035), 0 12px 30px rgba(4, 20, 39, .055);
--accent-weave: url("assets/img/generated/accents-2026/accent-weave.webp");
--accent-weave-size: 300px;
--accent-weave-strength: .5;
```

### Spacing

```css
--vs-space-1: .25rem;
--vs-space-2: .5rem;
--vs-space-3: .75rem;
--vs-space-4: 1rem;
--vs-space-5: 1.5rem;
--vs-space-6: 2rem;
--vs-space-7: 3rem;
--space-xs: var(--vs-space-2);
--space-sm: var(--vs-space-3);
--space-md: var(--vs-space-4);
--space-lg: var(--vs-space-5);
--space-xl: var(--vs-space-7);
--brand-section-space: clamp(60px, 6vw, 86px);
--brand-grid-gap: clamp(16px, 2vw, 24px);
```

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(10,27,61,.05),0 6px 16px -8px rgba(10,27,61,.16);
--shadow: 0 2px 6px rgba(10,27,61,.06),0 28px 56px -24px rgba(10,27,61,.42);
--vs-shadow-sm: 0 8px 24px rgba(3, 26, 51, .08);
--vs-shadow-md: 0 18px 48px rgba(3, 26, 51, .13);
--vs-shadow-lg: 0 34px 80px rgba(3, 26, 51, .18);
--lux-shadow-1: 0 12px 32px rgba(4, 29, 57, .075), 0 2px 5px rgba(4, 29, 57, .04);
--lux-shadow-2: 0 22px 52px rgba(4, 29, 57, .12), 0 5px 12px rgba(4, 29, 57, .055);
--deep-shadow: 0 18px 52px rgba(7, 29, 56, .09);
--std-shadow-rest: var(--brand-shadow-card);
--std-shadow-hover: 0 2px 5px rgba(4, 20, 39, .04), 0 18px 38px rgba(4, 20, 39, .085);
--std-glass-shadow: 0 1px 2px rgba(6, 31, 61, .035), 0 18px 48px rgba(6, 31, 61, .09), inset 0 1px 0 rgba(255, 255, 255, .92);
--brand-shadow-feature: 0 22px 52px rgba(4, 20, 39, .16);
--px-shadow: 0 1px 2px #011a350d,0 1px 1px #011a3508;
--px-shadow-hover: 0 1px 2px #011a350f,0 12px 28px -18px #011a3559;
```

### Radii

```css
--radius: 16px;
--brand-radius: 16px;
--vs-radius-sm: .5rem;
--vs-radius-md: .875rem;
--vs-radius-lg: 1.25rem;
--vs-radius-xl: 1.75rem;
--lux-radius-sm: 10px;
--lux-radius: 16px;
--lux-radius-lg: 22px;
--deep-radius: 18px;
--std-radius-sm: var(--brand-radius-control);
--std-radius-md: var(--brand-radius-card);
--std-radius-lg: var(--brand-radius-feature);
--brand-radius-control: 9px;
--brand-radius-feature: 20px;
--px-radius: 14px;
--px-radius-lg: 20px;
--px-radius-ctl: 10px;
```

### Other

```css
--navy: #0b1f3a;
--navy-700: #10294a;
--navy-600: #163457;
--navy-900: #071528;
--navy-050: #e8eef7;
--gold: var(--brand-gold-500);
--gold-soft: #fff0a2;
--gold-bright: #ffdf69;
--gold-deep: #6d5508;
--gold-grad: linear-gradient(180deg, #ffe37a 0%, #f2ce4f 100%);
--ivory: #eef3f9;
--cream: #eef3f9;
--paper: #ffffff;
--ink: #0c1c33;
--faint: #55677d;
--line: #e2e8f0;
--line-2: #eef2f7;
--ok: #13708f;
--warn: #755d12;
--bad: var(--brand-red-700);
--info: var(--brand-blue-600);
--serif: 'Merriweather',Georgia,'Times New Roman',serif;
--sans: 'Public Sans',system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
--maxw: 1180px;
--gut: 40px;
--r-control: 10px;
--r-panel: 22px;
--red: var(--brand-red-600);
--red-deep: var(--brand-red-700);
--red-soft: var(--brand-red-100);
--sky: var(--brand-blue-600);
--sky-deep: var(--brand-navy-700);
--edge: #00c0fc;
--ease-out-quint: cubic-bezier(.23,1,.32,1);
--ease-in-out-strong: cubic-bezier(.77,0,.175,1);
--geo-africa: polygon(47% 0%,58% 2%,67% 8%,74% 14%,84% 18%,90% 25%,98% 27%,92% 35%,84% 37%,79% 45%,75% 54%,70% 63%,64% 76%,58% 88%,51% 100%,44% 88%,39% 77%,35% 63%,29% 55%,18% 51%,7% 42%,0% 32%,9% 23%,22% 21%,31% 12%,39% 3%);
--geo-drc: polygon(98.2% 90.6%,97.9% 84.3%,100% 83.5%,96.3% 80.2%,93.2% 74.8%,91.6% 64.4%,90.1% 62.9%,88.7% 56.3%,90% 53.8%,90.8% 39.5%,97.7% 26.6%,88.6% 26.2%,85.7% 22.1%,86.8% 19.7%,85.2% 7.9%,90.3% 4.8%,91.8% 5.8%,92.2% 0%,88.2% 0%,84.1% 5.3%,80.1% 6.1%,78.9% 8.9%,75.7% 7.2%,71.4% 8%,69.7% 10.4%,63.9% 10.8%,63.6% 12.5%,52.5% 11.7%,52.8% 18.2%,51% 20.2%,51.4% 26.7%,50.3% 32.2%,43.9% 32.2%,44.3% 34.1%,41.6% 34.1%,38.1% 33%,36% 28.5%,33.1% 29.2%,27.9% 28%,21.8% 39.9%,6.3% 39.9%,0.7% 38.7%,0% 40.3%,1.3% 40.9%,2.4% 44.7%,5.7% 45.2%,7.5% 47.3%,10.3% 47.3%,12.6% 44.8%,20.1% 52.5%,20% 57%,22.2% 62.2%,28.7% 69.3%,30.1% 81%,32.7% 87.3%,33.5% 94.3%,38.4% 98.8%,46.1% 95%,53.8% 93.4%,56.1% 97.1%,58.5% 96.5%,64.4% 99.2%,66.5% 98.1%,70.9% 100%,80% 99.9%,83.2% 95.4%,85.5% 94.8%,92.3% 96.5%);
--geo-paris: polygon(52% .8%,65.3% 0%,69.7% 4.5%,71.6% 21.3%,75.4% 25.5%,77.1% 34.5%,78.2% 62.1%,76.2% 79.3%,80.6% 77.2%,80.5% 67.1%,96.7% 69.1%,100% 76.5%,97.1% 96.6%,86.8% 97.6%,72.5% 84.4%,56.6% 100%,43.8% 99%,22.3% 81%,17.8% 86.4%,17.9% 78.7%,12.6% 78.3%,11.5% 65.9%,0% 56.5%,2.6% 39.6%,8.7% 29.9%,12.5% 32.6%,13.9% 25.3%,22.7% 27.4%,25% 18.1%,39.2% 1.6%);
--brand-ink: #092744;
--brand-copy: #334763;
--brand-line: rgba(10, 49, 88, .17);
--brand-glass: rgba(255,255,255,.72);
--brand-measure: 68ch;
--brand-ease: cubic-bezier(.2, .75, .25, 1);
--vs-navy-950: #031a33;
--vs-navy-900: #06284d;
--vs-navy-800: #0b3a6f;
--vs-blue-600: #087fc7;
--vs-blue-400: #28b8ee;
--vs-gold-500: #f4d21f;
--vs-gold-300: #ffe56c;
--vs-red-600: var(--brand-red-600);
--vs-ivory-100: #faf8f1;
--vs-white: #ffffff;
--vs-ink: #0b2038;
--vs-surface: rgba(255, 255, 255, .92);
--vs-surface-glass: rgba(255, 255, 255, .72);
--vs-focus: 0 0 0 3px rgba(244, 210, 31, .38), 0 0 0 6px rgba(8, 127, 199, .24);
--vs-content: min(1180px, calc(100vw - 40px));
--lux-navy: #041d39;
--lux-navy-2: #082f59;
--lux-blue: #087fc7;
--lux-gold: #e6bd36;
--lux-gold-light: #ffe477;
--lux-red: var(--brand-red-700);
--lux-ink: #10263f;
--lux-ivory: #f8f5ed;
--lux-paper: #fffefa;
--lux-line: rgba(6, 40, 77, .13);
--lux-line-gold: rgba(210, 169, 43, .3);
--lux-serif: "Merriweather", Georgia, serif;
--lux-sans: "Public Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
--type-page-title: clamp(32px, calc(1.6vw + 18px), 39px);
--type-section-title: clamp(28px, calc(1.2vw + 15px), 34px);
--type-feature-title: clamp(32px, calc(1.8vw + 17px), 42px);
--type-body: 15px;
--type-lead: clamp(15px, calc(.3vw + 13px), 17px);
--type-small: 12.5px;
--type-label: 11px;
--type-control: 12px;
--type-reading-measure: 68ch;
--deep-ink: #071d38;
--deep-blue: #006bbf;
--deep-gold: #d5aa24;
--deep-paper: #fbfaf6;
--deep-line: rgba(7, 29, 56, .13);
--faq-navy: #062447;
--faq-blue: #0b78ca;
--faq-gold: #e6bd36;
--faq-paper: #ffffff;
--faq-mist: #f4f8fc;
--faq-line: rgba(6,50,91,.15);
--mos-navy: #061b36;
--mos-blue: #0876c9;
--mos-gold: #f1ca46;
--mos-paper: #fbfaf6;
--mos-dock-h: 72px;
--contrast-on-dark: #f8fbff;
--contrast-on-dark-soft: #dce7f4;
--contrast-on-light: #082a50;
--std-ink: var(--brand-ink);
--std-blue: var(--brand-blue-600);
--std-blue-dark: var(--brand-navy-700);
--std-navy: var(--brand-navy-900);
--std-gold: var(--brand-gold-500);
--std-paper: var(--brand-paper);
--std-line: var(--brand-line);
--std-line-strong: rgba(5, 47, 87, .27);
--std-ease: cubic-bezier(.2, .75, .25, 1);
--std-surface: linear-gradient(155deg, #ffffff 0%, #fbfdff 62%, #e8f6fd 100%);
--std-surface-warm: linear-gradient(155deg, #ffffff 0%, #fffdf5 65%, #edf8fd 100%);
--std-glass-light: rgba(255, 255, 255, .78);
--std-glass-soft: rgba(242, 249, 253, .7);
--std-glass-line: rgba(255, 255, 255, .74);
--std-glass-blur: 18px;
--brand-navy-950: #061a32;
--brand-navy-900: #0a3158;
--brand-navy-700: #174f86;
--brand-blue-600: #2d70d6;
--brand-blue-100: #e8f0f4;
--brand-gold-500: #f3d34a;
--brand-gold-100: #fff6ca;
--brand-red-600: #c4333e;
--brand-paper: #ffffff;
--brand-canvas: #eef3f9;
--brand-line-strong: rgba(16, 42, 67, .22);
--brand-page-hero-height: 660px;
--brand-page-hero-height-tablet: 560px;
--brand-blue-500: #4a8bed;
--brand-sky-100: #e7f1ff;
--brand-sky-050: #f4f8fd;
--brand-red-700: #9f2732;
--brand-red-100: #fde8ea;
--brand-signature: linear-gradient(90deg,
    var(--brand-blue-600) 0 58%,
    var(--brand-gold-500) 58% 66%,
    var(--brand-red-600) 66% 82%,
    var(--brand-gold-500) 82% 90%,
    var(--brand-blue-600) 90% 100%);
--blue: var(--brand-blue-600);
--px-navy-950: #011a35;
--px-navy-900: #052f57;
--px-navy-800: #0a3d6e;
--px-blue-600: #2d70d6;
--px-blue-700: #1d5bb8;
--px-gold-500: #f3d34a;
--px-gold-600: #e2bd22;
--px-gold-ink: #7a5a00;
--px-red-600: #c4333e;
--px-ink: #0b2440;
--px-ink-2: #3b5571;
--px-ink-3: #5a7189;
--px-line: #052f5724;
--px-line-strong: #052f573d;
--px-canvas: #f4f7fb;
--px-paper: #fff;
--px-sky: #eaf2fd;
--px-serif: "Merriweather",Georgia,"Times New Roman",serif;
--px-sans: "Public Sans",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
--px-t-h2: clamp(28px,2.4vw + 10px,40px);
--px-t-h3: clamp(19px,.6vw + 15px,23px);
--px-t-lead: clamp(17px,.3vw + 15.5px,19px);
--px-t-body: 16.5px;
--px-t-meta: 14px;
--px-t-eyebrow: 12.5px;
--px-ease: cubic-bezier(.2,.75,.25,1);
```

### Dependencies

```css
0: --brand-gold-500;
0: --brand-red-700;
0: --brand-blue-600;
0: --brand-red-600;
0: --brand-red-700;
0: --brand-red-100;
0: --brand-blue-600;
0: --brand-navy-700;
0: --brand-red-600;
0: --vs-ivory-100;
0: --vs-white;
0: --vs-surface;
0: --vs-surface-glass;
0: --vs-ink;
0: --vs-muted;
0: --vs-gold-500;
0: --vs-blue-600;
0: --vs-border;
0: --brand-red-700;
0: --vs-space-2;
0: --vs-space-3;
0: --vs-space-4;
0: --vs-space-5;
0: --vs-space-7;
0: --brand-red-700;
0: --brand-ink;
0: --brand-muted;
0: --brand-blue-600;
0: --brand-navy-700;
0: --brand-navy-900;
0: --brand-gold-500;
0: --brand-paper;
0: --brand-line;
0: --brand-radius-control;
0: --brand-radius-card;
0: --brand-radius-feature;
0: --brand-shadow-card;
0: --brand-blue-600;
1: --brand-gold-500;
2: --brand-red-600;
3: --brand-gold-500;
4: --brand-blue-600;
0: --brand-blue-600;
```

### Semantic

```css
--color-success: #17815f;
--warn: #755d12;
--color-warning: #755d12;
--red: var(--brand-red-600);
--red-deep: var(--brand-red-700);
--red-soft: var(--brand-red-100);
--vs-red-600: var(--brand-red-600);
--color-error: var(--brand-red-700);
--lux-red: var(--brand-red-700);
--brand-red-600: #c4333e;
--brand-red-700: #9f2732;
--brand-red-100: #fde8ea;
--px-red-600: #c4333e;
--info: var(--brand-blue-600);
--vs-blue-600: #087fc7;
--vs-blue-400: #28b8ee;
--lux-blue: #087fc7;
--deep-blue: #006bbf;
--faq-blue: #0b78ca;
--mos-blue: #0876c9;
--std-blue: var(--brand-blue-600);
--std-blue-dark: var(--brand-navy-700);
--brand-blue-600: #2d70d6;
--brand-blue-100: #e8f0f4;
--brand-blue-500: #4a8bed;
--blue: var(--brand-blue-600);
--px-blue-600: #2d70d6;
--px-blue-700: #1d5bb8;
```

## Breakpoints

| Name | Value | Type |
|------|-------|------|
| xs | 360px | max-width |
| xs | 380px | max-width |
| 390px | 390px | max-width |
| 400px | 400px | max-width |
| 410px | 410px | max-width |
| sm | 420px | max-width |
| sm | 430px | max-width |
| sm | 460px | max-width |
| sm | 479px | max-width |
| sm | 480px | max-width |
| sm | 481px | min-width |
| sm | 520px | max-width |
| sm | 521px | min-width |
| 560px | 560px | max-width |
| 561px | 561px | min-width |
| sm | 599px | max-width |
| sm | 600px | min-width |
| sm | 620px | max-width |
| sm | 621px | min-width |
| sm | 640px | max-width |
| sm | 650px | max-width |
| sm | 680px | max-width |
| sm | 700px | max-width |
| md | 720px | max-width |
| md | 760px | min-width |
| md | 761px | min-width |
| md | 767px | max-width |
| md | 800px | max-width |
| md | 820px | max-width |
| md | 821px | min-width |
| 860px | 860px | max-width |
| 861px | 861px | min-width |
| 880px | 880px | max-width |
| 881px | 881px | min-width |
| 899px | 899px | max-width |
| 900px | 900px | min-width |
| 901px | 901px | min-width |
| lg | 960px | min-width |
| lg | 961px | min-width |
| lg | 980px | min-width |
| lg | 992px | max-width |
| lg | 1000px | max-width |
| lg | 1023px | max-width |
| lg | 1024px | min-width |
| lg | 1039px | max-width |
| lg | 1040px | min-width |
| lg | 1050px | max-width |
| lg | 1080px | max-width |
| 1099px | 1099px | max-width |
| 1100px | 1100px | min-width |
| 1101px | 1101px | min-width |
| xl | 1264px | max-width |
| 1399px | 1399px | max-width |
| 1400px | 1400px | max-width |
| 1401px | 1401px | min-width |
| 2xl | 1500px | max-width |
| 2xl | 1599px | max-width |
| 2xl | 1600px | min-width |
| 1680px | 1680px | min-width |
| 1700px | 1700px | min-width |
| 2400px | 2400px | min-width |
| 3000px | 3000px | min-width |

## Transitions & Animations

**Easing functions:** `cubic-bezier(0.4, 0, 0.2, 1)`, `cubic-bezier(0.23, 1, 0.32, 1)`, `cubic-bezier(0.2, 0.7, 0.3, 1)`, `cubic-bezier(0.2, 0.75, 0.25, 1)`, `ease`, `cubic-bezier(0.2, 0.8, 0.2, 1)`, `linear`

**Durations:** `0.15s`, `0.4s`, `0.5s`, `0.1s`, `0.2s`, `0.22s`, `0.25s`, `0.16s`, `0.18s`, `0.55s`, `1.8s`, `0.36s`, `0.24s`, `0.7s`, `0.26s`, `0.08s`, `0.3s`, `0s`

### Common Transitions

```css
transition: all;
transition: top 0.15s;
transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s 0.1s, border-bottom-width 0.4s;
transition: transform 0.2s;
transition: color 0.15s;
transition: box-shadow 0.22s;
transition: height 0.22s;
transition: transform 0.25s cubic-bezier(0.23, 1, 0.32, 1);
transition: 0.15s;
transition: transform 0.2s, opacity 0.2s;
```

### Keyframe Animations

**pop**
```css
@keyframes pop {
  0% { opacity: 0; transform: scale(0.98); }
  100% { opacity: 1; transform: none; }
}
```

**ticker**
```css
@keyframes ticker {
  0% { transform: translateX(0px); }
  100% { transform: translateX(-50%); }
}
```

**kenburns**
```css
@keyframes kenburns {
  0% { transform: scale(1.04); }
  100% { transform: scale(1.12); }
}
```

**bob**
```css
@keyframes bob {
  0%, 100% { transform: translate(-50%, 0px); }
  50% { transform: translate(-50%, 7px); }
}
```

**heroUp**
```css
@keyframes heroUp {
  0% { opacity: 0; transform: translateY(22px); }
  100% { opacity: 1; transform: none; }
}
```

**shimmer**
```css
@keyframes shimmer {
  100% { background-position: 200% 0px; }
}
```

**pulse**
```css
@keyframes pulse {
  0%, 100% { box-shadow: rgba(46, 125, 82, 0.18) 0px 0px 0px 4px; }
  50% { box-shadow: rgba(46, 125, 82, 0.04) 0px 0px 0px 8px; }
}
```

**sealIn**
```css
@keyframes sealIn {
  0% { opacity: 0; transform: scale(0.55) rotate(-110deg); }
  60% { opacity: 1; }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}
```

**asstPulse**
```css
@keyframes asstPulse {
  0% { box-shadow: rgba(70, 209, 138, 0.55) 0px 0px 0px 0px; }
  70% { box-shadow: rgba(70, 209, 138, 0) 0px 0px 0px 7px; }
  100% { box-shadow: rgba(70, 209, 138, 0) 0px 0px 0px 0px; }
}
```

**tickPulse**
```css
@keyframes tickPulse {
  0% { box-shadow: rgba(192, 57, 43, 0.5) 0px 0px 0px 0px; }
  70% { box-shadow: rgba(192, 57, 43, 0) 0px 0px 0px 6px; }
  100% { box-shadow: rgba(192, 57, 43, 0) 0px 0px 0px 0px; }
}
```

## Component Patterns

Detected UI component patterns and their most common styles:

### Buttons (190 instances)

```css
.buttons {
  background-color: rgb(255, 255, 255);
  color: rgb(23, 59, 102);
  font-size: 13.3333px;
  font-weight: 400;
  padding-top: 0px;
  padding-right: 0px;
  border-radius: 9px;
}
```

### Cards (81 instances)

```css
.cards {
  background-color: rgb(255, 255, 255);
  border-radius: 1px;
  box-shadow: rgba(6, 13, 30, 0.6) 0px 32px 66px -30px, rgba(6, 13, 30, 0.08) 0px 4px 12px 0px;
  padding-top: 9px;
  padding-right: 9px;
}
```

### Inputs (28 instances)

```css
.inputs {
  background-color: rgb(255, 255, 255);
  color: rgb(12, 28, 51);
  border-color: rgba(255, 255, 255, 0.27);
  border-radius: 0px;
  font-size: 16px;
  padding-top: 9px;
  padding-right: 11px;
}
```

### Links (861 instances)

```css
.links {
  color: rgb(12, 28, 51);
  font-size: 15px;
  font-weight: 600;
}
```

### Navigation (93 instances)

```css
.navigation {
  background-color: rgb(255, 255, 255);
  color: rgb(9, 39, 68);
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  position: relative;
  box-shadow: rgba(6, 13, 30, 0.6) 0px 32px 66px -30px, rgba(6, 13, 30, 0.08) 0px 4px 12px 0px;
}
```

### Footer (21 instances)

```css
.footer {
  color: rgb(203, 221, 234);
  padding-top: 46px;
  padding-bottom: 22px;
  font-size: 16px;
}
```

### Modals (23 instances)

```css
.modals {
  background-color: rgba(6, 13, 30, 0.62);
  border-radius: 0px;
  box-shadow: rgba(6, 13, 30, 0.45) -26px 0px 60px 0px, rgba(239, 218, 164, 0.14) 1px 0px 0px 0px inset;
  padding-top: 0px;
  padding-right: 0px;
  max-width: 1075.2px;
}
```

### Dropdowns (42 instances)

```css
.dropdowns {
  background-color: rgb(255, 255, 255);
  border-radius: 1px;
  box-shadow: rgba(6, 13, 30, 0.6) 0px 32px 66px -30px, rgba(6, 13, 30, 0.08) 0px 4px 12px 0px;
  border-color: rgb(236, 228, 210);
  padding-top: 9px;
}
```

### Tables (7 instances)

```css
.tables {
  border-color: rgba(10, 49, 88, 0.17);
  cell-style: [object Object];
}
```

### Badges (51 instances)

```css
.badges {
  background-color: rgb(234, 242, 253);
  color: rgb(29, 91, 184);
  font-size: 15px;
  font-weight: 400;
  padding-top: 0px;
  padding-right: 0px;
  border-radius: 12px;
}
```

### Accordions (29 instances)

```css
.accordions {
  color: rgb(1, 26, 53);
  font-size: 15px;
  padding-top: 0px;
  padding-right: 0px;
  border-color: rgb(1, 26, 53);
}
```

### Switches (21 instances)

```css
.switches {
  background-color: rgb(244, 248, 253);
  border-radius: 10px;
  border-color: rgba(12, 143, 211, 0.24);
}
```

## Component Clusters

Reusable component instances grouped by DOM structure and style similarity:

### Button — 4 instances, 3 variants

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(22, 52, 87);
  padding: 2px 0px 2px 10px;
  border-radius: 0px;
  border: 0px none rgb(22, 52, 87);
  font-size: 10.5px;
  font-weight: 750;
```

**Variant 2** (2 instances)

```css
  background: rgb(244, 248, 253);
  color: rgb(23, 79, 134);
  padding: 0px 0px 0px 0px;
  border-radius: 10px;
  border: 0px none rgba(12, 143, 211, 0.24);
  font-size: 13.3333px;
  font-weight: 400;
```

**Variant 3** (1 instance)

```css
  background: rgb(11, 31, 58);
  color: rgb(255, 240, 162);
  padding: 0px 0px 0px 0px;
  border-radius: 2px;
  border: 1px solid rgb(109, 85, 8);
  font-size: 13.3333px;
  font-weight: 400;
```

### Button — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgba(255, 255, 255, 0.08);
  color: rgb(255, 255, 255);
  padding: 0px 0px 0px 0px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.25);
  font-size: 9px;
  font-weight: 700;
```

### Button — 2 instances, 2 variants

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(7, 26, 52);
  padding: 7px 14px 7px 14px;
  border-radius: 10px;
  border: 1px solid rgb(201, 163, 33);
  font-size: 12px;
  font-weight: 750;
```

**Variant 2** (1 instance)

```css
  background: rgba(255, 255, 255, 0.043);
  color: rgb(255, 255, 255);
  padding: 7px 14px 7px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.38);
  font-size: 12px;
  font-weight: 750;
```

### Card — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgb(255, 255, 255);
  color: rgb(11, 36, 64);
  padding: 25.6px 25.6px 25.6px 25.6px;
  border-radius: 14px;
  border: 1px solid rgba(5, 47, 87, 0.14);
  font-size: 15px;
  font-weight: 400;
```

### Card — 2 instances, 1 variant

**Variant 1** (2 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(59, 85, 113);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(59, 85, 113);
  font-size: 16px;
  font-weight: 400;
```

### Card — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgb(255, 255, 255);
  color: rgb(11, 36, 64);
  padding: 25.6px 25.6px 25.6px 25.6px;
  border-radius: 14px;
  border: 1px solid rgba(5, 47, 87, 0.14);
  font-size: 15px;
  font-weight: 400;
```

### Card — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgb(255, 255, 255);
  color: rgb(11, 36, 64);
  padding: 25.6px 25.6px 25.6px 25.6px;
  border-radius: 14px;
  border: 1px solid rgba(5, 47, 87, 0.14);
  font-size: 15px;
  font-weight: 400;
```

### Input — 2 instances, 2 variants

**Variant 1** (1 instance)

```css
  background: rgb(255, 255, 255);
  color: rgb(9, 39, 68);
  padding: 13px 14px 13px 14px;
  border-radius: 10px;
  border: 1px solid rgba(5, 47, 87, 0.24);
  font-size: 16px;
  font-weight: 400;
```

**Variant 2** (1 instance)

```css
  background: rgba(2, 18, 38, 0.82);
  color: rgb(255, 255, 255);
  padding: 9px 11px 9px 11px;
  border-radius: 7px;
  border: 1px solid rgba(255, 255, 255, 0.27);
  font-size: 12px;
  font-weight: 500;
```

### Button — 2 instances, 2 variants

**Variant 1** (1 instance)

```css
  background: rgb(243, 211, 74);
  color: rgb(1, 26, 53);
  padding: 12px 20px 12px 20px;
  border-radius: 10px;
  border: 1px solid rgb(226, 189, 34);
  font-size: 15px;
  font-weight: 600;
```

**Variant 2** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(7, 26, 52);
  padding: 9px 14px 9px 14px;
  border-radius: 7px;
  border: 1px solid rgb(201, 163, 33);
  font-size: 11px;
  font-weight: 800;
```

### Card — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgb(255, 255, 255);
  color: rgb(11, 36, 64);
  padding: 0px 0px 0px 0px;
  border-radius: 14px;
  border: 1px solid rgba(5, 47, 87, 0.14);
  font-size: 15px;
  font-weight: 400;
```

### Card — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgb(255, 255, 255);
  color: rgb(11, 36, 64);
  padding: 25.6px 25.6px 25.6px 25.6px;
  border-radius: 14px;
  border: 1px solid rgba(5, 47, 87, 0.14);
  font-size: 15px;
  font-weight: 400;
```

### Card — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgb(255, 255, 255);
  color: rgb(11, 36, 64);
  padding: 25.6px 25.6px 25.6px 25.6px;
  border-radius: 14px;
  border: 1px solid rgba(5, 47, 87, 0.14);
  font-size: 15px;
  font-weight: 400;
```

### Button — 2 instances, 2 variants

**Variant 1** (1 instance)

```css
  background: rgb(5, 47, 87);
  color: rgb(255, 255, 255);
  padding: 0px 0px 0px 0px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  font-size: 12px;
  font-weight: 400;
```

**Variant 2** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(255, 255, 255);
  padding: 0px 0px 0px 0px;
  border-radius: 50%;
  border: 1px solid rgba(239, 218, 164, 0.5);
  font-size: 13.5px;
  font-weight: 700;
```

### Card — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgb(255, 255, 255);
  color: rgb(11, 36, 64);
  padding: 25.6px 25.6px 25.6px 25.6px;
  border-radius: 14px;
  border: 1px solid rgba(5, 47, 87, 0.14);
  font-size: 15px;
  font-weight: 400;
```

### Card — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgb(255, 255, 255);
  color: rgb(11, 36, 64);
  padding: 25.6px 25.6px 25.6px 25.6px;
  border-radius: 14px;
  border: 1px solid rgba(5, 47, 87, 0.14);
  font-size: 15px;
  font-weight: 400;
```

## Layout System

**398 grid containers** and **867 flex containers** detected.

### The System

- **Content column** — 1180px wide, 51px gutters (4% edge density)
  - Width ladder: 387px · 553px · 591px · 687px · 760px · 1180px
- **Column system** — 2 columns
- **Section rhythm** — 77px vertical padding (ladder: 22px · 30px · 46px · 77px · 112px)
- **Gap scale** — 8px · 14px · 16px · 18px · 20px · 24px · 28px · 51.2px
- **Fluid layout** — 12 clamp/viewport declarations

```css
.mobile-menu { max-width: 84vw; }
.search-box { width: min(640px, 90vw); }
.asst-panel { max-width: calc(-32px + 100vw); }
.mplayer .mp-box { width: min(760px, 94vw); }
.search-panel { width: min(640px, 92vw); }
.rd-box { width: min(620px, 94vw); }
```

### Container Widths

| Max Width | Padding |
|-----------|---------|
| 100% | 0px |
| min(1560px, 100%) | 51.2px |
| 686.664px | 0px |
| 760px | 0px |
| 1240px | 0px |
| 820px | 0px |
| 707.472px | 0px |
| 626.076px | 0px |
| 900px | 20px |
| 920px | 0px |
| 720.936px | 0px |
| 560px | 0px |
| 800px | 0px |
| 624.24px | 24px |
| 767.448px | 0px |

### Grid Column Patterns

| Columns | Usage Count |
|---------|-------------|
| 1-column | 187x |
| 2-column | 119x |
| 3-column | 23x |
| 4-column | 13x |
| 6-column | 7x |
| 5-column | 1x |

### Grid Templates

```css
grid-template-columns: 232px 781.625px;
gap: 64px;
grid-template-columns: 422.344px 591.281px;
gap: normal 64px;
grid-template-columns: 528.812px 528.812px;
gap: 18px 20px;
grid-template-columns: 595.516px 458.109px;
gap: 24px;
grid-template-columns: 368.578px 645.047px;
gap: 64px;
```

### Flex Patterns

| Direction/Wrap | Count |
|----------------|-------|
| row/nowrap | 654x |
| column/nowrap | 162x |
| row/wrap | 43x |
| column-reverse/nowrap | 8x |

**Gap values:** `normal 18px`, `normal 28.16px`, `normal 14px`, `normal 16px`, `normal 51.2px`, `normal 64px`, `normal 20px`, `0px normal`, `0px 20px`, `0px 32px`, `normal 44.8px`, `0px 28px`, `0px 26px`, `2px`, `3px`, `4px 8px`, `4px`, `5px`, `6px`, `6px 16px`, `6px 18px`, `7px`, `8px`, `8px 64px`, `8px 6px`, `8px 22px`, `9px`, `10px 18px`, `10px`, `11px`, `12px`, `12px 24px`, `14px normal`, `14px`, `14px 28px`, `14px 20px`, `16px 18px`, `16px 22px`, `16px`, `16px 24px`, `18px`, `18px 20px`, `20px`, `20px 38.4px`, `20.48px`, `24px`, `24px 64px`, `24px 48px`, `28px 20px`, `28px 56px`, `30px`, `38.4px`, `43.52px`, `48px`, `51.2px`, `64px`, `76.8px`

## Interaction States

### Button States

**"🌐 EN ▾"**
```css
/* Hover */
border-color: rgba(241, 219, 162, 0.3) → rgb(255, 240, 162);
```
```css
/* Focus */
border-color: rgba(241, 219, 162, 0.3) → rgb(255, 240, 162);
box-shadow: none → rgba(244, 210, 31, 0.38) 0px 0px 0px 3px, rgba(8, 127, 199, 0.24) 0px 0px 0px 6px;
outline: rgb(234, 247, 253) none 3px → rgb(45, 112, 214) solid 3px;
```

**""**
```css
/* Hover */
color: rgb(23, 79, 134) → rgb(255, 255, 255);
background-color: rgb(244, 248, 253) → rgb(45, 112, 214);
border-color: rgba(12, 143, 211, 0.24) → rgb(45, 112, 214);
outline: rgb(23, 79, 134) none 3px → rgb(255, 255, 255) none 3px;
```
```css
/* Focus */
color: rgb(23, 79, 134) → rgb(255, 255, 255);
background-color: rgb(244, 248, 253) → rgb(45, 112, 214);
border-color: rgba(12, 143, 211, 0.24) → rgb(45, 112, 214);
box-shadow: none → rgba(0, 29, 61, 0.18) 0px 0px 0px 4px;
outline: rgb(23, 79, 134) none 3px → rgb(45, 112, 214) solid 3px;
```

**""**
```css
/* Hover */
color: rgb(23, 79, 134) → rgb(221, 229, 237);
background-color: rgb(244, 248, 253) → rgb(74, 132, 220);
border-color: rgba(12, 143, 211, 0.24) → rgba(44, 113, 214, 0.886);
transform: none → matrix(1, 0, 0, 1, 0, -0.851767);
outline: rgb(23, 79, 134) none 3px → rgb(221, 229, 237) none 3px;
```
```css
/* Focus */
color: rgb(23, 79, 134) → rgb(255, 255, 255);
background-color: rgb(244, 248, 253) → rgb(45, 112, 214);
border-color: rgba(12, 143, 211, 0.24) → rgb(45, 112, 214);
transform: none → matrix(1, 0, 0, 1, 0, -1);
outline: rgb(23, 79, 134) none 3px → rgb(76, 133, 220) solid 3px;
```

### Link Hover

```css
text-decoration: underline rgba(194, 205, 224, 0.4) → underline rgb(255, 240, 162);
```

### Input Focus

```css
outline: rgb(9, 39, 68) none 3px → rgb(243, 211, 74) solid 3px;
```

## Accessibility (WCAG 2.1)

**Overall Score: 100%** — 174 passing, 0 failing color pairs

### Passing Color Pairs

| Foreground | Background | Ratio | Level |
|------------|------------|-------|-------|
| `#0c1c33` | `#ffffff` | 17.08:1 | AAA |
| `#173b66` | `#ffffff` | 11.33:1 | AAA |
| `#011a35` | `#f8fafc` | 16.72:1 | AAA |
| `#011a35` | `#ffffff` | 17.49:1 | AAA |
| `#0b2440` | `#f8fafc` | 14.97:1 | AAA |
| `#ffffff` | `#0b1f3a` | 16.52:1 | AAA |
| `#061a32` | `#f3d34a` | 11.84:1 | AAA |
| `#ffffff` | `#9f2732` | 7.47:1 | AAA |
| `#34455e` | `#eef3f9` | 8.72:1 | AAA |
| `#725817` | `#fff8df` | 6.32:1 | AA |

## Design System Score

**Overall: 71/100 (Grade: C)**

| Category | Score |
|----------|-------|
| Color Discipline | 65/100 |
| Typography Consistency | 55/100 |
| Spacing System | 85/100 |
| Shadow Consistency | 50/100 |
| Border Radius Consistency | 80/100 |
| Accessibility | 100/100 |
| CSS Tokenization | 100/100 |

**Strengths:** Well-defined spacing scale, Strong accessibility compliance, Good CSS variable tokenization

**Issues:**
- 9 font weights in use — consider standardizing to 3 (regular, medium, bold)
- 40 distinct font sizes — consider a tighter type scale
- 31 unique shadows — consider a 3-level elevation scale (sm/md/lg)
- 1397 !important rules — prefer specificity over overrides
- 81% of CSS is unused — consider purging
- 10003 duplicate CSS declarations

## Gradients

**25 unique gradients** detected.

| Type | Direction | Stops | Classification |
|------|-----------|-------|----------------|
| linear | 90deg | 3 | bold |
| linear | 90deg | 3 | bold |
| linear | — | 2 | brand |
| linear | — | 2 | brand |
| linear | 90deg | 3 | bold |
| linear | 97deg | 5 | complex |
| linear | 90deg | 10 | complex |
| linear | — | 3 | bold |
| radial | circle at 50% -80% | 2 | brand |
| linear | 110deg | 3 | bold |
| linear | 145deg | 2 | brand |
| linear | — | 2 | brand |
| radial | circle at 90% 0px | 2 | brand |
| linear | 145deg | 3 | bold |
| linear | 145deg | 2 | brand |

```css
background: linear-gradient(90deg, rgb(248, 252, 255), rgb(231, 241, 255) 52%, rgb(255, 255, 255));
background: linear-gradient(90deg, rgb(6, 26, 50), rgb(10, 49, 88) 58%, rgb(6, 72, 117));
background: linear-gradient(rgb(244, 251, 255), rgb(216, 240, 252));
background: linear-gradient(rgb(255, 227, 123) 0%, rgb(243, 211, 74) 100%);
background: linear-gradient(90deg, rgb(10, 49, 88), rgb(23, 79, 134) 55%, rgb(8, 111, 174));
```

## Z-Index Map

**20 unique z-index values** across 4 layers.

| Layer | Range | Elements |
|-------|-------|----------|
| modal | 1300,2000 | div.l.a.n.g.-.m.e.n.u, div.l.a.n.g.-.m.e.n.u, div.l.a.n.g.-.m.e.n.u |
| dropdown | 120,230 | button.a.s.s.t.-.l.a.u.n.c.h. .i.s.-.t.u.c.k.e.d, button.a.s.s.t.-.l.a.u.n.c.h. .i.s.-.t.u.c.k.e.d, button.a.s.s.t.-.l.a.u.n.c.h. .i.s.-.t.u.c.k.e.d |
| sticky | 30,90 | section.q.a.-.b.a.n.d, section.q.a.-.b.a.n.d, section.q.a.-.b.a.n.d |
| base | 0,8 | div.h.e.r.o.-.s.l.i.d.e.s. .f.i.l.m.-.l.i.v.e, div.p.h.e.a.d.-.s.l.i.d.e.s, div.h.e.r.o.-.o.v.e.r.l.a.y |

## SVG Icons

**42 unique SVG icons** detected. Dominant style: **filled**.

| Size Class | Count |
|------------|-------|
| xs | 7 |
| sm | 14 |
| md | 20 |
| xl | 1 |

**Icon colors:** `rgb(0, 0, 0)`, `currentColor`, `rgb(29, 91, 184)`, `rgb(90, 113, 137)`, `rgb(1, 26, 53)`, `rgb(243, 211, 74)`, `rgb(255, 255, 255)`

## Font Files

| Family | Source | Weights | Styles |
|--------|--------|---------|--------|
| Merriweather | google-fonts | 400, 700, 900 | italic, normal |
| Public Sans | google-fonts | 400, 500, 600, 700, 800 | italic, normal |

**Google Fonts URL:** `https://fonts.googleapis.com/`

## Image Style Patterns

| Pattern | Count | Key Styles |
|---------|-------|------------|
| general | 4 | objectFit: cover, borderRadius: 0px, shape: square |
| thumbnail | 2 | objectFit: cover, borderRadius: 0px, shape: square |
| hero | 1 | objectFit: cover, borderRadius: 13px 13px 0px 0px, shape: rounded |

**Aspect ratios:** 16:9 (3x), 3:4 (2x), 3:2 (1x), 2.08:1 (1x)

## Motion Language

**Feel:** responsive · **Scroll-linked:** yes

### Duration Tokens

| name | value | ms |
|---|---|---|
| `instant` | `80ms` | 80 |
| `xs` | `100ms` | 100 |
| `sm` | `160ms` | 160 |
| `md` | `260ms` | 260 |
| `lg` | `500ms` | 500 |
| `xxl` | `1.8s` | 1800 |

### Easing Families

- **custom** (7 uses) — `cubic-bezier(0.4, 0, 0.2, 1)`
- **ease-out** (464 uses) — `cubic-bezier(0.23, 1, 0.32, 1)`, `cubic-bezier(0.2, 0.7, 0.3, 1)`, `cubic-bezier(0.2, 0.75, 0.25, 1)`
- **ease-in-out** (87 uses) — `ease`
- **linear** (12 uses) — `linear`

### Keyframes In Use

| name | kind | properties | uses |
|---|---|---|---|
| `heroUp` | slide-y | opacity, transform | 1 |
| `riseIn` | slide-y | opacity, transform, filter | 27 |

## Component Anatomy

### button — 11 instances

**Slots:** label, icon
**Variants:** ghost

| variant | count | sample label |
|---|---|---|
| default | 10 | About this preview |
| ghost | 1 | Appointment guidance |

### card — 10 instances

**Slots:** heading, media, footer

### input — 2 instances


## Brand Voice

**Tone:** friendly · **Pronoun:** you-only · **Headings:** Title Case (balanced)

### Top CTA Verbs

- **about** (1)
- **consular** (1)
- **appointment** (1)
- **register** (1)
- **video** (1)
- **subscribe** (1)
- **ask** (1)

### Button Copy Patterns

- "about this preview" (1×)
- "ⅱ" (1×)
- "consular services →" (1×)
- "appointment guidance" (1×)
- "register" (1×)
- "video · plays from youtube
national anthem: debout congolais" (1×)
- "subscribe" (1×)
- "ask the embassyai guide · verified information" (1×)

### Sample Headings

> Welcome to the Embassy of the Democratic Republic of the Congo.
> Information for visitors, investors and the Congolese diaspora
> Visas, passports and travel documents
> Civil affairs for the Congolese diaspora
> The Embassy
> Welcome to the Embassy of the Democratic Republic of the Congo.
> Information for visitors, investors and the Congolese diaspora
> Visas, passports and travel documents
> Civil affairs for the Congolese diaspora
> The Embassy

## Page Intent

**Type:** `pricing` (confidence 0.48)
**Description:** Website preview of the Embassy of the Democratic Republic of the Congo in Washington, D.C. - consular services, visas, passports, news and contact.

Alternates: landing (0.3)

## Section Roles

Reading order (top→bottom): nav → testimonials → nav → nav → nav → content → hero → content → nav → content → nav → testimonial → testimonial → pricing-table → nav → pricing → nav → content → nav → content → nav → sidebar → hero → nav → content → nav → content → nav → footer

| # | Role | Heading | Confidence |
|---|------|---------|------------|
| 0 | nav | — | 0.4 |
| 1 | nav | — | 0.9 |
| 2 | content | Welcome to the Embassy of the Democratic Republic of the Congo. | 0.3 |
| 3 | hero | Welcome to the Embassy of the Democratic Republic of the Congo. | 0.85 |
| 4 | content | — | 0.3 |
| 5 | nav | — | 0.9 |
| 6 | content | Information for visitors, investors and the Congolese diaspora | 0.3 |
| 7 | nav | Information for visitors, investors and the Congolese diaspora | 0.4 |
| 8 | testimonial | The Head of State and the Ambassador | 0.8 |
| 9 | testimonial | The Head of State and the Ambassador | 0.8 |
| 10 | pricing-table | Practical information | 0.9 |
| 11 | nav | Practical information | 0.4 |
| 12 | pricing | Traveling to or living in the DRC? | 0.4 |
| 13 | nav | Traveling to or living in the DRC? | 0.4 |
| 14 | content | Forms and downloads | 0.3 |
| 15 | nav | Forms and downloads | 0.4 |
| 16 | content | News and calendar | 0.3 |
| 17 | nav | News and calendar | 0.4 |
| 18 | sidebar | GENOCOST 2026: sign the petition | 0.4 |
| 19 | hero | Media center | 0.4 |

## Material Language

**Label:** `mixed` (confidence 0.45)

| Metric | Value |
|--------|-------|
| Avg saturation | 0.578 |
| Shadow profile | soft |
| Avg shadow blur | 0px |
| Max radius | 999px |
| backdrop-filter in use | no |
| Gradients | 25 |

## Imagery Style

**Label:** `photography` (confidence 0.881)
**Counts:** total 7, svg 0, icon 0, screenshot-like 0, photo-like 8
**Dominant aspect:** landscape
**Radius profile on images:** square

## Quick Start

To recreate this design in a new project:

1. **Install fonts:** Add `Public Sans` from Google Fonts or your font provider
2. **Import CSS variables:** Copy `variables.css` into your project
3. **Tailwind users:** Use the generated `tailwind.config.js` to extend your theme
4. **Design tokens:** Import `design-tokens.json` for tooling integration
