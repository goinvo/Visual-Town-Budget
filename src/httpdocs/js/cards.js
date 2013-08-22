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
    // all the cards that need to be shown for the current section
    var deck = [],
    // all card objects
    cardstack = [],
    $cards;

    /*
    *   Initializes cards
    */
    initialize = function(){
        cardstack = [];
        $cards = $("#cards");
        // each section has its own deck, or information to be shown
        // about each entry
        // eg. only expenses has personal contribution card
        deck = decks[avb.section];

        var container,
            rowHtml = '<div class="row-fluid card-row separator"> </div>';
        // draw all cards in deck
        for(var i=0; i < deck.length; i++) {
            // append new row every 2 cards
            if (i%2 === 0) {
                container = $(rowHtml).appendTo($cards);
            }
            // creates div for new card
            var newcard = $('<div class="card-wrapper"></div>').appendTo(container);
            // var newcard = drawCard(container, deck[i]);
            // remember card object for future updates
            cardstack.push(newcard);
        }
    },

    /*
    *   Updates all cards with latest data
    *
    *   @param {node} data - node for which data has to be displayed
    */
    update = function (data) {

        // update all cards in deck
        $.each(deck, function(i,d){
            // render template

            if(typeof(d.cardRenderer) === 'function') {
                d.cardRenderer(data, cardstack[i]);
            } else {
                cardstack[i].html(Mustache.render($('#card-template').html(),d));
            }
            // set value
            cardstack[i].find(".card-value").html(deck[i].value(data));

            // set card description if available
            cardstack[i].find(".card-desc").html(
                (typeof(deck[i].side) === 'string') ? deck[i].side : deck[i].side(data));
        });
    },

    /*
    *   Displays node in cards
    *
    *   @param {node} data - node for which data has to be displayed
    */
    open = function(data){
        avb.cards.update(data);
    };

    return{
        open : open,
        update : update,
        initialize : initialize
    }
}();
