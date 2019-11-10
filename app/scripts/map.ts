import {} from "google-maps";

export function FunWithMaps(map: google.maps.Map) {
  const corinth = { lat: 38, lng: 23 };
  const marker = new google.maps.Marker({ position: corinth, map: map });
}
