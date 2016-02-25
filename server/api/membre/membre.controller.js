'use strict';

var _ = require('lodash');
var utils = require('./../../utils/drive-utils.js');

// Get list of membres
exports.index = function(req, res) {
  res.header('Content-Type', 'application/json; charset=utf-8')
  if(req.params.id){
    var annuaire = utils.renderGData('annuaire', 'gContent'),
        membre;

    if(!annuaire){
      res.json({});
    }

    annuaire.some(function(membre){
      if(membre.identifiant === req.params.id){
        return res.json(membre);
      }
    });
  }else{
    var annuaire = utils.renderGData('annuaire', 'gContent');

    if(annuaire){
      res.json(annuaire);
    }else res.json([]);
  }
};
