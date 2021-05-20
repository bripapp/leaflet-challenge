
// BACKGROUND TILES //

// grayscale background
// var graymap_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//   accessToken: API_KEY
// });
var graymap_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiYnJpcGFwcCIsImEiOiJja29zem1nYXQwMDhoMnltcXk1aHlpdHdzIn0.BA8uiuTQoE324Rq_bIWmHA");

// satellite background
// var satellitemap_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//   accessToken: API_KEY
// });
var satellitemap_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiYnJpcGFwcCIsImEiOiJja29zem1nYXQwMDhoMnltcXk1aHlpdHdzIn0.BA8uiuTQoE324Rq_bIWmHA");

// outdoors background
// var outdoors_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//   accessToken: API_KEY
// });
var outdoors_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiYnJpcGFwcCIsImEiOiJja29zem1nYXQwMDhoMnltcXk1aHlpdHdzIn0.BA8uiuTQoE324Rq_bIWmHA");

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

// layer control
L.control.layers(baseMaps, overlayMaps).addTo(map);


// RETRIEVE DATA //

// retrieve earthquake data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", function(data) {
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // retrive tectonic plate geoJSON data
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
  function(platedata) {

    L.geoJson(platedata, {
      color: "orange",
      weight: 2
    })
    .addTo(tectonicplates);

    // add the tectonicplates layer to the map.
    tectonicplates.addTo(map);
  });

  // use magnitude to define marker color
  function getColor(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "#ea2c2c";
      case magnitude > 4:
        return "#ea822c";
      case magnitude > 3:
        return "#ee9c00";
      case magnitude > 2:
        return "#eecc00";
      case magnitude > 1:
        return "#d4ee00";
      default:
        return "#98ee00";
    }
  }

  // use magnitude to determine radius of marker
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 3;
  }

  // add GeoJSON layer to map
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(earthquakes);
  earthquakes.addTo(map);

  // add color scale legend to map
  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var scale = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];

    for (var i = 0; i < scale.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
      scale[i] + (scale[i + 1] ? "&ndash;" + scale[i + 1] + "<br>" : "+");
    }
    return div;
  };
  legend.addTo(map);

});