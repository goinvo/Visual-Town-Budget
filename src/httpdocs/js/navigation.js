var avb = avb || {};

avb.navigation = function(){
	var nav,


    initialize = function(data) {
        var w = $('#navigation').width(),
        h = $('#navigation').height();
        //color = d3.scale.category20c();

        nav = d3.select("#navigation").append("div")
        .attr("class", "chart")
        .style("width", w.px())
        .style("height", h.px());
        // .append("svg:svg")
        // .attr("width", w)
        // .attr("height", h);

        nav.h = h;
        nav.w = w;

        var color = revenuesColor;
        data.color = color[0];
        for(var i=0 ; i<data.sub.length; i++) {
            data.sub[i].color = color[(i+1)%color.length];
        }

        update(data);
    },

    update = function(data){



        nav.x = d3.scale.linear().range([0, nav.w]),
        nav.y = d3.scale.linear().range([0, nav.h])

        var partition = d3.layout.partition()
        .value(function(d) { return d.values[yearIndex].val;})
        .children(function(d) { return d.sub;});

       log(data)

        nav.divs = d3.select('.chart').selectAll('div')
        .data(partition.nodes(data)).enter().append('div');

        nav.kx = nav.w / (data.dx),
        nav.ky = nav.h / 1;

        // var opacityScale = d3.scale.linear()
        // .domain([4,0]).range([0.3,0.9]);

        nav.divs.classed('rectangle',true)
        .attr("nodeid", function(d) { return d.hash})
        .style('left', function(d) { return (nav.x(d.y)).px() })
        .style('top', function(d) { return (Math.floor(nav.y(d.x))).px() })
        .style("height", function(d) { return (Math.floor(d.dx * nav.ky)).px(); })
        .style("width", (data.dy * nav.kx - 5).px())
        //.style("opacity", function(d) { return opacityScale(d.depth)})
        //.style('background-color', function(d) { return color((d.children ? d : d.parent).key); });
        .style('background', function(d) {
            if(d.color === undefined) {
                d.color = shadeColor(d.parent.color,0);
            }
            return background(d.color);
         });
        nav.divs.each(function(){
            d3.select(this).append('div').classed('overlay',true);
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
            scope.call(this, d);
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
    updateSelection(d, d3.select(this).style("background-color"))

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

    nav.divs.each(function(d){
        scope.call(this, d);
    });

    var t = nav.divs.transition()
    .duration(duration)
    .style('left', function(d) { return (nav.x(d.y)).px() })
    .style('top' , function(d) { return (Math.floor(nav.y(d.x))).px() })
    .style("width", (d.dy * nav.kx - 5).px())
    .style("height", function(d) { return (Math.floor(d.dx * nav.ky)).px(); });

    nav.divs.each(function(d){
        opacity.call(this, d, 150);
    });

    if(d3.event !== null) {
        d3.event.stopPropagation();
    }
},


background = function(color) {
    var opacity = 0.5;
    var startRgb = hexToRgb(color);
    var start = 'rgba(' + startRgb.r + ',' + startRgb.g + ',' + startRgb.b + ',' + opacity + ')';
    var gradient = start;
    return gradient;
},

scope = function(d) {

    d3.select(this).style('box-shadow', function(d){
        if(d.dx * nav.ky > 150){
            return 'inset 0px 0px ' + ((d.dx * nav.ky)) + 'px' + d.color;
        } else {
            return '';
        }
    });
}

opacity = function(d, duration) {
    if(duration === undefined) duration = 0;

    labelTitleHeight = 12,
    labelValueHeight = 18;

    var zoneHeight = d.dx * nav.ky,
        titleOpacity = 0,
        valueOpacity = 0;
        valueOpacity = 1;
         $(this).find(".valueLabel, .valueLabel").css({
            display : 'none'
         })
    if(zoneHeight > (labelTitleHeight + labelValueHeight)) {
        valueOpacity = 1;
         $(this).find(".valueLabel").css({
            display : 'block'
         })
    } 
    if(zoneHeight > ( labelValueHeight)) {
        titleOpacity = 1;
         $(this).find(".titleLabel").css({
            display : 'block'
         })
    }

    $(this).find(".titleLabel").css({"opacity": titleOpacity});
    $(this).find(".valueLabel").css({"opacity": valueOpacity});
};

return{
 initialize : initialize,
 update : update,
 open : open
}
}();