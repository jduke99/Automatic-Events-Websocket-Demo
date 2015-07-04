var debug = require('debug')('automatic-streaming-demo');
var nconf = require('nconf');

module.exports = function(app) {

  var automaticSocketURL = 'https://stream.automatic.com?token=' + nconf.get('AUTOMATIC_CLIENT_ID') + ':' + nconf.get('AUTOMATIC_CLIENT_SECRET');
  var automaticSocket = require('socket.io-client')(automaticSocketURL);

  automaticSocket.on('connect', function(){
    debug('Automatic Websocket Connected');
  });

  automaticSocket.on('location:updated', function(data) {
    debug('Incoming Location: ' + JSON.stringify(data));

    var browserSocket = app.get('wss');
    if(browserSocket) {
      browserSocket.sendEvent(data);
    }
  });

  automaticSocket.on('error', function(data){
    debug('Automatic Websocket Error:', data);
  });

  automaticSocket.on('reconnecting', function(attemptNumber) {
    debug('Automatic Websocket Reconnecting! - attempt ' + attemptNumber);
  });

  automaticSocket.on('reconnect_error', function (error) {
    debug('Automatic Websocket Reconnection error!\n', error);
  });

  automaticSocket.on('reconnect', function (attemptNumber) {
    debug('Automatic Websocket Reconnected on attempt ' + attemptNumber);
  });

  automaticSocket.on('disconnect', function(){
    debug('Automatic Websocket Disconnected');
  });
};
