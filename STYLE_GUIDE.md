# Style Guide & Design System

## 1. Typography
**Primary Font (UI):** Inter (sans-serif)
**Heading Font:** Merriweather (serif) or Poppins (sans-serif) - *Fallback to system fonts*

| Role | Font Family | Size | Weight | Line Height |
|------|-------------|------|--------|-------------|
| Display | Merriweather | 30px (4xl) | Bold (700) | 1.2 |
| H1 | Merriweather | 24px (3xl) | Bold (700) | 1.2 |
| H2 | Merriweather | 20px (2xl) | Semibold (600) | 1.3 |
| H3 | Inter | 18px (xl) | Semibold (600) | 1.4 |
| Body | Inter | 14px (base) | Regular (400) | 1.5 |
| Small | Inter | 12px (sm) | Regular (400) | 1.5 |
| Tiny | Inter | 11px (xs) | Medium (500) | 1.4 |

## 2. Color System

### Primitive Tokens
| Name | Hex |
|------|-----|
| Teal 500 | #20B2AA |
| Teal 600 | #178A84 |
| Cyan 400 | #22D3EE |
| Slate 900 | #0F172A |
| Slate 800 | #1E293B |
| Slate 700 | #334155 |
| Slate 500 | #64748B |
| Cream 50 | #FFF8F3 |
| White | #FFFFFF |
| Red 500 | #EF4444 |
| Orange 500 | #F97316 |
| Green 500 | #22C55E |

### Semantic Tokens (Light Theme)
| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-app` | `#FFF8F3` (Cream 50) | App background |
| `--color-bg-surface` | `#FFFFFF` (White) | Cards, Modals |
| `--color-text-primary` | `#0F172A` (Slate 900) | Main text |
| `--color-text-secondary` | `#64748B` (Slate 500) | Subtitles, labels |
| `--color-primary` | `#20B2AA` (Teal 500) | Primary buttons, links, active tabs |
| `--color-accent` | `#22D3EE` (Cyan 400) | Highlights, focus rings |
| `--color-border` | `rgba(100, 116, 139, 0.2)` | Dividers, borders |

### Semantic Tokens (Dark Theme)
| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-app` | `#0F1720` (Dark Slate) | App background |
| `--color-bg-surface` | `#1E293B` (Slate 800) | Cards, Modals |
| `--color-text-primary` | `#F1F5F9` (Slate 100) | Main text |
| `--color-text-secondary` | `#94A3B8` (Slate 400) | Subtitles, labels |
| `--color-primary` | `#2DD4BF` (Teal 400) | Primary actions |
| `--color-accent` | `#67E8F9` (Cyan 300) | Highlights |
| `--color-border` | `rgba(148, 163, 184, 0.2)` | Dividers |

## 3. Spacing & Sizing (Strictly Preserved)
*   Space-4: 4px
*   Space-8: 8px
*   Space-12: 12px
*   Space-16: 16px
*   Space-24: 24px
*   Space-32: 32px
*   Radius-sm: 4px
*   Radius-md: 8px
*   Radius-lg: 12px

## 4. Shadows & Elevation
*   `--shadow-sm`: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
*   `--shadow-md`: `0 4px 6px -1px rgba(0, 0, 0, 0.1)` (Cards)
*   `--shadow-lg`: `0 10px 15px -3px rgba(0, 0, 0, 0.1)` (Modals, Dropdowns)

## 5. Components

### Buttons
*   **Primary:** Solid Teal background, White text. Hover: Darker Teal. Active: Scale 0.98.
*   **Secondary:** Transparent/Light Gray background, Dark text.
*   **Outline:** Bordered, transparent background.

### Cards
*   White/Slate-800 background.
*   1px Border (Light: Slate-200, Dark: Slate-700).
*   Shadow-md.
*   Radius-lg.

### Forms
*   Input fields: White/Slate-900 bg, 1px border. Focus: Teal ring.

## 6. CSS Variables Example
```css
:root {
  --color-primary: #20B2AA;
  --font-family-ui: 'Inter', sans-serif;
  --font-family-heading: 'Merriweather', serif;
}
[data-theme="dark"] {
  --color-bg-app: #0F1720;
}
```
