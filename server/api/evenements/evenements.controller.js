'use strict';
var utils = require('./../../utils/drive-utils.js');


var _ = require('lodash');

// Get list of evenementss
exports.index = function(req, res) {
  res.header('Content-Type', 'application/json; charset=utf-8')
  if(req.params.id){
    var evenements = utils.renderGData('evenements', 'gContent'),
        evenement;

    if(!evenements){
      res.json({});
    }

    evenements.some(function(evenement){
      if(evenement.slug === req.params.id){
        if(evenement.page_visible)
          return res.json(evenement);
        else res.json({});
      }
    });
  }else{
    var evenements = utils.renderGData('evenements', 'gContent');

    evenements = evenements.filter(function(evenement){
      return evenement.index_visible == "oui";
    })
    if(evenements){
      res.json(evenements);
    }else res.json([]);
  }
};
