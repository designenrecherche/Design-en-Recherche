/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var express = require('express');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/reload-data', require('./api/reload-data'));
  app.use('/api/reseaux', require('./api/reseaux'));
  app.use('/api/introduction', require('./api/introduction'));
  app.use('/api/search', require('./api/search'));
  app.use('/api/prochains-evenements', require('./api/prochains-evenements'));
  app.use('/api/a-propos', require('./api/a-propos'));
  app.use('/api/contact', require('./api/contact'));
  app.use('/api/evenements', require('./api/evenements'));
  app.use('/api/membres', require('./api/membre'));
  app.use('/api/prochains-evenements', require('./api/prochains-evenements'));

  app.use('/assets', express.static(path.join(__dirname, 'assets')));


  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
