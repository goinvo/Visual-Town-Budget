/*
File: home.js

Description:
    Homepage component for visual budget application

Authors:
    Ivan DiLernia <ivan@goinvo.com>
    Roger Zhu <roger@goinvo.com>

License:
    Copyright 2013, Involution Studios <http://goinvo.com>

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/


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
    var data = home.data['sub'];
    var scale = d3.scale.linear().clamp(true).range([30,160])
    .domain([0, d3.max(data, function(d) { return d.values[yearIndex].val})]);
    $('#revenues-node').animate({height : scale(data[0].values[yearIndex].val)},duration)
    .find('.node-value').text(formatcurrency(data[0].values[yearIndex].val));
    $('#expenses-node').animate({height : scale(data[1].values[yearIndex].val)},duration)
    .find('.node-value').text(formatcurrency(data[1].values[yearIndex].val));
    $('#funds-node').animate({height : scale(data[2].values[yearIndex].val)},duration)
    .find('.node-value').text(formatcurrency(data[2].values[yearIndex].val));
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
        // do not show next button at last tour step
        tutorial.onchange(function(targetElement) {
          lastStep = $(targetElement).attr('data-step') == 4 ? true : false;
          $navbuttons = $('.introjs-nextbutton, .introjs-prevbutton');
          $navbuttons.css({display : lastStep ? 'none' : 'inline-block'});
          if (lastStep) setTimeout(function(){$('#yeardrop-container').addClass('open')},800)
        });
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


