export function directionCalculator(map: google.maps.Map) {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  const autocomplete_input_origin: HTMLInputElement = document.getElementById(
    "origin"
  ) as HTMLInputElement;
  const autocomplete_input_destination: HTMLInputElement = document.getElementById(
    "destination"
  ) as HTMLInputElement;
  const onChangeHandler = () => {
    calculateAndDisplayRoute(
      directionsService,
      directionsRenderer,
      autocomplete_input_origin,
      autocomplete_input_destination
    );
  };

  const autocomplete_origin = new google.maps.places.Autocomplete(
    autocomplete_input_origin
  );
  const autocomplete_destination = new google.maps.places.Autocomplete(
    autocomplete_input_destination
  );

  autocomplete_origin.setFields([
    "address_components",
    "geometry",
    "icon",
    "name"
  ]);
  autocomplete_destination.setFields([
    "address_components",
    "geometry",
    "icon",
    "name"
  ]);

  autocomplete_origin.addListener("place_changed", () => {
    const place = autocomplete_origin.getPlace();
    onChangeHandler();
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }
  });

  autocomplete_destination.addListener("place_changed", () => {
    const place = autocomplete_destination.getPlace();
    onChangeHandler();
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }
  });
}

function calculateAndDisplayRoute(
  directionsService: any,
  directionsRenderer: google.maps.DirectionsRenderer,
  origin: HTMLInputElement,
  destination: HTMLInputElement
) {
  if (
    origin.value &&
    origin.value.length > 0 &&
    destination.value &&
    destination.value.length > 0
  ) {
    directionsService.route(
      {
        origin: { query: origin.value },
        destination: { query: destination.value },
        travelMode: "DRIVING"
      },
      (response: any, status: any) => {
        console.log(response, status);
        if (status === "OK") {
          directionsRenderer.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }
}
