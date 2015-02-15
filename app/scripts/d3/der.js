(function($, undefined){

   'use strict';



    var Der = function(){

	

		/*
		for information, here is the total list of arguments :
		{
			containerId: String (id of container div)
			gifPath: String (path to gif)
			width: int (px)
			height: int (px)
			logoDataPath : String (path to json)
		}
		*/

		var container,
			gifPath,
			img,
			node,
			link;
		
		this.init = function(args){

				
			if(!args)
				args = {};

			var der = this;
			this.loaded = true;
			this.dataLoaded = false;
			
			//get or set global args
			'containerId' in args ? container = d3.select('#'+args.containerId) : container = d3.select('#designLogo');
			'gifPath' in args ? gifPath = args.gifPath : gifPath = 'images/designLogo.gif';

			var rawGif = new Image();
			rawGif.src = gifPath;

			rawGif.addEventListener('load', function(){

				//get or set other args
				('width' in args && typeof args.width == 'number') ? der.width = parseInt(args.width, 10) : der.width = rawGif.width;
				('height' in args && typeof args.height == 'number') ? der.height = parseInt(args.height, 10) : der.height = rawGif.height;
				'logoDataPath' in args ? der.logoDataPath = args.logoDataPath : der.logoDataPath = 'data/designLogo.json';
				//get ratio of GIF
				der.ratio = rawGif.height/rawGif.width;


				der.svg = container.append('svg').style('position', 'absolute').attr('width', der.width).attr('height', der.height)
				.append('g')
				.attr('transform', function(){
					//why these transformations ?
					return 'scale(0.65)' + 'translate('
						+ der.width*0.2
						+','
						+ der.height*0.2
						+ ')';
				}).attr('id', 'designLogoGroup');

				var fond = der.svg.append('circle')
				.attr('cx', der.width/2)
				.attr('cy', der.width/6)
				.attr('r', function(){
					return der.width*0.7;
				}).attr('fill', 'white')
				.style('cursor', 'pointer')
				.on('click', function(){
					window.location.href = "#/"
				});



				//setting image and svg one in front of the other - I chose to keep a gif for the animation part instead of dealing everything with svg+json
				//in order to keep some simplicity and lightness in json data
				

				der.loadLogoData();//json data for edges and links of the logo

				der.bigRadius = der.getHeight()/10;
				der.mediumRadius = der.getHeight()/100;

				img = container.append('img').attr('src', gifPath).style('position', 'absolute');

				der.gifDuration = 2000;

				//TODO : following could be improved by listening to gif animation's end
				setTimeout(function(){
					img.style('display', 'none');
					der.svg.selectAll('.node,.link').style('display', 'block');
					der.animationDone = true;
					if(der.dataLoaded)
						cer.faisLePaon();
				}, der.gifDuration);

				img.style('width', function(){return der.width*0.75 + 'px'}).style('height', function(){return der.width*der.ratio + 'px'})
				.style('padding-left', function(){return der.width*0.15 + 'px'})
				.style('padding-top', function(){return der.height*0.15 + 'px'});
				
				//der.resizeLogo();
				console.log(der);
				return der;
			});

			//console.log(der);

			//return der;
		};

		//not sure with all these "this"
		this.initShape = function(gData){
			link = this.svg.selectAll('.link').data(gData.links).enter().append('line').attr('class', 'link').style('display', 'none');
			node = this.svg.selectAll('.node').data(gData.nodes).enter().append('g').attr('class', 'node').style('display', 'none');

			link.attr('stroke', '#475350');

			link.attr("x1", function(d) { return der.scaleLogo(gData.nodes[d.source].x); })
	        .attr("y1", function(d) { return der.scaleLogo(gData.nodes[d.source].y); })
	        .attr("x2", function(d) { return der.scaleLogo(gData.nodes[d.target].x); })
	        .attr("y2", function(d) { return der.scaleLogo(gData.nodes[d.target].y); })
	        .attr('stroke-width', function(d){
	        	return d.type == "thick" ? der.mediumRadius*2 : der.getHeight()/300;
	        });

			node.attr('transform', function(d){
				return 'translate(' + der.scaleLogo(d.x) + ','  + der.scaleLogo(d.y) + ')';
			}).style('cursor', 'pointer');


			node.each(function(d){
				d.imagePath = "http://googledrive.com/host/0B8drr1YUb3a7RFBTWW1FVXhIdTA/"+d.identifiant + ".png";
				if(!imageExists(d.imagePath))
					d.imagePath = 'images/portrait.png';
			});

			node.append('circle').attr('class', 'fond').attr('cx', 0).attr('cy', 0).attr('stroke', 'none').attr('fill', 'white').attr('fill-opacity', '0.01').attr('r', bigRadius);
			node.append('circle').attr('class', 'forme').attr('cx', 0).attr('cy', 0).attr('stroke', 'none').attr('fill', '#475350').attr('r', mediumRadius);

			node.append('image').attr('x', 0).attr('y', 0)
			.attr('xlink:href', function(d){
				return d.imagePath;
			})
			.attr('width', 0).attr('height', 0);


			node.on('click', function(d){
	            if(d.identifiant){
	                window.location.href = '#personne/' + d.identifiant;
	            }
	        }).on('mouseover', function(d){
				d3.select(this).each(nodeUp);
				var da = d;
				d3.select('#logoText a').text(function(d){
					if(da.surname != undefined)
						return da.surname + ' ' +da.name;
					else return "annuaire en cours de chargement";
				});

			}).on('mouseout', function(){
				logo.hideAll();
				d3.select('#logoText a').text("design en recherche");
			});

		};


		//showing one node
		this.showNodeById = function(id){
			node.filter(function(d){
				return d.identifiant == id;
			}).each(nodeUp);
		};

		this.hideAll = function(){
			node.each(nodeDown);
		};

		function nodeUp(){
			var data;

			d3.select(this).call(function(d){data = d[0][0].__data__;})
			d3.select(this).select('.forme').transition().attr('r', bigRadius*1.3).attr('fill', 'black');
			d3.select(this).select('image').transition()
					.attr('x', -bigRadius).attr('y', -bigRadius)
					.attr('width', bigRadius*2).attr('height', bigRadius*2);

			return this;
		}


		function nodeDown(){

			d3.select(this).select('.forme').transition().attr('r', mediumRadius).attr('fill', '#475350');
			d3.select(this).select('image').transition()
			.attr('x', 0).attr('y', 0).attr('width', 0).attr('height', 0);
			return this;
		}

		this.faisLePaon = function(){
			
			if(node){
				var length = node[0].length;
				var interval = 1000/length;
				node.each(function(d,i){
					if(d.identifiant)
						d3.select(this).transition().delay(i*interval).each(nodeUp).each('end', nodeDown);
				});
			}
		}

		//dirty - to enhance
		this.feedMeWithYourBigData = function(data){
			if(!node[0][0])
				der.loadLogoData();
			if(node && node[0][0]){
				node.each(function(d,i){
					if(i < data.length){
						for(var key in data[i]){
							d[key] = data[i][key];
						}
					}
				});
			}else{
				setTimeout(function(){
					node.each(function(d,i){
						if(i < data.length){
							for(var key in data[i]){
								d[key] = data[i][key];
							}
						}
					});
				}, 2000)
			}


			if(this.animationDone)
				this.faisLePaon();
			//else ok for faisLePaon when animation is done ?
		};

		this.loadLogoData = function(){
			var der = this;
			d3.json(der.logoDataPath, function(data){
				var logoData = data;
				der.scaleLogo = d3.scale.linear().range([0,der.getWidth()]);
				der.initShape(logoData);
			});
		};

		this.getHeight = function(){
			return der.height;
		}

		this.getWidth = function(){
			return der.width;
		}

		function imageExists(image_url){

			    var http = new XMLHttpRequest();

			    http.open('HEAD', image_url, false);
			    http.send();

			    return http.status != 404;

			}

	    }

	window.der = new Der();

})();




