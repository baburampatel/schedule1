# Interaction Specification

## 1. Global Transitions
*   **Theme Switch:** 0.3s ease-in-out crossfade. Background color and text color transitions should be smooth.
*   **Hover States:** 0.2s ease-out.

## 2. Micro-interactions

### Buttons
*   **Hover:** Background darkens by 10% (filter brightness or specific token).
*   **Active (Click):** Transform scale(0.98).
*   **Focus:** 2px solid offset ring (Teal/Cyan).

### Cards
*   **Hover:** Lift effect (transform translateY(-2px)), Shadow increases from md to lg.

### Inputs
*   **Focus:** Border color changes to Primary. Box-shadow glow (0 0 0 3px rgba(Primary, 0.2)).

### Timetable Blocks
*   **Hover:** Brightness increase + Slight scale (1.02).
*   **Drag Start:** Opacity 0.8, Scale 1.05, Rotate 3deg.
*   **Drop Target:** Dotted border highlight.
*   **Conflict:** Pulse animation (Red glow).

## 3. Animations

### Conflict Pulse
```css
@keyframes pulse-conflict {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}
.conflict-badge {
  animation: pulse-conflict 2s infinite;
}
```

### Modal Open
*   **Backdrop:** Fade in (opacity 0 -> 1).
*   **Content:** Slide up + Fade in (translateY(20px) -> 0, opacity 0 -> 1).

## 4. Accessibility
*   **Focus Management:** Visible focus indicators for keyboard users.
*   **Contrast:** Text ratios > 4.5:1.
*   **Reduced Motion:** Respect `prefers-reduced-motion` media query to disable movements.
