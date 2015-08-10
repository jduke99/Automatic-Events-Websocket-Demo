function kmphToMPH(kmph) {
  return kmph * 0.621371;
}


function kmplToMPG(kmpl) {
  return kmpl * 2.353;
}


function metersToMiles(distance_m) {
  return distance_m / 1609.34;
}


function formatDuration(s) {
  var duration = moment.duration(s, 'seconds'),
      hours = (duration.asHours() >= 1) ? Math.floor(duration.asHours()) + ' h ' : '',
      minutes = duration.minutes() + ' min';
  return hours + minutes;
}
