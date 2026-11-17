//const { contextBridge } = require("electron");

const button = document.getElementById("btn");
const btnLow = document.getElementById("btn-low");
const btnHigh = document.getElementById("btn-high");
const btnProcesses = document.getElementById("btn-processes");

button.addEventListener("click", test);

btnLow.addEventListener("click", lowPitch);
btnHigh.addEventListener("click", highPitch);
btnProcesses.addEventListener("click", getTopUsage);

//-------------------------------
function test() {
  console.log("---");
  for (var i = 0; i <= 51; i++) console.log("hi " + i);
}

function lowPitch() {
  window.api.preload_LowerPitch();
  console.log("low pitch");
}
function highPitch() {
  window.api.preload_HigherPitch();
  console.log("high pitch");
}

//-----
function getTopUsage() {
  console.log("(render.js)fucking work dammit ");
  window.api.preload_TenProcesses();
}


