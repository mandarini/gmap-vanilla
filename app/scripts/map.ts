/// <reference types="@types/markerclustererplus" />
import {} from "google-maps";
import * as styledMap from "./styledMap";
import { listenForDrawing } from "./drawing";

import { customGradient } from "./gradient";
import { mapNumber } from "./mapNumber";

let this_map: google.maps.Map;
let london: google.maps.LatLng;
let dark_theme: boolean = true;
let markers: google.maps.Marker[] = [];
let infoWindow: google.maps.InfoWindow;

let masts: string[][];
let mastsVisible: boolean = false;
let markerClusterer: MarkerClusterer;
let clustersVisible: boolean = false;

let heatmap: google.maps.visualization.HeatmapLayer;
let lettings: string[][];

let showLonely: boolean = false;
let prevalence: string;
let heatmapVisible: boolean = false;

export function FunWithMaps(map: google.maps.Map) {
  this_map = map;
  london = coords(51.561638, -0.14);
  let darkmap = new google.maps.StyledMapType(
    styledMap.styledMap as google.maps.MapTypeStyle[],
    {
      name: "Dark Map"
    }
  );

  map.setCenter(london);
  map.mapTypes.set("dark_map", darkmap);
  map.setMapTypeId("dark_map");

  map.controls[google.maps.ControlPosition.LEFT_TOP].push(
    document.getElementById("controls")
  );
  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(
    document.getElementById("legend")
  );
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
    document.getElementById("drawingControls")
  );
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
    document.getElementById("katlink")
  );
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(
    document.getElementById("place-search")
  );

  const autocomplete_input: HTMLInputElement = document.getElementById(
    "place-input"
  ) as HTMLInputElement;

  const autocomplete = new google.maps.places.Autocomplete(autocomplete_input);
  autocomplete.bindTo("bounds", map);
  autocomplete.setFields(["address_components", "geometry", "icon", "name"]);
  const marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });
  autocomplete.addListener("place_changed", function() {
    marker.setVisible(false);
    const place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    let address = "";
    if (place.address_components) {
      address = [
        (place.address_components[0] &&
          place.address_components[0].short_name) ||
          "",
        (place.address_components[1] &&
          place.address_components[1].short_name) ||
          "",
        (place.address_components[2] &&
          place.address_components[2].short_name) ||
          ""
      ].join(" ");
    }
  });

  listenForDrawing(map);
  loadAllMarkers(map);
  loadHeatmapData();
  loadGeoJson(map);
}

function coords(x: number, y: number) {
  return new google.maps.LatLng(x, y);
}

function loadAllMarkers(map: google.maps.Map): void {
  let antenna: google.maps.Icon = {
    url: "assets/img/antennabl.png",
    scaledSize: new google.maps.Size(40, 40)
  };
  fetch("assets/data/masts.json")
    .then(response => {
      return response.json();
    })
    .then((response_masts: { meta: {}; data: string[][] }) => {
      masts = response_masts.data;
      masts.map((x: string[]) => {
        let marker = new google.maps.Marker({
          position: new google.maps.LatLng(
            parseFloat(x[18]),
            parseFloat(x[17])
          ),
          icon: antenna
        });
        infoWindow = new google.maps.InfoWindow();
        marker.addListener("click", e => {
          infoWindow.setPosition(e.latLng);
          infoWindow.setContent(`<p>${x[14]}</p>`);
          infoWindow.open(map, marker);
        });
        markers.push(marker);
      });
    })
    .catch(error => {
      console.log(error, "Error loading asset");
    });
}

export function city(city: string) {
  if (city === "lon") {
    this_map.setCenter(coords(51.561638, -0.14));
  }
  if (city === "man") {
    this_map.setCenter(coords(53.52476717517185, -2.5434842249308414));
  }
}

export function changeType() {
  if (!dark_theme) {
    this_map.setMapTypeId("dark_map");
  } else {
    this_map.setMapTypeId("roadmap");
  }
  dark_theme = !dark_theme;
}
export function toggleMasts(): void {
  if (!mastsVisible) {
    markers.map(marker => {
      marker.setMap(this_map);
    });
  } else {
    markers.map(marker => {
      marker.setMap(null);
    });
  }
  mastsVisible = !mastsVisible;
}

export function toggleClusters(): void {
  if (!clustersVisible) {
    markerClusterer = new MarkerClusterer(this_map, markers, {
      imagePath: "assets/img/m"
    });
    markerClusterer.setGridSize(10);
  } else {
    markerClusterer.clearMarkers();
  }
  clustersVisible = !clustersVisible;
}

export function toggleHeatmap(): void {
  if (heatmapVisible) {
    heatmap.setMap(null);
  } else {
    heatmap.setMap(this_map);
  }
  heatmapVisible = !heatmapVisible;
}
export function changeHeatmapRadius(heatmap_radius: number) {
  heatmap.set("radius", heatmap_radius);
}
export function changeCluster(clust_num: number): void {
  clustersVisible = true;
  if (markerClusterer) {
    markerClusterer.clearMarkers();
  }
  markerClusterer = new MarkerClusterer(this_map, markers, {
    imagePath: "assets/img/m"
  });
  markerClusterer.setGridSize(clust_num);
}

function loadHeatmapData() {
  fetch("assets/data/letting.json")
    .then(response => {
      return response.json();
    })

    .then((data: { meta: {}; data: string[][] }) => {
      lettings = data.data;
      let heatmapData: {}[] = [];
      lettings.map((x: string[]) => {
        if (x[24] && x[23]) {
          heatmapData.push({
            location: new google.maps.LatLng(
              parseFloat(x[24]),
              parseFloat(x[23])
            ),
            weight: parseInt(x[15], 10)
          });
        }
      });
      heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData
      });
      heatmap.set("gradient", customGradient);
      heatmap.set("radius", 40);
      heatmap.set("opacity", 1);
    })
    .catch(error => {
      console.log(error);
    });
}
function loadGeoJson(map: google.maps.Map) {
  map.data.loadGeoJson("assets/data/lonely.geojson");
  map.data.addListener("mouseover", e => {
    showLonely = true;
    prevalence = e.feature.getProperty("PREVALENCE");
  });
  map.data.addListener("mouseout", e => {
    showLonely = false;
  });
  map.data.setStyle(feature => {
    let lon = feature.getProperty("PREVALENCE");
    let value = 255 - Math.round(mapNumber(lon, 0, 5, 0, 255));
    let color = "rgb(" + value + "," + value + "," + 0 + ")";
    return {
      fillColor: color,
      strokeWeight: 1
    };
  });
  infoWindow = new google.maps.InfoWindow();
  map.data.addListener("click", e => {
    infoWindow.setPosition(e.latLng);
    infoWindow.setContent(`<div class="overlay">
    <p><b>Prevalence factor of Loneliness of those over the age of 65: </b>
      ${e.feature.getProperty("PREVALENCE")}</p></div>`);
    infoWindow.open(map);
  });
}
