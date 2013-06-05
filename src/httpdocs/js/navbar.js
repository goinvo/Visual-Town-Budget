var avb = avb || {};

avb.navbar = function(){
	var dummy,

	initialize = function(){
		home = true;
		$('#home-button').unbind();
		$('#home-button').click(function(d) {
			window.location =  '/';
		});

	},

	enableYears = function(){
		// year processing

		if(!jQuery.browser.mobile) {

			$('#yeardrop-list').html('');
			for(var i=firstYear; i<=lastYear; i++) {
				var html = '<li role="presentation"><a role="menuitem" tabindex="-1" href="#">' + i +'</a></li>';
				$('#yeardrop-list').append(html);
				$('#yeardrop-list li :last').click(function(event) {
					event.preventDefault();
					var year = parseInt($(this).text());
					$('#yeardrop-label').html(year + ' <b class="caret"></b>');
					changeyear(year);
					$('#yeardrop-container').removeClass('open');
				});
			};
			$('#yeardrop-label').html(thisYear + ' <b class="caret"></b>');
			$('#yeardrop-container').show();
		} else {
			$('#yeardrop-container-mobile').html('');
			for(var i=firstYear; i<=lastYear; i++) {
				var html = '<option'
				+ ((i === thisYear) ? ' selected="selected"' : ' ')
				+ 'value="' + i + '">' + i + '</option>';
				$('#yeardrop-container-mobile').append(html);
			}
			$('#yeardrop-container-mobile').change(function(){
				changeyear(parseInt($('#yeardrop-container-mobile').val()));
			})
			$('#yeardrop-container-mobile').show();
		}
	};

return{
	initialize : initialize,
	enableYears : enableYears

}
}();