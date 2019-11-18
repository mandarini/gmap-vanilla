/// <reference types="@types/markerclustererplus" />

import { loadMapScript } from "./mapscript";
// import { RegisterSW } from "./sw-reg";
import { loadAllDrawingButtons } from "./clickListeners";
import { FunWithMaps } from "./map";
import {} from "google-maps";

// RegisterSW();
loadAllDrawingButtons();

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
}
