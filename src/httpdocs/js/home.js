 var avb = avb || {};

 avb.home = function(){
 	var home = new Object;

    init = function(data) {
    	function overlayClick(event){
    		event.stopPropagation();
    		hide();
    	}

		function divClick(){
			log('click');
			initialize({ section : $(this).text().toLowerCase() }); 
			hide();
		}

 		home.content = $('#avb-home');
 		home.overlay = $('#overlay');
 		home.map = $('#home-map-svg');
 		home.menubar = $('#avb-menubar');
 		home.overlay.click(overlayClick);

 		home.map.find('.node').click(divClick);
 		log('eXXECc')

 	},

 	show = function(){
 		home.menubar.removeClass('purple-border');
 		home.content.show();
 		home.overlay.show();
		initialize({"section":"revenues"});
 	},

 	hide = function(showTutorial){
 		home.content.slideUp(function(){
 			home.menubar.addClass('purple-border');
 		});
 		home.overlay.fadeOut(function(){
 			if( showTutorial || isFirstVisit() ) startTutorial();
 		});
 	},

    isFirstVisit = function(){
        var visited = jQuery.cookie('visited');
        jQuery.cookie('visited', 'y', { expires: 14 });
        return (visited !== 'y');
    },

    startTutorial = function(){
        tutorial = introJs();
        tutorial.setOption("showStepNumbers", false);
        tutorial.setOption("skipLabel", "Exit");
        tutorial.start();
    };

    /*
 	renderMap = function(){

 		d3.select(home.map.get(0)).select('svg').remove();

 		function position() {
		  this.style("left", function(d) { return d.x + "px"; })
		      .style("top", function(d) { return d.y + "px"; })
		      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
		      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
		}

		function divClick(d){
			event.stopPropagation();
			console.log(d);
			initialize({ section : d.key.toLowerCase() });
			hide();
		}

 		function render(data) {

	 		var width = home.map.width(), height = home.map.height();

	        var map =  d3.select(home.map.get(0)).append("div")
		    .style("position", "relative")
		    .style("width", width.px())
		    .style("height", height.px())
		    .style("left", 0)
		    .style("top", 0);

	        map.x = d3.scale.linear().domain([0, width]).range([0, width]);
	        map.y = d3.scale.linear().domain([0, height]).range([0, height]);
	        map.color = d3.scale.category20();

	        var treemap = d3.layout.treemap().size([width, height])
	        .children(function(d) { return d.sub; })
	    	.sticky(true).value(function(d) { return d.values[yearIndex].val; });

	    	var node = map.datum(data).selectAll(".node")
	      .data(treemap.nodes).enter().append("div")
	      .attr("class", "node").call(position)
	      .style("background", function(d) { return d.children ? null : map.color(d.key); })
	      .text(function(d) { return d.key; })
	      .on('click', divClick);

	    }

	    d3.json("/data/home.json", render);

 	};

 	*/


  return{
  	initialize : init,
  	show : show,
  	hide : hide
  }
}();


