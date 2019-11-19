export function loadMapScript(libraries: string, c: Function): void {
  if (!document.getElementById("gmap")) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDuMnM4W0JCUyNydC9n3Y_NuXSOdJG4np4";
    if (libraries && libraries.length > 0) {
      script.src = script.src + "&libraries=" + libraries;
    }
    script.id = "gmap";
    script.addEventListener(
      "load",
      e => {
        c(e);
      },
      false
    );
    document.body.appendChild(script);
  }
}
