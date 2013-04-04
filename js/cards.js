var avb = avb || {};

avb.cards = function(){
    var deck = [],
    cardstack = [],

    initialize = function(){
        // amount card
        var newcard = new Object();
        newcard.title = "AMOUNT";
        newcard.icon = "img/dollar.png"
        newcard.back = "this is the back of the card";
        newcard.value = function(data) { return formatcurrency(data[cur_year.toString()]); };
        newcard.side = function(data) { return "as of " + cur_year.toString() + "."};
        deck.push(newcard);

        var newcard = new Object();
        newcard.title = "IMPACT";
        newcard.icon = "img/build.png";
        newcard.back = "this is the back of the card";
        newcard.value = function(data) { return Math.max(0.01,(Math.round(data[cur_year]*100*100/root_total)/100)).toString() + "%"; };
        newcard.side = "of total " + section + ".";
        deck.push(newcard);

        var newcard = new Object();
        newcard.title = "GROWTH";
        newcard.icon = "img/updown.png";
        newcard.back = "this is the back of the card";
        newcard.value = function(data) { return h_growth(data, cur_year.toString()); };
        newcard.side = "compared to last year.";
        deck.push(newcard);

        var newcard = new Object();
        newcard.title = "SOURCE";
        newcard.icon = "img/info_30.png";
        newcard.back = "this is the back of the card";
        newcard.value = function(data) { return "Cherry sheet"; };
        newcard.side = "";
        deck.push(newcard);
    },

    draw = function () {
        var container;
        for(var i=0; i < deck.length; i++) {
            if (i%3 === 0) {
                container = d3.select("#cards").append("div")
                .attr("class","row-fluid");
            }
            var newcard = card_draw(container, deck[i]);
            cardstack.push(newcard);
        }
        if(deck.length%3 !== 0) {
            container.append("div")
            .attr("class", "span6");
        }
    },

    card_draw = function (container, card){
        var newcard = container.append("div")
        .attr("class", "span4 card");

        newcard.divs =  newcard.append("div");
        newcard.title = newcard.divs.append("div")
        .text(card.title)
        .attr("class", "cardtitle");
        var img_size = newcard.title.property("clientHeight");
        console.log(img_size);
        newcard.title.append("img")
        .attr("src", card.icon)
        .attr("height", img_size)
        .attr("width", img_size)
        .style("float","left");
        newcard.title.append("hr");
        newcard.bottom = newcard.divs.append("div");
        newcard.bottom.left = newcard.bottom.append("div")
        .attr("class", "cardvalue");;
        newcard.bottom.right = newcard.bottom.append("div")
        .attr("class", "carddescr");;

        return newcard;
    },

    update = function (data) {
        for(var i=0; i < deck.length; i++) {
            cardstack[i].bottom.left.text(deck[i].value(data));
            var text;
            if ( typeof(deck[i].side) === 'string') {
                text = deck[i].side;
            } else {
                text = deck[i].side(data);
            }
            cardstack[i].bottom.right.text(text);
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
