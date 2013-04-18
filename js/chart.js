var avb = avb || {};

avb.chart = function(){
	var chart,
	multichart,

	initialize = function(){

		if(layout.chartsvg !== undefined) {
			layout.chartsvg.remove();
		}

		layout.chartsvg = d3.select("#chart").append("svg");

		layout.chartsvg.width = $("#chart").width();

		// compute height to align with bars
		layout.chartsvg.height = $('#chart').height();


		layout.chartsvg.attr("height", layout.chartsvg.height )
		.attr("width", layout.chartsvg.width);

		var width = layout.chartsvg.width;
		var height = layout.chartsvg.height;
		if(chart !== undefined ) {
			chart.remove();
		}
		chart = layout.chartsvg.append("svg:g");

		chart.xmargin = 50;
		chart.ymargin = 20;
		chart.width = width - 15;
		chart.height = height;
		chart.linestack = [];
		chart.xscale = d3.scale.linear().domain([min_year, max_year]).range([chart.xmargin, chart.width]);

		var today = svgtext_draw(chart, chart.xscale(cur_year), 15, "Today", "svggrey");
		translate(today, - today.node().getBBox().width/2,0);

		// controles
		chart.modes = [ { key : "Simple", disabled : false}, {key : "Detailed", disabled : true} ];
		
		chart.controls = legend(chart.modes, chart.width/2, "#666", modechange);
	},

	modechange = function(d, i){

		if(d.disabled === false ) return; 
		chart.modes.map(function(s) {
			s.disabled = true;
			return s;
		});
		d.disabled = false;
		chart.controls.remove();

		var offsetX = (chart.width - chart.xmargin) / 2;

		chart.controls = legend(chart.modes, chart.width/2, "#666", modechange);

		if(d.key === "Detailed") {
			add_subsections(cur_json);
		} else {
			remove_subsections(true);
		}

	},


	legend  = function(data, x, color, callback) {

		var width = 200;
		var height = 50;

		var chart = nv.legend()
		.width(width)
		.height(height);

		if( color !== undefined) {
			chart.color(function() { return color;});
		} else {
			chart.color(function() { return "#666"});
		}


		if( callback !== undefined) {
			chart.dispatch.on('legendClick', callback);
		}

		var newlegend = layout.chartsvg.append("g")
		.attr('width',  width)
		.attr('height', height)
		.datum(data)
		.call(chart);

		translate(newlegend, x - width, 0);

		return newlegend;
	},



	drawline = function(data, color, clear) {

		if(chart.legend !== undefined) {
			chart.legend.remove();
		}

		var label = data.key.length > 18 ? data.key.substr(0,18) + ".." : data.key;
		chart.legend = legend( [{ key : label }], chart.width + 15, color);

		if(typeof(clear)==='undefined') clear = false;
		if(clear) {
			for(var i=0; i<chart.linestack.length; i++) {
				chart.linestack[i].remove();   
			}
		}

		var yscale = d3.scale.linear().domain([0,d3.max(data.values, get_values)*1.2])
		.range([chart.height - chart.ymargin, 20]);
		chart.yscale = yscale;
		var xscale = chart.xscale;

		var container = chart.append("svg:g")
		chart.linestack.push(container);

		container.xgrid_axis = d3.svg.axis()
		.scale(xscale)
		.orient("bottom")
		.tickSize(-chart.height + chart.ymargin + 20, 0, 0)
		.ticks(6)
		.tickFormat(function (d) { 
			return "";});

		container.xgrid = container.append("g")
		.attr("class", "multigrid")
		.attr("transform", "translate(0," + (chart.height - chart.ymargin) + ")")
		.call(container.xgrid_axis);

		container.ygrid_axis = d3.svg.axis()
		.scale(yscale)
		.ticks(4)
		.orient("left")
		.tickSize(-chart.width + chart.xmargin , 0, 0)
		.tickFormat(function (d) { 
			return "";});

		container.ygrid = container.append("g")
		.attr("class", "multigrid")
		.attr("transform", "translate(" + chart.xmargin + ",0)")                 
		.call(container.ygrid_axis);   

		var line = d3.svg.line()
		.interpolate("monotone")
		.x(function(d) { return xscale(d.year); })
		.y(function(d) { return  yscale(d.val); });

        // area
        var area = d3.svg.area()
		.interpolate("monotone")
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

        //non-projection area
        container.append("svg:path").attr("d", area(data.values.slice(0,projected +1)))
        .style("fill", color)
        .style("opacity", 0.2);

        // projection area
        container.append("svg:path").attr("d", area(data.values.slice(projected, data.values.length )))
        .style("fill", color)
        .style("opacity", 0.2);
        
        // non-projection line
        container.append("svg:path").attr("d", line(data.values.slice(0,projected +1)))
        .attr("class","graphline")
        .style("stroke", color)
        .style("opacity", 0.6);
        
        // projection line
        container.append("svg:path").attr("d", line(data.values.slice(projected, data.values.length )))
        .attr("class","graphline_proj")
        .style("stroke", color)
        .style("opacity", 0.6);

        var getcolor = function (d){
        	if(d.year === cur_year) {
        		return "rgb(167, 103, 108)";
        	} else {
        		return color;
        	}
        };

       //axes
       var xAxis = d3.svg.axis(container)
       .scale(xscale)
       .orient("bottom")
       .tickSize(0, 0, 0)
       .tickPadding(10)
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

       
        // hotspots
        container
        .append("svg:g")
        .attr("data-name", data.key)
        .selectAll("circle")
        .data(data.values)
        .enter()
        .append("circle")
        .attr("class","chart-circle")
        .attr("cx", function(d) { return xscale(d.year); })
        .attr("cy", function(d) { return yscale(d.val); })
        .attr("r", function(d) { 
        	if(d.val > 0 && d.year > min_year) {
        		return 6;
        	} else {
        		return 0;
        	}
        })
        .attr("stroke", color)
        .attr("fill", color);

        $('.chart-circle').popover({
        	container:'body',
        	placement: 'bottom',
        	trigger: 'hover',
        	title: function(){
        		return $(this).parent().attr("data-name") +
        		" in " + d3.select(this).datum().year;
        	},
        	content: function() {
        		$('#popover-value')
        		.text(formatcurrency(d3.select(this).datum().val));
        		return $('#popover-html').html();
        	},
        	html: true
        });

        sub = data.sub;

        remove_subsections(false);
        if ( $('#subdivide').is(':checked') ) {
        	add_subsections(data);
        }
    },

    add_subsections = function(jsondata, transition){

    	if(jsondata.sub === undefined) return;

    	multichart = layout.chartsvg.append("svg:g")
    	.style("opacity",0);

    	var chart_w = chart.width;
    	var chart_h = chart.height;

    	multichart.width = chart_w;
    	multichart.height = chart_h;

    	var yscale = chart.yscale;
    	var xscale = chart.xscale;

    	multichart.xscale = xscale;
    	var color = d3.scale.category20();

    	var area = d3.svg.area()

		.interpolate("monotone")
		.x(function(d,i) { return xscale(d.year); })
		.y0(function(d) { return yscale(d.y0); })
		.y1(function(d) { return yscale(d.y0 + d.val); });

		var line = d3.svg.line()
		.interpolate("monotone")
		.x(function(d,i) { return xscale(d.year); })
		.y(function(d) { return yscale(d.y0 + d.val); });

		var stack = d3.layout.stack()
		.values(function(d) { return d.values; })
		.x(function(d) { return d.year;})
		.y(function(d) { return d.val;});

		var instance = stack(jsondata.sub);

		var browser = multichart.selectAll(".browser")
		.data(instance)
		.enter().append("g")
		.attr("class", "browser");

		multichart.areas = browser.append("path")
		.attr("class", "multiarea")
		.attr("d", function(d) { return area(d.values); })
		.style("fill", function(d,i) { return colors[i%20]; });

		multichart.lines = browser.append("path")
		.attr("class", "multiline")
		.attr("d", function(d) { return line(d.values); })
		.style("stroke", function(d,i) { return colors[i%20]; });

		multichart.areas.on("mouseout", function(d,i) {
			tooltip.style("visibility", "hidden");
			d3.select(this).attr("opacity","1");
		});        
		multichart.areas.on("mouseover", function(d) {
			d3.select(this).attr("opacity","0.7");
			tooltip.style("visibility","visible")
			.style("left", (d3.event.pageX + 10).px())
			.style("top", (d3.event.pageY + 2).px())
			.text(d.key);
		});
		multichart.areas.on("mousemove", function(d) {
			tooltip.style("left", (d3.event.pageX + 10).px())
			.style("top", (d3.event.pageY + 2).px())
			.text(d.key);
		});


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