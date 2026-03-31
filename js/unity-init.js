(function () {
  var loadingOverlay = document.getElementById("unity-loading");
  var progressFill = document.getElementById("unity-progress-fill");
  var canvas = document.getElementById("unity-canvas");

  if (!loadingOverlay || !progressFill || !canvas || typeof createUnityInstance !== "function") {
    return;
  }

  createUnityInstance(canvas, {
    arguments: [],
    dataUrl: "unity-build/Build/unity-build.data",
    frameworkUrl: "unity-build/Build/unity-build.framework.js",
    codeUrl: "unity-build/Build/unity-build.wasm",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "DefaultCompany",
    productName: "Overmath_FJ2026",
    productVersion: "1.0"
  }, function (progress) {
    progressFill.style.width = (progress * 100) + "%";
  }).then(function (unityInstance) {
    loadingOverlay.style.display = "none";
    window.unityInstance = unityInstance;
  }).catch(function (message) {
    loadingOverlay.innerHTML = "<p>Error al cargar el juego.</p>";
    console.error("Unity error:", message);
  });
})();
