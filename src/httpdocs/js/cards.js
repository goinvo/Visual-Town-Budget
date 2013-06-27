/*
File: cards.js

Description:
    Card component for visual budget application

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

avb.cards = function(){
    var deck = [],
    cardstack = [],

    initialize = function(){
        cardstack = [];
        deck = decks[avb.section];
        draw();
    },

    draw = function () {
        var container;
        for(var i=0; i < deck.length; i++) {
            if (i%2 === 0) {
                container = d3.select("#cards").append("div")
                .attr("class","row-fluid card-row separator");
            }
            var newcard = card_draw(container, deck[i]);
            cardstack.push(newcard);
        }
    },

    card_draw = function (container, card){
        return container.append("div")
        .html(Mustache.render($('#card-template').html(),card));
    },

    update = function (data) {

        d3.select("#cardtitle").text(data.name + " in " + avb.thisYear.toString());
        for(var i=0; i < deck.length; i++) {
            cardstack[i].html(Mustache.render($('#card-template').html(),deck[i]));
            cardstack[i].select(".cardvalue").html(deck[i].value(data));
            if(typeof(deck[i].link) === 'function')
                cardstack[i].attr('onclick', "window.location='" + deck[i].link()  + "'");
            cardstack[i].select(".carddesc").html(
                (typeof(deck[i].side) === 'string') ? deck[i].side : deck[i].side(data));
        }
    },

    clear = function(){
        cardstack.length = 0;
    };

    return{
        update : update,
        clear : clear,
        initialize : initialize
    }
}();
