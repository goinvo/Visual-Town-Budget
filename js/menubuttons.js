function menu_scale() {
	var homelink_height = $("#home-button").height();
	// align navbar
	console.log(homelink_height);
	console.log($("#avb-links").height());
	$("#avb-links").css("margin-top", (homelink_height - $("#avb-links").height())/2);
	$("#vdivider").css("left", $("#home-button").width());
	$("#vdivider").css("height", $("#home-button").height());
};

// RESIZE

$(window).resize(function() {
	menu_scale();
	resize();
});

// var fby = fby || [];
// (function () {
//     var f = document.createElement('script'); f.type = 'text/javascript'; f.async = true;
//     f.src = '//cdn.feedbackify.com/f.js';
//     var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(f, s);
// })();
