// Store our API endpoint as queryUrl.
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"

// Perform get request to query URL
d3.json(queryUrl).then(function(data) {
    console.log(data)
    console.log(Math.max.apply(Math, data.features.map(function(o) {
      return o.geometry.coordinates[2];
    })))
    console.log(Math.min.apply(Math, data.features.map(function(o) {
      return o.geometry.coordinates[2];
    })))
    createFeatures(data)
});

function createFeatures(earthquakeData) {
    // Define a function that we want to run once for each feature in the array
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.title}. Depth: ${feature.geometry.coordinates[2]} km.</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
    //Run onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {
              radius: Math.pow(feature.properties.mag,2),//4*Math.sqrt(feature.properties.mag),
              color: colorOps(feature)
            });
          },
        onEachFeature: onEachFeature
    });

    //Send earthquakes layer to createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Create the base layer.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    // Create a baseMaps object.
    var baseMap = {
       "Street Map": street
    };
  
    // Create an overlay object to hold our overlay.
    var overlayMap = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [street,earthquakes]
    });
  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMap, overlayMap, {
      collapsed: false
    }).addTo(myMap);

    // Legend function variable.
var legend = L.control({ position: "bottomright" });

legend.onAdd = function(myMap) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Earthquake Depth (km)</h4>";
  div.innerHTML += '<i style="background: #00ccff"></i><span>≤50</span><br>';
  div.innerHTML += '<i style="background: #0099ff"></i><span>≤100</span><br>';
  div.innerHTML += '<i style="background: #0066ff"></i><span>≤150</span><br>';
  div.innerHTML += '<i style="background: #0066cc"></i><span>≤200</span><br>';
  div.innerHTML += '<i style="background: #0033cc"></i><span>≤250</span><br>';
  div.innerHTML += '<i style="background: #003399"></i><span>≤300</span><br>';
  div.innerHTML += '<i style="background: #000099"></i><span>≤350</span><br>';
  div.innerHTML += '<i style="background: #003366"></i><span>≤400</span><br>';
  div.innerHTML += '<i style="background: #003333"></i><span>≤500</span><br>';
  div.innerHTML += '<i style="background: #000000"></i><span>>500</span><br>';
  return div;
};
legend.addTo(myMap);
  
}

//Function to return relevant color depending on relative depth of earthquake.
function colorOps(feat) {
  if (feat.geometry.coordinates[2] < 50) {
    return "#00ccff"
  }
  else if (feat.geometry.coordinates[2] < 100) {
    return "#0099ff"
  }
  else if (feat.geometry.coordinates[2] < 150) {
    return "#0066ff"
  }
  else if (feat.geometry.coordinates[2] < 200) {
    return "#0066cc"
  }
  else if (feat.geometry.coordinates[2] < 250) {
    return "#0033cc"
  }
  else if (feat.geometry.coordinates[2] < 300) {
    return "#003399"
  }
  else if (feat.geometry.coordinates[2] < 350) {
    return "#000099"
  }
  else if (feat.geometry.coordinates[2] < 400) {
    return "#003366"
  }else if (feat.geometry.coordinates[2] < 500) {
    return "#003333"
  }
  else {
    return "#000000"
  }
}

