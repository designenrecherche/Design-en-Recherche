'use strict';

var _ = require('lodash');
var utils = require('./../../utils/drive-utils.js');

exports.index = function(req, res) {
  console.log('reload asked');
  utils.refreshData();
  res.redirect('/');
};
