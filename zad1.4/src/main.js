import * as L from 'leaflet'
import 'leaflet-control-geocoder'
import 'leaflet/dist/leaflet.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './style.css'

const map = L.map('map').setView([54.462248, 17.037182], 13)
const geocoder = L.Control.Geocoder.nominatim()
let marker = null

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map)

map.on('dblclick', function(e) {
    const coords = e.latlng
    let name
    if (marker) {
        marker.setLatLng(coords)
    } else {
        marker = L.marker(coords, { draggable: true }).addTo(map)
        marker.bindPopup('<b>Szczegóły</b>').openPopup()
    }

    geocoder.reverse(e.latlng, map.options.crs.scale(map.getZoom()), results => {
        const r = results[0]
        if (r) {
          document.getElementById('name').value = r?.name
          marker.setLatLng(r.center).setPopupContent(r.html || r.name).openPopup()
      }      
    })

    document.getElementById('coordinates').value = `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`
    document.getElementById('form-container').style.display = 'block'

    marker.on('dragend', function() {
        const position = marker.getLatLng()
        document.getElementById('coordinates').value = `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`
    })
})
