'use strict';

var _ = require('lodash');
var utils = require('./../../utils/drive-utils.js');
// Get list of reseauxs
exports.index = function(req, res) {
  var reseaux = utils.renderGData('reseaux', 'gContent');
  if(reseaux){
    res.json(reseaux);
  }else res.json([]);
};
