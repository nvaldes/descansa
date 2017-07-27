'use strict';

module.exports.hello = (event, context, callback) => {
  var request = require('request');
  var headerNames = Object.keys(event.headers).filter(e => { return ['Host', 'X-DESCANSA-DEST'].indexOf(e) === -1 });
  var options = {
    url: event.headers['X-DESCANSA-DEST'],
    method: event.httpMethod,
    headers: {},
    gzip: true,
    body: event.body
  }
  for (var i = 0; i < headerNames.length; i++) {
    options.headers[headerNames[i]] = event.headers[headerNames[i]];
  }
  request(options, (error, response, body) => {
    var tmpHeaders = JSON.parse(JSON.stringify(response.headers));
    delete tmpHeaders['content-encoding'];
    callback(null, {
      statusCode: response.statusCode,
      headers: tmpHeaders,
      body: body
    });
  });
};
