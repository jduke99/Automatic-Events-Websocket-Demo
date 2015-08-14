var debug = require('debug')('automatic-events-websocket-demo');
var nconf = require('nconf');

module.exports = function (app) {

  var automaticSocketURL = nconf.get('AUTOMATIC_WEBSOCKET_URL') + '?token=' + nconf.get('AUTOMATIC_CLIENT_ID') + ':' + nconf.get('AUTOMATIC_CLIENT_SECRET');
  var automaticSocket = require('socket.io-client')(automaticSocketURL);


  function sendEventToUser(data) {
    debug('Incoming Event: ' + JSON.stringify(data));

    var browserSocket = app.get('wss');
    if (browserSocket) {
      browserSocket.sendEvent(data);
    }
  }

  automaticSocket.on('connect', function () {
    debug('Automatic Websocket Connected', nconf.get('AUTOMATIC_WEBSOCKET_URL'));
  });

  automaticSocket.on('trip:finished', sendEventToUser);
  automaticSocket.on('ignition:on', sendEventToUser);
  automaticSocket.on('ignition:off', sendEventToUser);
  automaticSocket.on('notification:speeding', sendEventToUser);
  automaticSocket.on('notification:hard_brake', sendEventToUser);
  automaticSocket.on('notification:hard_accel', sendEventToUser);
  automaticSocket.on('mil:on', sendEventToUser);
  automaticSocket.on('mil:off', sendEventToUser);
  automaticSocket.on('location:updated', sendEventToUser);

  automaticSocket.on('error', function (data) {
    console.error('Automatic Websocket Error:', data);
    console.error(data.stack);
  });

  automaticSocket.on('reconnecting', function (attemptNumber) {
    debug('Automatic Websocket Reconnecting! - attempt ' + attemptNumber);
  });

  automaticSocket.on('reconnect_error', function (error) {
    debug('Automatic Websocket Reconnection error!\n', error);
  });

  automaticSocket.on('reconnect', function (attemptNumber) {
    debug('Automatic Websocket Reconnected on attempt ' + attemptNumber);
  });

  automaticSocket.on('disconnect', function () {
    debug('Automatic Websocket Disconnected');
  });
};
