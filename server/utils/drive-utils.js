var express = require('express');
var utils = {};
var Tabletop = require('tabletop');
var gRoutes = require('./../config/drive_routes');
var gAssetsRoutes = require('./../config/drive_assets');
var gRefreshRate = require('./../config/drive_refresh_rate');
var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var Baobab = require('baobab');
// var zotero = require('./zotero');

var driveData, tree;


/*
UTILS
*/

vimeo_Reg = /https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;

function vimeoID(url) {
  var match = url.match(vimeo_Reg);

  if (match){
    return match[3];
  }else{
    return undefined;
  }
}

var replaceResource = function(type, value){
  if(type === 'ressource'){
    var extension = value.split('.').pop();
    if(extension === 'pdf'){
      return '<iframe style="height:1000px" src="'
              +gAssetsRoutes.ressources + value
              + '"></iframe>';
    }else if(extension === 'png' || extension === 'jpg' || extension === 'jpeg'){
      return '<img class="ressource-image" src="'+ value +'"></img>';
    }
  }//TODO : vimeo, eventbrite, storify, ...
}

var cleanHTMLContent = function(raw){
  var resRE = /\^\^(.*)/gi,
      match;

  var $ = cheerio.load(raw);
  var contents = $('body #contents');
  contents.find('style').remove();
  contents.find('script').remove();
  contents.find('a').attr('target', '_blank')
  .attr('href', function(i){
      var url = $(this).attr('href');
      var redirect = url && url.indexOf('https://www.google.com/url?q=') === 0;
      if(redirect){
        url = url.split('https://www.google.com/url?q=')[1];
      }
      var okUrl = url && url.indexOf('http://local/') >= 0;
      if(okUrl){
        // console.log('local spotted', url);
        var nUrl = url.split('http://local')[1];
        nUrl = nUrl.split('&')[0];
        url = nUrl;
        // console.log('new url ', url);
      }
      return url;
    });

  //connecting resources
  var ok;
  contents.find('p').each(function(i, value){
    var text = $(this).text();
    while(match = resRE.exec(text)){
      if(match){
        var expression = match[1];
        var expressions = expression.split(':');
        var type = expressions.shift();
        var value = expressions.join(':');
        var replacement = replaceResource(type, value);
        $(this).replaceWith(replacement);
        ok = true;
      }
    }
  });

  return contents.html();
}

var fetchGDText = function(url, callback){
  console.log('begining to fetch text gdata from ', url);

  request({
    encoding : null,
    url : url
  }, function(err, response, body){
    if(err){
      console.log('fetching gdoc', url, ' failed!');
      callback(err, body);
    }
    else{
      console.log('fetching gdoc ', url, ' succeeded!');
      var contents = cleanHTMLContent(body);
      callback(null, contents);
    }
  });
}

var fetchGDSpreadsheet = function(url, finalCallback){
  console.log('begining to fetch gdata from ', url);
  Tabletop.init({
    key : url,
    callback : function(data, tabletop){
      console.log('fetching spreadsheet ', url, ' succeeded!');
      finalCallback(null, data);
    },
    simpleSheet : true
  });
}


/*
DAtA REFRESH PROCESS
*/

var parseGObject = function(object, callback){
  var urlFound;
  var timer;
  var returned = false;


  setTimeout(function(){
    if(!returned){
      timer = setInterval(function(){
        console.log('still processing ', object.gurl);
      }, 5000);
    }
  }, 30000);



  var props = [];
  for(var i in object){
    props.push(i);
  }

  async.map(props, function(i, c){
    //extract google content
    if(i.indexOf('gurl') > -1){
      var attr = "";
      var split = i.split('_');
      if(split.length > 1){
        attr = split[1];
      };
      var key = (attr.length > 0)?'gContent'+'_'+attr:'gContent';
      urlFound = true;
      //case spreadsheet
      if(object.type === 'spreadsheet' && !object[key]){
        fetchGDSpreadsheet(object[i], function(err, data){
          if(err){
            c(err, {key : i, value : object[i]});
          }else{
            //recursively get contents
            async.map(data, parseGObject, function(err, results){
              c(err, {key : key, value : results});
            })
          }
        });
      }else if(!object[key]){
        fetchGDText(object[i], function(err, data){
          if(err){
            c(err, {key : i, value : object[i]});
          }else{
            c(undefined, {key : key, value : data});
          }
        });
      }
    }else if(i.indexOf('mots-cles') > - 1){
      var keywords = object[i].split(',');
      keywords.forEach(function(keyword, i){keywords[i] = keyword.trim()});
      c(undefined, {key : i , value : keywords});
    }else{
      c(undefined, {key : i, value : object[i]});
    }
  }, function(err, results){

    for(var i in results){
      object[results[i].key] = results[i].value;
    }
    returned = true;
    callback(err, object);

    clearInterval(timer);

  });
}

var fetchProfileImage = function(person, callback){
  var personImgUrl = gAssetsRoutes.images_annuaire + person.identifiant + ".png";
  var magic = {
    jpg: 'ffd8ffe0',
    png: '89504e47',
    gif: '47494638'
  };
  console.log('going to verify ', personImgUrl);
  request({
    encoding : null,
    url : personImgUrl
  }, function(err, response, body){
    if(err){
      console.log('fetching image', personImgUrl, ' failed!');
      person.image_url = gAssetsRoutes.images_annuaire + 'default.png';
      callback(err, person);
    }
    else{
      var magigNumberInBody = body.toString('hex',0,4);
      if(magigNumberInBody == magic.png){
        person.image_url = personImgUrl;
        var contents = cleanHTMLContent(body);
        callback(null, person);
      }else{
        console.log('fetching image', personImgUrl, ' failed!');
        person.image_url = gAssetsRoutes.images_annuaire + 'default.png';
        callback(err, person);
      }
    }
  });
}

var fetchProfileImages = function(data, callback){
  console.log('verifying profile images');
  var ok = data.annuaire && data.annuaire.gContent;
  if(!ok){
    return callback(undefined, data);
  }
  var annuaire = data.annuaire.gContent;

  async.map(annuaire, async.ensureAsync(fetchProfileImage), function(err, results){
    if(err){
      callback(err, data);
    }else{
      data.annuaire.gContent = results;
      callback(undefined, data);
    }
  });
}

var parsePersonsInDocuments = function(data, callback){
  var members = [], span, index;
  var ok = data.annuaire && data.annuaire.gContent;
  if(!ok)return callback(undefined, data);

  data.annuaire.gContent.forEach(function(person){
    var name = (person.Surname + ' ' + person.Name).toLowerCase();
    members.push({
      completeName : name,
      surname : person.Surname,
      name : person.Name
    });
  });

  for(var i in data){
    if(data[i].type === 'text'){
      var content = data[i].gContent.toLowerCase();
      members.forEach(function(member){
        if(content.indexOf(member.completeName) > -1){
          index = content.indexOf(member.completeName);
          span = '<span class="person" person="'
                  +member.completeName
                  +'" itemscope itemtype="http://schema.org/Person">'
                  +'<span class="person-surname" itemprop="givenName">' + member.surname
                  +'</span> <span class="person-name" itemprop="familyName">' + member.name
                  +'</span></span>';
          data[i].gContent = data[i].gContent.substr(0, index) + span + data[i].gContent.substr(index + member.completeName.length, data[i].gContent.length - 1);
        }
      });
    }else if(data[i].type === 'spreadsheet'){
      for(var j in data[i].gContent){
        var content = data[i].gContent[j].gContent_contenu;
        if(!content){
          continue;
        }else{
          content = content.toLowerCase();
        }
        members.forEach(function(member){
          if(content.indexOf(member.completeName) > -1){
            index = content.indexOf(member.completeName);
            span = '<span class="person" person="'
                    +member.completeName
                    +'" itemscope itemtype="http://schema.org/Person">'
                    +'<span class="person-surname" itemprop="givenName">' + member.surname
                    +'</span> <span class="person-name" itemprop="familyName">' + member.name
                    +'</span></span>';
            data[i].gContent[j].gContent_contenu = data[i].gContent[j].gContent_contenu.substr(0, index) + span + data[i].gContent[j].gContent_contenu.substr(index + member.completeName.length, data[i].gContent[j].gContent_contenu.length - 1);
          }
        });
      }
    }
  }

  console.log('done with members identification');

  callback(undefined, data);
}


var refreshData = function(){

  async.waterfall(
    [
      //fetch data
      function(callback){
        async.map(gRoutes, parseGObject, function(err, results){
          if(err){
            console.log('failure in data retrieving');
            callback(err, undefined);
          }else{
            console.log('drive data retrieved successfully');
            callback(err, results);
          }
        });
      },
      //compare pages contents with organization members directory
      parsePersonsInDocuments,
      //fetch google public profile images, replace by default if not set
      fetchProfileImages
    ], function(err, results){
    if(err){
      console.log('failure in data refreshing :', err);
    }else{
      driveData = results;
      // console.log(JSON.stringify(results.annuaire, null, 6));
      console.log('drive data refreshed successfully');
      tree = new Baobab(driveData);
    }
  });
}

/*
DRIVE DATA ENDPOINTS
*/

var renderGData = function(){
  if(arguments && tree){
    var args = [];
    for(var i in arguments){
      args.push(arguments[i])
    }
    return tree.select(args).get();
  }else{
    return driveData;
  }
}


/*
DIVERSE UTILS
*/

var getDriveRefreshRate = function(){
  var value = gRefreshRate.value;
  switch(gRefreshRate.unit){
    case 'day':
      value *= 24 * 3600 * 1000;
    break;

    case 'hour':
      value *= 3600 * 1000;
    break;

    case 'minute':
      value *= 60 * 1000;
    break;

    default:
    break;
  }
  return value;
}


// EXPOSING PUBLIC FUNCTIONS

utils.refreshData = refreshData;
utils.renderGData = renderGData;

utils.fetchGDText = fetchGDText;
utils.fetchGDSpreadsheet = fetchGDSpreadsheet;
utils.getDriveRefreshRate = getDriveRefreshRate;

module.exports = utils;
