# CrossOnScreen

A neon glassmorphic on-screen crosshair for FPS games, built as a transparent **always-on-top, click-through** Electron overlay.

## Run

Requires [Node.js](https://nodejs.org) (18+).

```bash
cd crosshair-app
npm install
npm start
```

The overlay appears centered on your primary monitor. It passes all mouse clicks straight through to your game.

## Shortcuts

| Default hotkey | Action |
| --- | --- |
| `Ctrl + Shift + F11` | Toggle overlay on/off |
| `Ctrl + Shift + F12` | Open / close settings panel |
| `Escape` | Close settings panel |

Both hotkeys are editable in the settings panel (use Electron accelerator syntax, e.g. `CommandOrControl+Shift+F11`). If a registration fails you'll see a toast and the old key is kept.

## In-game usage tips

- Play in **Borderless Windowed / Windowed Fullscreen** mode so the overlay stays visible on top.
- With exclusive fullscreen, the game renders above all windows and the overlay is hidden — switch to borderless.
- The tray icon (double-click) toggles the overlay. Right-click for menu with Quit.

## Settings

- Style: Cross, Dot, Ring, Dot+Ring, Cross+Dot, Corners
- Neon palette: 8 presets + custom primary / accent colors
- Arm size, thickness, gap, dot radius, ring radius, glow, opacity
- Shift X/Y to nudge the aim point to match a game's true center
- Dark outline toggle for visibility on bright scenes
- Monitor selection across all displays
- Persistent config stored in Electron's `userData` folder — `%APPDATA%\CrossOnScreen\neon-crosshair.json`.

## Notes

- Overlays can be blocked by some anti-cheat / game launchers. Use at your own risk.
- Transparent fullscreen compositing uses extra GPU; expect normal overlay overhead.