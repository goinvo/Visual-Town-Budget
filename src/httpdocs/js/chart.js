var avb = avb || {};

avb.chart = function () {
    var chart, layers

        initialize = function (div) {

            if (chart !== undefined) {
                chart.remove();
            }

            chart = d3.select(div).append("svg");

            chart.width = $(div).width();
            chart.height = $(div).height();
            chart.xmargin = 50;
            chart.ymargin = 20;
            chart.layersWidth = 100;
            chart.linestack = [];
            chart.xscale = d3.scale.linear()
                .domain([firstYear, lastYear])
                .range([chart.xmargin, chart.width - 15]);


            chart.attr("height", chart.height)
                .attr("width", chart.width);

            $('#chart-expand').click(function (d) {
                $('#modal-container').modal({
                        onOpen: modalOpen,
                        onClose: modalClose,
                        opacity: 70
                    });
            });
            // chart expansion

        },



        legend = function (layers, parent) {

            var legendLabels = [];
            layers.each(function (d) {
                legendLabels.push({
                        key: d.key,
                        color: d3.select(this).select('path').style('fill')
                    });
            });

            d3.selectAll("#legend tr").remove();

            // add legend rows
            var rows = d3.select("#legend tbody").selectAll("tr")
                .data(legendLabels.reverse()).enter().append("tr");

            rows.append("td").append('div')
                .classed('legend-label', true)
                .style('background-color', function (d) {
                    return d.color;
                });

            rows.append("td").text(function (d) {
                return d.key;
            })

            $('#legend').center();

        },

        initializeLayers = function () {

            function setDatapointsOpacity(transition) {
                transition = 50;
                chart.circles.selectAll('circle').attr('opacity', function () {
                    var circle = d3.select(this);
                    if (parseFloat(circle.attr('cx')) < chart.layersWidth) {
                        circle.style('opacity', 0);
                    } else {
                        circle.style('opacity', 1);
                    }
                });
            };

            function appendDropshadow(group) {
                // filters go in defs element
                var defs = group.append("defs");

                var filter = defs.append("filter")
                    .attr("id", "ds2")
                    .attr("height", "300%").attr("width", "300%")
                    .attr("y", "-100%").attr("x", "-100%");

                filter.append("feGaussianBlur")
                    .attr("in", "SourceAlpha")
                    .attr("stdDeviation", 2)
                    .attr("result", "blur");

                filter.append("feOffset")
                    .attr("in", "blur")
                    .attr("dx", -2)
                    .attr("result", "offsetBlur");

                var feMerge = filter.append("feMerge");

                feMerge.append("feMergeNode")
                    .attr("in", "offsetBlur")
                feMerge.append("feMergeNode")
                    .attr("in", "SourceGraphic");
            };

            function translate(x, y) {
                return 'translate(' + x + ', ' + y + ')';
            }

            function slideLayers(x, transition) {

                x = Math.min(x, chart.xscale.range()[1]);
                x = Math.max(x, chart.xscale.range()[0]);
                chart.layersWidth = x;
                if (transition) {
                    chart.layerSlider.transition().duration(transition).ease('cubic-in-out').attr("cx", x);
                    chart.layers.svg.transition().duration(transition).ease('cubic-in-out').attr("width", x);
                    chart.layerLine.transition().duration(transition).ease('cubic-in-out').attr("x1", x).attr("x2", x);
                } else {
                    chart.layerSlider.attr("cx", x);
                    chart.layers.svg.attr("width", x);
                    chart.layerLine.attr("x1", x).attr("x2", x);
                }
                setDatapointsOpacity(transition);
            }

            if (chart.layerSlider) return;

            appendDropshadow(chart.layerWindow);

            chart.layerSlider = chart.layerWindow.append('circle').attr('cx',chart.layersWidth).attr('cy',chart.height/2)
            .attr('r', 8).classed('layerSlider', true);


            // button controls
            var drag = d3.behavior.drag()
                .on("drag", function (e) {
                    var x = d3.mouse(this)[0];
                    slideLayers(x);
                });
            chart.layerSlider.call(drag);

            chart.on('click', function () {
                var x = d3.mouse(this)[0];
                slideLayers(x, 250);
            });

        },

        drawline = function (data, color) {

            // redraw case
            if (data === undefined) {
                data = currentSelection.data;
                color = currentSelection.color;
            }

            layersEnabled = chart.layersSelected && (data.sub.length !== 0);

            if (chart.axes === undefined) {
                chart.grids = chart.append('g');
                chart.areagroup = chart.append('g');
                chart.layers = chart.append('g');
                chart.linegroup = chart.append('g');
                chart.axes = chart.append('g');
                chart.layerWindow = chart.append('g');
            }

            d3.selectAll(chart.grids.node().childNodes).remove()
            d3.selectAll(chart.axes.node().childNodes).remove()

            /*
             *  x/y scales
             */
            chart.yscale = d3.scale.linear().domain([0, d3.max(data.values, get_values) * 1.2])
                .range([chart.height - chart.ymargin, 10]);

            /*
             * grids
             */

            // xgrid

            // ticksize = height - 10px for legend space
            var xgrid_axis = d3.svg.axis().scale(chart.xscale).orient("bottom")
                .tickSize(-chart.yscale.range()[0] + 10, 0, 0).ticks(6)
                .tickFormat(function (d) {
                    return '';
                });

            chart.grids.append("g")
                .attr("class", "multigrid")
                .attr("transform", "translate(0," + (chart.yscale.range()[0]) + ")")
                .call(xgrid_axis);

            // y grid
            var ygrid_axis = d3.svg.axis().scale(chart.yscale).orient("left")
                .ticks(5).tickSize(-chart.width + 15 + chart.xmargin, 0, 0)
                .tickFormat(function (d) {
                    return "";
                });

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
                .x(function (d) {
                    return chart.xscale(d.year);
                })
                .y(function (d) {
                    return chart.yscale(d.val);
                });

            // area
            var area = d3.svg.area()
                .interpolate("monotone")
                .x(function (d, i) {
                    return chart.xscale(d.year);
                })
                .y0(function (d) {
                    return (chart.height - chart.ymargin);
                })
                .y1(function (d) {
                    return chart.yscale(d.val);
                });

            var projected = currentYear - firstYear;

            // current year line
            // chart.grids.append("line").classed('thisYearLine',true)
            // .attr("x1", chart.xscale(thisYear)).attr("x2", chart.xscale(thisYear))
            // .attr("y1", chart.yscale(data.values[yearIndex].val)).attr("y2", chart.height - chart.ymargin)
            // .style("stroke","black");

            /*
             * line and areas drawing
             */
            var transitionDuration = 0;
            if (chart.visuals === undefined) {
                chart.visuals = []
                for (i = 0; i < 2; i++) chart.visuals.push(chart.areagroup.append("svg:path"));
                for (i = 0; i < 2; i++) chart.visuals.push(chart.linegroup.append("svg:path"));
            }
            transitionDuration = 0;


            //non-projection area
            chart.visuals[0].classed("area", true)
                .transition().duration(transitionDuration)
                .attr("d", area(data.values.slice(0, projected + 1)))
                .attr("color", color);

            chart.visuals[1].classed("area", true).classed("projection", true)
                .transition().duration(transitionDuration)
                .attr("d", area(data.values.slice(projected, data.values.length)))
                .attr("color", color);

            if (layersEnabled) {
                chart.visuals[0].style("fill", "black");
                chart.visuals[1].style("fill", "black");
            } else {
                chart.visuals[0].style("fill", color);
                chart.visuals[1].style("fill", color);
            }

            // non-projection line
            chart.visuals[2].classed("line", true)
                .transition().duration(transitionDuration)
                .attr("d", line(data.values.slice(0, projected + 1)))
                .style("stroke", color);

            // projection line
            chart.visuals[3].classed("line", true).classed("projection", true)
                .transition().duration(transitionDuration)
                .attr("d", line(data.values.slice(projected, data.values.length)))
                .style("stroke", color);

            /*
             * x/y axes
             */
            var xAxis = d3.svg.axis().scale(chart.xscale)
                .orient("bottom").tickSize(0, 0, 0).tickPadding(10)
                .tickFormat(function (d) {
                    return d;
                });

            var yAxis = d3.svg.axis().scale(chart.yscale).ticks(4)
                .orient("left").tickSize(0, 0, 0).tickPadding(5)
                .tickFormat(function (d) {
                    return formatcurrency(d);
                });

            if (chart.xAxisSocket !== undefined) {
                chart.xAxisSocket.remove();
                chart.yAxisSocket.remove();
            }

            /*
             * Hotspots and popovers
             */

            if (chart.circles === undefined) {
                chart.circles = chart.linegroup.append("svg:g");
                chart.circles.selectAll("circle").data(data.values).enter().append("circle");
            }

            chart.circles.attr("data-name", data.key)
                .selectAll("circle").data(data.values)
                .attr("cx", function (d) {
                    return chart.xscale(d.year);
                })
                .attr("cy", function (d) {
                    return chart.yscale(d.val);
                })
                .attr("r", 5).attr("stroke", color).attr("fill", color);

            chart.circles.attr("data-name", data.key)
                .selectAll("circle").data(data.values).enter().append("circle");

            /*
             * Overflows
             */

            // covers leftmost circle overflow 
            var overflows = chart.axes.append("g").classed('overflows', true);
            overflows.append("rect").attr("width", chart.xmargin)
                .attr("height", chart.height);

            // covers line overflow when value is 0
            overflows.append("rect").attr("width", chart.width)
                .attr("height", chart.ymargin).attr("y", chart.height - chart.ymargin);


            chart.xAxisSocket = chart.axes.append("g")
                .classed("axis", true).classed("xAxis", true)
                .attr("transform", "translate(0," + (chart.height - chart.ymargin) + ")").call(xAxis);

            chart.yAxisSocket = chart.axes.append("g")
                .attr("class", "axis")
                .attr("transform", "translate( " + chart.xmargin + ",0)").call(yAxis);

            // mark odd entries

            // d3 can't do odd selectors
            $('.xAxis .tick:odd').each(function () {
                //jquery can't add classes to SVG elements
                d3.select(this).classed('odd', true);
            });

            d3.select('.xAxis g:nth-child(' + (yearIndex + 1) + ')')
                .classed('thisYear', true);

            initializeLayers();

            if (layers !== undefined) layers.remove();

            enableLayers(data);
        },

        enableLayers = function (jsondata, transition) {


            function appendDropshadow(group) {
                // filters go in defs element
                var defs = group.append("defs");

                // create filter with id #drop-shadow
                // height=130% so that the shadow is not clipped
                var filter = defs.append("filter")
                    .attr("id", "ds")
                    .attr("height", "130%");

                filter.append('feComponentTransfer').attr('result', "matrixOut")
                    .attr('in', 'SourceAlpha').append('feFuncA')
                    .attr('type', 'table').attr('tableValues', '1.0');

                filter.append("feGaussianBlur")
                    .attr("in", "matrixOut")
                    .attr("stdDeviation", 2)
                    .attr("result", "blur");

                filter.append("feOffset")
                    .attr("in", "blur")
                    .attr("dx", -2)
                    .attr("result", "offsetBlur");

                var feMerge = filter.append("feMerge");

                feMerge.append("feMergeNode")
                    .attr("in", "offsetBlur")
                feMerge.append("feMergeNode")
                    .attr("in", "SourceGraphic");
            }

            if (jsondata.sub.length === 0) {
                var legendData = chart.areagroup.datum(jsondata);
                legend(legendData, legendData);
                
                return;
            }

            layers = chart.layers.append('svg')
                .attr("height", chart.height).attr("width", chart.layersWidth)
                .classed('layers', true);

            chart.layers.svg = layers;

            appendDropshadow(layers);
            chart.layers.classed('layers', true);

            layers.width = chart.width;
            layers.height = chart.height;

            var yscale = chart.yscale
            var xscale = chart.xscale;

            layers.xscale = xscale;

            var color = d3.scale.category20();

            // line declaration
            var area = d3.svg.area()
                .interpolate("monotone")
                .x(function (d) {
                    return xscale(d.year);
                })
                .y0(function (d) {
                    return yscale(d.y0);
                })
                .y1(function (d) {
                    return yscale(d.y0 + d.val);
                });

            // area declaration
            var line = d3.svg.line()
                .interpolate("monotone")
                .x(function (d) {
                    return xscale(d.year);
                })
                .y(function (d) {
                    return yscale(d.y0 + d.val);
                });

            // stack declaration
            var stack = d3.layout.stack()
                .values(function (d) {
                    return d.values;
                })
                .x(function (d) {
                    return d.year;
                })
                .y(function (d) {
                    return d.val;
                });

            var instance = stack(jsondata.sub);

            // calculate areas
            var browser = layers.selectAll(".browser")
                .data(instance)
                .enter().append("g")
                .attr("class", "browser");

            // draw areas
            layers.areas = browser.append("path")
                .attr("class", "multiarea")
                .attr("d", function (d) {
                    return area(d.values);
                })
                .style("fill", function (d, i) {
                    return colors[i % 20];
                });

            // draw lines
            layers.lines = browser.append("path")
                .attr("class", "multiline")
                .attr("d", function (d) {
                    return line(d.values);
                })
                .style("stroke", function (d, i) {
                    return colors[i % 20];
                });

            // legend
            legend(browser, jsondata);

            // not fundamental, improves layers looks
            $('.layers g:last .multiline').remove();


            chart.layerLine = layers.append("line").classed('layerLine', true)
                .attr("x1", chart.layersWidth).attr("x2", chart.layersWidth)
                .attr("y1", chart.yscale.range()[1]).attr("y2", chart.height - chart.ymargin);

            if (transition === undefined) {
                // d3.selectAll('#chart circle').transition().duration(500).style('opacity', 0);
                layers.transition().duration(500).style("opacity", 1);
            } else {
                layers.style("opacity", 1);
            }

        },

        removeLayers = function () {
            // enablePopovers();
            d3.selectAll('#chart circle').style('opacity', 1);
            if (layers !== undefined) {
                d3.selectAll('.area').classed("layers", false)
                    .style("fill", function () {
                        return d3.select(this).attr("color")
                    });
                layers.transition().duration(500).style("opacity", 0);
                layers.transition().delay(500).remove();
            }
        };


    return {
        chart: chart,
        initialize: initialize,
        drawline: drawline
    }
}();