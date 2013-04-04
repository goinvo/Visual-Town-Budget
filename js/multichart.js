var avb = avb || {};

avb.multichart = function(){
	var multichart,

	draw = function(jsondata, x, y, width, height){
		multichart = layout.multichartsvg.append("svg:g");

		var padding = 35;
		var margin_h = 25;
		var chart_w = width - padding * 2;
		var chart_h = height;

		multichart.width = chart_w;
		multichart.height = chart_h;

		rev = jsondata;
		var yscale = d3.scale.linear()
		.domain([0,get_max(rev) * 1.3])
		.range([chart_h, 0]);


		var xscale = d3.scale.linear().domain([min_year, max_year]).range([padding, chart_w]);
		multichart.xscale = xscale;
		var color = d3.scale.category20();

		var area = d3.svg.area()
		.interpolate("basis")
		.x(function(d,i) { return xscale(d.x); })
		.y0(function(d) { return yscale(d.y0); })
		.y1(function(d) { return yscale(d.y0 + d.y); });

		var line = d3.svg.line()
		.interpolate("basis")
		.x(function(d,i) { return xscale(d.x); })
		.y(function(d) { return yscale(d.y0 + d.y); });


		var stack = d3.layout.stack()
		.values(function(d) { return d.val; });

		var layers = rev.sub;
		var convert = layers.map(function(d) {
			var values = [];
			for(var i=min_year; i <= max_year ; i++){
				if( d[i.toString()] === undefined ) {
					values.push({ "x" : i , "y" : 4000000});
				} else {
					values.push({ "x" : i , "y" : d[i.toString()]});
				}
			}
			return {
				name : d.name,
				val : values
			}
		});

		var instance = stack(convert);

		multichart.xgrid_axis = d3.svg.axis()
		.scale(xscale)
		.orient("bottom")
		.tickSize(-multichart.height, 0, 0)
		.tickFormat(function (d) { 
			return "";});

		multichart.xgrid = multichart.append("g")
		.attr("class", "multigrid")
		.attr("transform", "translate(0," + chart_h + ")")
		.call(multichart.xgrid_axis);

		multichart.ygrid_axis = d3.svg.axis()
		.scale(yscale)
		.orient("left")
		.tickSize(-multichart.width + padding, 0, 0)
		.tickFormat(function (d) { 
			return "";});

		multichart.grid = multichart.append("g")
		.attr("class", "multigrid")
		.attr("transform", "translate(" + padding + ",0)")                 
		.call(multichart.ygrid_axis);         



		var browser = multichart.selectAll(".browser")
		.data(instance)
		.enter().append("g")
		.attr("class", "browser");

		multichart.areas = browser.append("path")
		.attr("class", "multiarea")
		.attr("d", function(d) { return area(d.val); })
		.style("fill", function(d,i) { return colors[i%20]; });

		multichart.lines = browser.append("path")
		.attr("class", "multiline")
		.attr("d", function(d) { return line(d.val); })
		.style("stroke", function(d,i) { return colors[i%20]; });

		multichart.areas.on("mouseout", function(d,i) {
			tooltip.style("visibility", "hidden");
			d3.select(this).attr("opacity","1");
		});        
		multichart.areas.on("mouseover", function(d) {
			d3.select(this).attr("opacity","0.7");
			tooltip.style("visibility","visible")
			.style("left", (d3.event.x + 10).px())
			.style("top", (d3.event.y + 2).px())
			.text(d.name);
		});
		multichart.areas.on("mousemove", function(d) {
			tooltip.style("left", (d3.event.x + 10).px())
			.style("top", (d3.event.y + 2).px())
			.text(d.name);
		});

		browser.append("text")
		.datum(function(d) { return {name: d.name, val: d.val[d.val.length - 1]}; })
		.attr("transform", function(d) { return "translate(" + xscale(d.val.x) + "," + yscale(d.val.y0 + d.val.y / 2) + ")"; })
		.attr("x", -5)
		.attr("dy", ".35em")
		.text(function(d) { 
			console.log(yscale.range()[0] - yscale(d.val.y));
			if((yscale.range()[0] - yscale(d.val.y)) > 20) {
				return d.name;
			} else {
				return "";
			}
		});


		multichart.xAxis = d3.svg.axis()
		.scale(xscale)
		.orient("bottom")
		.ticks(5)
		.tickFormat(function (d) { 
			return d.toString();});   

		var yAxis = d3.svg.axis()
		.scale(yscale)
		.orient("left")
		.tickFormat( function(d) {
			return formatcurrency(d);
		})

		multichart.xscale = multichart.append("g")
		.attr("class", "multiaxis")
		.attr("transform", "translate(0," + chart_h + ")")
		.call(multichart.xAxis);

		multichart.append("g")
		.attr("class", "multiaxis")
		.attr("transform", "translate(" + padding + ",0)")
		.call(yAxis);

		translate(multichart, x + padding, y + 5);

	},


	draw_multchart_scale = function(start, end) {
                // var scale = ntl.xscale.range()[1] / (end - start);
                // multichart.areas.attr("transform", "scale(" + scale.toString() + ",1)");
                // multichart.lines.attr("transform", "scale(" + scale.toString() + ",1)");
                // console.log(scale);
                // multichart.xaxis.remove();

                // multichart.xaxis = multichart.append("g")
                //       .attr("class", "multiaxis")
                //       .attr("transform", "translate(0," + chart_h + ")")
                //       .call(multichart.xAxis.scale());
            },



    remove = function(){
    	console.log(get_winsize('w'));
    	multichart.transition().duration(500).attr("transform", "translate(" + get_winsize("w") + ", 0)");
    	d3.select("#multichart").transition().delay(500).style("display", "none");
    	d3.select("#multichart").selectAll("svg").transition().delay(500).remove();
    };


            return{
            	draw : draw,
            	remove : remove
            }
}();