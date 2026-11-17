//const { contextBridge } = require("electron");

const button = document.getElementById("btn");
const btnLow = document.getElementById("btn-low");
const btnHigh = document.getElementById("btn-high");

button.addEventListener("click", test);

btnLow.addEventListener("click", lowPitch);
btnHigh.addEventListener("click", highPitch);

//-------------------------------
function test() {
  console.log("---");
  for (var i = 0; i <= 51; i++) console.log("hi " + i);
}

function lowPitch() {
  window.api.preloadLowerPitch();
  console.log("low pitch");
}
function highPitch() {
  window.api.preloadHigherPitch();
  console.log("high pitch");
}
