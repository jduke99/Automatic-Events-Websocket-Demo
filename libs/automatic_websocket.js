const debug = require('debug')('automatic-events-websocket-demo');
const nconf = require('nconf');

module.exports = (app) => {
  const automaticSocketURL = nconf.get('AUTOMATIC_WEBSOCKET_URL') + '?token=' + nconf.get('AUTOMATIC_CLIENT_ID') + ':' + nconf.get('AUTOMATIC_CLIENT_SECRET');
  const automaticSocket = require('socket.io-client')(automaticSocketURL);


  function sendEventToUser(data) {
    debug('Incoming Event: ' + JSON.stringify(data));

    const browserSocket = app.get('wss');
    if (browserSocket) {
      browserSocket.sendEvent(data);
    }
  }

  automaticSocket.on('connect', () => {
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
  automaticSocket.on('vehicle:setup', sendEventToUser);
  automaticSocket.on('vehicle:status_report', sendEventToUser);

  automaticSocket.on('error', (data) => {
    console.error('Automatic Websocket Error:', data);
    console.error(data.stack);
  });

  automaticSocket.on('reconnecting', (attemptNumber) => {
    debug('Automatic Websocket Reconnecting! - attempt ' + attemptNumber);
  });

  automaticSocket.on('reconnect_error', (error) => {
    debug('Automatic Websocket Reconnection error!\n', error);
  });

  automaticSocket.on('reconnect', (attemptNumber) => {
    debug('Automatic Websocket Reconnected on attempt ' + attemptNumber);
  });

  automaticSocket.on('disconnect', () => {
    debug('Automatic Websocket Disconnected');
  });
};
