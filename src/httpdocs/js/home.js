 var avb = avb || {};

 avb.home = function(){
 	var home = new Object;

    init = function(data) {
    	function overlayClick(event){
    		event.stopPropagation();
    		hide();
    	}

		function divClick(){
			initialize({ section : $(this).text().toLowerCase() }); 
			hide();
		}

 		home.content = $('#avb-home');
 		home.overlay = $('#overlay');
 		home.map = $('#home-map-svg');
 		home.menubar = $('#avb-menubar');
 		home.overlay.click(overlayClick);
    $('.section').removeAttr('onclick');

 		home.map.find('.node').click(divClick);

 	},

 	show = function(){
 		home.menubar.removeClass('purple-border');
 		home.content.show();
 		home.overlay.show();
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
  	hide : hide
  }
}();


