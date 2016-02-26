'use strict';

var _ = require('lodash');
var utils = require('./../../utils/drive-utils.js');

// Get list of searchs
exports.index = function(req, res) {
  res.header('Content-Type', 'application/json; charset=utf-8')
  var query = req.query;
  var results = [];
  var q = query && query.q;
  if(q){
    results = utils.searchExpression(decodeURIComponent(q));
  }
  res.json({query:query,results:results});
};
