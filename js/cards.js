var avb = avb || {};

avb.cards = function(){
    var deck = [],
    cardstack = [],

    initialize = function(){
        // amount card
        var newcard = new Object();
        newcard.title = "Amount";
        newcard.icon = ""
        newcard.back = "this is the back of the card";
        newcard.value = function(data) { return formatcurrency(data[cur_year.toString()]); };
        newcard.side = function(data) { return "as of " + cur_year.toString() + "."};
        deck.push(newcard);

        var newcard = new Object();
        newcard.title = "Impact";
        newcard.icon = "";
        newcard.back = "this is the back of the card";
        newcard.value = function(data) { return Math.max(0.01,(Math.round(data[cur_year]*100*100/root_total)/100)).toString() + "%"; };
        newcard.side = "of total " + section + ".";
        deck.push(newcard);

        var newcard = new Object();
        newcard.title = "Growth";
        newcard.icon = "";
        newcard.back = "this is the back of the card";
        newcard.value = function(data) { return h_growth(data, cur_year.toString()); };
        newcard.side = "compared to last year.";
        deck.push(newcard);

        var newcard = new Object();
        newcard.title = "Source";
        newcard.icon = "";
        newcard.back = "this is the back of the card";
        newcard.value = function(data) { return "Cherry sheet"; };
        newcard.side = "";
        deck.push(newcard);

        var newcard = new Object();
        newcard.title = "Fluctuation";
        newcard.icon = "";
        newcard.back = "this is the back of the card";
        newcard.value = function(data) { return "Cherry sheet"; };
        newcard.side = "";
        deck.push(newcard);
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
        var newcard = container.append("div")
        .attr("class", "span3 card");

        newcard.append("div")
        .classed("card-img",true)
        .append("img")
        .attr("src", card.icon)
        .attr("height", 30)
        .attr("width", 30)
        .style("float","left");

        newcard.divs =  newcard.append("div")
        .style("margin-left", (35).px())
        .classed("card-text", true)
        newcard.title = newcard.divs.append("div")
        .text(card.title)
        .attr("class", "cardtitle");

        newcard.bottom = newcard.divs.append("div")
        .attr("class", "cardvalue");

        return newcard;
    },

    update = function (data) {
        d3.select("#cardtitle").text(data.name + " in " + cur_year.toString());
        for(var i=0; i < deck.length; i++) {
            var text = deck[i].value(data);
            if ( typeof(deck[i].side) === 'string') {
                text = text + " " + deck[i].side;
            } else {
                text = text + " " + deck[i].side(data);
            }
            cardstack[i].bottom.text(text);
        }
        reposition()
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

    return{
        update : update,
        draw : draw,
        clear : clear,
        initialize : initialize,
        reposition : reposition
    }
}();
