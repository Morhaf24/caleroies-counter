import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

const { div, p, input, button, table, tr, td, br } = hh(h);

const buttonStyle = "bg-green-400 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded";
const inputFieldStyle = "border-2 border-red-900 inline-block";
const lineStyle = "min-w-[450px] border border-red-900 text-red-900";
const deleteButtonStyle = "bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded";
const masages = {
  createRow: "createRow",
};

function brief(dispatch, model) {
  return div ({ }, [ 
    div({ className: " text-left gap-4 items-center"}, [
    p({className: "inline-block px-6 text-red-900 text-xl border-b-red-900" }, `Meal:`),
    input({type:"text", className: inputFieldStyle, id:"nameInput"}),
    br({}),
    br({}),
    p({className: "inline-block px-3 text-red-900 text-xl" }, `Calories:`),
    input({type:"number", className: inputFieldStyle, id:"caloriesInput"}),
    br({}),
    br({}),
    button({ className: buttonStyle, onclick: () => dispatch(masages.createRow) }, "Create" + model.currentMeal + model.currentCalories),
    ]), 
    table({ className: "text-center mx-auto border-collapse mt-10", id:"table" }, [
      tr({ className: "" }, [
        td({ className: lineStyle }, "Meal"),
        td({ className: lineStyle }, "kcal"),
      ]),
    ]),
    br({}),
    p({className: "text-xl text-left text-red-900" }, `Calories Total: ${caloriesTotal}`)
  ]);
}

function update(msg, model) {
  switch (msg) {
    case masages.createRow:
      const table = document.getElementById("table");
      const row = table.insertRow(-1);
      const meal = row.insertCell(-1);
      const calories = row.insertCell(-1);
      const deleteRow = row.insertCell(-1);
      const delButton = document.createElement("button");
      deleteRow.appendChild(delButton);

      meal.className = lineStyle;
      calories.className = lineStyle;
      delButton.className = deleteButtonStyle;

      delButton.addEventListener("click", function(event) {
        const td = event.target.parentNode; 
        const tr = td.parentNode;
        tr.parentNode.removeChild(tr);
      });

      meal.innerText = document.getElementById("nameInput").value;
      calories.innerText = document.getElementById("caloriesInput").value;
      delButton.innerText = "Delete";
      return model;
    default:
      return model;
  }
}

const initModel = {
  currentMeal: "",
  currentCalories: ""
};

const caloriesTotal = 0;

function app(initModel, update, brief, node) {
  let model = initModel;
  let currentbrief = brief(dispatch, model);
  let root = createElement(currentbrief);
  node.appendChild(root);
  function dispatch(msg) {
    model = update(msg, model);
    const updatedbrief = brief(dispatch, model);
    const patches = diff(currentbrief, updatedbrief);
    root = patch(root, patches);
    currentbrief = updatedbrief;
  }
}

const root = document.getElementById("app");

app(initModel, update, brief, root);