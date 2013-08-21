/*
File: table.js

Description:
    Table compoent for visual budget application

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

avb.table = function () {

    var indent = 25; // indentation width
    var tableStats = []; // columns to be shown
    // color scales
    var growthScale = d3.scale.linear().clamp(true).domain([-10, 10]).range(["rgb(29,118,162)", 'rgb(167, 103, 108)']);
    var amountScale = d3.scale.linear().clamp(true).range(["#aaa", "#333"]);
    var impactScale = d3.scale.linear().clamp(true).domain([0, 100]).range(["#aaa", "#333"]);

    /*
     * Initializes table
     *
     * @param {obj} data - dataset
     */
    var initialize = function ($container, data) {
        log($container)
        var $table = $container;

        // remove old rows
        $('.tablerow').remove();

        if (data instanceof Array) {

            /*
             * Data is flat (search results)
             */

            // load row template
            tableStats = tables.search;

            // display no results message should that be the case
            if (data.length === 0) {
                textRow('No results found.', table);
            }
            // render table head
            $table.append(Mustache.render($('#table-header-template').html(), tableStats));

            // render all nodes (all search results)
            $.each(data, function () {
                renderNode(this, 0, $table);
            });
        } else {

            /*
             * Data in nested (datasets)
             */

            tableStats = tables[avb.section];

            // render table head
            $table.append(Mustache.render($('#table-header-template').html(), tableStats));
            // initialize scale
            amountScale.domain([0, data.values[yearIndex].val * 0.5]);
            // render root node (cascades to children)
            renderNode(data, 0, $table).trigger('click');
        }

    },


    /*
     * Aligns columns when the indentation level changes
     */
    alignRows = function () {
        // could do this using a stack
        var maxLevel = 0;
        // find maximum depth level
        $('.tablerow').each(function () {
            if ($(this).data('level') > maxLevel) maxLevel = $(this).data('level');
        })
        // assign each first column a margin-right so that all the remaining
        // columns will be aligned
        $('.tablerow').each(function () {
            $(this).find('.name').animate({
                'margin-right': (maxLevel - $(this).data('level')) * indent
            }, 250);
        });
    },

    /*
    * Renders row containing text message
    */
    textRow = function (msg, table) {
        var template = $('#row-template');
        var rendered = table.append(Mustache.render(template.html())).children().last();
        // align text to center
        rendered.css({
            'text-align': 'center'
        }).text(msg);
    },

    /*
     *   Click event for rows
     */
    rowClick = function () {
        var row = $(this);
        var node = row.data();
        // atomic nodes don't need to expand or collapse
        if (row.hasClass('atomic')) return;

        if (row.hasClass('expanded')) {

            /*
             *  Collapse row if expanded
             */

            // retrieve children rows
            var child = row.data('childDiv');
            // slide up children rows
            child.slideUp(250, function () {
                $(this).remove();
                alignRows();
            })

            row.removeClass('expanded');

        } else {

            /*
             *  Expand row is collapsed
             */

            // container
            var childDiv = $('<div class="group"></div>').insertAfter(row);

            // render children rows
            for (var i = 0; i < node.sub.length; i++) {
                renderNode(node.sub[i], row.data('level') + 1, childDiv);
                row.data('childDiv', childDiv);
            }

            // show children rows
            alignRows();
            childDiv.slideDown(250);

            row.addClass('expanded');
        }
    },

    /*
     *   Renders row based on node data
     *
     *   @param {object} node - current node
     *   @param {int} level - current depth
     *   @param {jquery object} - container to which new row is appended
     *
     *   @return {jquery object} - new row
     */
    renderNode = function (node, level, container) {
        // append row to container
        var template = $('#row-template');
        var rendered = container.append(Mustache.render(template.html(), node)).children().last();

        // check whether node has children
        rendered.addClass((node.sub === undefined || node.sub.length === 0) ? 'atomic' : '');
        rendered.data(node);
        rendered.data('level', level);

        // recreate indentation style based on level
        rendered.css({
            'padding-left': level * indent
        });


        $.each(tableStats, function () {
            // append new cell to row
            var newcell = $('<div class="' + this.cellClass + '"> </div>').appendTo(rendered);
            if (this.cellFunction) {
                // function (eg. formatting numerical value)
                this.cellFunction(node, newcell.get(0));
            } else {
                // text (eg. row title)
                newcell.text(this.value(node));
            }
        })

        // append popover
        if (node.descr.length !== 0) {
            rendered.find('.long').popover({
                // trigger : 'hover' is not the best solution
                // as it will show the popover mid-row, which
                // what we want
                trigger: 'manual',
                animation : false,
                // calculate best position for popover placement
                placement: function (context, source) {
                    var position = $(source).position();
                    if (position.top < 150) {
                        return "bottom";
                    } else {
                        return "top";
                    }
                },
                // assign popover content
                content: node.descr
            });
        }
        // show popover on hover
        rendered.mouseenter(function () {
            rendered.find('.long').popover('show');
        });
        rendered.mouseleave(function () {
            rendered.find('.long').popover('hide');
        });

        // attach click event 
        rendered.click(rowClick);

        return rendered;
    },

    /*
     * Draws D3 sparkline in cell
     *
     *   @param {object} data - current node
     *   @param {jquery object} - current cell
     */
    renderSparkline = function (node, cell) {

        // delete old sparklines
        d3.select(cell).select('svg').remove();

        // svg initialization
        var width = $(cell).width(),
            height = $(cell).parent().height();
        var sparkline = d3.select(cell).append('svg')
            .attr('width', width).attr('height', height);

        // scale initialization
        var xscale = d3.scale.linear().range([5, width-5])
            .domain([avb.firstYear, avb.lastYear]);
        var yscale = d3.scale.linear().range([height - 2, 2])
            .domain([0, d3.max(node.values, function (d) {
                return d.val
            })]);

        // line initialization
        var line = d3.svg.line().interpolate("monotone")
            .x(function (d) {
                return xscale(d.year);
            })
            .y(function (d) {
                return yscale(d.val);
            });

        // draw sparkline
        sparkline.append('g').append("svg:path").classed("line", true)
            .attr("d", line(node.values)).style("stroke", 'black');

        // draw point to indicate current year
        var pointer = sparkline.append('g').append("svg:circle").attr("r", 2)
            .datum({
                cx : xscale(node.values[yearIndex].year),
                cy : yscale(node.values[yearIndex].val)
            })
            .attr("cx", xscale(node.values[yearIndex].year))
            .attr("cy", yscale(node.values[yearIndex].val));

        // mouse moving in sparkline
        sparkline.on('mousemove', function(){
            // find year from x coordinate
            var year = Math.round(xscale.invert(d3.mouse(this)[0]));
            // move circle to another year
            pointer.attr("cx",  xscale(year))
            .attr("cy", yscale(node.values[year - avb.firstYear].val));

            // redraw popover
            $(pointer.node()).tooltip('destroy');
            $(pointer.node()).tooltip({
                // popover is appended to sparkline cell
                // this is done to avoid mouseleave events should the tooltip
                // be attached to 'body'. Obviously we cannot attach the tooltip
                // to the svg itself.
                container : sparkline.node().parentNode,
                title : year,
                animation : false
            })
            $(pointer.node()).tooltip('show');
        });

        // mouse leaving sparkline
        d3.select(sparkline.node().parentNode).on('mouseleave', function(){
            // return year pointer to its original location
            var pos = pointer.datum();
            pointer.attr("cx", pos.cx)
            .attr("cy", pos.cy);
            // remove tooltip
            $(pointer.node()).tooltip('destroy');
        });

    },

    /*
     *   Draws growth cell for current node
     *
     *   @param {object} data - current node
     *   @param {jquery object} - current cell
     */
    renderGrowth = function (data, cell) {
        // when year is first year report previous year value to be 0
        // growth will result to be 100%
        var previous = (data.values[yearIndex - 1]) ? data.values[yearIndex - 1].val : 0;
        // edge case
        if (data.values[yearIndex].val === 0) {
            if (previous === 0) {
                perc = 0;
            } else {
                perc = 100;
            }
        } else {
            // non-edge case
            // growth calculation
            perc = Math.round(100 * 100 * (data.values[yearIndex].val - previous) / data.values[yearIndex].val) / 100;
        }

        // change color depending of growth magnitude and direction
        $(cell).css({
            "color": growthScale(perc)
        });
        $(cell).text(formatPercentage(perc));

    }

    /*
     *   Draws amount cell for current node
     *
     *   @param {object} data - current node
     *   @param {jquery object} - current cell
     */
    renderAmount = function (data, cell) {
        var amount = (data.values[yearIndex].val);
        // apply color based on scale
        if (tableStats !== tables.search) $(cell).css({
            "color": amountScale(amount)
        });
        // format numeric value
        $(cell).text(formatCurrencyExact(amount));
    },

    /*
     *   Draws inpact cell for current node
     *
     *   @param {object} data - current node
     *   @param {jquery object} - current cell
     */
    renderImpact = function (data, cell) {
        var impact = stats.impact.value(data);
        // apply color based on scale
        $(cell).css({
            "color": impactScale(impact)
        });
        $(cell).text(impact);
    },

    /*
     *   Draws links that redirect to treemap representation of current entry
     *
     *   @param {object} data - current node
     *   @param {jquery object} - current cell
     */
    renderMaplink = function(data, cell){
        $(cell).html('<i class="icon-chevron-right maplink"></i>');
        $(cell).click(function(){
            avb.section = findSection(data.hash).key.toLowerCase();
            switchMode('t', true);
            // give enough time to load data
            setTimeout(function(){
                avb.treemap.open(data.hash, false, false);
            }, 50)
            
        });
    }

    open = function(){

    },

    /*
     * Updates/re-renders table rows
     */
    update = function () {
        // update all rows
        $('.tablerow').each(function () {
            var node = $(this);

            // do not update table header
            if (node.is('#table-header')) return;

            // assumption. cell order and tableStats array do not change
            // update all cells
            for (var i = 0; i < tableStats.length; i++) {
                var cell = $($(node).find('.value').get(i));
                // refresh cell value
                if (tableStats[i].cellFunction) {
                    // function (eg. formatting numerical value)
                    tableStats[i].cellFunction(node.data(), cell.get(0));
                } else {
                    // text (eg. row title)
                    cell.text(tableStats[i].value(node));
                }
            };
        })
    };

    return {
        initialize: initialize,
        renderSparkline: renderSparkline,
        renderGrowth: renderGrowth,
        renderAmount: renderAmount,
        renderImpact: renderImpact,
        renderMaplink : renderMaplink,
        open: open,
        update: update
    }
}();