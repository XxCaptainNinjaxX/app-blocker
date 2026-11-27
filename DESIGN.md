# DESIGN.md: app-blocker (working name "Study Block" / "Task Manager 2.0")

Hand-off brief for another AI or reviewer. It describes the **planned UI and
features**, the current state, and the open questions. It does not contain code.
The source is hand-drawn wireframes from 2026-11-26.

---

## 1. Context

- **Who:** a solo beginner developer building this to learn. They write all the
  code themselves, and AI is used for explanations and reviews only. Feedback
  should be about design, not implementation code.
- **Platform:** a Windows-only desktop app.
- **Stack (fixed):** Electron, plain JavaScript (CommonJS), plain HTML and CSS.
  No framework, bundler or TypeScript until after the first release.
  - Renderer security: `nodeIntegration` off and `contextIsolation` on. The
    renderer talks to main only through `preload.js` and `contextBridge`.
- **How "blocking" works:** Windows has no real block switch. The app lists
  running processes with a PowerShell or `tasklist` command, and force-closes
  blocked ones with `taskkill /F` in a loop every 1–2 s while a session is
  active.
- **Safety rule:** there is a hard-coded never-kill list (`explorer.exe`,
  `svchost.exe`, `csrss.exe`, `winlogon.exe` and the app itself). The only test
  target is an empty Notepad.
- **Current state:** about 3 working sessions in. The Electron window works, and
  IPC renderer→main→renderer works. A button lists the top 10 processes by
  memory into a basic HTML table. Filtering out protected names is in progress.
- **Original scope:** pick apps, block them for X minutes, Cancel button,
  session survives restart, tray icon, `.exe` release.
- **New scope:** two modes, described below. It is roughly 3× the original.

---

## 2. App structure

```
Home ──┬── Study Block   (original purpose: block app groups for a set time)
       └── Task Manager 2.0  (live process viewer + grouping + kill)
```

Every main screen has a **home button** (top-left), a title, and the
minimize/maximize/close buttons. In the bottom-left corner of every screen there
is an **avatar + username + settings gear**, which opens the settings tab.

---

## 3. Screens

### 3.1 Home

- The greeting reads "Hi [user]", followed by "What would you like to do?"
- There are two large choice cards side by side, each with a title and a
  picture or illustration:
  - **Study Block**
  - **Task Manager 2.0**
- Later features, parked and not part of v1:
  - A user account and sign-up system.
  - Usage tracking: what time each mode was opened, and how many times each
    option was chosen (a counter).
  - Based on the day or week, the app highlights a suggested option.
  - OS notifications registered with Windows (details still to research).

### 3.2 Study Block: main grid

- The screen is a grid of **group cards**, 3 per row and scrollable. The last
  slot is a **"+" card** that creates a new group.
- Each group card shows:
  - A **duration or timer** at the top-left, in red, e.g. `3:00:01`.
  - A **green play button** at the top-right that starts the block.
  - The **list of apps** in the group, e.g. Steam, Witcher, "Risk of Ra…"
    (long names are cut off with an ellipsis).
  - The **group name** at the bottom-left, e.g. "group1".
  - An **edit ✎** button at the bottom-right.

### 3.3 Study Block: edit mode (opened from ✎)

- The card turns into an editable state:
  - The timer is greyed out and editable.
  - A **red trash icon** deletes the group.
  - Each app has a **red ✕** that removes it.
  - An **"add"** row adds apps.
  - A **"finished"** button saves.
- While editing, the card wiggles like the iOS home screen ("jitter effect").

### 3.4 Study Block: search / add apps

- A **"Search"** pill button expands, with an outline animation, into a panel.
  The panel holds a search field and a **checkbox list** of apps to add to the
  group.

### 3.5 Overlay: block active

- The overlay is modal. The background is **blurred and can't be used**.
- It shows "group1 **active**", "time remaining: __", and a red **"End study
  session early"** button.

### 3.6 Overlay: session finished

This overlay appears when the timer hits zero or the end button is pressed.

- It shows a party-popper icon and the text "You locked in for **[time]**!
  Good job **[name]**".
- `[name]` is chosen at random from a list: "Einstein", "genius",
  "brainiac", and so on.
- A **celebration sound** plays, e.g. "yippee".

### 3.7 Task Manager 2.0

The screen has three tabs: **All processes | Featured grouping | ≡ Custom**.
Data refreshes about every **0.5 s**.

- **All processes:** a table with the columns name, CPU %, memory %, disk %,
  network %. Multiple instances of the same app are grouped into one row, so
  all Chrome processes show as one "Chrome" row.
- **Featured grouping:** collapsible preset categories, for example:
  - Gaming: Steam, Discord, Witcher
  - Windows: Defender, Intel
  - Further presets: Windows/Microsoft, Code (VS Code, node), AI (Claude,
    Copilot), and **Other**, which catches anything not listed.
- **Custom:** collapsible groups the user creates (group1, group2, …, Other).
  - The ≡ button opens a **"Custom grouping"** panel listing the groups, with
    "add group".
  - **"Other" is mandatory** and can't be deleted.
- **Protected processes** such as Windows Defender are shown **greyed out**
  and can't be killed.
- **Right-click** on a process or group opens a context menu with **Kill**.
- **Color themes** can be chosen in settings.

---

## 4. Main feature list

1. Kill a specific running process (Task Manager 2.0). The process list can be
   grouped and filtered, and protected processes are greyed out.
2. Select specific apps and block them for X time (Study Block).
3. Color themes.
4. Later: accounts, usage tracking, suggestions, OS notifications.

---

## 5. Open questions (design decisions not made yet)

1. **Card timer meaning:** is `3:00:01` the configured duration, or a live
   countdown? Where exactly is the duration set?
2. **Multiple active groups:** can two groups be active at once? What happens
   if the same app is in two groups?
3. **Overlay reach:** does the overlay cover only the app's own window, or the
   whole screen above other apps? Real blur of other apps' content isn't
   possible with plain CSS.
4. **Adding apps that aren't running:** search lists running processes. How
   does the user add an app that is closed right now, e.g. Discord?
5. **Display names vs process names:** "Steam" is really several processes,
   e.g. `steam.exe` and `steamwebhelper.exe`. The app needs a mapping from the
   friendly name to the executables.
6. **Shared groups:** are Study Block groups and Task Manager custom groups the
   same objects? The current recommendation is yes: one shared group model.
7. **Kill confirmation:** should Task Manager ask "Are you sure?" before a kill,
   since it can lose unsaved work?
8. **Blocked app relaunched mid-session:** does the user get feedback, such as
   a toast saying "Discord closed — you're in a study block"?
9. **Settings contents:** what goes there beyond the theme? Possible items: a
   sound on/off toggle, the name list, refresh rate.
10. **Refresh rate:** spawning PowerShell every 0.5 s may be too heavy, and
    per-process disk and network stats aren't available from `Get-Process`.
    Is 1–2 s with CPU and memory only acceptable for v1? (Needs verification.)
11. **States still to design:** empty (no groups yet), first launch, errors
    (e.g. a kill is denied because an app runs as admin), and the tray icon
    behaviour.

---

## 6. Draft milestones

The plan ships Study Block first, as the original goal, then adds Task Manager.
Estimates are in working sessions of about 4 h each.

| #   | Milestone                                                                          | Est. sessions |
| --- | ---------------------------------------------------------------------------------- | ------------- |
| M1  | Show running apps in the UI (in progress)                                          | 1             |
| M2  | Process model: merge duplicate instances, never-kill/greyed list, kill Notepad     | 2–3           |
| M3  | Groups: create, rename, add/remove apps, save to JSON                              | 3–4           |
| M4  | Study Block grid + start a group → kill loop                                       | 2–3           |
| M5  | Timer (end timestamp) + "active" overlay + end early                               | 2–3           |
| M6  | "Finished" overlay + sound; session survives restart; tray                         | 2–3           |
| M7  | **v1 release:** home screen (Study Block only), `.exe`, README, GitHub release     | 2             |
| M8  | Home screen with both modes + navigation                                           | 1–2           |
| M9  | Task Manager "All processes": live CPU/mem table, refresh loop, right-click kill   | 3–4           |
| M10 | Featured + custom grouping tabs                                                    | 3–4           |
| M11 | Polish: edit jitter, search expand animation, color themes, settings               | 3–5           |
| —   | Later: TypeScript conversion, accounts, tracking, suggestions, notifications       | —             |

**Total:** about 25–35 sessions. About 12–16 of those come before the v1
release.
