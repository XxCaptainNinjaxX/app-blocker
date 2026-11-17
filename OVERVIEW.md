# OVERVIEW.md — app-blocker

The **map**: what this project is and how it's planned. Rules for working in
the repo live in `CLAUDE.md`.

---

## Goal

A small Windows desktop app for focus while studying:

- Pick which Windows apps to block and for how long.
- While the timer runs, those apps get force-closed whenever they open.
- A **Cancel** button sets the timer to zero and unblocks everything.

Built solo and by hand as a learning project. Every line is typed by me; AI is
for questions, not code.

**Done =** someone else can install the `.exe` from a GitHub release and block
Discord for 25 minutes. Then the repo goes public.

---

## How it works

Windows has no real "block" switch for this, so the app is really an app closer:

1. **List running programs:** `tasklist /fo csv /nh`, run from the Electron
   main process with `child_process.exec`.
2. **Close a program:** `taskkill /IM <name>.exe /F` (every instance, by name).
3. **Enforcement loop:** `setInterval` every 1–2 s while a session is active.
   Catches apps I reopen and apps that restart themselves (e.g. Discord's updater).
4. **Timer = stored end timestamp** (`Date.now() + duration`). Remaining time =
   end − now. No countdown variable: it drifts and resets on restart.
5. **Session persistence:** block list + end time saved as JSON in
   `app.getPath('userData')`, loaded on launch, so closing the blocker doesn't
   end the block.
6. **Cancel:** end time = now, clear the list, stop the loop, save.

**Known limits (these go in the README):**

- Can't close apps running as admin unless the blocker also runs as admin.
- The user can always kill the blocker in Task Manager. Fine for a
  self-discipline tool.

**Safety:** test only on an empty Notepad. Hard-coded never-kill list:
`explorer.exe`, `svchost.exe`, `csrss.exe`, `winlogon.exe`, and the blocker itself.

---

## Stack

| Layer         | Pick                                                     | Why                                                             |
| ------------- | -------------------------------------------------------- | --------------------------------------------------------------- |
| Runtime       | Electron                                                 | Web skills + Node access to Windows; reused in the next project |
| Language      | Plain JS (M0–M5), TypeScript after M6                    | No build step before the first "it works"                       |
| UI            | Plain HTML/CSS/JS                                        | ~3 screens; a bundler is overkill                               |
| Process ↔ UI  | `preload.js` + `contextBridge` + `ipcMain`/`ipcRenderer` | Electron's secure pattern; `nodeIntegration` stays off          |
| List apps     | `tasklist /fo csv /nh` via `child_process.exec`          | Built in, no packages, easy to parse                            |
| Close apps    | `taskkill /IM name.exe /F`                               | All instances in one call                                       |
| Loop          | `setInterval` in main, 1–2 s                             | Simple; catches reopened apps                                   |
| Persistence   | JSON via `fs` in `userData`                              | One small object; teaches file I/O                              |
| Tray          | Electron `Tray` + `Menu`                                 | Built in                                                        |
| Start on boot | `app.setLoginItemSettings` (optional)                    | Built in                                                        |
| Packaging     | electron-builder (NSIS)                                  | Same tool as the next project                                   |
| Testing       | Manual, Notepad as target                                | Safe and visible; revisit during the TS conversion              |

Tradeoff: Electron installers are big (~80MB+) and memory-heavy. Doesn't
matter for a learning project.

---

## Milestones

| #     | Milestone                                                            | Learns                                                          |
| ----- | -------------------------------------------------------------------- | --------------------------------------------------------------- |
| M0    | Repo + empty Electron window                                         | Setup, git/GitHub, Electron entry point                         |
| M1    | Show running apps in the UI                                          | `child_process`, async output, IPC main → renderer              |
| M2    | Checkboxes → block list + kill loop (Notepad only)                   | IPC renderer → main, `setInterval`, `taskkill`, never-kill list |
| M3    | Timer + countdown; auto-unblock at zero                              | End-timestamp logic, UI updates                                 |
| M4    | Cancel button                                                        | State reset, event handling                                     |
| M5    | Session survives restarts + tray icon                                | `fs`, `app.getPath`, `Tray`/`Menu`                              |
| M6    | `.exe` via electron-builder, README + screenshot, release, go public | Packaging, release, docs                                        |
| After | Convert to TypeScript                                                | Types, refactoring                                              |

Out of scope until after M6 (parked in `IDEAS.md`): website blocking, stats,
schedules, anything new.

---

## Process (every milestone)

1. Read the docs first (Electron "Quick Start" and "Process Model" cover M0–M1).
2. Try it alone for 20–30 min before asking.
3. Ask AI in teach mode: concepts, API names, hints, problem-only reviews.
4. Type every line. If I can't explain a line, it doesn't go in.
5. Break it on purpose: delete a line, see what fails.
6. Commit + push once the milestone works (`M2: kill loop works on notepad`).
7. 3–5 lines in `DEVLOG.md`: what broke, why, how I fixed it.

---

## Files

| File                    | Purpose                                                    |
| ----------------------- | ---------------------------------------------------------- |
| `CLAUDE.md`             | Rules for Claude Code in this repo                         |
| `OVERVIEW.md`           | This map                                                   |
| `DEVLOG.md`             | Per-milestone notes, written by me                         |
| `IDEAS.md`              | Scope-creep parking lot, written by me                     |
| `.claude/settings.json` | Permission guardrails (blocks commits, pushes, `taskkill`) |

## Second laptop

`gh repo clone XxCaptainNinjaxX/app-blocker`, then `npm install`. Push from
one machine, pull on the other.
