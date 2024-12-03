
map = new mapboxgl.Map({
  container: "map",
  accessToken: "pk.eyJ1IjoidGFwaWFtY2NsdW5nIiwiYSI6IlF0THU1RkEifQ.xxCppBzG7fR7cTITWLMM2A",
  //accessToken: "pk.eyJ1IjoiZGV2ZWxvcGdlbyIsImEiOiJja2dwcXFic20wYnJnMzBrbG11d3dwYTkyIn0.4WwFOH6C7hDQXV9obU6mAw",
  style: "mapbox://styles/mapbox/light-v10", // initial light style
  center: [-102.00, 19.53], // meseta
  zoom: 10,
  minZoom: 8,
  maxZoom: 17,
  pitch: 64
});

map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }));
// cargar geojsons
const addSource =async layer =>{
const rawData = await fetch(`/data/${layer}.geojson`);
const data = await rawData.json();

map.addSource(layer, {
"type": "geojson",
"data": data
});
}

map.on("style.load", async () => {
//map.loadImage('https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Maki-fire-station-15.svg/15px-Maki-fire-station-15.svg.png', (error, image) => {
map.loadImage('https://upload.wikimedia.org/wikipedia/commons/7/7b/Farm-Fresh_tree_white.png', (error, image) => {
if (error) throw error;
map.addImage('tree-icon', image, { 'sdf': true });
});

map.setFog({
"range": [1, 10],
"color": "black",
"horizon-blend": 0.1
});

map.addSource("mapbox-dem", {
"type": "raster-dem",
"url": "mapbox://mapbox.mapbox-terrain-dem-v1",
"tileSize": 512,
"maxzoom": 16
});
map.setTerrain({
"source": "mapbox-dem",
"exaggeration": ["interpolate", ["linear"],
    ["zoom"],
    10, 0.0,
    12, 1.5]
});

await addSource("cverde");
await addSource("mun_mich22");
await addSource("mun_cv");

map.addLayer({
"id": "cverde",
"source": "cverde",
"type": "symbol",
"layout": {
    "visibility": "visible",
    "icon-image": "tree-icon"
 },
"paint": {
    "icon-color": "#319f43",
    "icon-opacity": 0.90
}
});
map.addLayer({
"id": "mun_mich22",
"source": "mun_mich22",
"type": "line",
"paint": {
  "line-color": "#000000",//checar
  "line-width": 0.5//checar
}
});
map.addLayer({
"id": "mun_cv",
"source": "mun_cv",
"type": "fill",
"paint": {
  "fill-color": "#319f43",//checar
  "fill-opacity": 0.3//checar
}
});

let popup;

// pop-ups onclick
map.on('mouseenter', 'cverde', (e) => {
const Name = e.features[0].properties.Name;
const region = e.features[0].properties.region;

const popupContent = `<strong>Nombre:</strong> ${Name}<br><strong>Region:</strong> ${region}`;
popup = new mapboxgl.Popup({
closeButton: false, // No mostrar botón de cerrar
closeOnClick: false // Mantener el popup mientras el cursor está sobre la capa
})
  .setLngLat(e.lngLat)
  .setHTML(popupContent)
  .addTo(map);
   map.getCanvas().style.cursor = 'pointer'; // Cambiar cursor enter leave
});

map.on('mouseleave', 'cverde', () => {
if (popup) {
  popup.remove();
  popup = null; // Reiniciar la variable para evitar conflictos
}
    map.getCanvas().style.cursor = ''; // Restaurar cursor

});

//AHP();

});

// gráfica de barras
const barCtx = document.getElementById('barras').getContext('2d');
new Chart(barCtx, {
type: 'bar',
data: {
labels: ['2019','2020', '2021', '2022', '2023', '2024'],
datasets: [{
  label: 'Árboles totales plantados (miles)',
  data: [400,400,400,500,500,1200],
  backgroundColor: 'rgba(75, 192, 192, 1)',
  borderColor: 'rgba(75, 192, 192, 1)',
  borderWidth: 1
}]
},
options: {
responsive: true,
maintainAspectRatio: false
}
});

// gráfica de pastel
const pieCtx = document.getElementById('pastel').getContext('2d');
new Chart(pieCtx, {
type: 'pie',
data: {
labels: ['Viveros de gobiernos', 'Viveros privados', 'Viveros propios'],
datasets: [{
  label: 'Distribución de áreas reforestadas',
  data: [50, 30, 20],
  backgroundColor: [
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(255, 99, 132, 0.6)'
  ],
  borderColor: [
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(255, 99, 132, 1)'
  ],
  borderWidth: 1
}]
},
options: {
responsive: true,
maintainAspectRatio: false
}
});

// gráfica lineal
const lineCtx = document.getElementById('lineas').getContext('2d');
new Chart(lineCtx, {
type: 'line',
data: {
labels: ['may', 'jun', 'jul', 'ago', 'sep','oct', 'nov'],
datasets: [{
  label: 'Porcentaje de meta alcanzada (2 millones)',
  data: [0,5,10,20,30,40, 60],
  backgroundColor: 'rgba(153, 102, 255, 0.4)',
  borderColor: 'rgba(153, 102, 255, 1)',
  borderWidth: 1
}]
},
options: {
responsive: true,
maintainAspectRatio: false
}
});

// JavaScript para alternar las pestañas
const buttons = document.querySelectorAll('.tab-button');
const contents = document.querySelectorAll('.tab-content');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    // Desactivar todas las pestañas y contenido
    buttons.forEach(btn => btn.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));

    // Activar la pestaña seleccionada
    button.classList.add('active');
    const tabId = button.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
if (tabId === 'tab1') {
  setTimeout(() => map.resize(), 200); // Ajusta el tamaño del mapa
 }         
 
});
});