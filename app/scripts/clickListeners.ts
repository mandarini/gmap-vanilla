import * as map from "./map";
import * as drawingFunctions from "./drawing";

export function loadAllDrawingButtons() {
  drawing_buttons.forEach((btn: { name: string; img: string }) => {
    createImgButton(btn, drawing, btn.name === "clear" ? "clear" : "draw");
  });
}

export function listenersForControlButtons() {
  document
    .getElementById("city-lon")
    .addEventListener("click", (event: MouseEvent) => {
      map.city("lon");
    });
  document
    .getElementById("city-man")
    .addEventListener("click", (event: MouseEvent) => {
      map.city("man");
    });
  document
    .getElementById("lights")
    .addEventListener("click", (event: MouseEvent) => {
      map.changeType();
    });
  document
    .getElementById("masts-toggle")
    .addEventListener("click", (event: MouseEvent) => {
      map.toggleMasts();
    });
  document
    .getElementById("cluster-toggle")
    .addEventListener("click", (event: MouseEvent) => {
      map.toggleClusters();
    });
  document
    .getElementById("heatmap-toggle")
    .addEventListener("click", (event: MouseEvent) => {
      map.toggleHeatmap();
    });

  document.getElementById("heatmap-range").addEventListener("change", event => {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    map.changeHeatmapRadius(parseInt(target.value));
  });

  document.getElementById("cluster-range").addEventListener("change", event => {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    map.changeCluster(parseInt(target.value));
  });
}

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

function createImgButton(
  btn: { name: string; img: string },
  parent: HTMLElement,
  type: string
) {
  const img_btn = document.createElement("img");
  img_btn.id = `${btn.name}-control`;
  img_btn.tabIndex = 0;
  img_btn.setAttribute("role", "button");
  if (type === "clear") {
    img_btn.src = `assets/img/${btn.img}.svg`;
    img_btn.addEventListener("click", (ev: MouseEvent) => {
      drawingFunctions.clearAll();
    });
  } else {
    img_btn.src = `assets/img/${btn.img}.png`;
    img_btn.addEventListener("click", (ev: MouseEvent) => {
      drawingFunctions.draw(btn.name);
    });
  }
  parent.appendChild(img_btn);
}
