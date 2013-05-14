var avb = avb || {};

avb.navigation = function(){
	var nav,
        white = { r : 255, b : 255, g : 255 },


    initialize = function(data) {
        var w = $('#navigation').width(),
        h = $('#navigation').height();

        nav = d3.select("#navigation").append("div")
        .attr("class", "chart")
        .style("width", w.px())
        .style("height", h.px());

        nav.h = h;
        nav.w = w;

        update(data);
    },

    updateTitle = function (data) {
        var title = $(".title-head"),
            description = $('.title-descr');

        title.text(data.key);

        if (data.descr !== undefined && data.descr !== ''){
            description.text(data.descr);
        } else {
            var defaultDescr = "Learn more about " + data.key + " using chart and information provided or download Cherry Sheet to learn more.";
            description.text(defaultDescr);
        }

        $(title.parent()).center();
    }

    update = function(data){

        nav.x = d3.scale.linear().range([0, nav.w]),
        nav.y = d3.scale.linear().range([0, nav.h])

        var partition = d3.layout.partition()
        .value(function(d) { return d.values[yearIndex].val;})
        .children(function(d) { return d.sub;});

        d3.select('.chart').selectAll('div').remove();
        
        nav.divs = d3.select('.chart').selectAll('div')
        .data(partition.nodes(data)).enter().append('div');

        nav.kx = nav.w / (data.dx),
        nav.ky = nav.h / 1;

        var color = revenuesColor;
        data.color = color[0];
        for(var i=0 ; i<data.sub.length; i++) {
            data.sub[i].color = color[(i+1)%color.length];
        }

        nav.divs.classed('rectangle',true)
        .attr("nodeid", function(d) { return d.hash})
        .style('left', function(d) { return (nav.x(d.y)).px() })
        .style('top', function(d) { return (Math.floor(nav.y(d.x))).px() })
        .style("height", function(d) { return (Math.floor(d.dx * nav.ky)).px(); })
        .style("display", function(d) { return (Math.floor(d.dx * nav.ky)) === 0 ? 'none' : ''; })
        .style("width", (data.dy * nav.kx - 5).px())
        .style('background', function(d) {
            if(d.color === undefined) {
                d.color = d.parent.color;
            }
            var color = background(d.color, 0.8-(0.15*d.depth));
            d3.select(this).attr("printcolor", color );
            return color;
         });
        nav.divs.each(function(){
            $(this).click(function(d) { zoneClick.call(this, d3.select(this).datum()) });
        });


        var textContainers = nav.divs.append('div').classed("outer", true)
        .append('div').classed('inner',true);

        textContainers.append('div').classed('titleLabel', true)
        .text(function(d) { return d.key;} );
        textContainers.append('div').classed('valueLabel', true)
        .text(function(d) { return formatcurrency(d.values[yearIndex].val);} );

        

        nav.divs.each(function(d){
            opacity.call(this, d);
        });

        nav.rootnode = d3.select($('.chart div:first').get(0))
        .classed("selected", true);
        nav.lastClicked =  nav.rootnode;

        $('#arrow').css({
            'margin-left' : (nav.rootnode.datum().dy * nav.kx - $('#arrow').outerWidth())/2
        });

    },


    open = function(nodeId) {
        var rect = d3.select('div[nodeid*="' + nodeId +'"]');
        if(rect.node() === null) {
            rect = d3.select('div[nodeid*="' + root.hash +'"]');
        }
        zoneClick.call(rect.node(), rect.datum(), false);
    },


    zoneClick = function(d, click){


    updateTitle(d);

    // select clicked div
    nav.lastClicked.classed("selected", false);
    d3.select(this).classed("selected", true);

    // go back method
    if(nav.lastClicked !== undefined &&
        nav.lastClicked.datum().depth !== 0 &&
        d.depth === nav.lastClicked.datum().depth){
                zoneClick.call(nav.rootnode.node(),nav.rootnode.datum());
            return;
    }

    // push url
    if(click === undefined) {
        pushUrl( section, thisYear, d.hash);
    }

    // remember selected div
    nav.lastClicked = d3.select(this);

    // refresh title, chart, cards
    updateSelection(d, d.color)

    nav.kx = (d.y ? nav.w - 40 : nav.w) / (1 - d.y);
    nav.ky = nav.h / d.dx;
    nav.ky = nav.ky;

    nav.y.domain([d.x, d.x + d.dx]);
    nav.x.domain([d.y,1]).range([d.y ? 40 : 0, nav.w]);

    // animate pointer
    $('#arrow').animate({
        'margin-left' : (d.depth ? 40 : 0) + (d.dy * nav.kx - $('#arrow').outerWidth())/2
    });

    var duration = 600;

    var t = nav.divs.transition()
    .duration(duration)
    .style('left', function(d) { return (nav.x(d.y)).px() })
    .style('top' , function(d) { return ((nav.y(d.x))).px() })
    .style("width", (d.dy * nav.kx - 5).px())
    .style("height", function(d) { return ((d.dx * nav.ky)).px(); });

    nav.divs.each(function(d){
        opacity.call(this, d, 150);
    });

    if(d3.event !== null) {
        d3.event.stopPropagation();
    }
},


background = function(color, opacity) {
    var startRgb = mixrgb(hexToRgb(color), white, opacity);
    return 'rgba(' + startRgb.r + ',' + startRgb.g + ',' + startRgb.b + ',' + 1.0 + ')';
},


opacity = function(d) {

    labelTitleHeight = 12,
    labelValueHeight = 18;

    var zoneHeight = d.dx * nav.ky;
    if(zoneHeight > 30) {
        $(this).addClass("largearea");
    } else {
        $(this).removeClass("largearea");
    }
    if(zoneHeight < (labelTitleHeight + labelValueHeight)) {
        $(this).addClass("novalue");
    } else {
        $(this).removeClass("novalue");
    }
    if(zoneHeight < labelValueHeight) {
        $(this).addClass("notext");
    } else {
        $(this).removeClass("notext");
    }

};


return{
 initialize : initialize,
 update : update,
 open : open,
 updateTitle : updateTitle
}
}();