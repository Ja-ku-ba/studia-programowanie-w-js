import * as L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-control-geocoder"

import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.css'

const map = L.map('map', {
  center: L.latLng(54.4606742084513, 17.018881330891684),
  zoom: 10,
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.Routing.control({
  waypoints: [
    // L.latLng(54.4606742084513, 17.018881330891684),
    // L.latLng(54.5706742084513, 17.118881330891684)
  ],
  routeWhileDragging: true,
  geocoder: L.Control.Geocoder.nominatim()
}).addTo(map);

