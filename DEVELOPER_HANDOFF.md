# Developer Handoff

## Overview
This update modernizes the "Conflict-Free Summer Term Scheduler" with a new design system, light/dark mode, and improved UX features while strictly preserving the existing layout dimensions.

## Key Changes

### 1. Theme System
*   Implemented via CSS Variables in `style.css`.
*   Toggled via `data-theme="light" | "dark"` attribute on the `<html>` element.
*   Default: System preference, then persisted in `localStorage`.

### 2. Typography
*   **Inter** for UI text.
*   **Merriweather** for Headings.
*   Imported via Google Fonts in `index.html`.

### 3. New Features Implementation
*   **Theme Toggle:** Located in Header. JS handles state.
*   **Compact Mode:** Toggles `.compact-mode` class on body. CSS hides unnecessary details in cards/blocks.
*   **Quick Filters:** Client-side filtering of timetable rows in `app.js`.
*   **Live Conflict Hints:** New `.conflict-badge` element injected into session blocks.
*   **Keyboard Shortcuts:** `?` key or button opens modal.
*   **Export Preview:** Intercepts download click to show modal first.

### 4. Chart.js Adaptation
*   Charts now read CSS variables (e.g., `getComputedStyle(document.documentElement).getPropertyValue('--color-primary')`) to update colors dynamically on theme switch.

### 5. Responsive Behavior
*   Mobile Navigation: Tabs stack into a dropdown/overflow menu on small screens (implemented via CSS media queries).

## File Structure
*   `style.css`: Contains all design tokens and component styles.
*   `app.js`: Logic for toggles, state management, and chart updates.
*   `index.html`: Structure for new modals and controls.

## Notes
*   **Do not change px values for layout.** Padding, margins, and font-sizes are frozen.
*   Ensure all new colors meet WCAG AA contrast standards.
