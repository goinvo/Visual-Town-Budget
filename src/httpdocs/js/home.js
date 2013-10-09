/*
File: home.js

Description:
    Homepage component for visual budget application

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

avb.home = function () {
    var home = {},
        tour;

    /*
     * Tutorial node IDs.
     * They are used to identify which zone to highlight on the treemap
     */
    var townDepartments = 'dc313bc5',
        fireDepartment = 'bd2b7e5f',
        snowRemoval = 'c61196eb',
        townSchools = 'b5fe5259';

    /*
    * Main tour, for new users.
    */
    var mainTour = [{
        selector: '#information-cards',
        text: 'See the basic financial summary and high level data story.',
        position: 'right'
    }, {
        selector: '#chart-wrap',
        text: 'Explore how the town revenues changed over time.',
        position: 'right'
    }, {
        selector: '#navigation',
        text: 'The xray of the financials... Zoom into the data details by touching a block. How cool was that?',
        position: 'top'
    }, {
        selector: '#yeardrop',
        text: 'Interested in seeing budget history or projections? Use this menu.',
        position: 'left',
        before: function () {
            setTimeout(function () {
                $('#yeardrop-container').addClass('open');
                // exit the tour as soon a year is selected
                $('#yeardrop-container').find('li').click(function() { tour.exit() })
            }, 800);
        }
    }];

    /*
    *   Individual contribution tour, begins when user types in a contribution amount
    */
    var individualTour = [{
        selector: '.individual',
        text: 'Here is your yearly contribution.',
        position: 'right'
    }, {
        selector: '#navigation',
        text: 'See how much you pay for these services.',
        position: 'top'
    }];

    /*
    *   Topic tour, begins when user clicks on FAQ
    */
    var fireTour = [{
        selector: '#fire',
        text: 'The Fire Department requires significant spending to ensure public safety.',
        position: 'left',
        before: function () {
            $('g[nodeid="' + fireDepartment + '"]').find('div').first().attr('id', 'fire');
        }
    }, {
        selector: '#cards',
        text: 'Here is the basic information you need to know about the department.',
        position: 'down',
        before: function () {
            avb.navigation.open(fireDepartment, 500);
        }
    }, {
        selector: '#zoombutton',
        text: 'Go back and explore more.',
        position: 'left'
    }];

    /*
    *   Topic tour, begins when user clicks on FAQ
    */
    var snowTour = [{
        selector: '#snow',
        text: 'Snow removal has a relatively small cost compared to other departments',
        position: 'top',
        before: function () {
            $('g[nodeid="' + snowRemoval + '"]').find('div').first().attr('id', 'snow');
        }
    }, {
        selector: '#chart',
        text: 'Check how the snow removal costs oscillate over the years.',
        position: 'right',
        before: function () {
            avb.navigation.open(snowRemoval, 500);
        }
    }, {
        selector: '#cards',
        text: 'Here is the basic information about snow removal over the current year.',
        position: 'right'
    }, {
        selector: '#zoombutton',
        text: 'Go back and explore more.',
        position: 'left'
    }];

    /*
    *   Topic tour, begins when user clicks on FAQ
    */
    var schoolTour = [{
        selector: '#school',
        text: 'Education is an important factor in Town expenses.',
        position: 'bottom',
        before: function () {
            $('g[nodeid="' + townSchools + '"]').find('div').first().attr('id', 'school');
        }
    }, {
        selector: '#cards',
        text: 'They constitute about 40% of the yearly expenses.',
        position: 'right',
        before :  function() { avb.navigation.open(townSchools, 500) }
    }, {
        selector: '#zoombutton',
        text: 'Go back and explore more.',
        position: 'left'
    }];

    /*
    *   Initiialize function
    */
    init = function () {

        /*
        *   hides overlay when clicked
        *   defaults to funds section
        */
        function overlayClick(event) {
            event.stopPropagation();
            // highlight 'funds' link
            $($('.section').get(2)).addClass('selected');
            hide();
        }

        /* 
        *   starts a tour with a slight delay
        *   this gives the homepage enough time to minimize
        *
        *   @param {tour obj} tour - tour to be rendered
        *   @param {function} before - function to be execute before starting tour
        */
        function tourClick(tour, before) {
            // open tour section (section in data-section field of tour link)
            sectionClick.call(this);

            // wait for homepage to minize
            setTimeout(function () {
                // execute before function if any
                // the timeout give enuogh time for transitions
                // to happen and tour zones to be rendered
                if (before !== undefined) {
                    // execute before function
                    setTimeout(function () { before();}, 1000);
                    // start tour
                    setTimeout(function () {starttour(tour) }, 2500);
                } else {
                    starttour(tour);
                }
            }, 500);
        }

        // homepage div
        home.content = $('#avb-home');
        //overlay init
        home.overlay = $('#overlay');
        home.overlay.click(overlayClick);
        // visualization init
        home.map = $('#home-map-svg');
        home.menubar = $('#avb-menubar');
        
        $('.section').removeAttr('onclick');

        // taxes input box initialization
        $('#tax-input').val(getContribution());
        // start our when user clicks on start
        $('#tax-input-start').click(function () {
            setContribution();
            tourClick.call(this, individualTour);
        });
        // start our when user clicks on enter
        $('#tax-input').keypress(function (e) {
            if (e.which == 13) {
                setContribution();
                tourClick.call(this, individualTour);
            }
        });

        /*
        *   Tutorial links initialization
        */

        // Link 1
        $('#q1').click(function () {
            tourClick.call(this, fireTour, function () {
                avb.navigation.open(townDepartments, 500);
                fireTour[0].before();
            })
        });

        // Link 2
        $('#q2').click(function () {
            sectionClick.call(this);
            setTimeout(function() {
                schoolTour[0].before();
                starttour(schoolTour);
            },1200)
        });

        // Link 3
        $('#q3').click(function () {
            tourClick.call(this, snowTour, function () {
                avb.navigation.open(townDepartments, 500);
                snowTour[0].before();
            })
        });
    },

    sectionClick = function() {
        initializeVisualizations({
            section: $(this).attr('data-section').toLowerCase()
        });
        // home page minimizes right after treemap values are calculated
        // avoids sloppy animations
        setTimeout(function () { hide() }, 100);
    }

    /*
    *   retrieves resident annual contribution
    */
    getContribution = function () {
        var defaultContribution = 2000;
        // reads contribution cookie
        var value = jQuery.cookie('contribution') || defaultContribution;
        // adds yearly contribution as a new card
        if (value !== null && decks.expenses[0].title !== stats.individual.title) {
            decks.expenses.unshift(stats.individual);
        }
        return value;
    },

    /*
    * reads yearly contribution from input box and stores it
    */
    setContribution = function () {
        // value validation
        var input = parseFloat($('#tax-input').val());
        if (isNaN(input)) return;
        // yearly contribution is set
        avb.userContribution = input;
        // and stored
        jQuery.cookie('contribution', avb.userContribution, {
            expires: 14
        });
    },

    /*
    *   useful snippet on stackoverflow
    *   keeps non-numeric characters from being typed in the input box
    *   http://stackoverflow.com/questions/469357/html-text-input-allow-only-numeric-input
    */
    validate = function (evt) {

        // enter key
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        // regex all values are compared against
        var regex = /[0-9]|\./;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    },

    /*
    *   Executes home bars transition
    *  
    *   @param {int} duration - transition duration   
    */
    showGraph = function (duration) {
        // get data
        var data = home.data['sub'];
        // calculate block height scales
        var scale = d3.scale.linear().clamp(true).range([30, 160])
            .domain([0, d3.max(data, function (d) {
                return d.values[yearIndex].val
            })]);

        // renuves animation
        $('#revenues-node').animate({
            height: scale(data[0].values[yearIndex].val)
        }, duration)
            .find('.node-value').text(formatcurrency(data[0].values[yearIndex].val));
        // expenses animation
        $('#expenses-node').animate({
            height: scale(data[1].values[yearIndex].val)
        }, duration)
            .find('.node-value').text(formatcurrency(data[1].values[yearIndex].val));
        // funds animation
        $('#funds-node').animate({
            height: scale(data[2].values[yearIndex].val)
        }, duration)
            .find('.node-value').text(formatcurrency(data[2].values[yearIndex].val));
        $('.node-value').fadeIn(duration);

        // hook up click actions
        $('.node').click(sectionClick);
    },

    /*
    *   Shows home page
    */
    show = function () {
        // remove purple border on top of navbar
        home.menubar.removeClass('purple-border');

        // delays where inserted to mitigate jumps
        // on page load due to web-fonts loading and changing
        // the page aspect

        // fade in body
        $('#avb-body').css({opacity : 0});
        $('#avb-body').delay(200).animate({opacity : 1});

        home.overlay.show();

        // fade in homepage content
        home.content.delay(300).fadeIn();

        // show section bar animation
        var data = JSON.parse($('#data-home').html());
        setTimeout(function () {
            home.data = data;
            showGraph(1000);
        }, 1500);

        // start application
        initializeVisualizations({
            "section": "funds"
        });
        
        // do not highlight any sections while homepage is open
        $('.section').removeClass('selected');

    },

    /*
    *   Minimizes home page
    *
    *   @param {boolean} showtour - whether to show tour after homepage
    */
    hide = function (showtour) {
        // return if home is not initialized
        if(home.content === undefined) return;
        // slides up home page area
        home.content.slideUp(function () {
            //adds purple border to menu bar when transition is over
            home.menubar.addClass('purple-border');
        });
        // overlay fades out
        home.overlay.fadeOut(function () {
            // starts tour
            if (showtour || isFirstVisit()) starttour();
        });
    },

    /*
    *   Checks whether user is new or returning visitor
    *   Stores cookie that will mark current user as returning visitor
    *   for 2 weeks
    *
    *   @return {bool} - True when new user, false otherwise
    */
    isFirstVisit = function () {
        var visited = jQuery.cookie('visited');
        jQuery.cookie('visited', 'y', {
            expires: 14
        });
        return (visited !== 'y');
    },

    /*
    *   Loads a tour from tour object
    *
    *   @param {tour object} steps - Object containing tour directives
    *                                Check examples at beginning of this js file
    */
    starttour = function (steps) {

        function addTour(tour) {
            // for each step
            for (var i = 0; i < tour.length; i++) {
                // find its dom object and set tour data attributes
                $(tour[i].selector).attr('data-intro', tour[i].text)
                    .attr('data-step', i + 1).attr('data-position', tour[i].position);
            }
            home.selectedTour = tour;
        }

        var steps = steps || mainTour;
        // find the dom objects that will be part of the tour
        // and attach tour data attributes
        addTour(steps);
        // initialize tour
        tour = introJs();
        // before each new tour slide call any functions if needed
        tour.onchange(function (targetElement) {
            var curStep = parseInt($(targetElement).attr('data-step')) - 1;
            // don't show 'next' or 'back' options while at last step
            if (curStep === steps.length - 1) $('.introjs-nextbutton, .introjs-prevbutton').hide();
            // execute specified function if needed
            if (typeof (steps[curStep].before) === 'function') steps[curStep].before();
        });
        // don't show labels or step numbers
        tour.setOption("showStepNumbers", false);
        tour.setOption("skipLabel", "Exit");
        tour.start();
    };

    return {
        initialize: init,
        show: show,
        showGraph: showGraph,
        hide: hide,
        validate: validate,
        getContribution: getContribution,
        setContribution: setContribution
    }
}();