var avb = avb || {};

avb.cards = function(){
    var deck = [],
    cardstack = [],

    cards = {
        amount : {
            title : "Amount",
            class : "span6",
            icon : "/img/Amount@High.png",
            value : function(d) { return formatcurrency(d.values[yearIndex].val); },
            side : function() { return " as of " + thisYear.toString() + "."}
        },
        impact : {
            title : "Impact",
            class : "span6",
            icon : "/img/Impact@High.png",
            value : function(d) { return Math.max(0.01,(Math.round(d.values[yearIndex].val*100*100/root.values[yearIndex].val)/100)).toString() + "%"; },
            side : function() { return " of total " + section + "."}
        },
        growth : {
            title : "Growth",
            class : "span6",
            icon : "/img/Growth@High.png",
            value : function(d) { return growth(d); },
            side : " compared to last year."
        },
        source : {
            title : "Source",
            class : "span12 card-source",
            icon : "/img/Growth@High.png",
            value : function() { return "Cherry sheet"; },
            side : "is the data source for this entry."
        },
        mean : {
            title : "Average",
            class : "span6",
            icon : "/img/Growth@High.png",
            value : function(d) { return formatcurrency(d3.mean(d.values, get_values)); },
            side : "on average."
        },
        filler : {
            title : "",
            class : "span6",
            icon : "",
            value : function(d) { return ""; },
            side : ""
        }
    },

    decks = {
        revenues : [cards.amount, cards.growth, cards.impact, cards.mean, cards.source],
        expenses : [cards.amount, cards.growth, cards.impact, cards.mean, cards.source],
        funds : [cards.amount, cards.growth, cards.impact, cards.mean, cards.source]
    },

    initialize = function(){
        deck = decks[section];
    },

    draw = function () {
        var container;
        for(var i=0; i < deck.length; i++) {
            if (i%2 === 0) {
                container = d3.select("#cards").append("div")
                .attr("class","row-fluid card-row");
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
    },


    growth = function(data){
        var previous = (data.values[yearIndex-1] !== undefined) ? data.values[yearIndex-1].val : 0;
        var perc = Math.round(100 * 100 * (data.values[yearIndex].val - previous) / data.values[yearIndex].val)/100;
        if(perc > 0) {
            return "+ " + perc.toString() + "%";
        } else {
            return "- " + Math.abs(perc).toString() + "%";
        }
    };



    return{
        update : update,
        draw : draw,
        clear : clear,
        initialize : initialize
    }
}();
