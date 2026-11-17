const command = require("child_processes").exec;

const button = document.getElementById("btn");
const commandBtn = document.getElementById("command-btn");

button.addEventListener("click", test);
commandBtn.addEventListener("click", test2);

function test() {
  console.log("---");
  for (var i = 0; i <= 51; i++) console.log("hi " + i);
}

function test2() {
  command("[console]::beep(37, 600)", (err, stdout, stderr));
  if (err) {
    console.log(err);
    return;
  }
  console.log(stdout);
}
