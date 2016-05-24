function kmphToMPH(kmph) {
  return kmph * 0.621371;
}


function kmplToMPG(kmpl) {
  return kmpl * 2.353;
}


function metersToMiles(distance_m) {
  return distance_m / 1609.34;
}


function formatDuration(ms) {
  var duration = moment.duration(ms, 'ms');
  var hours = duration.asHours() >= 1 ? Math.floor(duration.asHours()) + ' h ' : '';
  var minutes = duration.minutes() + ' min';
  return hours + minutes;
}
