var myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 13
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

var baseURL = "https://data.sfgov.org/resource/wr8u-xric.json?";
var date = "$where=incident_date between'2016-01-10T12:00:00' and '2017-01-01T14:00:00'";
var limit = "&$limit=5000";

var url = baseURL + date + limit;

// Grab the data with d3
d3.json(url, function(response) {

  console.log(response);

  // Create a new marker cluster group
  var markers = L.markerClusterGroup();

  // Loop through data
  for (var i = 0; i < response.length; i++) {

    // Set the data location property to a variable
    var location = response[i].location;

    // Check for location property
    if (location) {

      // Add a new marker to the cluster group and bind a pop-up
      markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
        .bindPopup("Address:"+ ""+ response[i].address+""+ 'situation:'+"" + response[i].primary_situation));
    }

  }

  // Add our marker cluster layer to the map
  myMap.addLayer(markers);

});
