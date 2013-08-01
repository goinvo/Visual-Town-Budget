/*
File: chart.js

Description:
    Chart component for visual budget application.

Authors:
    Ivan DiLernia <ivan@goinvo.com>
    Roger Zhu <roger@goinvo.com>

License:
    Copyright 2013, Involution Studios <http://goinvo.com>

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
var avb = avb || {};

avb.chart = function () {
    var chart, layers

    /*
     * Initialization routines
     */
    initialize = function (div) {

        // remove preexisting charts
        if (chart !== undefined) {
            chart.remove();
        }

        chart = d3.select(div).append("svg");

        // chart param initialization
        chart.width = $(div).width();
        chart.height = $(div).height();
        chart.xmargin = 50;
        chart.ymargin = 20;
        chart.linestack = [];
        chart.showLegend = false;

        $('#info-wrap').click(toggleLegend);

        chart.attr("height", chart.height)
            .attr("width", chart.width);

        // xscale initialization(time)
        chart.xscale = d3.scale.linear()
            .domain([avb.firstYear, avb.lastYear])
            .range([chart.xmargin, chart.width - 15]);

        // limits layers from taking the whole chart width
        chart.layersWidth = chart.xscale(avb.thisYear);

        // hooks up chart interactions functions
        addActions(chart);

    },


    /*
    * Populates legend for all chart layers
    *
    * Arguments:
    * layers - *(array of svg groups)* an array containing all layers
    * parent - *(object)* data for upper level node (needed to calculate percentages)
    */
    legend = function (layers, parent) {

        chart.legendLayers = layers || chart.legendLayers;
        chart.legendParent = parent || chart.legendParent;

        var legendLabels = [];
        // populate the array above with the names of various layers
        // along with percentages relative to their parent
        chart.legendLayers.each(function (d) {
            legendLabels.push({
                key: d.key,
                color: d3.select(this).select('path').style('fill'),
                percentage: 100 * d.values[yearIndex].val / chart.legendParent.values[yearIndex].val
            });
        });

        // clean up old legend if needed
        d3.selectAll("#legend tr").remove();

        // add legend rows
        var rows = d3.select("#legend tbody").selectAll("tr")
            .data(legendLabels.reverse()).enter().append("tr");

        // insert divs to make bullet points
        rows.append("td").append('div')
            .classed('legend-label', true)
            .style('background-color', function (d) {
                return d.color;
            });

        // insert names and percentages
        rows.append("td").text(function (d) {
            return d.key + ' (' + d.percentage.toFixed(2) + '% of ' + chart.legendParent.key +')';
        })

        // center legend vertically
        $('#legend').center();
    },

    /*
    *   Initializes layers
    */
    initializeLayers = function () {

        // hides datapoint circles to the left of the
        // line that divides the layered part from the non-layered one
        setDatapointsVisibility();

        // IE9 does not support foreignobjects...
        if (ie() || jQuery.browser.mobile) return;
        if(chart.layersInitialized) return;

        // drop shadow at chart right-edge
        chart.sideShadow = chart.layerWindow.append("foreignObject")
            .attr('width', 10).attr('x', chart.xscale.range()[1] - 10)
            .attr('height', chart.yscale.range()[0] - 10).attr('y', 10).attr("class", "foreignobj");

        chart.sideShadow.append("xhtml:div")
            .style('width', (2).px()).style('height', (chart.yscale.range()[0] - 10).px())
            .classed('sideShadow', true);

        chart.layersInitialized = true;

    },

    /*
    * Updates chart with current data
    */
    update = function (data, color) {
        // do a redraw in case function is called with no arguments
        var data = data || avb.currentNode.data;
        var color = color || avb.currentNode.color;

        // svg groups initalization
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

        // scales initialization
        // yscale multiplied by 1.2 to avoid chart line to touch
        // the svg top
        chart.yscale = d3.scale.linear().domain(
            [0, d3.max(data.values, function (d) { return d.val }) * 1.2])
        .range([chart.height - chart.ymargin, 10]);


        // grid initialization

        // ticksize = height - 10px for label space
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


        // line drawing

        // line definition
        var line = d3.svg.line()
            .interpolate("monotone")
            .x(function (d) {
                return chart.xscale(d.year);
            })
            .y(function (d) {
                return chart.yscale(d.val);
            });

        // curve area
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

        // which index projection data begins
        var projected = avb.currentYear - avb.firstYear;

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

        d3.selectAll('#areaclip').remove();
        chart.append('g').append('clipPath').attr('id', 'areaclip')
            .append('svg:path').attr('fill', 'none')
            .attr("d", area(data.values.slice(0, data.values.length)));


        //non-projection area
        chart.visuals[0].classed("area", true)
            .transition().duration(transitionDuration)
            .attr("d", area(data.values.slice(0, data.values.length)))
            .attr("fill", 'black');

        chart.visuals[1].classed("area", true).classed("projection", true)
            .transition().duration(transitionDuration)
            .attr("d", area(data.values.slice(projected, data.values.length)))
            .attr("color", color);


        chart.visuals[0].style("fill", color);
        chart.visuals[1].style("fill", color);

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
            .attr("r", 3).attr("stroke", color).attr("fill", color);

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

        // covers rightmost circle overflow
        overflows.append("rect").attr("width", 10)
            .attr("height", chart.height).attr('x', chart.xscale(avb.lastYear));

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

        // highlights label that represents current year on axis
        d3.select('.xAxis g:nth-child(' + (yearIndex + 1) + ')')
            .classed('thisYear', true);

        // initialize layers
        initializeLayers();

        // remove any existing layers
        if (layers !== undefined) layers.remove();

        // draw layers
        drawLayers(data);
    },

    /*
    * Shows/hides datapoint markers when necessary
    * Eg. markers shouldn't be shown in the layered region
    */
    setDatapointsVisibility = function () {
        chart.circles.selectAll('circle').attr('opacity', function () {
            var circle = d3.select(this);
            if (parseFloat(circle.attr('cx')) < chart.layersWidth) {
                circle.style('opacity', 0);
            } else {
                circle.style('opacity', 1);
            }
        });
    },

    /*
    * Toggles layer legend
    */
    toggleLegend = function () {
        // return if action is being repeated
        chart.showLegend = !chart.showLegend;
        // stop any other ongoing transitions
        $('#legend-wrap, #cards').stop();
        // show legend
        if (chart.showLegend) {
            $('#legend-wrap').animate({
                left: '0'
            }, 350);
            $('#cards').animate({
                left: '100%'
            }, 350);
        // hide legend
        } else {
            $('#legend-wrap').animate({
                left: '-100%'
            }, 350);
            $('#cards').animate({
                left: '0'
            }, 350);
        }
    },

    /*
    * Handles drag and drops in chart
    */
    slideLayers = function (x) {
        // updates information data based on the 
        function updateInfo(year) {
            // fixes edge case bug which gives a out of 
            // boundary year
            var newIndex = Math.max(year - avb.firstYear, 0);
            if (yearIndex === newIndex) return;
            yearIndex = newIndex;
            avb.cards.update(avb.currentNode.data);
            legend();
        }

        updateInfo(Math.round(chart.xscale.invert(x)));

        // resize svg width
        x = Math.min(x, chart.xscale.range()[1]);
        x = Math.max(x, chart.xscale.range()[0]);
        chart.layersWidth = x;
        chart.layers.svg.attr("width", x);

        // show/hide point based on new layer position
        setDatapointsVisibility();

        // drop shadow not drawn in IE or mobile browsers
        if (!ie() && !jQuery.browser.mobile) chart.layerLine.attr('x', x - 10);

    },

    /*
    * Binds all events for chart interactivity
    */
    addActions = function (chart) {
        var touchStart = {},
            delta = {},
            mousedown = false;

        // called at beginning of drag
        function dragStart(e) {

            e = d3.event;

            e.preventDefault();
            var x, y;
            mousedown = true;

            // makes event valid for both touch and mouse devices 
            if (e.type === 'touchstart') {
                x = e.touches[0].pageX;
            } else {
                //solves some IE compatibility issues
                x = e.offsetX || d3.mouse(this)[0];
            }

            // immediately bring layers boundary where user clicked
            slideLayers(x);
            touchStart.x = chart.layersWidth;
            touchStart.y = 0;
        };

        // called during drag
        function dragMove(e) {

            e = d3.event;

            e.preventDefault();
            if (!mousedown) return;
            var x, y;
            dragging = true;

            // makes event valid for both touch and mouse devices 
            if (e.type === 'touchmove') {
                x = e.touches[0].pageX;
            } else {
                //solves some IE compatibility issues
                x = e.offsetX || d3.mouse(this)[0];
            }

            // distance from where the drag started
            delta = {
                x : x - touchStart.x
            };

            // bring layers where the cursor is at
            slideLayers(touchStart.x + delta.x);

        };

        // called at end of drag event
        function dragEnd(e) {

            e = d3.event;

            e.preventDefault();
            mousedown = false;
        };

        // hook up all actons
        chart.on('mousedown', dragStart);
        chart.on('mousemove', dragMove);
        chart.on('mouseup', dragEnd);
        chart.on('touchstart', dragStart);
        chart.on('touchmove', dragMove);
        chart.on('touchend', dragEnd);

    },

    /*
    * Draws layers
    */
    drawLayers = function (jsondata, transition) {

        // puts a shadow at boundary between layered
        // and non-layered part of the chart
        function appendShadow(group) {

            if (ie() || jQuery.browser.mobile) return;

            // clips the shadow so that it doesn't take the full height of the chart
            chart.sideShadow.attr("clip-path", "url(#areaclip)");

            // the shadow is a foreignobject (div) to which
            // the css property 'box-shadow' is applied to.
            chart.layerLine = group.append("foreignObject")
                .attr('x', chart.layersWidth - 10).attr('width', 10).attr('y', 10).attr('height', chart.yscale.range()[0] - 10)
                .attr("class", "foreignobj")

            chart.layerLine.append("xhtml:div").style('width', (3).px())
                .style('height', (chart.yscale.range()[0] - 10).px())
                .classed('layerLine', true);
        }

        // layers are a whole new svg image, this is done so that
        // the width of this svg can be easily adjusted to whatever desired
        // value, giving the illusion of 'clipping' the layers
        layers = chart.layers.append('svg')
            .attr("height", chart.height).attr("width", chart.width)
            .classed('layers', true);

        // clip area used by boundary shadow
        layers.attr("clip-path", "url(#areaclip)");

        chart.layers.svg = layers;
        chart.layers.classed('layers', true);
        layers.width = chart.width;
        layers.height = chart.height;

        // when there visualized part has no subsections there
        // is not much to be done
        if (jsondata.sub.length === 0) {
            // append the shadow
            appendShadow(layers);
            // update legend
            var legendData = chart.areagroup.datum(jsondata);
            legend(legendData, legendData.datum());
            return;
        }

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
        var regions = layers.selectAll(".browser")
            .data(instance)
            .enter().append("g")
            .attr("class", "browser");

        // draw areas
        layers.areas = regions.append("path")
            .attr("class", "multiarea")
            .attr("d", function (d) {
                return area(d.values);
            })
            .style("fill", function (d, i) {
                return d3.scale.category20().range()[i % 20];
            });

        // draw lines
        layers.lines = regions.append("path")
            .attr("class", "multiline")
            .attr("d", function (d) {
                return line(d.values);
            })
            .style("stroke", function (d, i) {
                return d3.scale.category20().range()[i % 20];
            });

        // legend
        legend(regions, jsondata);

        // not fundamental, improves layers looks
        $('.layers g:last .multiline').remove();

        // append boundary shadow
        appendShadow(layers);

        // trick that solves IE10 bug which keeps chart
        // for expanding past its initial width

        setTimeout(function(){
            slideLayers(chart.layersWidth);
        }, 10);

        

    };

    return {
        chart: chart,
        initialize: initialize,
        update : update
    }
}();