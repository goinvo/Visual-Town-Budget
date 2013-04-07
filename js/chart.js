var avb = avb || {};

avb.chart = function(){
	var chart,
		multichart,

	initialize = function(){
		console.log($("#chart").width());
		layout.chartsvg = d3.select("#chart").append("svg");
		layout.chartsvg.width = $("#chart").width();
		layout.chartsvg.height = $("#chart").height();
		layout.chartsvg.attr("height", layout.chartsvg.height )
		.attr("width", layout.chartsvg.width);

		var width = layout.chartsvg.width;
		var height = layout.chartsvg.height;
		if(chart !== undefined ) {
			chart.remove();
		}
		chart = layout.chartsvg.append("svg:g");

		chart.xmargin = 50;
		chart.ymargin = 15;
		chart.width = width- 15;
		chart.height = height;
		chart.linestack = [];
		chart.xscale = d3.scale.linear().domain([min_year, max_year]).range([chart.xmargin, chart.width]);

		var today = svgtext_draw(chart, chart.xscale(cur_year), 15, "Today", "svggrey");
		translate(today, -today.node().getBBox().width/2,0);

		$('#subdivide').click(function(){
			if ( $('#subdivide').is(':checked') ) {
				add_subsections(cur_json);
			} else {
				remove_subsections(true);
			}
		});

	},


	drawline = function(data, color, clear) {
		if(typeof(clear)==='undefined') clear = false;
		if(clear) {
			for(var i=0; i<chart.linestack.length; i++) {
				chart.linestack[i].remove();   
			}
		}

		data = toarray(data);

		var yscale = d3.scale.linear().domain([0,d3.max(data.values, get_values)*1.2]).range([chart.height - chart.ymargin, 20]);
		chart.yscale = yscale;
		var xscale = chart.xscale;

		var container = chart.append("svg:g");
		chart.linestack.push(container);

		container.xgrid_axis = d3.svg.axis()
		.scale(xscale)
		.orient("bottom")
		.tickSize(-chart.height + chart.ymargin + 20, 0, 0)
		.tickFormat(function (d) { 
			return "";});

		container.xgrid = container.append("g")
		.attr("class", "multigrid")
		.attr("transform", "translate(0," + (chart.height - chart.ymargin) + ")")
		.call(container.xgrid_axis);

		container.ygrid_axis = d3.svg.axis()
		.scale(yscale)
		.orient("left")
		.tickSize(-chart.width + chart.xmargin, 0, 0)
		.tickFormat(function (d) { 
			return "";});

		container.ygrid = container.append("g")
		.attr("class", "multigrid")
		.attr("transform", "translate(" + chart.xmargin + ",0)")                 
		.call(container.ygrid_axis);   

		var line = d3.svg.line()
		.x(function(d) { return xscale(d.year); })
		.y(function(d) { return  yscale(d.val); });

        // area
        var area = d3.svg.area()
        .x(function(d,i) { return xscale(d.year); })
        .y0(function(d) { return (chart.height - chart.ymargin); })
        .y1(function(d) { return yscale(d.val); });

        var projected = max_year - cur_year;

        container.append("line")
        .attr("x1", chart.xscale(cur_year))
        .attr("x2", chart.xscale(cur_year))
        .attr("y1", 20)
        .attr("y2", chart.height - chart.ymargin)
        .style("stroke-width",2)
        .style("stroke","black");

                // // non-projection area
                container.append("svg:path").attr("d", area(data.values.slice(0,projected +1)))
                .attr("class","grapharea")
                .style("fill", color)
                .style("opacity", 0.7);
                
                // projection area
                container.append("svg:path").attr("d", area(data.values.slice(projected, data.values.length )))
                .attr("class","grapharea_proj")
                .style("fill", color)
                .style("opacity", 0.15);
                
                // // non-projection line
                container.append("svg:path").attr("d", line(data.values.slice(0,projected +1)))
                .attr("class","graphline")
                .style("stroke", color)
                .style("opacity", 0.7);
                
                // // projection line
                container.append("svg:path").attr("d", line(data.values.slice(projected, data.values.length )))
                .attr("class","graphline_proj")
                .style("stroke", color)
                .style("opacity", 0.7);
                
                var getcolor = function (d){
                	if(d.year === cur_year) {
                		return "rgb(167, 103, 108)";
                	} else {
                		return color;
                	}
                };

	            // hotspots
	            container.selectAll("circle")
	            .data(values)
	            .enter()
	            .append("circle")
	            .attr("class","graphcircle")
	            .attr("cx", function(d) { return xscale(d.year); })
	            .attr("cy", function(d) { return yscale(d.val); })
	            .attr("r","5")
	            .attr("stroke-opacity",0.9)
	            .attr("fill-opacity",0.50)
	            .attr("stroke", color)
	            .attr("fill", color);

	           //axes
	           var xAxis = d3.svg.axis(container)
	           .scale(xscale)
	           .orient("bottom")
	           .tickSize(0, 0, 0)
	           .tickPadding(6)
	           .ticks(5)
	           .tickFormat(function(d){
	           	return d; });

	           var yAxis = d3.svg.axis()
	           .scale(yscale)
	           .ticks(5)
	           .orient("left")
	           .tickSize(0, 0, 0)
	           .tickPadding(5)
	           .tickFormat(function(d){
	           	return formatcurrency(d);
	           });

	           if(chart.xAxisSocket !== undefined) {
	           	chart.xAxisSocket.remove();
	           	chart.yAxisSocket.remove();
	           }

	           chart.xAxisSocket = chart.append("g")
	           .attr("class", "axis")
	           .attr("transform", "translate(0," + (chart.height - chart.ymargin -1) + ")").call(xAxis);

	           chart.yAxisSocket = chart.append("g")
	           .attr("class", "axis")
	           .attr("transform", "translate( " + chart.xmargin + ",0)").call(yAxis);

	           sub = data.sub;

	           remove_subsections(false);
	           if ( $('#subdivide').is(':checked') ) {
					add_subsections(data);
				}
	       },

	 add_subsections = function(jsondata, transition){

	 	if(jsondata.sub === undefined) {
	 		console.log("nojson");
	 		console.log(jsondata);
	 		return;
	 	}

		multichart = layout.chartsvg.append("svg:g")
		.style("opacity",0);

		var chart_w = chart.width;
		var chart_h = chart.height;

		multichart.width = chart_w;
		multichart.height = chart_h;

		rev = jsondata;

		console.log(jsondata);

		var yscale = chart.yscale;
		var xscale = chart.xscale;

		multichart.xscale = xscale;
		var color = d3.scale.category20();

		var area = d3.svg.area()
		// .interpolate("basis")
		.x(function(d,i) { return xscale(d.x); })
		.y0(function(d) { return yscale(d.y0); })
		.y1(function(d) { return yscale(d.y0 + d.y); });

		var line = d3.svg.line()
		// .interpolate("basis")
		.x(function(d,i) { return xscale(d.x); })
		.y(function(d) { return yscale(d.y0 + d.y); });

		var stack = d3.layout.stack()
		.values(function(d) { return d.val; });

		var layers = rev.sub;
		var convert = layers.map(function(d) {
			var values = [];
			for(var i=min_year; i <= max_year ; i++){
				if( d[i.toString()] === undefined ) {
					values.push({ "x" : i , "y" : 0});
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

		// browser.append("text")
		// .datum(function(d) { return {name: d.name, val: d.val[d.val.length - 1]}; })
		// .attr("transform", function(d) { return "translate(" + xscale(d.val.x) + "," + yscale(d.val.y0 + d.val.y / 2) + ")"; })
		// .attr("x", -5)
		// .attr("dy", ".35em")
		// .text(function(d) { 
		// 	console.log(yscale.range()[0] - yscale(d.val.y));
		// 	if((yscale.range()[0] - yscale(d.val.y)) > 20) {
		// 		return d.name;
		// 	} else {
		// 		return "";
		// 	}
		// });
		if (transition === undefined){
			multichart.transition().duration(500).style("opacity",1);
		} else {
			multichart.style("opacity",1);
		}

	},

		remove_subsections = function (transition){
			if(multichart === undefined) {
				return;
			}
			if(transition === true) {
				multichart.transition().duration(500).style("opacity",0);
				multichart.transition().delay(500).remove();	
			} else {
				multichart.remove();
			}
		};


	       return{
	       	chart : chart,
	       	initialize : initialize,
	       	drawline : drawline,
	       	add_subsections : add_subsections,
	       	remove_subsections : remove_subsections
	       }
	   }();