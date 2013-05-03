var avb = avb || {};

avb.chart = function(){
	var chart,
	multichart,
	firstPopover,

	initialize = function(div){

		if(layout.chartsvg !== undefined) {
			layout.chartsvg.remove();
		}

		layout.chartsvg = d3.select(div).append("svg");


		layout.chartsvg.width = $(div).width();

		// compute height to align with bars
		layout.chartsvg.height = $(div).height();


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
		chart.xscale = d3.scale.linear().domain([firstYear, lastYear]).range([chart.xmargin, chart.width]);

    // chart expansion
  },

  initializeLayers = function(){
        // chart mode switch
        $("#myonoffswitch").click(function(d) {
          if ( $('#myonoffswitch').is(':checked') ) {
            enableLayers(currentSelection.data);
            $('#legend').animate({left: '0'});
            $('#cards').animate({left: '100%'});
          } else {
            removeLayers();
            $('#legend').animate({left: '-100%'});
            $('#cards').animate({left: '0'});
          }
        })

        $('#chart-expand').click(function(d){
          $('#modal-container').modal({
            onOpen : modalOpen,
            onClose : modalClose,
            opacity : 70
          });
        });

      },

      legend  = function(layers) {

        var legendLabels = [];
        layers.each(function(d) {
          legendLabels.push({ key : d.key, color : d3.select(this).select('path').style('fill') });
        });

        d3.selectAll("#legend tr").remove();

        var rows = d3.select("#legend tbody")
        .selectAll("tr")
        .data(legendLabels)
        .enter()
        .append("tr");

        rows.append("td").append('div')
        .classed('legend-label', true)
        .style('background-color', function(d){
          return d.color;
        });

        rows.append("td").text(function(d){
          return d.key;
        })
      },



      drawline = function(data, color) {
        var popover = true;

        if(data === undefined) {
          data = currentSelection.data;
          color = currentSelection.color;
          popover = false;
        }

        if(chart.last !== undefined) { 
          chart.last.selectAll('.multigrid').remove();
          chart.last.selectAll('.axis').remove();
          chart.last.selectAll('.overflows').remove();
          chart.last.selectAll('.thisYearLine').remove();
          
        }

        /*
        *  x/y scales computation
        */
        var yscale = d3.scale.linear().domain([0,d3.max(data.values, get_values)*1.2])
        .range([chart.height - chart.ymargin, 10]);
        chart.yscale = yscale;
        var xscale = chart.xscale;

        var container = (chart.last === undefined) ? chart.append('svg:g') : chart.last.select("g");

        /*
        * grids
        */
        container.xgrid_axis = d3.svg.axis().scale(xscale).orient("bottom")
        .tickSize(-chart.height + chart.ymargin, 0, 0).ticks(6)
        .tickFormat(function (d) { return '';});

        container.xgrid = container.append("g")
        .attr("class", "multigrid")
        .attr("transform", "translate(0," + (chart.height - chart.ymargin) + ")")
        .call(container.xgrid_axis);

        container.ygrid_axis = d3.svg.axis().scale(yscale).orient("left")
        .ticks(4).tickSize(-chart.width + chart.xmargin , 0, 0)
        .tickFormat(function (d) { return "";});

        container.ygrid = container.append("g")
        .attr("class", "multigrid")
        .attr("transform", "translate(" + chart.xmargin + ",0)")                 
        .call(container.ygrid_axis);

        $('.multigrid').each(function(){
          $(this).prependTo($(this).parent())
        })

        /*
        * line - areas 
        */

        // line function
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

        var projected = lastYear - currentYear;

        // current year line
        container.append("line").classed('thisYearLine',true)
        .attr("x1", chart.xscale(thisYear)).attr("x2", chart.xscale(thisYear))
        .attr("y1", 0).attr("y2", chart.height - chart.ymargin)
        .style("stroke","black");

        $('.thisYearLine').each(function(){
          $(this).prependTo($(this).parent());
        })

        var transitionDuration = 300;

        if(chart.line1 === undefined) {
          chart.line1 = container.append("svg:path");     
          chart.line2 = container.append("svg:path");
          chart.area1 = container.append("svg:path");
          chart.area2 = container.append("svg:path");
          transitionDuration = 0;
        }

        //non-projection area
        chart.area1.attr('id','area1').transition().duration(transitionDuration)
        .attr("d", area(data.values.slice(0,projected +1)))
        .style("fill", color).style("opacity", 0.2);

        // projection area
        chart.area2.attr('id','area2').transition().duration(transitionDuration)
        .attr("d", area(data.values.slice(projected, data.values.length )))
        .style("fill", color).style("opacity", 0.1);
        
        // non-projection line
        chart.line1.attr('id','line1')
        .classed("chartline", true)
        .transition().duration(transitionDuration)
        .attr("d", line(data.values.slice(0,projected +1)))
        .style("stroke", color).style("opacity", 0.6);

        
        // projection line
        chart.line2.attr('id','line2')
        .classed("chartline", true).classed("chartline-projection", true)
        .transition().duration(transitionDuration)
        .attr("d", line(data.values.slice(projected, data.values.length )))
        .style("stroke", color).style("opacity", 0.6);

       /*
       * x/y axes
       */
       var xAxis = d3.svg.axis(container).scale(xscale)
       .orient("bottom").tickSize(0, 0, 0).tickPadding(10)
       .tickFormat(function(d){ return d; });

       var yAxis = d3.svg.axis().scale(yscale).ticks(5)
       .orient("left").tickSize(0, 0, 0).tickPadding(5)
       .tickFormat(function(d){
       	return formatcurrency(d);
       });


       if(chart.xAxisSocket !== undefined) {
       	chart.xAxisSocket.remove();
       	chart.yAxisSocket.remove();
       }
       
        // hotspots

        if(chart.circles === undefined) {
          chart.circles = container.append("svg:g");
          chart.circles.selectAll("circle").data(data.values).enter().append("circle");
        }

        chart.circles.attr("data-name", data.key)
        .selectAll("circle").data(data.values)
        .transition().duration(transitionDuration)
        .attr("class","chart-circle")
        .attr("cx", function(d) { return xscale(d.year); })
        .attr("cy", function(d) { return yscale(d.val); })
        .attr("r", 5)
        .attr("stroke", color).attr("fill", color);

        console.log(chart.circles.attr("data-name", data.key)
        .selectAll("circle").data(data.values).enter().append("circle"));

        $('.chart-circle').popover({
        	container:'body',
        	placement: 'top',
        	trigger: 'hover',
        	content: function() {
        		if(firstPopover !== undefined) {
        			firstPopover.popover('hide');
        			firstPopover = undefined;
        		}
        		$('#popover-value')
        		.text(formatcurrency(d3.select(this).datum().val));

        		return $('#popover-html').html();
        	},
        	html: true
        });

      var overflowFill = '#f9f9f9';

      var overflows = chart.append("g").classed('overflows',true);
      overflows.append("rect").attr("width",chart.xmargin)
      .attr("height", chart.height).attr('fill',overflowFill);

      overflows.append("rect").attr("width",5)
      .attr("height", chart.height).attr('x', chart.width)
      .attr('fill',overflowFill);

      overflows.append("rect").attr("width", chart.width)
      .attr("height", chart.ymargin).attr("y", chart.height - chart.ymargin)
      .attr('fill',overflowFill);


      chart.xAxisSocket = chart.append("g")
      .classed("axis",true).classed("xAxis",true)
      .attr("transform", "translate(0," + (chart.height - chart.ymargin -1) + ")").call(xAxis);

      chart.yAxisSocket = chart.append("g")
      .attr("class", "axis")
      .attr("transform", "translate( " + chart.xmargin + ",0)").call(yAxis);

      // mark odd entries

      // d3 can't do odd selectors
      $('.xAxis .tick:odd').each(function(){
        //jquery can't add classes to SVG elements
        d3.select(this).classed('odd',true);
      });

      d3.select('.xAxis g:nth-child(' + (yearIndex+1) + ')')
      .classed('thisYear', true);

      chart.last = chart;

      removeLayers(false);
      if ( $('#myonoffswitch').is(':checked') ) {
       enableLayers(data);
     }
   },

   enableLayers = function(jsondata, transition){


    $('.popover').hide();

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

      // line declaration
      var area = d3.svg.area()
      .interpolate("monotone")
      .x(function(d,i) { return xscale(d.year); })
      .y0(function(d) { return yscale(d.y0); })
      .y1(function(d) { return yscale(d.y0 + d.val); });

      // area declaration
      var line = d3.svg.line()
      .interpolate("monotone")
      .x(function(d,i) { return xscale(d.year); })
      .y(function(d) { return yscale(d.y0 + d.val); });

      // stack declaration
      var stack = d3.layout.stack()
      .values(function(d) { return d.values; })
      .x(function(d) { return d.year;})
      .y(function(d) { return d.val;});

      var instance = stack(jsondata.sub);

      // calculate areas
      var browser = multichart.selectAll(".browser")
      .data(instance)
      .enter().append("g")
      .attr("class", "browser");

      // draw areas
      multichart.areas = browser.append("path")
      .attr("class", "multiarea")
      .attr("d", function(d) { return area(d.values); })
      .style("fill", function(d,i) { return colors[i%20]; });

      // draw lines
      multichart.lines = browser.append("path")
      .attr("class", "multiline")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d,i) { return colors[i%20]; });

      // legend
      legend(browser);


      if (transition === undefined){
        multichart.transition().duration(500).style("opacity",1);
      } else {
        multichart.style("opacity",1);
      }

    },

    removeLayers = function (){

    	if(multichart === undefined) {
    		return;
    	}
    	multichart.transition().duration(500).style("opacity",0);
    	multichart.transition().delay(500).remove();	
    };


    return{
    	chart : chart,
    	initialize : initialize,
    	drawline : drawline,
    	enableLayers : enableLayers,
    	removeLayers : removeLayers,
      initializeLayers : initializeLayers
    }
  }();