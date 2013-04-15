var avb = avb || {};

avb.navigation = function(){
	var navigation,
  levels = [],

  fadeout= function(){
      navigation.transition().duration(500).attr("transform", "translate(" + get_winsize("w") + ", 0)");
  },

  drawzone = function(data, width, height) {
    delete navigation.selected;

    bar_width = width;
    bar_height = height;
    var container = navigation.append("svg:g")
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .attr("fill", "orange")
    .attr("lev", levels.length)
    .attr("name", data.key);

    //stack push
    container.lev = levels.length;
    levels.push(container);

    var maxvalue = d3.max(data.values, function(d) { return d.val; });

    var heightscale = d3.scale.linear().domain([0,maxvalue])
    .range([0,bar_height*maxvalue/d3.sum(data.sub, function (d) {return d.values[cur_index].val})]);

    var subdata = data.sub;

    var cur_y = 0;
    for(var i=0; i<subdata.length; i++) {
    	var group = container.append("g");
    	var entities = group.append("svg:rect");
    	if(subdata[i].values[cur_index] === undefined) continue;
    	entities.attr("x", 0)
    	.attr("y", bar_height - heightscale(subdata[i].values[cur_index].val) - cur_y )
    	.attr("width", bar_width)
    	.attr("height", heightscale(subdata[i].values[cur_index].val))
    	.attr("fill", colors[i%20])
    	.attr("rx", 5)
    	.attr("ry", 5)
    	.attr("opacity", nosel_opacity.toString());
    	if ( entities.attr("height") >= 20 ) {
    		add_label(group,entities,subdata[i].key, "lab");
    	}
    	cur_y += heightscale(subdata[i].values[cur_index].val);
    }
    container.selectAll("rect").data(subdata).enter;
    container.selectAll("rect").on("click", rectclick);
    container.selectAll("rect").on("dblclick", rectdclick);

    container.selectAll("rect").on("mouseout", function(d,i) {
       tooltip.style("visibility", "hidden");
       if(d3.select(this) !== navigation.selected){
        d3.select(this).attr("opacity","0.3");
    };
});        
    container.selectAll("rect").on("mouseover", function(d) {
       d3.select(this).attr("opacity","0.7");
       tooltip.style("visibility","visible")
       .style("left", (d3.event.pageX + 15).px())
       .style("top", (d3.event.pageY + 2).px())
       .text(d.key);
   });
    container.selectAll("rect").on("mousemove", function(d) {
       tooltip.style("left", (d3.event.pageX + 15).px())
       .style("top", (d3.event.pageY + 2).px())
       .text(d.key);
   });
    container.attr("display","none");
    return container;
},


presentation_layer = function(jsondata) {
    var presentation = new Object();
    presentation.key = jsondata.key;
    presentation.values = jsondata.values;
    presentation.sub = [jsondata];
    return presentation;
}

initialize = function(jsondata) {

    if(layout.navsvg !== undefined) {
        layout.navsvg.remove();
    }

    layout.navsvg = d3.select("#bars").append("svg");
    layout.navsvg.width = $("#bars").width();
    layout.navsvg.height = $("#bars").height();
    layout.navsvg.attr("height", layout.navsvg.height )
    .attr("width", layout.navsvg.width);
    navigation = layout.navsvg.append("svg:g");

    // introduction mode
    navigation.intro = true;

    navigation.height = layout.navsvg.height;
    navigation.width = layout.navsvg.width;

    // align with menu bar !
    navigation.bar_width =  $('#home-button').width();
    bar_height = navigation.height;

    avb.navigation.drawzone(presentation_layer(jsondata), navigation.bar_width, bar_height).attr("display","inline");
},

rectdclick = function(d,i) {
    log("double");
    if ( d.sub === undefined ) {
     return;
 }
 console.log(d.sub)
 levels[levels.length-1].style("display","none");
 newzone = drawzone(d, navigation.bar_width, bar_height).attr("display","inline");
},

rectclick = function(d,i) {

    cur_json = d;
    avb.chart.drawline(d, d3.select(this).attr("fill"), true);
    avb.cards.update(d);
    titlebox_fill(d);

    if(navigation.intro) {
        navigation.intro = false;
        setTimeout(function() {
            $('#container-right').fadeIn();
        },300);
    }

    // breadcums
    if(navigation.selected === undefined){
        avb.breadcrumbs.push(d.key);
    } else {
        avb.breadcrumbs.rename(d.key);
        d3.select(navigation.selected).transition()
        .duration(300)
        .attr("transform", "translate(0,0)");
    }

    //hightlight
    d3.select(navigation.selected).style("opacity", 0.3)
    navigation.selected = this;
    d3.select(this).style("opacity", 0.7);

    // slide left
    var offset_x = (navigation.width - bar_width)/1.5;
    d3.select(this).transition()
    .duration(300)
    .attr("transform", "translate(" + offset_x.toString() + ",0)");

    // pointer align
    log("heree")
    var pointer_height = Math.round(parseFloat(d3.select(this).attr("y")) + parseFloat(d3.select(this).attr("height"))/2);
    log(pointer_height)

  //   $('#pointer').animate({
  //   "top" : (pointer_height).px()
  //   }, 200, function() {
  //   // Animation complete.
  // });

    $('#pointer').css("top", (pointer_height).px())

};

return{
 fadeout : fadeout,
 initialize : initialize,
 drawzone : drawzone
}
}();