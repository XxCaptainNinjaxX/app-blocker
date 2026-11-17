//const { contextBridge } = require("electron");

const button = document.getElementById("btn");
const commandBtn = document.getElementById("command-btn");

button.addEventListener("click", test);
//commandBtn.addEventListener("click", test2);
commandBtn.addEventListener("click", test2);

//-------------------------------
function test() {
  console.log("---");
  for (var i = 0; i <= 51; i++) console.log("hi " + i);
}

function test2() {
  window.api.runCommand();
}
