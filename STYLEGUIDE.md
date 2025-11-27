# Style Guide

## Design Tokens

### Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--color-primary` | `#06b6d4` (Cyan-500) | `#22d3ee` (Cyan-400) | Primary actions, active states, focus rings |
| `--color-accent` | `#f97316` (Orange-500) | same | Secondary highlights, warnings |
| `--color-bg-body` | `#f8fafc` (Slate-50) | `#0f172a` (Slate-900) | Main background |
| `--color-bg-surface` | `#ffffff` (White) | `#1e293b` (Slate-800) | Cards, Modals, Sidebar |
| `--color-text-high` | `#111827` (Gray-900) | `#f8fafc` (Slate-50) | Headings, Primary text |
| `--color-text-medium` | `#374151` (Gray-700) | `#cbd5e1` (Slate-300) | Body text, secondary labels |

### Typography

*   **UI Font:** Inter (`--font-sans`)
*   **Headings:** Poppins / Merriweather (`--font-heading`)
*   **Monospace:** Berkeley Mono / Fira Code (`--font-mono`)

### Shadows & Elevation

*   `--shadow-sm`: Subtle lift for buttons.
*   `--shadow-md`: Default card elevation.
*   `--shadow-lg`: Modals and dropdowns.

---

## Components

### Buttons

```html
<button class="btn btn-primary">Primary Action</button>
<button class="btn btn-secondary">Secondary Action</button>
<button class="btn btn-sm">Small Button</button>
```

### Cards

```html
<div class="card">
  <div class="card-header">Header</div>
  <div class="card-body">Content</div>
</div>
```

### Chips

```html
<div class="chip">Default Chip</div>
<div class="chip chip-instructor">Instructor</div>
```

---

## Interactions

*   **Hover:** Translate Y -1px/ -2px, increase shadow.
*   **Active:** Scale 0.98.
*   **Focus:** Visible ring with `--color-primary`.
*   **Transitions:** Standard ease (`cubic-bezier(0.2, 0, 0, 1)`), 150ms-250ms.
