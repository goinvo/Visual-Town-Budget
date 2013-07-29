/*
File: treemap.js

Description:
    Treemap component for visual budget application.

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

avb.treemap = function () {
    var nav, currentLevel,
        // holds rgb values for white
        white = {
            r: 255,
            b: 255,
            g: 255
        };

    /*
     *   Initialize navigation treemap
     */
    var initialize = function (data) {
        var width = $('#navigation').width(),
            height = $('#navigation').height();

        var height = height,
            formatNumber = d3.format(",d"),
            transitioning;

        // create svg 
        nav = d3.select("#navigation").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .style("shape-rendering", "crispEdges");

        // initialize x and y scales
        nav.x = d3.scale.linear()
            .domain([0, width])
            .range([0, width]);

        nav.y = d3.scale.linear()
            .domain([0, height])
            .range([0, height]);

        nav.h = height;
        nav.w = width;

        // color scale
        nav.color = d3.scale.category20();

        // center zoom button vertically
        $('#zoombutton').center();

        // initialize chart
        avb.chart.initialize('#chart');


        // start populating treemap
        update(data);

    },

        /*
         * Computes treemap layout for a nested dataset
         */
        update = function (data) {
            // remove all old treemap elements
            nav.selectAll("g").remove();

            // this function recursively determines
            // treemap layout structure
            var layout = function (d) {
                if (d.sub) {
                    treemap.nodes({
                        values: d.values,
                        children: d.sub
                    });
                    d.sub.forEach(function (c) {
                        c.x = d.x + c.x * d.dx;
                        c.y = d.y + c.y * d.dy;
                        c.dx *= d.dx;
                        c.dy *= d.dy;
                        c.parent = d;
                        layout(c);
                    });
                }
            }

            // initialize treemap
            var init = function (root) {
                root.x = root.y = 0;
                root.dx = nav.w;
                root.dy = nav.h;
                root.depth = 0;
            }

            // create treemap d3 layout
            var treemap = d3.layout.treemap()
            // node children
            .children(function (d, depth) {
                return depth ? null : d.children;
            })
            // treemap values calculated based on current year value
            .value(function (d) {
                return d.values[yearIndex].val
            })
            // block sorting function
            .sort(function (a, b) {
                return a.values[yearIndex].val - b.values[yearIndex].val;
            })
                .ratio(nav.h / nav.w * 0.5 * (1 + Math.sqrt(5)))
                .round(false);

            var root = data;

            nav.grandparent = nav.append("g")
                .attr("class", "grandparent");

            // init treemap 
            init(root);
            // init layout
            layout(root);

            // display treemap
            currentLevel = display(root);
        }

        /*
         * Draws and displays a treemap layout
         */
        display = function (d) {

            // remove all popovers
            $('.no-value').popover('destroy');

            var formatNumber = d3.format(",d"),
                // flag will be used to avoid overlapping transitions
                transitioning;

            // return block name

            function name(d) {
                return d.parent ? name(d.parent) + "." + d.key : d.key;
            }

            // insert top-level blocks
            var g1 = nav.insert("g", ".grandparent")
                .datum(d)
                .attr("class", "depth")
                .on("click", function (event) {
                    zoneClick.call(this, d3.select(this).datum(), true);
                })

            // add in data
            var g = g1.selectAll("g")
                .data((d.sub.length === 0) ? [d] : d.sub)
                .enter().append("g");

            // create grandparent bar at top 
            nav.grandparent
                .datum((d.parent === undefined) ? d : d.parent)
                .attr("nodeid", (d.parent === undefined) ? d.hash : d.parent.hash)
                .on("click", function (event) {
                    zoneClick.call(this, d3.select(this).datum(), true);
                });

            // refresh title
            updateTitle(d);

            /* transition on child click */
            g.filter(function (d) {
                return d.sub;
            })
                .classed("children", true)
                // expand when clicked
                .on("click", function (event) {
                    zoneClick.call(this, d3.select(this).datum(), true);
                })
                .each(function () {
                    var node = d3.select(this);
                    // assign node hash attribute
                    node.attr('nodeid', function () {
                        return node.datum().hash;
                    });
                });

            // assign new color only if not last node
            if (d.sub.length !== 0 && d.color === undefined) {
                d.color = nav.color(0);
            }
            // assign colors to children
            for (var i = 0; i < d.sub.length; i++) {
                d.sub[i].color = nav.color(i);
            }

            // draw parent rectange
            g.append("rect")
                .attr("class", "parent")
                .call(rect)
                .style("fill", function (d) {
                    return zoneColor(d.color, 0.8);
                });

            // recursively draw children rectangles
            function addChilds(d, g) {
                // add child rectangles
                g.selectAll(".child")
                    .data(function (d) {
                        return d.sub || [d];
                    })
                    .enter().append("g")
                    .attr("class", "child")

                // propagate recursively to next depth
                .each(function () {
                    var group = d3.select(this);
                    if (d.sub !== undefined) {
                        $.each(d.sub, function () {
                            addChilds(this, group);
                        })
                    }
                })
                    .append("rect")
                    .call(rect);
            }

            addChilds(d, g);

            // IE popover action
            if (ie()) {
                nav.on('mouseout', function () {
                    d3.select('#ie-popover').style('display', 'none')
                });
                return g;
            }

            // assign label through foreign object
            // foreignobjects allows the use of divs and 
            // textwrapping
            g.each(function () {
                var label = d3.select(this).append("foreignObject")
                    .call(rect)
                    .attr("class", "foreignobj")
                    .append("xhtml:div")
                    .html(function (d) {
                        var title = '<div class="titleLabel">' + d.key + '</div>',
                            values = '<div class="valueLabel">' + formatcurrency(d.values[yearIndex].val) + '</div>';
                        return title + values;
                    })
                    .attr("class", "textdiv");

                textLabels.call(this);

            });

            return g;

        }

    /*
    * Assigns label and popover events (IE only)
    * this is done because IE9 does not support foreign objects
    */
    ieLabels = function (d) {

        /*
        * Attach popover event to zone
        */
        function attachPopoverIe(obj, title, descr) {
            d3.select(obj).on('mouseover', function () {
                var rect = d3.select(this).select('.parent');
                var coords = [parseFloat(rect.attr('x')),
                    parseFloat(rect.attr('y'))
                ];
                var x = coords[0] + parseFloat(rect.attr('width')) / 2 - 75;
                d3.select('#ie-popover').select('.text').text(title);
                d3.select('#ie-popover').style('display', 'block')
                    .style('left', (x).px()).style('top', (coords[1]).px());
            })
        }

        // label zone using svg:text object
        var label = d3.select(this).append("text")
            .call(rect).attr('dy', '1.5em').attr('dx', '0.5em')
            // assign label name
            .text(function (d) {
                return d.key
            })
        textLabels.call(this);

        var d = d3.select(this).datum(),
            containerHeight = nav.y(d.y + d.dy) - nav.y(d.y),
            containerWidth = nav.x(d.x + d.dx) - nav.x(d.x);

        // do not show label if zone is too small
        if (containerHeight < 40 || containerWidth < 150) {
            d3.select(this).classed("no-label", true);
            popover = true;
        }

        // attach popover to zone
        attachPopoverIe(this, d.key, d.descr);
    }

    /*
    * Assigns label and popover events (Non IE-browsers)
    */
    textLabels = function (d) {

        /*
        * Attach popover event to zone
        * Requires bootstrap popovers
        */
        function attachPopover(obj, title, descr) {
            $(obj).find('div').first().popover({
                container: 'body',
                trigger: 'hover',
                placement: function (context, source) {
                    // calculate best position for popover placement
                    var position = $(source).position();
                    if (position.top < 110) {
                        return "left";
                    } else {
                        return "top";
                    }
                },
                title: (descr !== '' && d.title !== '') ? d.key : '',
                content: (descr !== '') ? descr : d.key,
                html: true
            });
        }

        var d = d3.select(this).datum(),
            containerHeight = nav.y(d.y + d.dy) - nav.y(d.y),
            containerWidth = nav.x(d.x + d.dx) - nav.x(d.x),
            title = $(this).find('.titleLabel').first(),
            div = $(this).find('.textdiv').first();

        // eliminate old popover and reset zone classes
        $(this).find('div').first().popover('destroy');
        // no-label -> zone is too small to show any text at all
        d3.select(this).classed("no-label", false);
        // no-label -> zobe is too small to show amount label
        d3.select(this).classed("no-value", false);
        // compensates padding
        var labelPadding = 16;
        div.height(Math.max(0, containerHeight - labelPadding));

        // every entry has no popover by default
        var popover = false;

        // Note.
        // If we are in the expenses section and the user did enter his/her
        // tax contribution, popovers will be used to show how much each 
        // zone amounts in terms of personal contribution.
        var description;
        if (avb.userContribution != null && avb.section == 'expenses') {
            // popover content is split in separate 2 divs
            description = '<div>' + d.descr + '</div> <div class="contribution"> Your contribution is ' + stats.individual.value(d) + '</div>';
        } else {
            description = d.descr;
        }

        // calculate whether zone has enough space for any labels
        if (containerHeight < title.outerHeight() || containerHeight < 40 || containerWidth < 60) {
            d3.select(this).classed("no-label", true);
            popover = true;
        }
        // calculate whether zone has enough space for amount label
        if (containerHeight < div.height() || containerHeight < 80 || containerWidth < 90) {
            d3.select(this).classed("no-value", true);
        }
        // attach popover to zone
        if (popover || description !== '' || containerWidth < 80) {
            attachPopover(this, d.key, description);
        }

    }

    /*
    * Updates page title when sections
    */
    updateTitle = function (data) {
        var $title = $(".title-head .text");
        var $zoom = $('#zoombutton');
        var parent = d3.select('.grandparent').node();

        // remove previous action set on zoom button
        $zoom.unbind();
        // set title text
        $title.text(data.key);
        // make sure to shrink text if it does not fit
        // 48px is max text size
        $title.textfill(48, $('.title-head').width() - 120);

        // main section such as revenues, expenses and funds need to have
        // descriptions
        if (inArray(avb.sections, data.key.toLowerCase())) {
            $('<div class="description">  </div>').appendTo($title).text(data.descr);
        }

        // make zoom-out button appear disabled while at root nodes
        if (avb.currentNode.data === avb.root) {
            $zoom.addClass('disabled');
        } else {
            $zoom.removeClass('disabled');
        }

        // zoom button renders parent zone
        $zoom.click(function () {
            zoneClick.call(parent, d3.select(parent).datum(), true);
        })

    }

    /*
    * Opens visible treemap section
    * @param {string} nodeId - hash that refers to zone
    * @param {bool} pushUrl - Whether to add url to browser history
    */
    open = function (nodeId, pushUrl) {
        // find rectangle with nodeId
        var rect = d3.select('g[nodeid*="' + nodeId + '"]');
        // open zone
        zoneClick.call(rect.node(), rect.datum());
    },


    zoneClick = function (d, click) {
        // stop event propagation
        var event = window.event || event
        stopPropagation( event );

        // do not expand if another transition is happening
        // or data not defined
        if (nav.transitioning || !d || !avb.currentNode) return;

        // go back if click happened on the same zone
        if (d !== avb.root && d === avb.currentNode.data) {
            $('#zoombutton').trigger('click');
            return;
        }

        // push url to browser history
        if (click === true) {
            pushUrl(avb.section, avb.thisYear, avb.mode, d.hash);
        }

        // reset year
        yearIndex = avb.thisYear - avb.firstYear;

        // remove old labels
        nav.selectAll('text').remove();

        // calculate new treemap
        updateSelection(d, yearIndex, d.color);

        // prevent further events from happening while transitioning
        nav.transitioning = true;

        // initialize transitions
        var g2 = display(d);
        t1 = currentLevel.transition().duration(750),
        t2 = g2.transition().duration(750);

        // Update the domain only after entering new elements.
        nav.x.domain([d.x, d.x + d.dx]);
        nav.y.domain([d.y, d.y + d.dy]);

        // Enable anti-aliasing during the transition.
        nav.style("shape-rendering", null);

        // Draw child nodes on top of parent nodes.
        nav.selectAll(".depth").sort(function (a, b) {
            return a.depth - b.depth;
        });

        // Fade-in entering text.
        g2.selectAll(".foreignobj").style("fill-opacity", 0);

        // Transition to the new view
        t1.style('opacity', 0);
        t1.selectAll(".foreignobj").call(rect);
        t2.selectAll(".foreignobj").call(rect);
        t1.selectAll("rect").call(rect);
        t2.selectAll("rect").call(rect);

        // add labels to new elements
        t2.each(function () {
            if (ie()) return;
            textLabels.call(this);
        })
        t2.each("end", function () {
            if (ie()) {
                ieLabels.call(this);
            } else {
                textLabels.call(this);
            }
        })

        // Remove the old node when the transition is finished.
        t1.remove().each("end", function () {
            nav.style("shape-rendering", "crispEdges");
            nav.transitioning = false;

        });
        // update current level
        currentLevel = g2;
    }

    // sets rectangle (zone) properties
    rect = function (rect) {
        rect.attr("x", function (d) {
            return nav.x(d.x);
        })
        .attr("y", function (d) {
            return nav.y(d.y);
        })
        .attr("width", function (d) {
            return nav.x(d.x + d.dx) - nav.x(d.x);
        })
        .attr("height", function (d) {
            return nav.y(d.y + d.dy) - nav.y(d.y);
        });
    }


    zoneColor = function (color, opacity) {
        var startRgb = mixrgb(hexToRgb(color), white, opacity);
        return 'rgba(' + startRgb.r + ',' + startRgb.g + ',' + startRgb.b + ',' + 1.0 + ')';
    };

    return {
        initialize: initialize,
        update: update,
        open: open,
        updateTitle: updateTitle
    }
}();