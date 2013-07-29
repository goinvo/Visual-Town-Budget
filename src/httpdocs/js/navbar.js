/*
File: navbar.js

Description:
    Navigation bar compoent for visual budget application

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

avb.navbar = function(){

	var searchChange = function(){
	    var  keyword = $(this).val();

	    function showResults(){
	        if(avb.navigation !== avb.table){
	            setMode('l');
	        };
	        pushUrl(avb.section, avb.thisYear, 'l', avb.root.hash);
	        avb.navigation.initialize(search(keyword));
	    }

	    clearTimeout(timer);
	    timer = setTimeout( showResults, 300);
	},

	search = function(keyword){
	    var result = [];
	    // aggregate search results from all sections
	    $.each(avb.sections, function(){
	        var searchSection = this;
	        var newResult = searchObject(keyword, avb.data[this], avb.data);
	        // remember where searched element was found
	        $.each(newResult, function() {this.section = capitalize(searchSection)});
	        result = result.concat(newResult);
	    });
	    return result;
	},

	searchObject = function(keyword, object, parent){
		var index = object.key.toLowerCase().indexOf(keyword.toLowerCase());
		// ignore matches in mid word
		if (index !== 0 && object.key[index-1] !== ' ') index = -1;
		if(index != -1) { object.parent = parent.key};
	    var result = index !== -1 ? [object] : []; 
	    if(object.sub !== undefined) {
	        for(var i=0; i<object.sub.length; i++) {
	            result = result.concat(searchObject(keyword, object.sub[i], object));
	        }
	    }
	    return result;
	},

	minimize = function(){
		// removes right-handside portion of navbar
		log($('#navbar-links .entry').last().remove());
	},


	initialize = function(){
		
		// year dropdown (desktop browsers)
		$dropdown = $('#yeardrop-container');
		$dropdownLabel = $('#yeardrop-label');
		$dropdownList = $('#yeardrop-list');

		// year selector (mobile browsers)
		$selector = $('#yeardrop-container-mobile');
		if(!jQuery.browser.mobile) {

			$dropdownList.html('');
			for(var i=avb.firstYear; i<=avb.lastYear; i++) {
				var html = '<li role="presentation"><a role="menuitem" tabindex="-1" href="#">' + i +'</a></li>';
				$dropdownList.append(html);
				$dropdownList.find('li :last').click(function(event) {
					event.preventDefault();
					var year = parseInt($(this).text());
					$dropdownLabel.html(year + ' <b class="caret"></b>');
					changeYear(year);
					$dropdown.removeClass('open');
				});
			};
			$dropdownLabel.html(avb.thisYear + ' <b class="caret"></b>');
			$dropdown.show();
		} else {
			$selector.html('');
			for(var i=avb.firstYear; i<=avb.lastYear; i++) {
				var html = '<option'
				+ ((i == avb.thisYear) ? ' selected="selected"' : ' ')
				+ 'value="' + i + '">' + i + '</option>';
				$selector.append(html);
			}
			$selector.change(function(){
				changeYear(parseInt($selector.val()));
			})
			$selector.show();
			$('#yeardrop').css({'vertical-align' : 'top'});
		}

		if(jQuery.browser.mobile) {
			$('#navbar-map').text('Map');
			$('#navbar-table').text('Table');
			$('#navbar-funds').text('Funds');
		}
		$('#searchbox').bind('click touchstart',function () {
	        if ($('#avb-home').is(":visible")) avb.home.hide();
	    });


	};

return{
	initialize : initialize,
	searchChange : searchChange,
	minimize : minimize
}
}();