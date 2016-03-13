/**
 * Main application file
 */

'use strict';

var driveUtils = require('./utils/drive-utils.js')

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});


// console.log('refresh rate', driveUtils.getDriveRefreshRate());
setTimeout(function(){
  driveUtils.refreshData();
  setInterval(driveUtils.refreshData, driveUtils.getDriveRefreshRate());
}, 500);


// Expose app
exports = module.exports = app;
