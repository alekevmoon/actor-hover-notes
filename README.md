# Actor Hover Notes for Foundry VTT (GURPS)

A lightweight script for Foundry Virtual Tabletop that displays character notes in a tooltip when hovering over an actor's name in the Actor Directory sidebar. This script is specifically designed to work with the data structure of the **GURPS** game system.

## 🌟 Features

* **Deep Notes Extraction:** Automatically gathers all character notes from `actor.system.notes`, traversing through nested lists (`contains` and `collapsed`).
* **Permission-Aware:** Notes are strictly protected. The tooltip is only visible to the GM and players who have at least **Observer** permission for that specific actor.
* **Smart Formatting:** The script detects whether a note contains HTML or plain text. Plain text is safely escaped to prevent injection, and line breaks are automatically preserved.
* **UI Spam Protection:** Includes a built-in 400ms delay (`HOVER_DELAY_MS`) to prevent tooltips from rapidly flashing when simply moving your cursor across the sidebar.
* **Always Up-to-Date:** Tooltip content is built dynamically upon hover, meaning any changes made to an actor's sheet are immediately reflected without needing to refresh.

## 🚀 Installation & Usage

This code is a JavaScript hook (`Hooks.on`). To make it run permanently in your Foundry VTT world, use one of the following methods:

### Method 1: World Scripts (Recommended)

1. Install and enable a module that allows custom scripts, such as **World Scripter** or **Custom CSS & JS**.
2. Create a `.js` file (e.g., `actor-hover-notes.js`) in your world's script folder.
3. Copy and paste the provided script into this file.
4. Refresh your Foundry VTT world.

### Method 2: As a Macro

1. Create a new Macro in Foundry VTT.
2. Set the Macro type to **script**.
3. Paste the code and save.
4. You (and your players) will need to click this macro once per session/page refresh to register the hover hook.

## ⚙️ Configuration & Styling

You can tweak the behavior by adjusting the constants at the top of the script:

* `const HOVER_DELAY_MS = 400;` — The time (in milliseconds) the cursor must rest on an actor's name before the tooltip appears. Decrease for instant popups, or increase if they get in your way.
* `const TOOLTIP_CLASS = "ahn-tooltip";` — The CSS class applied to the tooltip element.

### Customizing Appearance (CSS)

If you want to customize how the tooltip looks, you can add custom CSS (via a Custom CSS module or your world's stylesheet) targeting the `.ahn-tooltip` class:

```css
/* Example custom styling for the tooltip */
.ahn-tooltip {
  font-size: 14px;
  background-color: rgba(30, 30, 30, 0.95);
  border: 1px solid #777;
  padding: 10px;
  max-width: 350px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.5);
}

/* Optional: Emphasize the first line (Actor Name) if wrapped in tags */
.ahn-tooltip strong {
  color: #ff6400;
  display: block;
  margin-bottom: 6px;
  border-bottom: 1px solid #555;
  padding-bottom: 4px;
}

```

## 🛠 System Requirements

* **Foundry VTT:** v10+ (Utilizes the standard `game.tooltip` API).
* **Game System:** **GURPS** (Relies on the `actor.system.notes` data path and GURPS-specific `contains`/`collapsed` structures).
* *Note:* To use this with other game systems (like D&D5e or Pathfinder), the `collectNotes` function must be modified to target that specific system's data structure.
