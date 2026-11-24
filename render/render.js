//const { contextBridge } = require("electron");

const button = document.getElementById("btn");
const btnTest1 = document.getElementById("btn-test1");
const btnLow = document.getElementById("btn-low");
const btnHigh = document.getElementById("btn-high");
const btnProcesses = document.getElementById("btn-processes");
const btnToggleTable = document.getElementById("btn-toggleTable");
const btnPopulate = document.getElementById("btn-populate");

const tableBody = document.getElementById("tableBody");
const table = document.getElementById("table");

button.addEventListener("click", test);
btnTest1.addEventListener("click", test1);

btnLow.addEventListener("click", lowPitch);
btnHigh.addEventListener("click", highPitch);
btnProcesses.addEventListener("click", getTopUsage);

btnPopulate.addEventListener("click", renderTable);

//toggles table visability
/*
btnToggleTable.addEventListener("click", () => {
  if (table.style.display == "none") table.style.display = "flow-root";
  else table.style.display = "none";
});
*/
btnToggleTable.addEventListener("click", () => {
  table.classList.toggle("is-hidden");
});

//-------------------------------
function test() {
  console.log("---");
  for (var i = 0; i <= 51; i++) console.log("hi " + i);
}

function test1() {
  let x = [
    { name: "person_name" },
    { name: "person_name1" },
    { name: "person_name2" },
    { name: "person_name3" },
  ];

  for (var i = 0; i <= x.length - 1; i++) {
    console.log(x[i].name);
  }
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
  console.log("(render.js) fucking work dammit ");
  window.api.preload_TenProcesses();
}

//----

async function renderTable() {
  //fetch data
  const rowData = await window.api.preload_getTableData();
  tableBody.innerHTML = " ";

  //loop and create each cell
  rowData.forEach((item) => {
    const row = tableBody.insertRow();

    const nameCell = row.insertCell(0);
    const statusCell = row.insertCell(1);
    const actionCell = row.insertCell(2);

    //populating table
    nameCell.textContent = item.name;
    statusCell.textContent = item.status;

    // interactive elements
    const btn = document.createElement("button");
    btn.textContent = "Toggle";
    btn.onclick = () => {
      alert(`Clicked ${item.name}`);
    };
    actionCell.appendChild(btn);
  });
}
