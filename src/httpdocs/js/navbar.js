var avb = avb || {};

avb.navbar = function(){
	var initialize = function(){
		
		// year dropdown (desktop browsers)
		$dropdown = $('#yeardrop-container');
		$dropdownLabel = $('#yeardrop-label');
		$dropdownList = $('#yeardrop-list');

		// year selector (mobile browsers)
		$selector = $('#yeardrop-container-mobile');

		console.log('***********');
		console.log(thisYear);

		if(!jQuery.browser.mobile) {

			$dropdownList.html('');
			for(var i=firstYear; i<=lastYear; i++) {
				var html = '<li role="presentation"><a role="menuitem" tabindex="-1" href="#">' + i +'</a></li>';
				$dropdownList.append(html);
				$dropdownList.find('li :last').click(function(event) {
					event.preventDefault();
					var year = parseInt($(this).text());
					$dropdownLabel.html(year + ' <b class="caret"></b>');
					changeyear(year);
					$dropdown.removeClass('open');
				});
			};
			$dropdownLabel.html(thisYear + ' <b class="caret"></b>');
			$dropdown.show();
		} else {
			$selector.html('');
			for(var i=firstYear; i<=lastYear; i++) {
				console.log(i);
				console.log(thisYear);
				var html = '<option'
				+ ((i == thisYear) ? ' selected="selected"' : ' ')
				+ 'value="' + i + '">' + i + '</option>';
				$selector.append(html);
			}
			$selector.change(function(){
				changeyear(parseInt($selector.val()));
			})
			$selector.show();
		}
	};

return{
	initialize : initialize

}
}();