var avb = avb || {};

avb.chart = function(){
	var chart,

	initialize = function(x, y){
		var width = layout.chartsvg.width;
		var height = layout.chartsvg.height;
		if(chart !== undefined ) {
			chart.remove();
		}
		chart = layout.chartsvg.append("svg:g");

		chart.padding = 50;
		chart.x = x;
		chart.y = y;
		chart.width = width - chart.padding;
		chart.height = height;
		chart.linestack = [];

		chart.xAxisSocket = chart.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (chart.height - chart.padding) + ")");

		chart.yAxisSocket = chart.append("g")
		.attr("class", "axis")
		.attr("transform", "translate( " + chart.padding + ",0)");

	},


	drawline = function(data, color, clear) {
		if(typeof(clear)==='undefined') clear = false;
		if(clear) {
			for(var i=0; i<chart.linestack.length; i++) {
				chart.linestack[i].remove();   
			}
		}


		var values = [];
		var min_year = get_minyear(data);
		var max_year = get_maxyear(data);
		var projected = cur_year - min_year + 1 ;

		for(var j = min_year; j<= max_year; j++) {
			values.push(data[j.toString()]);
		}

		var yscale = d3.scale.linear().domain([0,d3.max(values)]).range([chart.height - chart.padding, 5]);
		var xscale = d3.scale.linear().domain([0, max_year-min_year]).range([chart.padding, chart.width]);

		var container = chart.append("svg:g");
		chart.linestack.push(container);

		container.xgrid_axis = d3.svg.axis()
		.scale(xscale)
		.orient("bottom")
		.tickSize(-chart.height, 0, 0)
		.tickFormat(function (d) { 
			return "";});

		container.xgrid = container.append("g")
		.attr("class", "multigrid")
		.attr("transform", "translate(0," + (chart.height - chart.padding) + ")")
		.call(container.xgrid_axis);

		container.ygrid_axis = d3.svg.axis()
		.scale(yscale)
		.orient("left")
		.tickSize(-chart.width + chart.padding, 0, 0)
		.ticks(5)
		.tickFormat(function (d) { 
			return "";});

		container.ygrid = container.append("g")
		.attr("class", "multigrid")
		.attr("transform", "translate(" + chart.padding + ",0)")                 
		.call(container.ygrid_axis);   

		var line = d3.svg.line()
		.x(function(d,i) { return xscale(i); })
		.y(function(d) { return  yscale(d); });

                // area
                var area = d3.svg.area()
                .x(function(d,i) { return xscale(i); })
                .y0(function(d) { return (chart.height - chart.padding); })
                .y1(function(d) { return yscale(d); });

                // non-projection area
                container.append("svg:path").attr("d", area(values.slice(0,projected)))
                .attr("class","grapharea")
                .style("fill", color)
                .style("opacity", nosel_opacity);
                
                // projection area
                container.append("svg:path").attr("d", area(values.slice(projected-1,years.length)))
                .attr("class","grapharea_proj")
                .attr("transform", "translate(" + (xscale(projected-1) - chart.padding).toString() + ",0)")
                .style("fill", color)
                .style("opacity", 0.15);

                // non-projection line
                container.append("svg:path").attr("d", line(values.slice(0,projected )))
                .attr("class","graphline")
                .style("stroke", color)
                .style("opacity", 0.7);
                
                // projection line
                container.append("svg:path").attr("d", line(values.slice(projected-1,years.length)))
                .attr("class","graphline_proj")
                .attr("transform", "translate(" + (xscale(projected-1) - chart.padding).toString() + ",0)")
                .style("stroke", color)
                .style("opacity", 0.7);
                
                // hotspots
                container.selectAll("circle")
                .data(values)
                .enter()
                .append("circle")
                .attr("class","graphcircle")
                .attr("cx", function(d,i) { return xscale(i); })
                .attr("cy", function(d) { return yscale(d); })
                .attr("r","5")
                .attr("stroke", color)
                .attr("stroke-opacity",0.8)
                .attr("fill-opacity",0.50)
                .attr("fill", color);

               //axes
               var xAxis = d3.svg.axis(container)
               .scale(xscale)
               .orient("bottom")
               .tickSize(0, 0, 0)
               .tickPadding(5)
               .tickFormat(function(d, i){
               	return years[i]; });

               var yAxis = d3.svg.axis()
               .scale(yscale)
               .ticks(5)
               .orient("left")
               .tickSize(0, 0, 0)
               .tickPadding(5)
               .tickFormat(function(d,i){
               	return formatcurrency(d);
               });

               chart.xAxisSocket.call(xAxis);
               chart.yAxisSocket.call(yAxis);

               chart_height = chart.node().getBBox().height;

           };



           return{
           	chart : chart,
           	initialize : initialize,
           	drawline : drawline
           }
       }();