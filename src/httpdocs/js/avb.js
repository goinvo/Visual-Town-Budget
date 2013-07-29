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

// navigation variables

avb.root = null; // reference to root node of current section
avb.section = null; // current selected section
avb.mode = null; // current mode (map, table etc.)
avb.data = {}; // json data
avb.currentNode = {}; // currently selected node

// time variables

// first datapoint
avb.firstYear = null;
// last datapoint
avb.lastYear = null;
avb.currentYear = new Date().getFullYear();
avb.thisYear = avb.currentYear;

// amount of yearly taxes spent by user
avb.userContribution = null;
// available data sections
avb.sections = ['revenues', 'expenses', 'funds'];

var timer = 0;

// Protoypes

/*
* Converts number to css compatible value
*/
Number.prototype.px = function () {
    return this.toString() + "px";
};

// Browser history routines

/*
*   Pushes current status to browser history
*
*   @param {string} section - current section
*   @param {int} year - current year
*   @param {string} mode - treemap or table view
*   @param {string} node - hash of current node
*
*/
function pushUrl(section, year, mode, node) {
    if (ie()) return;
    var url = '/' + section + '/' + avb.thisYear + '/' + mode + '/' + node;
    window.history.pushState({
        section: section,
        year: avb.thisYear,
        mode: mode,
        nodeId: node
    }, "", url);
}

/*
*   Restores previous history state
*   
*   @param {state obj} event - object containing previous state
*/
function popUrl(event) {
    if (ie()) return;

    if (event.state === null) {

    } else if (event.state.mode !== avb.mode) {
        switchMode(event.state.mode, false);
    } else {
        avb.navigation.open(event.state.nodeId, false);
    }
}

/* Initialization routines */


/*
*   Bootstraps visual budget application
*   @param {obj} params - object listing year, mode, section and node
*/
function initialize(params) {
    // get previosly set year
    var yearCookie = parseInt(jQuery.cookie('year'));
    // use year listed in the params object
    if (params.year !== undefined && !isNaN(parseInt(params.year))) {
        avb.thisYear = params.year;
    // use year previosly set (if any)
    } else if (!isNaN(yearCookie)) {
        avb.thisYear = yearCookie;
    } else {
    }
    avb.section = params.section;

    // highlight current selection in navigation bar
    $('.section').each(function () {
        if ($(this).text().toLowerCase() === avb.section.toLowerCase()) {
            $(this).addClass('selected');
        }
    });

    // get user contribution if set
    avb.userContribution = avb.home.getContribution();
    
    // set viewing mode
    setMode(params.mode);

    // get datasets
    downloadData(avb.section);

}

/*
*   Download datasets
*/
function downloadData(section) {

    // loads all jsons in data
    var jxhr = [];
    $.each(avb.sections, function (i, url) {
        jxhr.push
(            $.getJSON('/data/' + url + '.json', function (json) {
                avb.data[url] = json;
            })
        );
    });

    // open section if needed
    $.when.apply($, jxhr).done(function () {
        if (section !== undefined) onDataload(avb.data[section]);
    });
}

function onDataload(jsondata) {
    avb.root = jsondata;

    avb.firstYear = d3.min(avb.root.values, function (d) {
        return d.year
    });
    avb.lastYear = d3.max(avb.root.values, function (d) {
        return d.year
    });
    yearIndex = avb.thisYear - avb.firstYear;
    avb.navbar.initialize(avb.thisYear);

    avb.currentNode.data = undefined;

    avb.cards.initialize();
    avb.navigation.initialize(jsondata);
    avb.navigation.open(avb.root.hash, true);

    // initializes search
    $('#searchbox').keyup(avb.navbar.searchChange);

    console.log("UI Loaded.");

}

/* Navigation subroutines */

function updateSelection(data, year, color) {
    avb.currentNode.data = data;
    avb.currentNode.year = year;
    avb.chart.update(data, color);
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
        avb.mode = 'l';
    } else {
        avb.navigation = avb.treemap;
        container.html(Mustache.render(treemap.html()));
        avb.mode = 't';
    }
}

function switchMode(mode, pushurl) {
    if (pushurl === undefined) pushurl = true;
    setMode(mode);
    if (pushurl) pushUrl(avb.section, avb.thisYear, mode, avb.root.hash);
    onDataload(avb.data[avb.section]);
}

function changeYear(year) {
    if (year === avb.thisYear) return;
    avb.currentNode = avb.root;
    pushUrl(avb.section, year, avb.mode, avb.root.hash);
    avb.thisYear = year;
    yearIndex = avb.thisYear - avb.firstYear;
    avb.navigation.update(avb.root);
    avb.navigation.open(avb.root.hash);

    $.cookie('year', year, {
            expires: 14
    });

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

function ie(){
    var agent = navigator.userAgent;
    var reg = /MSIE\s?(\d+)(?:\.(\d+))?/i;
    var matches = agent.match(reg);
    if (matches != null) {
        return true
    }
    return false;
}

function stopPropagation(event){
    if(event) {
        event.cancelBubble = true;
        if(event.stopPropagation) event.stopPropagation();
    }
}

function capitalize(string) {
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

var indexOf = function(needle) {
    if(typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index;

            for(i = 0; i < this.length; i++) {
                if(this[i] === needle) {
                    index = i;
                    break;
                }
            }
            return index;
        };
    }
    return indexOf.call(this, needle);
};

var inArray = function(myarray, needle){
    return indexOf.call(myarray, needle) > -1;
};