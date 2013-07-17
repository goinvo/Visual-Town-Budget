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
    var home = new Object;

    /*
     * Tutorial node IDs.
     * They are used to identify which zone to highlight on the treemap
     */
    var townDepartments = 'ad864a7e',
        fireDepartment = '8c25ea50',
        snowRemoval = 'f2e64f63',
        townSchools = '52b91b83';

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
        position: 'left'
    }, {
        selector: '#yeardrop',
        text: 'Interested in seeing budget history or projections? Use this menu.',
        position: 'left',
        before: function () {
            setTimeout(function () {
                $('#yeardrop-container').addClass('open')
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
        position: 'left'
    }];

    /*
    *   Topic tour, begins when user clicks on FAQ
    */
    var fireTour = [{
        selector: '#fire',
        text: 'The fire department accounts for one of the greatest town department expenses.',
        position: 'left',
        before: function () {
            $('g[nodeid="' + fireDepartment + '"]').find('div').first().attr('id', 'fire');
        }
    }, {
        selector: '#cards',
        text: 'Here is the basic information you need to know about the department.',
        position: 'down',
        before: function () {
            avb.navigation.open(fireDepartment);
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
            avb.navigation.open(snowRemoval);
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
        text: 'School play an important role in the town expenses.',
        position: 'bottom',
        before: function () {
            $('g[nodeid="' + townSchools + '"]').find('div').first().attr('id', 'school');
        }
    }, {
        selector: '#cards',
        text: 'They constitute about 40% of the yearly expenses.',
        position: 'right',
        before :  function() { avb.navigation.open(townSchools) }
    }, {
        selector: '#zoombutton',
        text: 'Go back and explore more.',
        position: 'left'
    }];

    /*
    *   Initiialize function
    */
    init = function (data) {

        // hides overlay when clicked
        // it defaults to funds section
        function overlayClick(event) {
            event.stopPropagation();
            // highlight 'funds' link
            $($('.section').get(2)).addClass('selected');
            hide();
        }

        // begins a tour with a slight delay to wait for 
        // homepage to minimize
        function tourClick(tour, before) {
            sectionClick.call(this);
            setTimeout(function () {
                if (before !== undefined) {
                    setTimeout(function () {
                        before();
                    }, 1000);
                    setTimeout(function () {
                        starttour(tour)
                    }, 2500);
                } else {
                    starttour(tour);
                }
            }, 500);
        }

        // 


        home.content = $('#avb-home');
        home.overlay = $('#overlay');
        home.map = $('#home-map-svg');
        home.menubar = $('#avb-menubar');
        home.overlay.click(overlayClick);

        $('.section').removeAttr('onclick');

        // taxes input initialization
        $('#tax-input').val(getContribution());
        // start link 
        $('#tax-input-start').click(function () {
            setContribution();
            tourClick.call(this, individualTour)
        });
        // enter key event
        $('#tax-input').keypress(function (e) {
            if (e.which == 13) {
                setContribution();
                tourClick.call(this, individualTour);
            }
        });

        // tutorials links
        $('#q1').click(function () {
            tourClick.call(this, fireTour, function () {
                avb.navigation.open(townDepartments);
                fireTour[0].before();
            })
        });

        $('#q2').click(function () {
            sectionClick.call(this);
            setTimeout(function() {
                schoolTour[0].before();
                starttour(schoolTour);
            },1200)
        });

        $('#q3').click(function () {
            tourClick.call(this, snowTour, function () {
                avb.navigation.open(townDepartments);
                snowTour[0].before();
            })
        });
    },

    sectionClick = function() {
        initialize({
            section: $(this).attr('data-section').toLowerCase()
        });
        // home page minimizes right after treemap values are calculated
        // avoids sloppy animations
        setTimeout(function () {
            hide()
        }, 100);
    }

    /*
    * retrieves resident annual contribution
    */
    getContribution = function () {
        // reads contribution cookie
        var value = jQuery.cookie('contribution') || null;
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
    * useful snippet on stackoverflow
    * keeps non-numeric characters from being typed in the input box
    * http://stackoverflow.com/questions/469357/html-text-input-allow-only-numeric-input
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
    * Executes home bars transition
    */
    showGraph = function (duration) {
        var data = home.data['sub'];
        var scale = d3.scale.linear().clamp(true).range([30, 160])
            .domain([0, d3.max(data, function (d) {
                return d.values[yearIndex].val
            })]);
        $('#revenues-node').animate({
            height: scale(data[0].values[yearIndex].val)
        }, duration)
            .find('.node-value').text(formatcurrency(data[0].values[yearIndex].val));
        $('#expenses-node').animate({
            height: scale(data[1].values[yearIndex].val)
        }, duration)
            .find('.node-value').text(formatcurrency(data[1].values[yearIndex].val));
        $('#funds-node').animate({
            height: scale(data[2].values[yearIndex].val)
        }, duration)
            .find('.node-value').text(formatcurrency(data[2].values[yearIndex].val));
        $('.node-value').fadeIn(duration);
        $('.node').click(sectionClick);
    },

    //
    show = function () {
        home.menubar.removeClass('purple-border');
        home.content.show();
        home.overlay.show();

        $.getJSON('data/home.json', function (data) {
            setTimeout(function () {
                home.data = data;
                showGraph(1000);
            }, 1000);
        });

        // start budget app
        initialize({
            "section": "funds"
        });
        $('.section').removeClass('selected');

    },

    /*
    * minimizes home page
    */
    hide = function (showtour) {
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
    * Checks for new or returning user
    * Stores cookie that will mark current user as returning visitor
    * for 2 weeks
    */
    isFirstVisit = function () {
        var visited = jQuery.cookie('visited');
        jQuery.cookie('visited', 'y', {
            expires: 14
        });
        return (visited !== 'y');
    },

    starttour = function (steps) {

        function addTour(tour) {
            for (var i = 0; i < tour.length; i++) {
                $(tour[i].selector).attr('data-intro', tour[i].text)
                    .attr('data-step', i + 1).attr('data-position', tour[i].position);
            }
            home.selectedTour = tour;
        }

        var steps = steps || mainTour;
        addTour(steps);
        tour = introJs();
        // do not show next button at last tour step
        tour.onchange(function (targetElement) {
            var curStep = parseInt($(targetElement).attr('data-step')) - 1;
            if (curStep === steps.length - 1) $('.introjs-nextbutton, .introjs-prevbutton').hide();
            if (typeof (steps[curStep].before) === 'function') steps[curStep].before();
        });
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