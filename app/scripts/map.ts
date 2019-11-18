/// <reference types="@types/markerclustererplus" />
import {} from "google-maps";
import * as styledMap from "./styledMap";

let london: google.maps.LatLng;
let infoWindow: google.maps.InfoWindow;
let markerClusterer: MarkerClusterer;
let heatmap: google.maps.visualization.HeatmapLayer;
let drawingManager: google.maps.drawing.DrawingManager;
let allOverlays: any[] = [];

let drawingLayer: google.maps.Data;

let otherGeoJson: any;

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
  drawingLayer = new google.maps.Data();

  listenForDrawing(map, drawingManager);
}

function coords(x: number, y: number) {
  return new google.maps.LatLng(x, y);
}

// @ViewChild("mapElement", { static: false }) mapElm: ElementRef;
// @ViewChild("legend", { static: false }) legend: ElementRef;
// @ViewChild("controls", { static: false }) controls: ElementRef;
// @ViewChild("drawingControls", { static: false }) drawingControls: ElementRef;
// @ViewChild("link", { static: false }) katlink: ElementRef;

//   drawingManager = new google.maps.drawing.DrawingManager({
//     drawingMode: null,
//     drawingControl: false // i have my custom tools so i don't need the defaults to be displayed
//   });
//   drawingManager.setMap(map);
//   drawingLayer = new google.maps.Data();
//   listenForDrawing(map, drawingManager);

//   // loadAllMarkers(map);
//   // loadGeoJson(map);
//   // loadHeatmapData();
//   // viewReady = true;
// }

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

// city(city: string) {
//   if (city === "lon") {
//     map.setCenter(coords(51.561638, -0.14));
//   }
//   if (city === "man") {
//     map.setCenter(coords(53.52476717517185, -2.5434842249308414));
//   }
// }

// changeType() {
//   if (!dark_theme) {
//     map.setMapTypeId("dark_map");
//   } else {
//     map.setMapTypeId("roadmap");
//   }
//   dark_theme = !dark_theme;
// }

function listenForDrawing(
  map: google.maps.Map,
  drawingManager: google.maps.drawing.DrawingManager
) {
  drawingManager.addListener("overlaycomplete", event => {
    allOverlays.push(event.overlay);
    event.overlay.addListener("rightclick", () => {
      event.overlay.setMap(null);
    });
    switch (event.type) {
      case "polygon":
        drawingLayer.add(
          new google.maps.Data.Feature({
            geometry: new google.maps.Data.Polygon([
              event.overlay.getPath().getArray()
            ])
          })
        );

        /**
         * We could do this, here:
         *
         * drawingLayer.setMap(map);
         *
         * The reason we are not doing this,
         * is because we want to keep the custom icons
         * showing. And if we add the data layer on the map,
         * it will use the default.
         */

        map.data.add(
          new google.maps.Data.Feature({
            geometry: new google.maps.Data.Polygon([
              event.overlay.getPath().getArray()
            ])
          })
        );
        break;
      case "rectangle":
        let bounds = event.overlay.getBounds();
        let points = [
          bounds.getSouthWest(),
          {
            lat: bounds.getSouthWest().lat(),
            lng: bounds.getNorthEast().lng()
          },
          bounds.getNorthEast(),
          {
            lng: bounds.getSouthWest().lng(),
            lat: bounds.getNorthEast().lat()
          }
        ];
        drawingLayer.add(
          new google.maps.Data.Feature({
            geometry: new google.maps.Data.Polygon([points])
          })
        );

        map.data.add(
          new google.maps.Data.Feature({
            geometry: new google.maps.Data.Polygon([points])
          })
        );
        break;
      case "polyline":
        drawingLayer.add(
          new google.maps.Data.Feature({
            geometry: new google.maps.Data.LineString(
              event.overlay.getPath().getArray()
            )
          })
        );

        map.data.add(
          new google.maps.Data.Feature({
            geometry: new google.maps.Data.LineString(
              event.overlay.getPath().getArray()
            )
          })
        );
        break;
      case "circle":
        drawingLayer.add(
          new google.maps.Data.Feature({
            properties: {
              radius: event.overlay.getRadius()
            },
            geometry: new google.maps.Data.Point(event.overlay.getCenter())
          })
        );

        map.data.add(
          new google.maps.Data.Feature({
            properties: {
              radius: event.overlay.getRadius()
            }
          })
        );
        break;
      case "marker":
        drawingLayer.add(
          new google.maps.Data.Feature({
            geometry: new google.maps.Data.Point(event.overlay.getPosition())
          })
        );
        break;
      default:
        console.log("end");
    }
  });
}

export function draw(type: string) {
  console.log("hey");
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

export function clearAll() {
  allOverlays.map(overlay => {
    overlay.setMap(null);
  });
  drawingLayer.setMap(null);
  drawingLayer = new google.maps.Data();
  allOverlays = [];
}
