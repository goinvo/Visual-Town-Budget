var avb = avb || {};

avb.cards = function(){
    var deck = [],
    cardstack = [],

    cards = {
        amount : {
            title : "Amount",
            icon : "img/Amount@High.png",
            back : "this is the back of the card",
            value : function() { return formatcurrency(cur_json.values[cur_index].val); },
            side : function() { return "as of " + cur_year.toString() + "."}
        },
        impact : {
            title : "Impact",
            icon : "img/Impact@High.png",
            back : "this is the back of the card",
            value : function() { return Math.max(0.01,(Math.round(cur_json.values[cur_index].val*100*100/root.values[cur_index].val)/100)).toString() + "%"; },
            side : "of total."
        },
        growth : {
            title : "Growth",
            icon : "img/Growth@High.png",
            back : "this is the back of the card",
            value : function() { return growth(cur_json); },
            side : "compared to last year."
        },
        source : {
            title : "Source",
            icon : "img/Growth@High.png",
            back : "this is the back of the card",
            value : function() { return "Cherry sheet"; },
            side : ""
        },
        fluctuation : {
            title : "Fluctuation",
            icon : "img/Growth@High.png",
            back : "this is the back of the card",
            value : function() { return "Cherry sheet"; },
            side : ""
        }
    },

    initialize = function(){
        deck.push(cards.amount);
        deck.push(cards.impact);
        deck.push(cards.growth);
        deck.push(cards.source);
        deck.push(cards.fluctuation);
        deck.push(cards.fluctuation);
        deck.push(cards.impact);

    },

    draw = function () {
        var container;
        for(var i=0; i < deck.length; i++) {
            if (i%4 === 0) {
                container = d3.select("#cards").append("div")
                .attr("class","row-fluid card-row");
            }
            var newcard = card_draw(container, deck[i]);
            cardstack.push(newcard);
        }
        if(deck.length%4 !== 0) {
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
        }
        reposition();
    },

    reposition = function(){
        var margin = $("#card-container").height();
        $("#cards .row-fluid").each(function(d) {
            console.log($(this).height());
            margin = margin - $(this).height();
        })
        $("#cards").css("margin-top", margin/2);
    },

    clear = function(){
        cardstack.length = 0;
    };


    function growth(data, key){
        var res = "";
        if(key === min_year.toString()) {
            return "+0.00%";
        } else {
            var perc = Math.round(100 * 100 * (data.values[cur_index].val - data.values[cur_index].val.toString()) / data.values[cur_index].val)/100;
            if(perc > 0) {
                return "+" + perc.toString() + "%";
            } else {
                return perc.toString() + "%";
            }
        }
    }

    return{
        update : update,
        draw : draw,
        clear : clear,
        initialize : initialize,
        reposition : reposition
    }
}();
