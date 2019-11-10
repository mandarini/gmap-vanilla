import { loadMapScript } from "./mapscript";
import { RegisterSW } from "./sw-reg";
import { FunWithMaps } from "./map";
import {} from "google-maps";

RegisterSW();

let map: google.maps.Map;

if (window["google"] && window["google"]["maps"]) {
  initMap();
} else {
  loadMapScript("", () => {
    initMap();
  });
}

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 38, lng: 24 },
    zoom: 7
  });
  FunWithMaps(map);
}
