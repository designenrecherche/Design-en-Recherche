'use strict';

var _ = require('lodash');
var utils = require('./../../utils/drive-utils.js');

exports.index = function(req, res) {
  res.header('Content-Type', 'application/json; charset=utf-8');
  console.log('reload asked');
  utils.refreshData();
  res.redirect('/');
};
