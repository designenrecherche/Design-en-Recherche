'use strict';

angular.module('designEnRechercheApp')
  .directive('derLogo', function ($rootScope, $timeout, $document) {
    return {
      restrict: 'A',
      scope : {
        data : "=derLogo"
      },
      link: function postLink(scope, element, attrs) {

        var membres;

        if(!der.initiated){
          der.init({
            containerSelector : '.navbar #designLogo'
          });
        }

        scope.$watch('data', function(d){
          if(d){
            $timeout(function(){
              der.updateData(d);
            });
          }
        });

        var bindMembers = function(){
          $timeout(function(){
            membres = angular.element($document).find('.membre');
            console.log('bind ! ');
            membres.on('mouseover', membreOnHover);
            membres.on('mouseout', membreOnOut);
          }, 500);
        }

        var membreOnHover = function(e, d){
          var el = angular.element(this);
          var firstName = el.find('.person-surname').text();
          var familyName = el.find('.person-name').text();
          var id = (familyName + ' ' + firstName).toLowerCase()
          id = id.replace(/([\s]+)/g, '-');
          der.showNodeById(id);
        }

        var membreOnOut = function(){
          der.hideAll();
        }

        var unbindMembers = function(){
          if(membres.length){
            // membres.off('mouseover', membreOnHover);
            // membres.off('mouseover', membreOnOut);
          }
        }

        $rootScope.$on('$routeChangeEnd', bindMembers);
        $rootScope.$on('$routeChangeStart', unbindMembers);
        bindMembers();
      }
    };
  });


/* Design en Recherche Logo */

(function($, undefined){

  'use strict';

  var Der = function(){

      var der = this,
      initiated = false,
      node,link;

      this.init = function(options){
        der.initiated = true;
        if(!options)
          options = {};

        //get options or set default
        ('containerSelector' in options) ?
        der.container = d3.select(options.containerSelector)
        :
        der.container = d3.select('#designLogo');

        ('width' in options && typeof options.width === 'number') ?
        der.width = parseInt(options.width, 10)
        :
        der.width = der.container[0][0].offsetWidth;

        ('height' in options && typeof options.height === 'number') ?
        der.height = parseInt(options.height, 10)
        :
        der.height = der.container[0][0].offsetHeight;

        ('logoDataPath' in options) ?
        der.logoDataSrc = options.logoDataSrc
        :
        der.logoDataSrc = 'assets/data/designLogo.json';


        //setting svg container
        der.svg = der.container
        .append("svg:svg")
        .attr("viewBox","0 0 " + der.width +" " + der.height)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .append("svg:g")
        .attr('transform', function(){
              //why these transformations ?
              return 'scale(.65)' + 'translate('
                + der.width*0.1
                +','
                + der.height*0.1
                + ')';
      })
        .style('background', 'green')
        .attr('id', 'designLogoGroup');

        //setting computed variables
        der.bigRadius = der.height/7;
        der.mediumRadius = der.height/50;
        der.scaleLogo = d3.scale.linear().range([0,der.width]);


        //loading the basic data file
        der.loadLogoData(der.logoDataSrc, function(data){
          der.redraw(data);
        });
      };

      //this function returns json data from a json file
      this.loadLogoData = function(jsonSrc, callback){
        d3.json(jsonSrc, function(data){
          return callback(data);
        });
      };

      //this function draws the logo
      //TODO : deploying logo
      this.redraw = function(logoData){
        der.link = der.svg.selectAll('.link').data(logoData.links).enter().append('line').attr('class', 'link');
        der.node = der.svg.selectAll('.node').data(logoData.nodes).enter().append('g').attr('class', 'node');

        // der.link.attr('stroke', '#475350');

        der.link.attr("x1", function(d) { return der.scaleLogo(logoData.nodes[d.source].x); })
        .attr("y1", function(d) { return der.scaleLogo(logoData.nodes[d.source].y); })
        .attr("x2", function(d) { return der.scaleLogo(logoData.nodes[d.target].x); })
        .attr("y2", function(d) { return der.scaleLogo(logoData.nodes[d.target].y); })
        .attr('stroke-width', function(d){
          return d.type == "thick" ? der.mediumRadius*2 : der.height/300;
        });

        der.node.attr('transform', function(d){
          return 'translate(' + der.scaleLogo(d.x) + ','  + der.scaleLogo(d.y) + ')';
        });
      };

      //this function updates the logo with additionnal data for the logo
      this.updateData = function(data){
        der.dataUpdated = true;
        if(!der.node){
          return;
        }
        //append additionnal data
        der.node.each(function(d,i){
          if(i < data.length){
            for(var key in data[i]){
              d[key] = data[i][key];
            }
          }
        });
        //console.log("data loaded from annuaire");
        der.fillNodes();
        der.faisLePaon();
      };


      //GRAPHICS

      //nodes preparation
      this.fillNodes = function(){

        //background circles
        der.node.append('circle').attr('class', 'fond').attr('cx', 0).attr('cy', 0).attr('stroke', 'none').attr('fill', 'white').attr('fill-opacity', '0.01').attr('r', der.bigRadius);
        der.node.append('circle').attr('class', 'forme').attr('cx', 0).attr('cy', 0).attr('stroke', 'none').attr('fill', '#475350').attr('r', der.mediumRadius);

        //image
        var a = der.node.append('a')
        .attr('xlink:href', function(d){
          if(d.identifiant)
            return '/membres/' + d.identifiant;
        });


        //a.append('use').attr('xlink:href', '#rect').attr('x', 0).attr('y', 0).attr('width', 0).attr('height', 0);
        //TODO : add clip to have rounded images
        a.append('image').attr('x', 0).attr('y', 0)
        .attr('width', 0).attr('height', 0).attr('xlink:href', function(d){
          return d.image_url;
        });
        //cache with ellispse
        a.append('circle').attr('class', 'cache').attr('cx', 0).attr('cy', 0).attr('stroke', 'black').attr('stroke-width',0).attr('fill-opacity', 0).attr('r', der.mediumRadius);


        //interactions
        der.node.on('mouseover', function(d){
          d3.select(this).each(nodeUp);
          var da = d;
          //TODO : handle through angular the header's title text
          d3.select('#brand-text').html(function(d){
            if(da.Surname != undefined)
              return '<br>' + da.Surname + '<br>' +da.Name;
            else return "membre du réseau <br>non enregistré sur notre annuaire";
          }).attr('href', function(d){
            return '/membres/'+da.identifiant;
          });

        }).on('mouseout', function(){
            d3.select(this).each(nodeDown);
              //TODO : handle through angular the header's title text
              d3.select('#brand-text').html("design <br>en <br>recherche")
              .attr('href', '/');
        });
      };


      this.showNodeById = function(id){
        der.node.filter(function(d){
          return d.identifiant === id;
        }).each(nodeUp);
      };

      this.hideAll = function(){
        if(der.node)
          der.node.each(nodeDown);
      };

      //d3 nodeup and nodedown
      function nodeUp(){
        var data;
        d3.select(this).call(function(d){data = d[0][0].__data__;})
        d3.select(this).selectAll('.forme,.cache').transition().attr('r', der.bigRadius*1.3).attr('fill', 'black').attr('stroke-width', 4);
        d3.select(this).select('image').transition()
        .attr('x', -der.bigRadius).attr('y', -der.bigRadius)
        .attr('width', der.bigRadius*2).attr('height', der.bigRadius*2);
        return this;
      };

      function nodeDown(){
        d3.select(this).selectAll('.forme,.cache').transition().attr('r', der.mediumRadius).attr('fill', '#475350').attr('stroke-width', 0);
        d3.select(this).select('image').transition()
        .attr('x', 0).attr('y', 0).attr('width', 0).attr('height', 0);
        return this;
      };

      //show off animation
      this.faisLePaon = function(){
        if(der.node){
          //console.log("je fais le paon!!!");
          var length = der.node[0].length;
          var interval = 2000/length;
          der.node.each(function(d,i){
            if(d.identifiant)
              d3.select(this).transition().delay(i*interval).each(nodeUp).each('end', nodeDown);
          });
        }
      };

      //UTILS
      function imageExists(image_url, good, bad){
        var img = new Image();
        img.src = image_url;
        img.onload = good;
        img.onerror = bad;
      };

  }

  window.der = new Der();

})();
