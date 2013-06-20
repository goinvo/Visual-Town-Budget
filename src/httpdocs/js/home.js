 var avb = avb || {};

 avb.home = function(){
 	var home = new Object;

    init = function(data) {
    	function overlayClick(event){
    		event.stopPropagation();
        // clicking on overlay is the same as clicking on revenues
        $('.section').first().addClass('selected');
    		hide();
    	}

		function divClick(){
			initialize({ section : $(this).attr('data-section').toLowerCase() });
      // timeout needed to avoid sloppy animation
      // while calculating treemap values
      setTimeout(function(){
        hide()
      }, 100);

		}

 		home.content = $('#avb-home');
 		home.overlay = $('#overlay');
 		home.map = $('#home-map-svg');
 		home.menubar = $('#avb-menubar');
 		home.overlay.click(overlayClick);
    $('.section').removeAttr('onclick');

 		home.map.find('.node').click(divClick);

 	},

  showGraph = function(duration){
    var data = home.data;
    var scale = d3.scale.linear().clamp(true).range([30,160])
    .domain([0, d3.max(data['home'], function(d) { return d.values[yearIndex].val})]);
    $('#revenues-node').animate({height : scale(data['home'][0].values[yearIndex].val)},duration)
    .find('.node-value').text(formatcurrency(data['home'][0].values[yearIndex].val));
    $('#expenses-node').animate({height : scale(data['home'][1].values[yearIndex].val)},duration)
    .find('.node-value').text(formatcurrency(data['home'][1].values[yearIndex].val));
    $('#funds-node').animate({height : scale(data['home'][2].values[yearIndex].val)},duration)
    .find('.node-value').text(formatcurrency(data['home'][2].values[yearIndex].val));
    $('.node-value').fadeIn(duration);
  }

 	show = function(){
 		home.menubar.removeClass('purple-border');
 		home.content.show();
 		home.overlay.show();

    $.getJSON('data/home.json', function(data) {
      setTimeout(function(){
        home.data = data;
        showGraph(1000);
      },1000);
    });

		initialize({"section":"revenues"});
		$('.section').removeClass('selected');
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

  return{
  	initialize : init,
  	show : show,
    showGraph : showGraph,
  	hide : hide
  }
}();


