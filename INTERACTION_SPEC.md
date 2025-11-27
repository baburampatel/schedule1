# Interaction Specification

## Theme Toggle
*   **Trigger:** Click on Moon/Sun icon.
*   **Transition:**
    *   Background color fades over 250ms.
    *   Icon rotates/swaps immediately.
*   **Persistence:** Saves to `localStorage`.

## Session Blocks
*   **Drag Start:** Opacity reduces to 0.5.
*   **Hover:** Scale up 1.01, Z-index promotes to top.
*   **Conflict:** Red border + pulsing red badge (1.5s loop).

## Compact Mode
*   **Trigger:** '⚏' Icon or 'C' key.
*   **Effect:**
    *   Hides `.event-meta` (Room/Instructor details in calendar).
    *   Reduces card padding from 16px to 12px.

## Keyboard Shortcuts
*   `Ctrl + Z`: Undo last action.
*   `Ctrl + Y`: Redo.
*   `R`: Run Optimizer.
*   `C`: Toggle Compact Mode.
