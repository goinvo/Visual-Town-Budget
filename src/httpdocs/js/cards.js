var avb = avb || {};

avb.cards = function(){
    var deck = [],
    cardstack = [],

    initialize = function(){
        cardstack = [];
        deck = decks[section];
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

        d3.select("#cardtitle").text(data.name + " in " + thisYear.toString());
        for(var i=0; i < deck.length; i++) {
            cardstack[i].html(Mustache.render($('#card-template').html(),deck[i]));
            cardstack[i].select(".cardvalue").html(deck[i].value(data));
            cardstack[i].select(".carddesc").html(
                (typeof(deck[i].side) === 'string') ? deck[i].side : deck[i].side(data));
        }
    },

    clear = function(){
        cardstack.length = 0;
    };

    return{
        update : update,
        draw : draw,
        clear : clear,
        initialize : initialize
    }
}();
