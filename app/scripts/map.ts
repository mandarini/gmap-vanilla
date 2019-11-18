/// <reference types="@types/markerclustererplus" />
import {} from "google-maps";
import * as styledMap from "./styledMap";
import { listenForDrawing } from "./drawing";

let this_map: google.maps.Map;

let london: google.maps.LatLng;
let drawingManager: google.maps.drawing.DrawingManager;

let otherGeoJson: any;
let infoWindow: google.maps.InfoWindow;
let markerClusterer: MarkerClusterer;
let heatmap: google.maps.visualization.HeatmapLayer;

let lettings: string[][];
let masts: string[][];
let markers: google.maps.Marker[] = [];

let showLonely: boolean = false;
let clust_num: number;
let prevalence: string;

let dark_theme: boolean = true;
let mastsVisible: boolean = false;
let clustersVisible: boolean = false;
let heatmapVisible: boolean = false;

let heatmap_radius: number = 20;

let viewReady: boolean = false;

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

  drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: null,
    drawingControl: false // i have my custom tools so i don't need the defaults to be displayed
  });
  drawingManager.setMap(map);

  listenForDrawing(map, drawingManager);
}

function coords(x: number, y: number) {
  return new google.maps.LatLng(x, y);
}

export function city(city: string) {
  if (city === "lon") {
    this_map.setCenter(coords(51.561638, -0.14));
  }
  if (city === "man") {
    this_map.setCenter(coords(53.52476717517185, -2.5434842249308414));
  }
}

// loadHeatmapData() {
//   data
//     .loadAsset("assets/data/letting.json")
//     .then((data: { meta: {}; data: string[][] }) => {
//       lettings = data.data;
//       let heatmapData = [];
//       lettings.map((x: string[]) => {
//         if (x[24] && x[23]) {
//           heatmapData.push({
//             location: new google.maps.LatLng(
//               parseFloat(x[24]),
//               parseFloat(x[23])
//             ),
//             weight: parseInt(x[15], 10)
//           });
//         }
//       });
//       heatmap = new google.maps.visualization.HeatmapLayer({
//         data: heatmapData
//       });
//       heatmap.set("gradient", customGradient);
//       heatmap.set("radius", 40);
//       heatmap.set("opacity", 1);
//     })
//     .catch(error => {
//       console.log(error);
//     });
// }
// loadGeoJson(map: google.maps.Map) {
//   map.data.loadGeoJson("assets/data/lonely.geojson");
//   map.data.addListener("mouseover", e => {
//     showLonely = true;
//     prevalence = e.feature.getProperty("PREVALENCE");
//   });
//   map.data.addListener("mouseout", e => {
//     showLonely = false;
//   });
//   map.data.setStyle(feature => {
//     let lon = feature.getProperty("PREVALENCE");
//     let value = 255 - Math.round(mapNumber(lon, 0, 5, 0, 255));
//     let color = "rgb(" + value + "," + value + "," + 0 + ")";
//     return {
//       fillColor: color,
//       strokeWeight: 1
//     };
//   });
//   infoWindow = new google.maps.InfoWindow();
//   map.data.addListener("click", e => {
//     infoWindow.setPosition(e.latLng);
//     infoWindow.setContent(`<div class="overlay">
//     <p><b>Prevalence factor of Loneliness of those over the age of 65: </b>
//       ${e.feature.getProperty("PREVALENCE")}</p></div>`);
//     infoWindow.open(map);
//   });
// }
// loadAllMarkers(map: google.maps.Map): void {
//   let antenna: google.maps.Icon = {
//     url: "assets/img/antennabl.png",
//     scaledSize: new google.maps.Size(40, 40)
//   };
//   data
//     .loadAsset("assets/data/masts.json")
//     .then((masts: { meta: {}; data: string[][] }) => {
//       masts = masts.data;
//       masts.map((x: string[]) => {
//         let marker = new google.maps.Marker({
//           position: new google.maps.LatLng(
//             parseFloat(x[18]),
//             parseFloat(x[17])
//           ),
//           icon: antenna
//         });
//         infoWindow = new google.maps.InfoWindow();
//         marker.addListener("click", e => {
//           infoWindow.setPosition(e.latLng);
//           infoWindow.setContent(`<p>${x[14]}</p>`);
//           infoWindow.open(map, marker);
//         });
//         markers.push(marker);
//       });
//     })
//     .catch(error => {
//       console.log(error, "Error loading asset");
//     });
// }
// toggleMasts(): void {
//   if (!mastsVisible) {
//     markers.map(marker => {
//       marker.setMap(map);
//     });
//   } else {
//     markers.map(marker => {
//       marker.setMap(null);
//     });
//   }
//   mastsVisible = !mastsVisible;
// }
// toggleClusters(): void {
//   if (!clustersVisible) {
//     markerClusterer = new MarkerClusterer(map, markers, {
//       imagePath: "assets/img/m"
//     });
//     markerClusterer.setGridSize(10);
//   } else {
//     markerClusterer.clearMarkers();
//   }
//   clustersVisible = !clustersVisible;
// }
// toggleHeatmap(): void {
//   if (heatmapVisible) {
//     heatmap.setMap(null);
//   } else {
//     heatmap.setMap(map);
//   }
//   heatmapVisible = !heatmapVisible;
// }
// changeCluster(): void {
//   clustersVisible = true;
//   if (markerClusterer) {
//     markerClusterer.clearMarkers();
//   }
//   markerClusterer = new MarkerClusterer(map, markers, {
//     imagePath: "assets/img/m"
//   });
//   markerClusterer.setGridSize(clust_num);
// }
// changed() {
//   heatmap.set("radius", heatmap_radius);
// }
// changeType() {
//   if (!dark_theme) {
//     map.setMapTypeId("dark_map");
//   } else {
//     map.setMapTypeId("roadmap");
//   }
//   dark_theme = !dark_theme;
// }
