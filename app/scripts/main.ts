/// <reference types="@types/markerclustererplus" />

import { loadMapScript } from "./mapscript";
// import { RegisterSW } from "./sw-reg";
import { FunWithMaps } from "./map";
import {} from "google-maps";

// RegisterSW();

let map: google.maps.Map;
let drawingManager: google.maps.drawing.DrawingManager;
let allOverlays: any[] = [];

let drawingLayer: google.maps.Data;
if (window["google"] && window["google"]["maps"]) {
  initMap();
} else {
  loadMapScript("geometry,drawing,visualization", (event: Event) => {
    console.log(event);
    initMap();
  });
}

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 11,
    scrollwheel: true,
    panControl: false,
    mapTypeControl: false,
    zoomControl: true,
    streetViewControl: false,
    scaleControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.LARGE,
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    }
  });
  FunWithMaps(map);
  drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: null,
    drawingControl: false // i have my custom tools so i don't need the defaults to be displayed
  });
  drawingManager.setMap(map);
  drawingLayer = new google.maps.Data();
}

function draw(type: string) {
  switch (type) {
    case "marker":
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
      let point: google.maps.Icon = {
        url: "assets/img/point.png",
        scaledSize: new google.maps.Size(30, 30)
      };

      drawingManager.setOptions({
        markerOptions: {
          icon: point,
          clickable: true,
          draggable: true
        }
      });
      break;
    case "cat":
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
      let cat: google.maps.Icon = {
        url: "assets/img/cat.png",
        scaledSize: new google.maps.Size(70, 70)
      };
      drawingManager.setOptions({
        markerOptions: {
          icon: cat,
          clickable: true,
          draggable: true
        }
      });
      break;
    case "polygon":
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
      drawingManager.setOptions({
        polygonOptions: {
          fillColor: "#9c4d4f",
          fillOpacity: 0.5,
          strokeWeight: 2,
          strokeColor: "#401619",
          clickable: true,
          editable: true,
          draggable: true
        }
      });
      break;
    case "square":
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
      drawingManager.setOptions({
        rectangleOptions: {
          fillColor: "#fff82e",
          fillOpacity: 0.5,
          strokeWeight: 2,
          strokeColor: "#c8a535",
          clickable: true,
          editable: true,
          draggable: true
        }
      });
      break;
    case "polyline":
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
      drawingManager.setOptions({
        polylineOptions: {
          strokeWeight: 2,
          strokeColor: "#00b801",
          clickable: true,
          editable: true,
          draggable: true
        }
      });
      break;
    case "circle":
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
      drawingManager.setOptions({
        circleOptions: {
          fillColor: "#00b801",
          fillOpacity: 0.5,
          strokeWeight: 2,
          strokeColor: "#00b801",
          clickable: true,
          editable: true,
          draggable: true
        }
      });
      break;
    case "pan":
      drawingManager.setDrawingMode(null);
      break;
    case "save":
      drawingManager.setDrawingMode(null);
      drawingLayer.toGeoJson(obj => {
        console.log(obj);
        download(JSON.stringify(obj), "drawingData.txt");
      });
      break;
    default:
      drawingManager.setDrawingMode(null);
  }
}

function download(content: string, fileName: string) {
  let a = document.createElement("a");
  let file = new Blob([content], { type: "text/plain" });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

function clearAll() {
  allOverlays.map(overlay => {
    overlay.setMap(null);
  });
  drawingLayer.setMap(null);
  drawingLayer = new google.maps.Data();
  allOverlays = [];
}
