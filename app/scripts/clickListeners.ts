import * as map from "./map";

const drawing = document.getElementById("drawingControls");
const drawing_buttons = [
  {
    name: "marker",
    img: "point"
  },
  {
    name: "polygon",
    img: "polygon"
  },
  {
    name: "square",
    img: "square"
  },
  {
    name: "circle",
    img: "circle"
  },
  {
    name: "polyline",
    img: "line"
  },
  {
    name: "cat",
    img: "cat"
  },
  {
    name: "pan",
    img: "pan"
  },
  {
    name: "save",
    img: "save"
  },
  {
    name: "clear",
    img: "clear"
  }
];

console.log(map);

export function loadAllDrawingButtons() {
  drawing_buttons.forEach((btn: { name: string; img: string }) => {
    createButton(btn, drawing);
  });
}

function createButton(btn: { name: string; img: string }, parent: HTMLElement) {
  const img_btn = document.createElement("img");
  img_btn.id = `${btn.name}-control`;
  img_btn.tabIndex = 0;
  img_btn.setAttribute("role", "button");
  if (btn.name === "clear") {
    img_btn.src = `assets/img/${btn.img}.svg`;
    img_btn.addEventListener("click", (ev: MouseEvent) => {
      map.clearAll();
    });
  } else {
    img_btn.src = `assets/img/${btn.img}.png`;
    img_btn.addEventListener("click", (ev: MouseEvent) => {
      map.draw(btn.name);
    });
  }
  parent.appendChild(img_btn);
}
