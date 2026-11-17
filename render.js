const button = document.getElementById("btn");
button.addEventListener("click", test);

function test() {
  console.log("---");
  for (var i = 0; i <= 51; i++) console.log("hi " + i);
}
