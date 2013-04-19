function home_init(){
	home = true;
	$('#home-button').unbind();
	$('#home-button').click(function(d) {
		window.location =  '/';
     });
	$("#home-button div").css('cursor','pointer');

	menu_scale();

}

function loadthumbails(){
	getthumbail($("#home-thumb1"),homecolors[0]);
	getthumbail($("#home-thumb2"),homecolors[2]);
	getthumbail($("#home-thumb3"),homecolors[1]);
}

function menu_scale() {

	// link menu div to home
	var homelink_height = $("#home-button").height();
	// align navbar
	$("#avb-links").css("margin-top", (homelink_height - $("#avb-links").height())/2);

};


// On resize
$(window).resize(function() {
	menu_scale();
});


// On back button
// window.addEventListener("popstate", function(e) {
//     location.reload();
// });


// var fby = fby || [];
// (function () {
//     var f = document.createElement('script'); f.type = 'text/javascript'; f.async = true;
//     f.src = '//cdn.feedbackify.com/f.js';
//     var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(f, s);
// })();