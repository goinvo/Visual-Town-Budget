var avb = avb || {};

avb.navbar = function(){
	var dummy,

	initialize = function(){
		home = true;
		$('#home-button').unbind();
		$('#home-button').click(function(d) {
			window.location =  '/';
		});
		$("#home-button div").css('cursor','pointer');

		reposition();

	},

	enableYears = function(){
		// year processing

		if(!jQuery.browser.mobile) {

			$('#yeardrop-list').html('');
			for(var i=min_year; i<=max_year; i++) {
				var html = '<li role="presentation"><a role="menuitem" tabindex="-1" href="#">' + i +'</a></li>';
				$('#yeardrop-list').append(html);
				$('#yeardrop-list li :last').click(function() {
					var year = parseInt($(this).text());
					$('#yeardrop-label').html(year + ' <b class="caret"></b>');
					changeyear(year);
				});
			};
			$('#yeardrop-label').html(cur_year + ' <b class="caret"></b>');
			$('#yeardrop-container').show();
		} else {
			$('#yeardrop-container-mobile').html('');
			for(var i=min_year; i<=max_year; i++) {
				var html = '<option'
				+ ((i === cur_year) ? ' selected="selected"' : ' ')
				+ 'value="' + i + '">' + i + '</option>';
				$('#yeardrop-container-mobile').append(html);
			}
			$('#yeardrop-container-mobile').change(function(){
				changeyear(parseInt($('#yeardrop-container-mobile').val()));
			})
			$('#yeardrop-container-mobile').show();
		}
	},

	reposition = function() {

	// link menu div to home
	var homelink_height = $("#home-button").height();
	// align navbar
	$("#avb-links").css("margin-top", (homelink_height - $("#avb-links").height())/2);

};

return{
	initialize : initialize,
	reposition : reposition,
	enableYears : enableYears,

}
}();