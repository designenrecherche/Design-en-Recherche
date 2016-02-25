var walk    = require('walk');
var fs      = require('fs');
var async = require('async');
var path = require('path');var factory = {};

var resourcesDir = 'public/resources/';


// I browse into a folder and return a list of its related file paths
var listFiles = function(dir, callback){
  //walk into files
  var walker  = walk.walk(dir, { followLinks: false }), files=[];
  walker.on('file', function(root, stat, next) {
      // Add this file to the list of files
      files.push(root + '/' + stat.name);
      next();
  });

  //when every file has been processed, return callback function
  walker.on('end', function() {
      callback(files);
  });
};


factory.listResources = function(slug, callback){
  listFiles(resourcesDir + slug, function(files){
    var notOk = !files || !files.length;
    var output = {
        images : []
      };
    if(notOk){
      callback('not found', output);
    }else{

      files.forEach(function(file){
        var parts = file.split('.');
        if(parts.length > 1){
          var ext = parts[parts.length - 1];
          file = file.split('/');
          file.shift();
          file = encodeURIComponent(file.join('/'));
          if(ext === 'jpg' || ext === 'png' || ext === 'jpeg'){
            output.images.push(file);
          }
        }
      });
      callback(undefined, output);
    }
  });
}

module.exports = factory;
