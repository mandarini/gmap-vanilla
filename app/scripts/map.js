var map;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 38, lng: 24 },
    zoom: 11
  });
}
