# bhdfs
bhdfs is stupid ik, didnt expect this to be a serious project

# NBA Trade Generator

A simple browser-based NBA trade generator that uses players from the current season and displays each involved player's:

- Name
- Team
- NBA 2K overall

It can also include draft-pick assets (1st/2nd round picks) in generated trades.

## Run as an app (recommended)

From this folder, run:

```bash
./run-app
```

That script automatically:

- starts a local web server,
- opens the app in your default browser,
- and keeps it running until you press `Ctrl+C`.

## Windows `.exe`

Yes — this project now supports building a Windows executable launcher.

### Option A: Build locally on Windows

From this folder in Command Prompt:

```bat
build-exe.bat
```

This builds:

- `dist/NBA-Trade-Generator.exe`

### Option B: Build from GitHub Actions

Use the **Build Windows EXE** workflow (`.github/workflows/build-windows-exe.yml`).
It uploads `NBA-Trade-Generator.exe` as a downloadable artifact.

## Alternative manual run

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Features

- Random 1-for-1 or 2-for-2 trade generation
- Optional inclusion of draft picks (1st/2nd round)
- Control for max picks each team can include
- Value-balance filter using max allowed total trade-value difference
- Trade output clearly lists every involved player's team and 2K OVR

## Data note

2K overalls are representative for the current season and can vary by official roster update. Pick values are heuristic and intended only for balanced random generation.
