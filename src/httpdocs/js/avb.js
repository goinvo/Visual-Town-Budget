/*
File: avb.js

Description:
    Visual budget application main routines

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

var avb = avb || {};

var colors = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", 
              "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", 
              "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", 
              "#17becf", "#9edae5"];
var sections = ['revenues', 'expenses', 'funds'];

var firstYear, lastYear,
    currentYear = new Date().getFullYear(), // only used for projections
    thisYear = currentYear;

var timer = 0;
var section, mode, data, root;
var currentSelection = new Object();


Number.prototype.px = function () {
    return this.toString() + "px";
};

/* URL history routines */

function pushUrl(section, year, mode, node) {
    if (ie()) return;

    var url = '/' + section + '/' + thisYear + '/' + mode + '/' + node;
    window.history.pushState({
        section: section,
        year: thisYear,
        mode: mode,
        nodeId: node
    }, "", url);
}

function popUrl(event) {
    if (ie()) return;

    if (event.state === null) {
        //avb.navigation.open(root.hash);
    } else if (event.state.mode !== mode) {
        switchMode(event.state.mode, false);
    } else {
        avb.navigation.open(event.state.nodeId, false);
    }
}


/* Initialization routines */

function initialize(params) {
    if (params.year !== undefined && !isNaN(parseInt(params.year)) &&
        params.year < lastYear && params.year > firstYear) {
        thisYear = params.year;
    }

    
    section = params.section;

    // highlight current selection in menubar
    $('.section').each(function () {
        if ($(this).text().toLowerCase() === section) {
            $(this).addClass('selected');
        }
    });

    // set viewing mode
    setMode(params.mode);

    downloadData(section);

}

function downloadData(openSection){
    data = new Object;

    // loads all jsons in data
    var jxhr = [];
    $.each(sections, function (i, url) {
        jxhr.push(
            $.getJSON('/data/' + url + '.json', function (json) {
                data[url] = json;
            })
        );
    });

    // open section if needed
    $.when.apply($, jxhr).done(function() {
        if(openSection !== undefined) onDataload(data[openSection]);
    });
}

function onDataload(jsondata) {
    root = jsondata;

    //year bounds initialization
    firstYear = d3.min(root.values, function(d) { return d.year});
    lastYear = d3.max(root.values, function(d) { return d.year});
    yearIndex = thisYear - firstYear;
    avb.navbar.initialize(thisYear);

    currentSelection.data = undefined;

    avb.cards.initialize();
    avb.navigation.initialize(jsondata);
    avb.navigation.open(root.hash, true);

    // initializes search
    $('#searchbox').keyup(avb.navbar.searchChange);
    $('#searchbox').click(function(){
        if ($('#avb-home').is(":visible"))  avb.home.hide();
    });

    console.log("UI Loaded.");

}

/* Navigation subroutines */ 

function updateSelection(data, year, color) {
    currentSelection.data = data;
    currentSelection.year = year;
    avb.chart.drawline(data, color);
    avb.cards.update(data);
}


function setMode(modeId) {
    var container = $('#avb-wrap'),
        table = $('#table-template'),
        treemap = $('#treemap-template');

    // initialize code
    if (modeId && modeId === 'l') {
        avb.navigation = avb.table;
        container.html(Mustache.render(table.html()));
        mode = 'l';
    } else {
        avb.navigation = avb.treemap;
        container.html(Mustache.render(treemap.html()));
        mode = 't';
    }
}

function switchMode(mode, pushurl) {
    if (pushurl === undefined) pushurl = true;
    setMode(mode);
    if (pushurl) pushUrl(section, thisYear, mode, root.hash);
    onDataload(data[section]);
}

function changeYear(year) {
    if (year === thisYear) return;
    currentSelection = root;
    pushUrl(section, year, mode, root.hash);
    thisYear = year;
    yearIndex = thisYear - firstYear;
    avb.navigation.update(root);
    avb.navigation.open(root.hash);

    // update homepage graph if needed
    if ($('#avb-home').is(":visible")) {
        avb.home.showGraph(100);
    }
}

/* Helper functions */

var log = function (d) {
    console.log(d);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function mixrgb(rgb1, rgb2, p) {
    return {
        r: Math.round(p * rgb1.r + (1 - p) * rgb2.r),
        g: Math.round(p * rgb1.g + (1 - p) * rgb2.g),
        b: Math.round(p * rgb1.b + (1 - p) * rgb2.b)
    };
}

function translate(obj, x, y) {
    obj.attr("transform", "translate(" + (x).toString() + "," + (y).toString() + ")");
}

function rotate(obj, degrees) {
    obj.attr("transform", "rotate(" + degrees.toString() + " 100 100)");
}


$.fn.center = function () {
    this.css("margin-top", Math.max(0, $(this).parent().height() - $(this).outerHeight()) / 2);
    return this;
}

$.fn.availableHeight = function () {
    var available = $(this).height();
    $(this).children().each(function () {
        available -= $(this).outerHeight();
    })
    return Math.max(0, availableHeight);
}

$.fn.textfill = function (maxFontSize, targetWidth) {
    var fontSize = 10;
    $(this).css({
        'font-size': fontSize
    });
    while (($(this).width() < targetWidth) && (fontSize < maxFontSize)) {
        fontSize += 1;
        $(this).css({
            'font-size': fontSize
        });
    }
    $(this).css({
        'font-size': fontSize - 1
    });

};

function ie() {
    var undef, v = 3,
        div = document.createElement('div');

    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        div.getElementsByTagName('i')[0]
    );

    return v > 4 ? v : undef;
};

function capitalise(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
 // Back button action
window.onpopstate = popUrl;

 // Feedback button
var fby = fby || [];
(function () {
    var f = document.createElement('script');
    f.type = 'text/javascript';
    f.async = true;
    f.src = '//cdn.feedbackify.com/f.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(f, s);
})();