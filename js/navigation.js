var avb = avb || {};

avb.navigation = function(){
	var navigation,
  levels = [],

  fadeout= function(){
      navigation.transition().duration(500).attr("transform", "translate(" + get_winsize("w") + ", 0)");
  };

  drawcurly=function(container, target_y, x, y, init_height, color){
      if(container.curly !== undefined ) {
         container.curly.remove();
     }
     curly = layout.navsvg.append("svg:g");
     var radius = Math.floor(bar_intra_padding/5);
     var points = 6;

     var angle = d3.scale.linear()
     .domain([0, points-1])
     .range([0, Math.PI/2]);

     var curvedline = d3.svg.line.radial()
     .interpolate("basis")
     .tension(0)
     .radius(radius)
     .angle(function(d, i) { return angle(i); });

                // 1st curl
                curly.append("svg:path").datum(d3.range(points))
                .attr("d", curvedline)
                .attr("class","curly_b")
                .attr("transform", "rotate(270 0 0), translate(" + (-radius).toString() +  ", " + (2*radius).toString() + ") ");

                curly.append("svg:line").attr("x1",radius)
                .attr("y1",radius)
                .attr("x2",radius)
                .attr("y2",target_y - radius)
                .attr("class","curly_b");

                curly.append("svg:path").datum(d3.range(points))
                .attr("d", curvedline)
                .attr("class","curly_b")
                .attr("transform", "translate(0, " + (radius + target_y).toString() + ") ");

                curly.append("svg:path").datum(d3.range(points))
                .attr("d", curvedline)
                .attr("class","curly_b")
                .attr("transform", "rotate(90 0 0), translate(" + (-radius + target_y).toString() +  ", 0)");
                
                curly.append("svg:line").attr("x1",radius)
                .attr("y1",radius + target_y)
                .attr("x2",radius)
                .attr("y2",bar_height - radius)
                .attr("class","curly_b");
                
                curly.append("svg:path").datum(d3.range(points))
                .attr("d", curvedline)
                .attr("class","curly_b")
                .attr("transform", "rotate(180 0 0), translate(" + (-radius*2).toString() +  ", " + (-bar_height + radius).toString() + ") ");
                //translate(curly, x + (bar_intra_padding-radius*2)/2, y);
                curly.padding = (bar_intra_padding-radius*2)/2;
                curly.attr("display","none");
                curly.attr("transform", "scale(0, " + init_height/bar_height + " ), translate(" + (x + (bar_intra_padding-radius*2)/2).toString() +"," + (y).toString() + ")");
                curly.transition().delay(500)
                .duration(500)
                .attr("transform", "translate(" + (x + curly.padding).toString() +"," + (y).toString() + ")")
                .attr("display", "inline");
                return curly;
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

rectclick = function(d,i) {
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
    navigation.selected = this;
    d3.select(this).style("opacity", 0.7);
//                         // fix this parentnode mess !
//                         if( levels[levels.length-1].lev == d3.select(this.parentNode.parentNode).attr("lev")){
//                         } else {
//                         	levels.pop().remove();
//                         	if(curly !== undefined) {
//                         		curly.remove();
//                         	}
//                         }
//                         console.log(d.sub);
//                         if ( d["sub"] === undefined ) {
//                         	return;
//                         }

//                         for(var i=0; i < levels.length; i++) {

//                             //container = levels[parseInt(d3.select(this.parentNode.parentNode).attr("lev"))];
//                             container = levels[i];
//                             container.x = container.x - bar_width - bar_intra_padding;
//                             container.transition().duration(500).attr("transform", " translate(" + (container.x).toString() +"," + (container.y).toString() + ")");
//                             if(container.curly !== undefined) {
//                             	container.curly.transition().duration(500).attr("transform", " translate(" + (container.x + bar_width + container.curly.padding).toString() + "," + (container.y).toString() + ")");
//                             }
//                         }

//                         container.curly = drawcurly(container, Math.floor(d3.select(this).attr("y")) + d3.select(this).attr("height")/2, container.x + bar_width, layout.navsvg.height - bar_height, 100, d3.select(this).attr("fill"));
//                         d3.select(this).attr("opacity",sel_opacity.toString());
//                         newzone = drawzone(d3.select(this).data()[0], cur_year.toString(), container.x, navigation.height - bar_height, bar_width, bar_height);
//                         newzone.x = layout.navsvg.width - bar_width - 30;
//                         newzone.transition()
//                         .delay(1000)
//                         .duration(500)
//                         .attr("transform", " translate(" + (newzone.x).toString() +"," + (container.y).toString() + ")")
//                         .attr("display", "inline");
                    };

                    return{
                    	fadeout : fadeout,
                    	initialize : initialize,
                    	drawzone : drawzone
                    }
                }();