'use strict';

var _ = require('lodash');
var utils = require('./../../utils/drive-utils.js');

// Get list of a-proposs
exports.index = function(req, res) {
  res.header('Content-Type', 'application/json; charset=utf-8');
  var content = utils.renderGData('a-propos', 'gContent');
  if(content){
      res.json(content);
    }else res.json([]);
};
