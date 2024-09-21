import './css/style.css'
import javascriptLogo from '../javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from '../counter.js'
import L from "leaflet";

import 'leaflet/dist/leaflet.css';


// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))

fetch('src/templates/searchbar.html')
.then(response => response.text())
.then(html => {
  document.getElementById('searchbar-container').innerHTML = html;
});


// var map = L.map('map').setView([51.505, -0.09], 13);
// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   maxZoom: 19,
//   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);



var map = L.map('map').setView([57.74, 11.94], 12)
var titleLayer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: 'OSM'}).addTo(map)


// var markerUno = L.marker([57.74, 11.94]).addTo(map);
// var markerSecundo = L.marker([57.6792, 11.949]).addTo(map);

// var map = L.map('map');

// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

// L.Routing.control({
//     waypoints: [
//         L.latLng(57.74, 11.94),
//         L.latLng(57.6792, 11.949)
//     ]
// }).addTo(map);

L.Routing.control({
  waypoints: [
    L.latLng(57.74, 11.94),
    L.latLng(57.6792, 11.949)
  ],
  router: L.Routing.graphHopper('5c7b3326-2063-4eb4-812a-210a4e756630	')
});
