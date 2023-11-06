// Create The Map
let map = L.map("map", { zoomControl: false }),
    marker,
    locationIcon = L.icon({
        iconUrl: "images/icon-location.svg",
        iconAnchor: [-3, 9],
        popupAnchor: [0, 0],
        tooltipAnchor: [0, 0],
    }),
    infoElement = document.querySelector(".search .info");

createMap();

let input = document.querySelector(".search form input");
let btn = document.querySelector(".search form button");

// Add Event Listener To THe Button
btn.addEventListener("click", (e) => {
    e.preventDefault();

    createMap(input.value);
});

// Start Functions
async function createMap(ip) {
    let location = { ip: ip };

    if (!location.ip) {
        let res = await fetch("https://api.ipify.org?format=json");

        location = await res.json();
    }

    let data = await fetch(
        "https://geo.ipify.org/api/v2/country,city?apiKey=at_chPuNnvpje0Em5YwBeo8qS8aGHPGg&ipAddress=" +
            location.ip
    );

    let info = await data.json();

    map.setView([info.location.lat, info.location.lng], 13);

    if (marker) map.removeLayer(marker);

    marker = L.marker([info.location.lat, info.location.lng], {
        icon: locationIcon,
    }).addTo(map);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        errorTileUrl: "",
    }).addTo(map);

    infoElement.children[0].children[1].textContent = info.ip;
    infoElement.children[1].children[1].textContent = info.location.region;
    infoElement.children[2].children[1].textContent =
        "UTS" + info.location.timezone;
    infoElement.children[3].children[1].textContent = info.isp;
}
