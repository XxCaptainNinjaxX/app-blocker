# Journal

## M0 (11/17/26) 12:22am

so. not sure what to write in here but, just started and intalized this project.

purpouse of this project is yes to build a fun little thing that can help me out but ainly restore my motivation for code once more, cause yk at the end of the day im a glorified cs major lmfao gotta know how to code.

### found out

- **main.js** = main process, window, app stuff, etc
- **preload.js** = bridge between page and actual scripts/code
- **renderer.js** = actual page logic, click btn, do that
- **index,styles,package,claude** all self explanatory
- **npm start** to start the window/application rather than the **npm run dev** for react

## M1 (11/17/26) 3:10am

yeah so realized that this was going to be more of a journal rather than a devlog soooo renamed and gonna start a yap session now lmfao

> ### new concepts

#### `const x = require(...)`

- varaible needed cause returns exports, otherwise just thrown away.
- require like a door between files, withought would become global rather than private

#### `child_process.exec`

- works by spawning/creating new shell and runs command
- can use ANY commands as one would use in terminal
  - **holds all memory until output** so there is a buffer memory size limit, (default 1mb)

#### ICP (Inter process Communcation)

- how processes talk to one another

```

ipcMain.on("[function name]", () => {
  exec(
    'powershell -Command "[windows command]"',
    (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        return;
      }

      [FUNCTION LOGIC]


      //cnt++;
      //console.log("Higher pitch works! " + cnt);
    },
  );
});


```

`err` = 'error

error itself, ex = command failed [command]

`std` = 'standard error'

explanation of error, ex: "ls: nonexistent-folder: No such file or directory"

`stdout` = 'standard output'

output of command, ex: `echo "hello"` => hello

#### Main Process 'backend'

- Node.js process, runs in vs code terminal
  - console.log -> vs code terminal
- no UI
- database
-

#### Render Process 'frontend'

- chromium page,
  - console.log -> app console
- UI
- sends data to backend / main process

> ### What has been done

- added style sheet + connected it
- restructured main and render folders
- btn performs windows command

## M1 (11/17/26)

> added

- three btns, high/low pitch to test out the ICP commands and impliement window function, another btn to show top 10 cpu usage programs
- toggle visability function in render.js + created table for it

> yap / decription

- attempted to play around with variables to see how to correctly build names since everytime i want to create a btn to do something, i need to edit 4 files, html, render (frondend), preload (bridge), main (backend).
  - rn using:
    - `main-[function name]` in main.js
    - `preload_[function name]` in preload.js
    - `render[function name]` in render.js

> new shit

### function vs async function

`function`

- immediate code / logic

```
function getGreeting() {
  return "Hello, world!";
} // Output: "Hello, world!"
```

`async function`

- wraps return value in 'promise'
- utlizes `await`

```
async function fetchUserData() {
  console.log("1. Starting fetch...");

  // Pauses ONLY inside fetchUserData until the fetch Promise resolves
  const response = await fetch("https://example.com");
  const data = await response.json();

  console.log("2. Data received:", data);
  return data;
}

fetchUserData();
console.log("3. This runs BEFORE step 2 finishes!");


```

## M1 (11/27/26)

### Design

went ahead and designed the whole app, took about 4 ish hrs to figure out right layout, what i wanted functianality, etc etc. deciedd one two core things, one taskmanager 2.0 and the orignal idea (study block thing)

### JavaScript Array Deduplication & Filtering Notes

#### 1. How `new Set()` Works

A **`Set`** is a built-in JavaScript collection that stores **only unique values**. Under the hood, it uses a hash table to track values in near-constant time (O(1)), making it much faster than scanning an array repeatedly.

- **Iteration & Hashing:** Passing an array into `new Set(arr)` loops through the items from left to right and checks if each exact value (`===`) already exists.
- **Skipping Duplicates:** If a value is already in the `Set`, JavaScript ignores it. The first occurrence stays in its original spot.
- **Order Preservation:** By specification, `Set` remembers the **exact insertion order** of elements.

```javascript
const items = ["apple", "banana", "apple", "cherry"];
const uniqueSet = new Set(items);
// Set(3) { "apple", "banana", "cherry" }
```

#### 2. Why the Three Periods (`...`) Are Needed

The three periods (`...`) are the **spread syntax**. Because a `Set` is not a standard array, it lacks array methods like `.map()` or `.filter()`. Wrapping it in `[...new Set(arr)]` unpacks each item out of the `Set` and places it into a brand-new array.

```javascript
// Without ... (Wrong: creates an array containing 1 Set object)
const wrong = [new Set(["a", "b"])]; // [ Set(2) { "a", "b" } ]

// With ... (Right: unpacks elements into a new array)
const right = [...new Set(["a", "b"])]; // [ "a", "b" ]
```

#### 3. Filtering & Blocked Lists with `.filter()`

The **`.filter()`** method creates a new array containing only the elements that pass a test function (returning `true`). Pairing `.filter()` with a `Set` is the fastest way to remove items found in a blocked list.

##### Exact Match Blocked List

```javascript
const processes = ["chrome.exe", "notepad.exe", "steam.exe", "chrome.exe"];
const blockedSet = new Set(["steam.exe", "discord.exe"]);

// Deduplicate first, then keep items NOT in blockedSet
const cleanList = [...new Set(processes)].filter(
  (item) => !blockedSet.has(item),
);
// ["chrome.exe", "notepad.exe"]
```

##### Case-Insensitive Blocked List & Deduplication

Because `Set` uses strict equality (`"Apple" !== "apple"`), normalize strings with `.toLowerCase()` when casing varies:

```javascript
const rawProcesses = ["Chrome.exe", "Steam.exe", "chrome.exe", "NOTEPAD.EXE"];
const blockedList = ["steam.exe", "discord.exe"];

const blockedSet = new Set(blockedList.map((item) => item.toLowerCase()));
const seen = new Set();

const allowed = rawProcesses.filter((item) => {
  const lower = item.toLowerCase();
  if (blockedSet.has(lower) || seen.has(lower)) {
    return false;
  }
  seen.add(lower);
  return true;
});
// ["Chrome.exe", "NOTEPAD.EXE"]
```

#### Quick Cheat Sheet

| Goal                                  | Pattern                                             | Mutates Original? |
| :------------------------------------ | :-------------------------------------------------- | :---------------- |
| **Remove exact duplicates**           | `[...new Set(arr)]`                                 | No                |
| **Remove matching items**             | `arr.filter(x => x !== "target")`                   | No                |
| **Remove items in a blocked list**    | `arr.filter(x => !blockedSet.has(x))`               | No                |
| **Deduplicate + filter blocked list** | `[...new Set(arr)].filter(x => !blockedSet.has(x))` | No                |
