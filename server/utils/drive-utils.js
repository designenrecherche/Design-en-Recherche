var express = require('express');
var utils = {};
var Tabletop = require('tabletop');
var gRoutes = require('./../config/drive_routes');
var gAssetsRoutes = require('./../config/drive_assets');
var gRefreshRate = require('./../config/drive_refresh_rate');
var async = require('async');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var Baobab = require('baobab');
var google = require('googleapis');
var drive = google.drive('v3');
var fs = require('fs');
var path = require('path');
var http = require('https');

var gRoutesRoutes = './../config/drive_routes.json';
var driveData, tree, isRefreshing;


var SCOPES = [
'https://www.googleapis.com/auth/drive',
'https://www.googleapis.com/auth/drive.appdata',
'https://www.googleapis.com/auth/drive.file',
'https://www.googleapis.com/auth/drive.metadata',
'https://www.googleapis.com/auth/drive.metadata.readonly',
'https://www.googleapis.com/auth/drive.photos.readonly',
'https://www.googleapis.com/auth/drive.readonly',
];
var profilePictures = [];
var publicResources = [];
var key = require('./../config/key.json');

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

var replaceResource = function(type, value, text){
  if(type === 'ressource'){
    var extension = value.split('.').pop();
    if(extension === 'pdf'){
      return '<iframe style="height:1000px" src="'
              + '/assets/resources/' + value
              + '"></iframe>';
    }else if(extension === 'png' || extension === 'jpg' || extension === 'jpeg'){
      return '<img class="ressource-image" src="'+'/assets/resources/' +  value +'"></img>';
    }else if(extension === 'wav' || extension === 'mp3' || extension === 'ogg' || extension === 'aac' || extension === 'wma'){
      var adress = '/assets/resources/' + value;
      console.log('adresse son : ', adress);
      return '<audio controls src="'+adress + '">Votre navigateur ne supporte pas l\'élément <code>audio</code>. Retrouvez cette bande sonore à <a href="'+adress+'">l\'adresse suivante</a></audio>';
    }
  }else if(type === 'ref'){
    return '<p class="citation">'+value + '</p>'
  }else if(type === 'lien-ressource'){
    var elements = value.split(':');
    var fichier = elements.shift();
    var adresse = gAssetsRoutes.ressources + fichier;
    var texte = elements[0]?elements[0]:'Lien vers ' + fichier;
    return '<a target="_blank" href="'+adresse+'">'+texte+'</a>';
  }else if(type === 'cartel-membre'){
    var names = value.split(' ');
    var prenom = names.shift().toLowerCase();
    var nom = names.join('-').toLowerCase().replace(/([\s]+)/g, '-');
    var replace = '<div '
          +'membres="$parent.membres" '
          +'load-with-membre="'
          +nom + '-' + prenom + '" '
          +'><div ng-include="\'components/membre-cartel/membre-cartel.html\'"></div></div>';
    return replace;
  }else if(type === 'storify'){
    console.log('url storify : ', value);
    var base = value.split('?').shift().split(':')[1];
    return '<div class="storify">'
            +'<iframe src="'+base+'/embed?border=false'
            + '" width="100%" height=\'500\' frameborder=no allowtransparency=true></iframe>'
            + '<script src="'+base+'.js?border=false"></script>'
            + '<noscript>[<a href="'+base+'" target="_blank">Voir sur Storify</a>]</noscript></div>'
  }else if(type === 'include'){
    return value;
  }else if(type === 'vimeo'){
    var id = value.match(/([\d]){8}/);
    var ok = id && id[0];
    if(ok){
      id = id[0];
      return '<iframe src="https://player.vimeo.com/video/'+id+'?portrait=0" width="100%" height="500" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
    }else return '';
  }else if(type === 'youtube'){
    var id = value.match(/(?:\/)?(?:v=)?([\w]{11})/);
    var ok = id && id[0];
    if(ok){
      id = id[0];
      return '<iframe width="100%" height="500" src="https://www.youtube.com/embed/'+id+'" frameborder="0" allowfullscreen></iframe>'
    }else return '';
  }else if(type === 'figshare'){
    var id = value.match(/([\d]{6})/);
    console.log('got figshare, value : ', value, 'id : ', id);
    var ok = id && id[0];
    if(ok){
      id = id[0];
      console.log('figshare id : ', id);
      console.log('<iframe src="https://widgets.figshare.com/articles/'+id+'/embed?show_title=1" width="100%" height="716" frameborder="0"></iframe>')
      return '<iframe src="https://widgets.figshare.com/articles/'+id+'/embed?show_title=1" width="100%" height="716" frameborder="0"></iframe>'
    }else return '';
  }else{
    console.log('unknown type of resource : ', type, ' value : ', value);
  }//TODO : slideshare, eventbrite, ...
}

var cleanHTMLContent = function(raw){
  var resRE = /\^\^(.*)/gi,
      match;

  var $ = cheerio.load(raw);
  var contents = $('body #contents');
  // contents.find('*').removeAttr('class');
  contents.find('style').remove();
  contents.find('script').remove();
  contents.find('a').attr('target', '_blank')
  .attr('href', function(i){
      var url = $(this).attr('href');
      var redirect = url && url.indexOf('https://www.google.com/url?q=') === 0;
      if(redirect){
        url = url.split('https://www.google.com/url?q=')[1].split('&sa')[0];
      }
      var okUrl = url && url.indexOf('http://local/') >= 0;
      if(okUrl){
        var nUrl = url.split('http://local')[1];
        nUrl = nUrl.split('&')[0];
        url = nUrl;
      }
      return url;
    });

  //parsing paragraphs for special stuff
  var ok, quoteRE = /^(["|'])(.*)(["|'])$/;
  contents.find('p').each(function(i, value){
    var text = $(this).text();
    //finding blockquotes
    if(text.match(quoteRE)){
      var newHtml = $(this).html().replace(/&quot;/g, '');
      $(this).replaceWith('<blockquote>'+newHtml + '</bloquote');
    }
    //find special resources and connect
    while(match = resRE.exec(text)){
      if(match){
        var expression = match[1];
        var expressions = expression.split(':');
        var type = expressions.shift();
        var value = expressions.join(':');
        var replacement = replaceResource(type, value, text);
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
var timer;

var parseGObject = function(object, callback){
  var urlFound;
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
    timer = null;

  });
}

var fetchProfileImage = function(person, callback){
  var driveImage = profilePictures.find(function(file) {
    return file.name === person.identifiant + '.png';
  });
  var hasAProfilePicture = driveImage !== undefined;
  person.image_url = hasAProfilePicture ? 'assets/profile_pictures/' + person.identifiant + '.png' : 'assets/profile_pictures/default.png';
  callback(null, person);
  /*var personImgUrl = gAssetsRoutes.images_annuaire + encodeURIComponent(person.identifiant) + ".png";
  var magic = {
    jpg: 'ffd8ffe0',
    png: '89504e47',
    gif: '47494638',
    alt: 'ffd8ffe1'
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
      var magicNumberInBody = body.toString('hex',0,4);
      if(magicNumberInBody == magic.png || magicNumberInBody == magic.jpg || magicNumberInBody == magic.gif || magicNumberInBody == magic.alt){
        person.image_url = personImgUrl;
        var contents = cleanHTMLContent(body);
        callback(null, person);
      }else{
        console.log('fetching image', personImgUrl, ' failed! ', body.toString('hex',0,12));
        person.image_url = gAssetsRoutes.images_annuaire + 'default.png';
        callback(err, person);
      }
    }
  });
  */
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

  data.annuaire.gContent = data.annuaire.gContent.filter(function(member) {
    return member.identifiant.trim().length > 0;
  })

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

//I handle the refreshing process : fetch data on google drive, then structure and link it
var doRefreshData = function(routes){
  async.waterfall(
    [
      //fetch data
      function(callback){

        async.map(routes, parseGObject, function(err, results){
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
      isRefreshing = false;
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

//I handle the refreshing request process
var refreshData = function(){
  if(!isRefreshing){
    isRefreshing = true;
    console.log('begining to refresh data');

    console.log('starting to retrieve static assets from google drive');
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    );
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        console.log(err);
        return;
      }
      // listing profile pictures
      drive.files.list({
        auth: jwtClient,
        // contained by images folder
        q: "'0B8drr1YUb3a7RFBTWW1FVXhIdTA' in parents",
        fields: '*'
      }, function (err, resp) {
        if (!err) {
          profilePictures = resp.files;
          profilePictures.forEach(meta => {
            var dest = path.resolve(__dirname + '/../assets/profile_pictures/' + meta.name);
            var file = fs.createWriteStream(dest);
            drive.files.get({
               fileId: meta.id,
               auth: jwtClient,
               alt: 'media'
            })
            .on('end', function() {
              console.log('Done downloading for ', meta.name);
            })
            .on('error', function(err) {
              console.log('Error during download', err);
            })
            .pipe(file);
          });
        }
      });

      // listing resource files
      drive.files.list({
        auth: jwtClient,
        // contained by public resources folder
        q: "'0B4WaIphtOWIGZ1FEcGZwT1lJODA' in parents",
        fields: '*'
      }, function (err, resp) {
        if (!err) {
          publicResources = resp.files;
          async.mapSeries(publicResources, ((meta, resourceCb) => {
            var dest = path.resolve(__dirname + '/../assets/resources/' + meta.name);
            console.log('starting download for resource ', meta.name);
            var exceedsBufferSize = +meta.size >= 256000000;
            var file = fs.createWriteStream(dest);
            drive.files.get({
               fileId: meta.id,
               auth: jwtClient,
               alt: 'media'
            })
            .on('end', function() {
              console.log('Done downloading for ', meta.name);
              resourceCb(null, meta);
            })
            .on('error', function(err) {
              console.log('Error during download', err);
              resourceCb(err);
            })
            .pipe(file);
          }, function(err) {
            console.log('done downloading resources, errors: ', err);
          }));
        }
      });
    });

    fs.readFile(__dirname + '/' + gRoutesRoutes, 'utf8', function(err, routes){
      try{
        gRoutes = JSON.parse(routes);
        doRefreshData(gRoutes);
      }catch(e){
        console.log('error in fetching routes : ', e);
      }
    })
  }else{
    console.log('refresh asked, but already refreshing : leaving');
  }

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
    return driveData || [];
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
      if(matches[j].contextPath[0] === 'nextEvts'){
        matches.splice(j, 1);
      }else if(matches[i].contextPath.join('/') === matches[j].contextPath.join('/')){
        // console.log('removing duplicate ', matches[j].contextPath.join('/'));
        matches[j].contextPath.join('/')
        matches.splice(j, 1);
      }else{
        console.log(matches[j].contextPath.join('/'));
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
