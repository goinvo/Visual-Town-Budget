/*
File: statistics.js

Description:
    Statistics and helper functions for visual budget application

Requires:
    d3.js

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

stats = {
    amount: {
        title: "Amount",
        class: "span6 top",
        value: function (d) {
            return formatcurrency(d.values[yearIndex].val);
        },
        side: function () {
            return " in " + (avb.firstYear + yearIndex).toString() + "."
        },
        cellClass: "value sum ",
        cellFunction: function (d, cell) {
            avb.table.renderAmount(d, cell)
        }
    },
    impact: {
        title: "Impact",
        class: "span6 ",
        value: function (d) {
            return Math.max(0.01, (Math.round(d.values[yearIndex].val * 100 * 100 / avb.root.values[yearIndex].val) / 100)).toString() + "%";
        },
        side: function () {
            return " of total " + avb.section + "."
        },
        cardRenderer : function(d, cell){
            $(cell).html(Mustache.render($('#card-template').html(),this));
            if(this.value(d) === '100%') {
                $(cell).find('.card').css({ display : 'none'});
            }
        },
        cellClass: "value sum",
        cellFunction: function (d, cell) {
            avb.table.renderImpact(d, cell)
        }
    },
    individual: {
        title: "Individual",
        class: "span6 individual",
        value: function (d) {
            var percentage = d.values[yearIndex].val / avb.root.values[yearIndex].val;

            return '$' + (avb.userContribution * percentage).toFixed(2);
        },
        side: contributionText,
        cellClass: "value sum",
        cellFunction: function (d, cell) {
            avb.table.renderImpact(d, cell)
        }
    },
    growth: {
        title: "Growth",
        class: "span6 top",
        value: function (d) {
            return growth(d);
        },
        side: " compared to previous year.",
        cellFunction: function (d, cell) {
            avb.table.renderGrowth(d, cell)
        },
        cellClass: "value"
    },
    source: {
        title: "Source",
        class: "span6 card-source ",
        value: function (d) {
            return (d.src === '') ? longName : d.src;
        },
        link: function (d) {
            return (d.url === '') ? municipalURL : d.url;
        },
        cardRenderer : function(d, card){
            $card = $(card);
            $card.html(Mustache.render($('#card-template').html(), this));

            $card.attr('onclick', "window.location='" + this.link(d)  + "'");
                // prevent sliding animation
                $card.click(function(event){
                    // stop propagation
                stopPropagation(window.event || event);
            });
        },
        side: "is the data source for this entry."
    },
    mean: {
        title: "Average",
        class: "span6 ",
        value: function (d) {
            return formatcurrency(d3.mean(d.values, function(d) {return d.val}));
        },
        side: "on average."
    },
    filler: {
        title: "",
        class: "span6 ",
        value: function (d) {
            return "";
        },
        side: ""
    },
    name: {
        title: "Name",
        cellClass: "value name long textleft",
        value: function (d) {
            return d.key;
        }
    },
    sparkline: {
        title: "Change",
        cellClass: "value sparkline",
        cellFunction: function (d, cell) {
            avb.table.renderSparkline(d, cell)
        }
    },
    section : {
        title: "Type",
        cellClass: "value",
        value: function (d){
            return d.section;
        }
    },
    parent : {
        title : "From",
        cellClass: "value parent",
        value: function (d){
            return (typeof(d.parent) === 'string') ? d.parent : '';
        }
    },
    mapLink : {
        title : "",
        cellClass: "value maplink",
        cellFunction: function (d, cell) {
            avb.table.renderMaplink(d, cell)
        }
    }
},

decks = {
    revenues: [stats.amount, stats.growth, stats.impact, stats.mean, stats.source],
    expenses: [stats.amount,  stats.growth, stats.impact, stats.mean, stats.source],
    funds: [stats.amount, stats.growth, stats.impact, stats.mean, stats.source]
},

tables = {
    revenues: [stats.name, stats.growth, stats.sparkline, stats.impact, stats.amount, stats.mapLink],
    expenses: [stats.name, stats.growth, stats.sparkline, stats.impact, stats.amount, stats.mapLink],
    funds: [stats.name, stats.growth, stats.sparkline, stats.impact, stats.amount, stats.mapLink],
    search: [stats.name, stats.growth, stats.sparkline, stats.amount, stats.parent,  stats.section, stats.mapLink]
}

/*
*   Formats currency
*
*   @param {float/int} value - number to be formatted
*   @return {string} formatted value
*/
function formatcurrency(value) {
    if (value === undefined) {
        return "N/A";
    } else if (value >= 1000000) {
        return "$" + Math.round(value / 1000000).toString() + " M";
    } else if (value < 1000000 && value >= 1000) {
        return "$" + Math.round(value / 1000).toString() + " K";
    } else if (value < 1 && value != 0) {
        return "¢" + Math.round(value * 100).toString();
    } else {
        return "$ " + value.toString();
    }
}

/*
*   Formats currency with no rounding
*
*   @param {float/int} value - number to be formatted
*   @return {string} formatted value
*/
function formatCurrencyExact(value) {
    var commasFormatter = d3.format(",.0f")
    return "$ " + commasFormatter(value);
}

/*
*   Formats percentage
*
*   @param {float/int} value - number to be formatted
*   @return {string} formatted value
*/
function formatPercentage(value) {
    if (value > 0) {
        return "+ " + value.toString() + "%";
    } else if (value < 0) {
        return "- " + Math.abs(value).toString() + "%";
    } else {
        return Math.abs(value).toString() + "%";
    }
}

/*
*   Calculates growth (% change) compared to previous datapoint
*
*   @param {node} data - node for which growth has to be computed
*   @return {string} - growth in %
*/
function growth(data) {
    var previous = (data.values[yearIndex - 1] !== undefined) ? data.values[yearIndex - 1].val : 0;
    var perc = Math.round(100 * 100 * (data.values[yearIndex].val - previous) / data.values[yearIndex].val) / 100;
    return formatPercentage(perc);
};

