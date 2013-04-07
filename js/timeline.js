var avb = avb || {};

avb.timeline = function(){
    var ntl,

    switchview = function(start, end) {
        if(end === undefined) {
            if (mode === 2) {
                avb.multichart.remove();
                setTimeout(function() {initsingle(cur_json);}, 600);
            }
        } else {
            if (mode === 1) {
                single_remove();

                setTimeout(function() {initmultiple(cur_json);}, 600);
            }
        }
    },

    timeline_onclick  = function () {
        // ntl.selrange.attr("width",0);
        // ntl.selector.transition().attr("transform", "translate(" + d3.mouse(this)[0] + ",0)");
        // console.log("click");
    },

    timeline_ondragstart = function() {
        console.log("start");
        ntl.selrange.attr("width",0);
        ntl.actionstart = new Date();
        ntl.selectend.attr("display", "none");
        ntl.selrange.start = d3.mouse(this)[0];
        ntl.selector.attr("transform", "translate(" + ntl.selrange.start + ",0)");
        ntl.selrange.attr("x", ntl.selrange.start + ntl.selector.node().getBBox().width/2);
    },

    timeline_ondrag = function() {
        if( (new Date() - ntl.actionstart) <= 100) {
            return;
        }
        if ((d3.mouse(this)[0] - ntl.selrange.start) > 0)  {
            ntl.selrange.attr("width", d3.mouse(this)[0] - ntl.selrange.start)
        }
    },

    timeline_ondragend = function() {
        console.log("dragend");
        if( (new Date() - ntl.actionstart) <= 100) {
            ntl.selrange.attr("width",0);
            ntl.selector.transition().attr("transform", "translate(" + d3.mouse(this)[0] + ",0)");
            switchview(ntl.xscale.invert(d3.mouse(this)[0]));
            return;
        }
        translate(ntl.selectend, d3.mouse(this)[0], 0);
        ntl.selectend.attr("display", "inline");
                //draw_multchart_scale(ntl.selrange.start ,d3.mouse(this)[0]);
                switchview(ntl.xscale.invert(ntl.selrange.start), ntl.xscale.invert(d3.mouse(this)[0]));
            },

            init_timeline_sel = function(timeline) {
                // var selector = timeline.append("svg:g")
                // .attr("class", "tselect");

                // selector.append("svg:path")
                // .attr("d","M0,0H20L10,20L0,0")
                // .attr("class", "tselect")
                // .attr("transform", "scale(0.7,0.7)")

                // selector.append("svg:line")
                // .attr("x1", selector.node().getBBox().width/2)
                // .attr("x2", selector.node().getBBox().width/2)
                // .attr("y1", selector.node().getBBox().height)
                // .attr("y2", ntl.height - ntl.padding)
                // .attr("stroke", "black");
                // return selector;
            }



            initialize = function() {
                // var tl_w = d3.select("#tl").property("clientWidth");
                // var tl_h = tl_w * 0.04;
                // //var tl_h = d3.select("#tl").property("clientHeight");
                // ntl = d3.select("#tl").append("svg")
                // .attr("width", tl_w)
                // .attr("height", tl_h);

                // ntl.width = tl_w;
                // ntl.height = tl_h;
                // ntl.padding = tl_h*0;
                // ntl.xscale = d3.scale.linear().domain([min_year, max_year]).range([ntl.padding, tl_w - ntl.padding]);
                // ntl.background = ntl.append("svg:rect").attr("class","tlb")
                // .attr("width", ntl.width)
                // .attr("height", ntl.height );

                // ntl.selector = init_timeline_sel(ntl);
                // ntl.selectend = init_timeline_sel(ntl).attr("display","none");


                // ntl.selrange = ntl.append("svg:rect")
                // .attr("height", ntl.height - ntl.padding)
                // .attr("opacity", 0.2)
                // .attr("fill", "steelblue");

                // ntl.selrange.start = 0;
                // ntl.actionstart = 0;

                // ntl.call(d3.behavior.drag()
                //     .on("dragstart", timeline_ondragstart)
                //     .on("drag", timeline_ondrag)
                //     .on("dragend", timeline_ondragend)
                //     );

                // ntl.on("click", timeline_onclick);

                // var xAxis = d3.svg.axis()
                // .scale(ntl.xscale)
                // .orient("bottom")
                // .tickSize(0)
                // .tickFormat(function (d) { 
                //     return d.toString();});

                // ntl.append("g")
                // .attr("transform", "translate(0," + (ntl.height - 20) + ")")
                // .attr("class","tlaxis")
                // .call(xAxis);
                initialize_jq();
            },


            update = function(jsondata){
                // var data = toarray(jsondata);
                // var yscale = d3.scale.linear().domain(d3.extent(data.values, get_values))
                // .range([ntl.height, 0]);
                // var line = d3.svg.line()
                // .interpolate("basis")
                // .x(function(d) { return ntl.xscale(d.year); })
                // .y(function(d) { return (yscale(d.val)); });

                // var area = d3.svg.area()
                // .interpolate("basis")
                // .x(function(d) { return ntl.xscale(d.year); })
                // .y1(function(d) { return (yscale(d.val)); })
                // .y0(function(d) { return (ntl.height); });


                // ntl.append("svg:path").attr("d", line(data.values))
                // .attr("class","graphline")
                // .style("stroke", "steelblue")
                // .style("stroke-width", 1);
                // ntl.append("svg:path").attr("d", area(data.values))
                // .attr("fill", "lightblue")
                // .attr("opacity",0.3);
            };

            initialize_jq = function(){
              $(".noUiSlider").noUiSlider({
                range: [min_year, max_year],
                handles : 1
                ,start: cur_year
                ,step: 1
                });

              var timescale = d3.scale.linear()
              .domain([min_year,max_year])
              .range([5, $(".noUiSlider").width()]);

              var svgscale = d3.select("#sliderscale").append("svg")
              .attr("width", $("#sliderscale").width())
              .attr("height", 30);

              timeaxis = d3.svg.axis()
              .scale(timescale)
              .orient("bottom")
              .tickPadding(10)
              .tickSize(5,0,0)
              .tickFormat(function(d){
                return d.toString();
              });

            svgscale.append("g")
            .call(timeaxis)
            .classed("timeaxis",true)
            .attr("transform", "translate(0,5)");

          };

          return{
            update : update,
            switchview : switchview,
            initialize : initialize

        }
    }();