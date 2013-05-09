var avb = avb || {};

avb.chart = function(){
	var chart, layers

	initialize = function(div){

		if(chart !== undefined) {
			chart.remove();
		}

		chart = d3.select(div).append("svg");

		chart.width = $(div).width() ;
		chart.height = $(div).height();
    chart.xmargin = 50;
    chart.ymargin = 20;
    chart.linestack = [];
    chart.xscale = d3.scale.linear()
    .domain([firstYear, lastYear])
    .range([chart.xmargin, chart.width]);


    chart.attr("height", chart.height )
    .attr("width", chart.width);


    $('#chart-expand').click(function(d){
      $('#modal-container').modal({
        onOpen : modalOpen,
        onClose : modalClose,
        opacity : 70
      });
    });
    // chart expansion
  },

  initializeSwitch = function(){
        // chart mode switch
        $("#layer-switch").click(function(d) {
          if ( $('#layer-switch').is(':checked') ) {
            //switch activated
            enableLayers(currentSelection.data);
            $('#legend').css({ 'margin-top' :  Math.max(0, ($('#bottom-right').height() - $('#legend').height())/2) })
            $('#legend').animate({left: '0'});
            $('#cards').animate({left: '100%'});
          } else {
            //switch deactivated
            removeLayers();
            $('#legend').animate({left: '-100%'});
            $('#cards').animate({left: '0'});
          }
        })
      },

      legend  = function(layers) {

        var legendLabels = [];
        layers.each(function(d) {
          legendLabels.push({ key : d.key, color : d3.select(this).select('path').style('fill') });
        });

        d3.selectAll("#legend tr").remove();

        // add legend rows
        var rows = d3.select("#legend tbody") .selectAll("tr")
        .data(legendLabels).enter().append("tr");

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

        // redraw case
        if(data === undefined) {
          data = currentSelection.data;
          color = currentSelection.color;
        }

        // set fixed opacity
        color = color.replace(color.split(',')[3], ')').replace('a','');

        layersEnabled = $('#layer-switch').is(':checked');

        if(chart.axes === undefined){
          chart.grids = chart.append('g');
          chart.areagroup = chart.append('g');
          chart.layers = chart.append('g');
          chart.linegroup = chart.append('g');
          chart.axes = chart.append('g');
        }

        d3.selectAll(chart.grids.node().childNodes).remove()
        d3.selectAll(chart.axes.node().childNodes).remove()

        /*
        *  x/y scales
        */
        chart.yscale = d3.scale.linear().domain([0,d3.max(data.values, get_values)*1.2])
        .range([chart.height - chart.ymargin, 10]);

       
        /*
        * grids
        */

        // xgrid
        var xgrid_axis = d3.svg.axis().scale(chart.xscale).orient("bottom")
        .tickSize(-chart.height + chart.ymargin, 0, 0).ticks(6)
        .tickFormat(function (d) { return '';});

        chart.grids.append("g")
        .attr("class", "multigrid")
        .attr("transform", "translate(0," + (chart.height - chart.ymargin) + ")")
        .call(xgrid_axis);

        // y grid
        var ygrid_axis = d3.svg.axis().scale(chart.yscale).orient("left")
        .ticks(4).tickSize(-chart.width + chart.xmargin , 0, 0)
        .tickFormat(function (d) { return "";});

        chart.grids.append("g")
        .attr("class", "multigrid")
        .attr("transform", "translate(" + chart.xmargin + ",0)")                 
        .call(ygrid_axis);

        /*
        * line - areas 
        */

        // line function
        var line = d3.svg.line()
        .interpolate("monotone")
        .x(function(d) { return chart.xscale(d.year); })
        .y(function(d) { return  chart.yscale(d.val); });

        // area
        var area = d3.svg.area()
        .interpolate("monotone")
        .x(function(d,i) { return chart.xscale(d.year); })
        .y0(function(d) { return (chart.height - chart.ymargin); })
        .y1(function(d) { return chart.yscale(d.val); });

        var projected = lastYear - currentYear;

        // current year line
        chart.grids.append("line").classed('thisYearLine',true)
        .attr("x1", chart.xscale(thisYear)).attr("x2", chart.xscale(thisYear))
        .attr("y1", 0).attr("y2", chart.height - chart.ymargin)
        .style("stroke","black");

        /*
        * line and areas drawing
        */
        var transitionDuration = 0;
        if (chart.visuals === undefined) {
          chart.visuals = []
          for(i=0; i<2; i++) chart.visuals.push(chart.linegroup.append("svg:path")); 
          for(i=0; i<2; i++) chart.visuals.push(chart.areagroup.append("svg:path")); 
        }
        transitionDuration = 0;

        //non-projection area
        chart.visuals[0].classed("area",true)
        .transition().duration(transitionDuration)
        .attr("d", area(data.values.slice(0,projected +1)))
        .attr("color", color).style("fill", layersEnabled ? 'rgb(0,0,0)' : color);

        // projection area
        chart.visuals[1].classed("area",true).classed("projection",true)
        .transition().duration(transitionDuration)
        .attr("d", area(data.values.slice(projected, data.values.length )))
        .attr("color", color).style("fill", layersEnabled ? 'rgb(0,0,0)' : color);
        
        // non-projection line
        chart.visuals[2].classed("line", true)
        .transition().duration(transitionDuration)
        .attr("d", line(data.values.slice(0,projected +1)))
        .style("stroke", color);
        
        // projection line
        chart.visuals[3].classed("line", true).classed("projection", true)
        .transition().duration(transitionDuration)
        .attr("d", line(data.values.slice(projected, data.values.length )))
        .style("stroke", color);

       /*
       * x/y axes
       */
       var xAxis = d3.svg.axis().scale(chart.xscale)
       .orient("bottom").tickSize(0, 0, 0).tickPadding(10)
       .tickFormat(function(d){ return d; });

       var yAxis = d3.svg.axis().scale(chart.yscale).ticks(5)
       .orient("left").tickSize(0, 0, 0).tickPadding(5)
       .tickFormat(function(d){
       	return formatcurrency(d);
       });

       if(chart.xAxisSocket !== undefined) {
       	chart.xAxisSocket.remove();
       	chart.yAxisSocket.remove();
       }
       
       /*
       * Hotspots and popovers
       */
        if(chart.circles === undefined) {
          chart.circles = chart.linegroup.append("svg:g");
          chart.circles.selectAll("circle").data(data.values).enter().append("circle");
        }

        chart.circles.attr("data-name", data.key)
        .selectAll("circle").data(data.values)
        .transition().duration(transitionDuration)
        .attr("cx", function(d) { return chart.xscale(d.year); })
        .attr("cy", function(d) { return chart.yscale(d.val); })
        .attr("r", 5)
        .attr("stroke", color).attr("fill", color);

        chart.circles.attr("data-name", data.key)
        .selectAll("circle").data(data.values).enter().append("circle");

        $('#chart circle').popover({
        	container:'body',
        	placement: 'top',
        	trigger: 'hover',
        	content: function() {
        		$('#popover-value').text(formatcurrency(d3.select(this).datum().val));
        		return $('#popover-html').html();
        	},
        	html: true
        });

        $('#chart circle:first').trigger('hover');

       /*
       * Overflows
       */

        // covers leftmost circle overflow 
        var overflows = chart.axes.append("g").classed('overflows',true);
        overflows.append("rect").attr("width",chart.xmargin)
        .attr("height", chart.height);

        // covers line overflow when value is 0
        overflows.append("rect").attr("width", chart.width)
        .attr("height", chart.ymargin).attr("y", chart.height - chart.ymargin);


        chart.xAxisSocket = chart.axes.append("g")
        .classed("axis",true).classed("xAxis",true)
        .attr("transform", "translate(0," + (chart.height - chart.ymargin -1) + ")").call(xAxis);

        chart.yAxisSocket = chart.axes.append("g")
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

      removeLayers(false);

      if ( layersEnabled ) {
       enableLayers(data);
     }
   },

   enableLayers = function(jsondata, transition){


    $('.popover').hide();

    if(jsondata.sub === undefined) return;

    layers = chart.layers.append('g')
    .classed('layers',true);

    var chart_w = chart.width;
    var chart_h = chart.height;

    layers.width = chart_w;
    layers.height = chart_h;

    var yscale = chart.yscale
    var xscale = chart.xscale;

    layers.xscale = xscale;
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
      var browser = layers.selectAll(".browser")
      .data(instance)
      .enter().append("g")
      .attr("class", "browser");


      console.log("DRAWING AREAS")
      // draw areas
      layers.areas = browser.append("path")
      .attr("class", "multiarea")
      .attr("d", function(d) { return area(d.values); })
      .style("fill", function(d,i) { return colors[i%20]; });

      // draw lines
      layers.lines = browser.append("path")
      .attr("class", "multiline")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d,i) { return colors[i%20]; });

      // legend
      legend(browser);

      // areas to gray
      d3.selectAll(".area").classed("layers",true).style("fill", "rgb(0,0,0)");
      d3.selectAll(".area").each(function(){
        log(this)
      })

      // not fundamental, improves layers looks
      $('.layers g:last .multiline').remove();

      if (transition === undefined){
        layers.transition().duration(500).style("opacity",1);
      } else {
        layers.style("opacity",1);
      }

    },

    removeLayers = function (){
      if(layers !== undefined){
        // d3.selectAll('.area').classed("layers",false)
        // .style("fill", function(){ return d3.select(this).attr("color")});
      	layers.transition().duration(500).style("opacity",0);
      	layers.transition().delay(500).remove();
      }	
    };


    return{
    	chart : chart,
    	initialize : initialize,
    	drawline : drawline,
    	enableLayers : enableLayers,
    	removeLayers : removeLayers,
      initializeSwitch : initializeSwitch
    }
  }();