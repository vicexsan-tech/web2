// ===============================
// CONFIGURACIÓN INICIAL
// ===============================

// Centro y zoom inicial
const homeLonLat = [-2.00, 40.8000];
const homeZoom = 10;

// Vista del mapa
const view = new ol.View({
    center: ol.proj.fromLonLat(homeLonLat),
    zoom: homeZoom
});

// ===============================
// BASEMAPS
// ===============================

// OSM
const osmLayer = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: false
});

// CARTO Light Gray
const lightGrayLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        attributions: '© OpenStreetMap © CARTO'
    }),
    visible: true
});

// CARTO Dark Gray
const darkGrayLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attributions: '© OpenStreetMap © CARTO'
    }),
    visible: false
});

// ===============================
// MAPA
// ===============================

const map = new ol.Map({
    target: 'map',
    layers: [
        osmLayer,
        lightGrayLayer,
        darkGrayLayer
    ],
    view: view
});

// ===============================
// CAPAS WMS (MESES)
// ===============================

const wmsUrl = 'https://geovisualizacion3d.com/geoserver/geovis03/wms';

const puntosWms = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'https://geovisualizacion3d.com/geoserver/geovis03/wms',
        params: { LAYERS: 'geovis03:puntos' }
    }),
    visible: true   // 👈 Esto la enciende por defecto
});

const comarcaWms = new ol.layer.Tile({
  visible: true,
  source: new ol.source.TileWMS({
    url: 'https://geovisualizacion3d.com/geoserver/geovis03/wms',  // ← CAMBIA ESTO
    params: {
      'LAYERS': 'geovis03:comarca',  // ← CAMBIA ESTO
      'TILED': true,
      'VERSION': '1.1.1',
      'FORMAT': 'image/png',
      'TRANSPARENT': true
    },
    serverType: 'geoserver'
  })
});

const capa1 = new ol.layer.Tile({ visible: true,  source: new ol.source.TileWMS({ url: wmsUrl, params: { LAYERS: 'geovis03:abril', FORMAT: 'image/png', TRANSPARENT: true } }) });
const capa2 = new ol.layer.Tile({ visible: false, source: new ol.source.TileWMS({ url: wmsUrl, params: { LAYERS: 'geovis03:mayo', FORMAT: 'image/png', TRANSPARENT: true } }) });
const capa3 = new ol.layer.Tile({ visible: false, source: new ol.source.TileWMS({ url: wmsUrl, params: { LAYERS: 'geovis03:junio', FORMAT: 'image/png', TRANSPARENT: true } }) });
const capa4 = new ol.layer.Tile({ visible: false, source: new ol.source.TileWMS({ url: wmsUrl, params: { LAYERS: 'geovis03:julio', FORMAT: 'image/png', TRANSPARENT: true } }) });
const capa5 = new ol.layer.Tile({ visible: false, source: new ol.source.TileWMS({ url: wmsUrl, params: { LAYERS: 'geovis03:agosto', FORMAT: 'image/png', TRANSPARENT: true } }) });
const capa6 = new ol.layer.Tile({ visible: false, source: new ol.source.TileWMS({ url: wmsUrl, params: { LAYERS: 'geovis03:septiembre', FORMAT: 'image/png', TRANSPARENT: true } }) });
const capa7 = new ol.layer.Tile({ visible: false, source: new ol.source.TileWMS({ url: wmsUrl, params: { LAYERS: 'geovis03:octubre', FORMAT: 'image/png', TRANSPARENT: true } }) });

// Añadir capas al mapa
map.addLayer(capa1);
map.addLayer(capa2);
map.addLayer(capa3);
map.addLayer(capa4);
map.addLayer(capa5);
map.addLayer(capa6);
map.addLayer(capa7);
map.addLayer(comarcaWms)
map.addLayer(puntosWms);

// ===============================
// FUNCIONES
// ===============================

// Leyenda
function updateLegend(layerName) {
    const legendUrl = 
        `https://geovisualizacion3d.com/geoserver/geovis03/wms?REQUEST=GetLegendGraphic&FORMAT=image/png&LAYER=${layerName}`;

    $('#legend').attr('src', legendUrl);
}

// Cambiar basemap
function changeBasemap(type) {
    osmLayer.setVisible(false);
    lightGrayLayer.setVisible(false);
    darkGrayLayer.setVisible(false);

    if (type === 'osm') osmLayer.setVisible(true);
    if (type === 'light') lightGrayLayer.setVisible(true);
    if (type === 'dark') darkGrayLayer.setVisible(true);

    console.log("Basemap cambiado a:", type);
}

// ===============================
// EVENTOS UI
// ===============================

// Selector de basemap
$('#basemap-select').on('change', function () {
    changeBasemap($(this).val());
});

// Selector de mes
$('#tema-select').on('change', function () {
    const value = $(this).val();

    capa1.setVisible(value === 'capa1');
    capa2.setVisible(value === 'capa2');
    capa3.setVisible(value === 'capa3');
    capa4.setVisible(value === 'capa4');
    capa5.setVisible(value === 'capa5');
    capa6.setVisible(value === 'capa6');
    capa7.setVisible(value === 'capa7');

  // Actualizar leyenda según la capa seleccionada
  const layerMap = {
    capa1: 'geovis03:abril',
    capa2: 'geovis03:mayo',
    capa3: 'geovis03:junio',
    capa4: 'geovis03:julio',
    capa5: 'geovis03:agosto',
    capa6: 'geovis03:septiembre',
    capa7: 'geovis03:octubre'
  };

  updateLegend(layerMap[value]);
});

$('#toggle-comarca').on('click', function () {
  const isActive = $(this).is(':checked');
  comarcaWms.setVisible(isActive);
});

// ===============================
// EVENTOS DEL MAPA
// ===============================

map.on('singleclick', function (evt) {
    const coord3857 = evt.coordinate;
    const coord4326 = ol.proj.toLonLat(coord3857);

    $('#info').html(
        `<b>Coordenadas</b><br>` +
        `EPSG:3857: ${coord3857.map(v => v.toFixed(2)).join(', ')}<br>` +
        `EPSG:4326: ${coord4326.map(v => v.toFixed(6)).join(', ')}`
    );
});

updateLegend('geovis03:abril');