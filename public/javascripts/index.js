// Setup mapbox
L.mapbox.accessToken = mapboxAccessToken;

var map = L.mapbox.map('map', 'automatic.h5kpm228', {maxZoom: 16}).setView([37.9, -122.5], 10);
var geocoder = L.mapbox.geocoder('mapbox.places');
var markers = [];
var previousMarker;
var bounds;
var markerLayer = L.mapbox.featureLayer().addTo(map);
var icon = L.mapbox.marker.icon({
  'marker-size': 'small',
  'marker-color': '#38BE43',
  'marker-symbol': 'circle'
});
var iconLatest = L.mapbox.marker.icon({
  'marker-size': 'small',
  'marker-color': '#E74A4A',
  'marker-symbol': 'circle'
});
var updateCount = 0;


/* Web socket connection */
var ws = new WebSocket((window.document.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.document.location.host);
ws.onopen = function() {
  updateAlert('Connected', 'Waiting for events');
};

ws.onclose = function(event) {
  updateAlert('Disonnected', event.reason);
};

ws.onmessage = function(msg) {
  var data = JSON.parse(msg.data);
  var date = new Date(parseInt(data.created_at));
  var description = [];
  var title = 'Location Updated';

  console.log(data);

  if(data.msg !== 'Socket Opened') {
    hideAlert();
  }
  
  description.push('Date: <b>' + moment(date).format('MMM D, YYYY') + '</b>');
  description.push('Time: <b>' + moment(date).format('h:mm a') + '</b>');

  if (data.location) {
    if(data.location.accuracy_m) {
      description.push('Accuracy: <b>' + data.location.accuracy_m.toFixed(0) + 'm</b>');
    }

    var marker = addMarker(data.location.lat, data.location.lon, title);

    updateStats();

    geocoder.reverseQuery([parseFloat(data.location.lon), parseFloat(data.location.lat)], function(e, response) {
      if(e) {
        console.error(e);
      }

      var location = buildLocation(response);

      if(location) {
        description.push('Location: <b>' + location + '</b>');
      }

      marker.bindPopup(description.join('<br>'), {className: 'driveEvent-popup'});
      marker.openPopup();
    });
  }
};


setInterval(function() {
  ws.send('ping');
}, 15000);


function addMarker(lat, lon, title) {
  var point = L.latLng(lat, lon);
  var marker = L.marker(point, {
    title: title,
    icon: iconLatest
  });

  marker.addTo(markerLayer);

  //change previous marker to standard Icon
  if(previousMarker) {
    previousMarker.setIcon(icon);
    drawLine(previousMarker, marker);
  }
  markers.push(marker);

  previousMarker = marker;

  if(bounds) {
    bounds.extend(point);
  } else {
    bounds = L.latLngBounds(point, point);
  }

  map.panTo(point);
  map.fitBounds(bounds);

  return marker;
}


function drawLine(marker1, marker2) {
  var lineStyle = {
    color: '#5DBEF5',
    opacity: 1,
    weight: 4
  };
  L.polyline([marker1.getLatLng(), marker2.getLatLng()], lineStyle).addTo(map);
}


function updateAlert(title, message) {
  $('#alert')
    .html('<b>' + title + '</b>: ' + message)
    .fadeIn()
    .addClass('alert alert-info');
}


function hideAlert() {
  $('#alert').fadeOut();
}


function updateStats() {
  updateCount += 1;
  $('.update-count').text(updateCount);
}


function buildLocation(response) {
  try {
    return response.features[0].place_name;
  } catch(e) {
    return '';
  }
}
