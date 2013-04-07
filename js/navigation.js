var avb = avb || {};

avb.navigation = function(){
	var navigation,
  levels = [],

  fadeout= function(){
      navigation.transition().duration(500).attr("transform", "translate(" + get_winsize("w") + ", 0)");
  },



  drawzone = function(obj, key, x, y, width, height) {

    delete navigation.selected;

    bar_width = width;
    bar_height = height;
    bar_left_padding = x;
    var container = navigation.append("svg:g")
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .attr("fill", "orange")
    .attr("lev", levels.length)
    .attr("name", obj["name"]);

    container.x = x;
    container.y = y;

    //stack push
    container.lev = levels.length;
    levels.push(container);
    var data = obj.sub;
    var maxvalue = d3.max(data, function(d) { return d[key]; });
    var heightscale = d3.scale.linear().domain([0,maxvalue])
    .range([0,bar_height*maxvalue/d3.sum(data, function (d) {return d[key]})]);
    var cur_y = 0;
    for(var i=0; i<data.length; i++) {
    	var group = container.append("g");
    	var entities = group.append("svg:rect");
    	if(data[i][key] === undefined) continue;
    	entities.attr("x", 0)
    	.attr("y", bar_height - heightscale(data[i][key]) - cur_y )
    	.attr("width", bar_width)
    	.attr("height", heightscale(data[i][key]))
    	.attr("fill", colors[i%20])
    	// .attr("rx", 5)
    	// .attr("ry", 5)
    	.attr("opacity", nosel_opacity.toString());
    	if ( entities.attr("height") >= 20 ) {
    		add_label(group,entities,data[i]["name"], "lab");
    	}
    	cur_y += heightscale(data[i][key]);
    }
    container.selectAll("rect").data(data).enter;
    container.selectAll("rect").on("click", rectclick);
    container.selectAll("rect").on("dblclick", rectdclick);

                // container.selectAll("rect").call(d3.behavior.drag()
                // 	.on("dragstart", function(d) {
                //         //console.log("dstart");
                //     })
                // 	.on("drag", function(d) {
                //         //console.log("dtag");
                //     })
                // 	.on("dragend", function() {
                // 		var color = d3.select(this).attr("fill");
                // 		drawline(d3.select(this).data()[0],color,false);
                // 	}));

container.selectAll("rect").on("mouseout", function(d,i) {
	tooltip.style("visibility", "hidden");
    if(d3.select(this) !== navigation.selected){
        d3.select(this).attr("opacity","0.3");
    };
});        
container.selectAll("rect").on("mouseover", function(d) {
	console.log("tool");
	d3.select(this).attr("opacity","0.7");
	tooltip.style("visibility","visible")
	.style("left", (d3.event.x + 10).px())
	.style("top", (d3.event.y + 2).px())
	.text(d.name);
});
container.selectAll("rect").on("mousemove", function(d) {
	tooltip.style("left", (d3.event.x + 10).px())
	.style("top", (d3.event.y + 2).px())
	.text(d.name);
});
translate(container, x, y);
container.attr("display","none");
return container;
},


initialize = function(jsondata, x, y) {
    layout.navsvg = d3.select("#bars").append("svg");
    add_filter(layout.navsvg);
    layout.navsvg.width = $("#bars").width();
    layout.navsvg.height = $("#bars").height();
    layout.navsvg.attr("height", layout.navsvg.height )
    .attr("width", layout.navsvg.width);
    navigation = layout.navsvg.append("svg:g");
    navigation.height = layout.navsvg.height;
    navigation.width = layout.navsvg.width;
    navigation.bar_width = navigation.width;
    bar_intra_padding = 0;
    bar_height = navigation.height;
    avb.navigation.drawzone(jsondata, cur_year.toString(), 0, navigation.height - bar_height, navigation.bar_width, bar_height).attr("display","inline");
},

rectdclick = function(d,i) {
    log("double");
    if ( d.sub === undefined ) {
     return;
    }
    levels[levels.length-1].style("display","none");
    newzone = drawzone(d, cur_year.toString(), 0, navigation.height - bar_height, navigation.bar_width, bar_height).attr("display","inline");
},

rectclick = function(d,i) {
    log("single");
    cur_json = d;
    avb.chart.drawline(d, d3.select(this).attr("fill"), true);
    avb.cards.update(d);
    titlebox_fill(d);
    if(navigation.selected === undefined){
        avb.breadcrumbs.push(d.name);
    } else {
        avb.breadcrumbs.rename(d.name);
    }
    d3.select(navigation.selected).style("opacity", 0.3)
    d3.select(this).attr("filter","");
    navigation.selected = this;
    d3.select(this).style("opacity", 0.7);
};

return{
 fadeout : fadeout,
 initialize : initialize,
 drawzone : drawzone
}
}();