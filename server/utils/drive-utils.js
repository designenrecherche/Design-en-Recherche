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
  contents.find('*').removeAttr('class');
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
      if(!object[i].length){
        return c(undefined, {key:'content',value:undefined});
      }
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
            console.log('error in fetching ', object[i], err);
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
            console.log('error in fetching ', object[i], err);
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
    //parse persons and their urls
    }else if(i.indexOf('personnes') > -1){

      var persons = [],
          raw = object[i].split(','),
          match;

      raw.forEach(function(entry){
        var infos = entry.trim().split('('), person = {};
        person.completeName = infos.shift().trim();
        if(!person.completeName.length){
          return;
        }
        var names = person.completeName.split(' ');
        person.surname = names.shift();
        person.name = names.join(' ');
        if(infos.length){
          person.url = infos[0].substr(0, infos[0].length - 1).trim();
        }

        // console.log(person);
        persons.push(person);
      });


      c(undefined, {key : i, value : persons});
    }else if(i.indexOf('membres') > -1){

      var persons = [],
          raw = object[i].split(',');

      raw.forEach(function(entry){
        if(!entry.trim().length){
          return;
        }
        var person = {};
        person.completeName = entry.trim();
        var names = entry.split(' ');
        person.surname = names.shift();
        person.name = names.join(' ');

        // console.log(person);
        persons.push(person);
      });


      c(undefined, {key : i, value : persons});
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
  // console.log('going to verify ', personImgUrl);
  request({
    encoding : null,
    url : personImgUrl
  }, function(err, response, body){
    if(err){
      // console.log('fetching image', personImgUrl, ' failed!');
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
        // console.log('fetching image', personImgUrl, ' failed!');
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


var parsePersons = function(content, persons, classe){
  content = content.replace(/&#xE9;/gi, 'é').replace(/&#xE1;/gi, 'á');
  var lowContent;
  persons.forEach(function(person){
      lowContent = content.toLowerCase();
      var hasPerson = lowContent.indexOf(person.completeName.toLowerCase()) > -1 && lowContent.charAt(lowContent.indexOf(person.completeName.toLowerCase()) -1) != '>';
      while(lowContent.indexOf(person.completeName.toLowerCase()) > -1){
        index = lowContent.indexOf(person.completeName.toLowerCase());
        if(person.url){
          span = '<a class="person '+ classe + '" '
                  +'" itemscope itemtype="http://schema.org/Person" '
                  +'target="_blank" href="'+person.url+'" '
                  +'>'
                  +'<span class="person-surname" itemprop="givenName">' + person.surname
                  +'</span> <span class="person-name" itemprop="familyName">' + person.name
                  +'</span></a>';
        }else{
          span = '<span class="person '+ classe + '" '
                  +'" itemscope itemtype="http://schema.org/Person" '
                  +'>'
                  +'<span class="person-surname" itemprop="givenName">' + person.surname
                  +'</span> <span class="person-name" itemprop="familyName">' + person.name
                  +'</span></span>';
          // console.log(span);
        }
        content = content.substr(0, index) + span + content.substr(index + person.completeName.length, content.length - 1);
        lowContent = content.toLowerCase();
    }
  });
  // console.log(content);
  return content;
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
      name : person.Name,
      identifiant : person.identifiant,
      url : "/membres/"+person.identifiant
    });
  });

  for(var i in data){
    if(data[i].type === 'text'){
      data[i].gContent = parsePersons(data[i].gContent, members, 'membre');
    }else if(data[i].type === 'spreadsheet'){
      for(var j in data[i].gContent){
        var content = data[i].gContent[j].gContent_contenu;
        var participants = data[i].gContent[j].personnes_participantes;
        if(content){
          data[i].gContent[j].gContent_contenu = parsePersons(data[i].gContent[j].gContent_contenu, members, 'membre');
          if(participants){
            data[i].gContent[j].gContent_contenu = parsePersons(data[i].gContent[j].gContent_contenu, participants, 'invite');
          }
        }else{
          continue;
        }
      }
    }
  }

  console.log('done with members identification');

  callback(undefined, data);
}

var dateAndNext = function(data, callback){
  console.log('parsing events dates');
  var evts = data.evenements && data.evenements.gContent;
  if(!evts){
    return callback(undefined, data);
  }else{
    evts = evts.map(function(evt){
      if(!evt.date.length){
        return evt;
      }
      var dateComponents = evt.date.split('/');
      if(dateComponents.length === 1){
        dateComponents = evt.date.split('-');
      }

      var date = new Date(dateComponents[2], +dateComponents[1]-1, dateComponents[0], 0,0,0,0);
      evt.date = date;
      return evt;
    });


    var now = new Date(), nextEvts;

    nextEvts = evts.filter(function(evt){
      return evt.date > now && evt.index_visible === 'oui';
    });

    if(nextEvts){
      data.nextEvts = nextEvts;
    }
    console.log('date events calling back');
    return callback(undefined, data);
  }
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
      dateAndNext,
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


var searchExpressionIn = function(expression, item, matches, path){
  if(typeof item === 'string'){
    if(item.toLowerCase().indexOf(expression) > -1){
      // console.log('found', expression, ' in ', path, ', value : ', item);
      matches.push({
        path : path,
        value : item
      });
    }
  }else if(typeof item === 'object'){
    for(var i in item){
      var newPath = (path.length)?path.concat([''+i]):[''+i];
      matches = searchExpressionIn(expression, item[i], matches, newPath);
    }
  }
  return matches;
}

var searchExpression = function(expression){
  expression = expression.toLowerCase();
  console.log('searching ', expression);
  if(!driveData){
    return [];
  }
  var matches = searchExpressionIn(expression, driveData, [], []);
  var jointPath;
  matches.forEach(function(match){
    jointPath = match.path.join('/');
    match.jointPath = jointPath;

    if(match.path[0] === "annuaire"){
      match.contextPath = match.path.slice(0, 3);
      match.matchType = "membre";
    }else if(match.path[0] === "evenements"){
      match.contextPath = match.path.slice(0, 3);
      match.matchType = "evenement";
    }else{
      match.matchType = "page";
      match.contextPath = match.path.slice(0, match.path.length - 1);
    }

    match.context = tree.select(match.contextPath).get();
    match.score = 1;
  });

  //removing duplicates
  var i = 0, j;
  while(i < matches.length){
    for(var j = matches.length - 1 ; j > i ; j--){
      if(matches[i].contextPath.join('/') === matches[j].contextPath.join('/')){
        // console.log('removing duplicate ', matches[j].contextPath.join('/'));
        matches.splice(j, 1);
      }
    }
    i++;
  }

  console.log('done with search, number of found items :', matches.length);
  return matches;
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
utils.searchExpression = searchExpression;

module.exports = utils;
