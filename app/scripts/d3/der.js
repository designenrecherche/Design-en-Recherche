(function($, undefined){

	'use strict';



	var Der = function(){

		var der = this,
		initiated = false,
		node,link;
		;

		this.init = function(options){
			der.initiated = true;
			if(!options)
				options = {};

			//get options or set default
			('containerId' in options) ? 
			der.container = d3.select('#'+options.containerId) 
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
			der.logoDataSrc = 'data/designLogo.json';


			//setting svg container
			der.svg = der.container
			.append("svg:svg")
			.attr("viewBox","0 0 " + der.width +" " + der.height)
			.attr("preserveAspectRatio", "xMinYMin meet")
			.append("svg:g")
			.attr('transform', function(){
						//why these transformations ?
						return 'scale(0.6)' + 'translate('
							+ der.width*0.3333333
							+','
							+ der.height*0.55
							+ ')';
		})
			.style('background', 'green')
			.attr('id', 'designLogoGroup');


			//TODO : remove (for testing the viewbox)
			/*der.svg.append('rect').attr('x', 0).attr('y', 0)
			.attr('width', der.width).attr('height', der.height)
			.attr('fill', 'red');*/

			//setting computed variables
			der.bigRadius = der.height/10;
			der.mediumRadius = der.height/100;
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

			der.link.attr('stroke', '#475350');

			der.link.attr("x1", function(d) { return der.scaleLogo(logoData.nodes[d.source].x); })
			.attr("y1", function(d) { return der.scaleLogo(logoData.nodes[d.source].y); })
			.attr("x2", function(d) { return der.scaleLogo(logoData.nodes[d.target].x); })
			.attr("y2", function(d) { return der.scaleLogo(logoData.nodes[d.target].y); })
			.attr('stroke-width', function(d){
				return d.type == "thick" ? der.mediumRadius*2 : der.height/300;
			});

			der.node.attr('transform', function(d){
				return 'translate(' + der.scaleLogo(d.x) + ','  + der.scaleLogo(d.y) + ')';
			}).style('cursor', 'pointer');
		};

		//this function updates the logo with additionnal data for the logo
		this.updateData = function(data){
			der.dataUpdated = true;
			if(!der.node)
				return;
			//append additionnal data
			der.node.each(function(d,i){
				if(i < data.length){
					for(var key in data[i]){
						d[key] = data[i][key];
					}
				}
			});
			console.log("data loaded from annuaire");
			der.fillNodes();
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
					return '#personne/' + d.identifiant;
			});


			//a.append('use').attr('xlink:href', '#rect').attr('x', 0).attr('y', 0).attr('width', 0).attr('height', 0);

			a.append('image').attr('x', 0).attr('y', 0)
			.attr('width', 0).attr('height', 0).attr('xlink:href', 'images/portrait.png');
			
			der.node.each(function(d){
				d.imagePath = "http://googledrive.com/host/0B8drr1YUb3a7RFBTWW1FVXhIdTA/"+d.identifiant + ".png";
				var el = this;
				imageExists(d.imagePath, function(){
					console.log("ok "+d.identifiant);
					d3.select(el).selectAll('image').attr('xlink:href', d.imagePath);
				}, function(){
					console.log("error "+d.identifiant);
					d3.select(el).selectAll('image').attr('xlink:href','images/portrait.png');
				});
			});
			

			//interactions
			der.node.on('mouseover', function(d){
				d3.select(this).each(nodeUp);
				var da = d;
				/*d3.select('#logoText a').text(function(d){
					if(da.surname != undefined)
						return da.surname + ' ' +da.name;
					else return "annuaire en cours de chargement";
				});*/

		}).on('mouseout', function(){
			d3.select(this).each(nodeDown);
				//d3.select('#logoText a').text("design en recherche");
			});

		der.faisLePaon();
	}


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
			d3.select(this).select('.forme').transition().attr('r', der.bigRadius*1.3).attr('fill', 'black');
			d3.select(this).select('image').transition()
			.attr('x', -der.bigRadius).attr('y', -der.bigRadius)
			.attr('width', der.bigRadius*2).attr('height', der.bigRadius*2);
			return this;
		};

		function nodeDown(){
			d3.select(this).select('.forme').transition().attr('r', der.mediumRadius).attr('fill', '#475350');
			d3.select(this).select('image').transition()
			.attr('x', 0).attr('y', 0).attr('width', 0).attr('height', 0);
			return this;
		};

		//show off animation
		this.faisLePaon = function(){
			if(der.node){
				console.log("je fais le paon!!!");
				var length = der.node[0].length;
				var interval = 1000/length;
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
		}

	}

	window.der = new Der();

})();