# Developer Handoff

## Architecture

*   **Single Page Application:** Pure HTML/CSS/JS.
*   **State Management:** Centralized `AppState` object in `app.js`.
*   **Theme:** Controlled via `data-theme="light|dark"` attribute on `<html>`. Persisted in `localStorage`.

## CSS Architecture

*   **Variables:** Defined in `:root` for light mode and `[data-theme="dark"]` for dark mode override.
*   **Spacing:** Strict adherence to `--space-*` variables to maintain rhythm.
*   **Layout:** Grid-based dashboard layout (`.dashboard-container`).

## Key Features Implementation

### Theme Toggle
*   **Logic:** `toggleTheme()` in `app.js` flips the state and updates the DOM attribute.
*   **Charts:** `updateChartTheme()` is called to refresh Chart.js colors dynamically.

### Compact Mode
*   **Logic:** Toggles `data-compact="true"` on `<body>`.
*   **CSS:** Uses descendant selectors `[data-compact="true"] .card-body` to reduce padding and hide elements.

### Live Conflict Hints
*   **Logic:** `detectConflicts()` adds `.conflict` class to session blocks.
*   **Animation:** CSS `@keyframes pulse-conflict` handles the visual cue.

### Export Preview
*   **Logic:** `openExportPreview(format)` generates a text summary and opens the modal.

## Accessibility Checklist

*   [x] Contrast ratios met for text/background in both themes.
*   [x] Focus indicators visible on interactive elements.
*   [x] Semantic HTML used for structure.
*   [x] Keyboard shortcuts provided for power users.
