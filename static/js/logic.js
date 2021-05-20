// BACKGROUND TILES //

// grayscale background
var graymap_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  accessToken: API_KEY
});

// satellite background
var satellitemap_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  accessToken: API_KEY
});

// outdoors background
var outdoors_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  accessToken: API_KEY
});

// create map object with background options
var map = L.map("mapid", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [graymap_background, satellitemap_background, outdoors_background]
});


// MAP LAYERS //

// tectonic plate data layer
var tectonicplates = new L.LayerGroup();
// earthquake data layer
var earthquakes = new L.LayerGroup();

// base layers
var baseMaps = {
  Satellite: satellitemap_background,
  Grayscale: graymap_background,
  Outdoors: outdoors_background
};

// overlays 
var overlayMaps = {
  "Tectonic Plates": tectonicplates,
  "Earthquakes": earthquakes
};


// LAYER CONTROL //
