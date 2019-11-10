const divInstall = document.getElementById("installContainer");
const butInstall = document.getElementById("butInstall");

window.addEventListener("beforeinstallprompt", event => {
  console.log("ok", "beforeinstallprompt", event);
  window.deferredPrompt = event;
  divInstall.classList.toggle("hidden", false);
});

butInstall.addEventListener("click", () => {
  console.log("ok", "butInstall-clicked");
  const promptEvent = window.deferredPrompt;
  if (!promptEvent) {
    return;
  }
  promptEvent.prompt();
  promptEvent.userChoice.then(result => {
    console.log("ok", "userChoice", result);
    divInstall.classList.toggle("hidden", true);

    window.deferredPrompt = null;
  });
});

window.addEventListener("appinstalled", event => {
  console.log("ok", "appinstalled", event);
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/explorer/service-worker.js", {
    scope: "/explorer/"
  });
}

if (window.location.protocol === "http:") {
  const requireHTTPS = document.getElementById("requireHTTPS");
  const link = requireHTTPS.querySelector("a");
  link.href = window.location.href.replace("http://", "https://");
  requireHTTPS.classList.remove("hidden");
}
