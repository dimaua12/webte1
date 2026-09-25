const SCHOOL = { name: "FEI STU", lat: 48.15251, lng: 17.07326 };
const HOME = { name: "Domov (ukážkový bod)", lat: 48.111, lng: 17.112 };

function haversineDistance(lat1, lng1, lat2, lng2) {
  const earthRadius = 6371;
  const latDifference = (lat2 - lat1) * Math.PI / 180;
  const lngDifference = (lng2 - lng1) * Math.PI / 180;
  const firstLatitude = lat1 * Math.PI / 180;
  const secondLatitude = lat2 * Math.PI / 180;

  const a = Math.sin(latDifference / 2) ** 2 +
    Math.cos(firstLatitude) * Math.cos(secondLatitude) *
    Math.sin(lngDifference / 2) ** 2;

  return 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const mapElement = document.getElementById("map");

if (mapElement) {
  const mapStatus = document.getElementById("map-status");
  const pointSelect = document.getElementById("point-select");
  const targetSelect = document.getElementById("target-select");

  if (typeof L === "undefined") {
    mapStatus.textContent = "Mapu sa nepodarilo načítať. Skontrolujte internetové pripojenie.";
  } else {
    let points = [];
    let line = null;
    const pointMarkers = [];

    try {
      const savedPoints = JSON.parse(localStorage.getItem("webteMapPoints") || "[]");
      if (Array.isArray(savedPoints)) {
        points = savedPoints.filter(function (point) {
          return point && typeof point.name === "string" &&
            Number.isFinite(point.lat) && Number.isFinite(point.lng);
        });
      }
    } catch (error) {
      mapStatus.textContent = "Uložené body sa nepodarilo načítať.";
    }

    const map = L.map("map").setView([48.133, 17.093], 12);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const schoolMarker = L.marker([SCHOOL.lat, SCHOOL.lng]).addTo(map).bindPopup("FEI STU, Ilkovičova 3");
    const homeMarker = L.marker([HOME.lat, HOME.lng]).addTo(map).bindPopup("Domov (ukážkový bod v Petržalke)");

    function addPointMarker(point, index) {
      const marker = L.marker([point.lat, point.lng]).addTo(map);
      const popup = document.createElement("span");
      popup.textContent = point.name;
      marker.bindPopup(popup);
      pointMarkers.push(marker);

      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = point.name;
      pointSelect.appendChild(option);
    }

    function updateDistance() {
      if (pointSelect.value === "") {
        mapStatus.textContent = "Zatiaľ nemáte pridané miesto. Kliknite na mapu a pomenujte ho.";
        return;
      }

      const index = Number(pointSelect.value);
      const point = points[index];
      const target = targetSelect.value === "home" ? HOME : SCHOOL;
      const targetMarker = targetSelect.value === "home" ? homeMarker : schoolMarker;
      const distance = haversineDistance(point.lat, point.lng, target.lat, target.lng);
      const distanceText = distance.toFixed(2).replace(".", ",") + " km";

      if (line) {
        map.removeLayer(line);
      }
      line = L.polyline([[point.lat, point.lng], [target.lat, target.lng]]).addTo(map);
      map.fitBounds(line.getBounds(), { padding: [40, 40] });

      const pointPopup = document.createElement("span");
      pointPopup.textContent = point.name + " – " + distanceText + " od cieľa";
      pointMarkers[index].bindPopup(pointPopup).openPopup();
      schoolMarker.bindPopup("FEI STU, Ilkovičova 3");
      homeMarker.bindPopup("Domov (ukážkový bod v Petržalke)");
      const targetPopup = document.createElement("span");
      targetPopup.textContent = target.name + " – " + distanceText + " od bodu " + point.name;
      targetMarker.bindPopup(targetPopup);
      mapStatus.textContent = "Vzdialenosť " + point.name + " – " + target.name + ": " + distanceText + " vzdušnou čiarou.";
    }

    points.forEach(function (point, index) {
      addPointMarker(point, index);
    });

    if (points.length > 0) {
      pointSelect.value = "0";
      updateDistance();
    }

    map.on("click", function (event) {
      const answer = prompt("Ako sa volá toto miesto?");
      if (!answer || !answer.trim()) {
        return;
      }

      const point = { name: answer.trim(), lat: event.latlng.lat, lng: event.latlng.lng };
      points.push(point);

      let saved = true;
      try {
        localStorage.setItem("webteMapPoints", JSON.stringify(points));
      } catch (error) {
        saved = false;
      }

      addPointMarker(point, points.length - 1);
      pointSelect.value = String(points.length - 1);
      updateDistance();
      if (!saved) {
        mapStatus.textContent += " Bod sa nepodarilo uložiť do prehliadača.";
      }
    });

    pointSelect.addEventListener("change", updateDistance);
    targetSelect.addEventListener("change", updateDistance);
  }
}
