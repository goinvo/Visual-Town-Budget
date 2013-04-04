var avb = avb || {};

avb.breadcrumbs = function(){
	var bc;

	var initialize = function initialize() {
		bc = d3.select("#avb-breadcrumbs");
		console.log("bc OK");
	},

	push = function(data){
		var lastnode = d3.select(bc.node().lastElementChild).classed("active", false);
		    lastnode_text = lastnode.text();
		lastnode.text("");
		lastnode.append("a").text(lastnode_text);
		lastnode.append("span").text("/").classed("divider",true);
		// lastnode.append("i").classed("icon-chevron-right",true);
		var crumb = bc.append("li").classed("active",true).text(data.name);
	},

	pop = function(){
		if(d3.select(bc.node().lastElementChild).attr("id") === "home-link") {
			console.warn("Breacrumbs root.")
			return;
		}
		d3.select(bc.node().lastElementChild).remove();
		var lastnode = bc.node().lastElementChild;
			lastnode_text = lastnode.select("a").text();
		lastnode.text("");
		lastnode.classed("active",true).text(lastnode_text);
	};

	return{
		push : push,
		pop : pop,
		initialize : initialize
	}
}();