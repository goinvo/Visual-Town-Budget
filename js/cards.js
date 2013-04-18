var avb = avb || {};

avb.cards = function(){
    var deck = [],
    cardstack = [],

    cards = {
        amount : {
            title : "Amount",
            icon : "img/Amount@High.png",
            value : function(d) { return formatcurrency(d.values[cur_index].val); },
            side : function() { return "as of " + cur_year.toString() + "."}
        },
        impact : {
            title : "Impact",
            icon : "img/Impact@High.png",
            value : function(d) { return Math.max(0.01,(Math.round(d.values[cur_index].val*100*100/root.values[cur_index].val)/100)).toString() + "%"; },
            side : "of total."
        },
        growth : {
            title : "Growth",
            icon : "img/Growth@High.png",
            value : function(d) { return growth(d); },
            side : ""
        },
        source : {
            title : "Source",
            icon : "img/Growth@High.png",
            value : function() { return "Cherry sheet"; },
            side : ""
        },
        mean : {
            title : "Average",
            icon : "img/Growth@High.png",
            value : function(d) { return formatcurrency(d3.mean(d.values, get_values)); },
            side : ""
        }
    },

    initialize = function(){
        deck.push(cards.amount);
        deck.push(cards.impact);
        deck.push(cards.growth);
        deck.push(cards.mean);
        deck.push(cards.source);
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
        if(deck.length%2 !== 0) {
            container.append("div") 
            .attr("class", "span6");
        }
    },

    card_draw = function (container, card){
        return container.append("div")
        .html(Mustache.render($('#card-template').html(),card));
    },

    update = function (data) {
        d3.select("#cardtitle").text(data.name + " in " + cur_year.toString());
        for(var i=0; i < deck.length; i++) {
            cardstack[i].html(Mustache.render($('#card-template').html(),deck[i]));
            cardstack[i].select(".cardvalue").html(deck[i].value(data) + 
               ((typeof(deck[i].side) === 'string') ? deck[i].side : deck[i].side(data)));
        }
        reposition();
    },

    reposition = function(){
        var margin = $("#bottom-container").height() - $("#cards").height();
        $("#cards").css("margin-top", margin/2);
        return;
    },

    clear = function(){
        cardstack.length = 0;
    },


    growth = function(data){
        var previous = (data.values[cur_index-1] !== undefined) ? data.values[cur_index-1].val : 0;
        var perc = Math.round(100 * 100 * (data.values[cur_index].val - previous) / data.values[cur_index].val)/100;
        if(perc > 0) {
            return "+ " + perc.toString() + "% compared to last year.";
        } else {
            return "- " + Math.abs(perc).toString() + "% compared to last year.";
        }
    };



    return{
        update : update,
        draw : draw,
        clear : clear,
        initialize : initialize,
        reposition : reposition
    }
}();
