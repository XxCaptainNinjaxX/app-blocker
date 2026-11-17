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
