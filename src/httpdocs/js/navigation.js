var avb = avb || {};

avb.navigation = function(){
	var nav,


    initialize = function(data) {
        var w = $('#navigation').width(),
        h = $('#navigation').height(),
        color = d3.scale.category20c();


        nav = d3.select("#navigation").append("div")
        .attr("class", "chart")
        .style("width", w.px())
        .style("height", h.px());
        // .append("svg:svg")
        // .attr("width", w)
        // .attr("height", h);

        nav.h = h;
        nav.w = w;

        update(data);
    },

    update = function(data){

        nav.x = d3.scale.linear().range([0, nav.w]),
        nav.y = d3.scale.linear().range([0, nav.h])

        var partition = d3.layout.partition()
        .value(function(d) { return d.values[yearIndex].val;})
        .children(function(d) { return d.sub;});


        var color = d3.scale.category20c();

        nav.divs = d3.select('.chart').selectAll('div')
        .data(partition.nodes(data)).enter().append('div');

        nav.kx = nav.w / (data.dx),
        nav.ky = nav.h / 1;

        // var opacityScale = d3.scale.linear()
        // .domain([4,0]).range([0.3,0.9]);

        nav.divs.classed('rectangle',true)
        .attr("nodeid", function(d) { return d.hash})
        .style('left', function(d) { return (nav.x(d.y)).px() })
        .style('top', function(d) { return (nav.y(d.x)).px() })
        .style("height", function(d) { return (Math.floor(d.dx * nav.ky)).px(); })
        .style("width", (data.dy * nav.kx - 2).px())
        //.style("opacity", function(d) { return opacityScale(d.depth)})
        //.style('background-color', function(d) { return color((d.children ? d : d.parent).key); });
        .style('background', function(d) { return gradient(color((d.children ? d : d.parent).key)); });
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

        scope();

        nav.divs.each(function(d){
            opacity.call(this, d);
        });

        nav.rootnode = d3.select($('.chart div:first').get(0))
        .classed("selected", true);
        nav.lastClicked =  nav.rootnode;

    },

    gradient = function(color) {
        var startRgb = hexToRgb(color);
        var start = 'rgba(' + startRgb.r + ',' + startRgb.g + ',' + startRgb.b + ',' + 1 + ')';
        var end = shadeColor(color, 5);
        var gradient = '-webkit-gradient(linear, 0% 0%, 0% 100%, from(' + start + '), to( ' + start + '))';
        return gradient;
    },

    open = function(nodeId) {
        var rect = d3.select('div[nodeid*="' + nodeId +'"]');
        if(rect.node() === null) {
            rect = d3.select('div[nodeid*="' + root.hash +'"]');
        }
        zoneClick.call(rect.node(), rect.datum(), false);
    },


    zoneClick = function(d, click){

    // back to rootnode if clicked on same level
    nav.lastClicked.classed("selected", false);
    d3.select(this).classed("selected", true);

    if(nav.lastClicked !== undefined &&
        nav.lastClicked.datum().depth !== 0 &&
        d.depth === nav.lastClicked.datum().depth){
                zoneClick.call(nav.rootnode.node(),nav.rootnode.datum());
            return;
    }

    if(click === undefined) {
        pushUrl( section, thisYear, d.hash);
    }

    nav.lastClicked = d3.select(this);

    updateSelection(d, d3.select(this).style("background-color"))

    var x = nav.x,
    y = nav.y,
    kx = nav.kx,
    ky = nav.ky,
    h = nav.h,
    w = nav.w,
    g = nav.divs;

    kx = (d.y ? w - 40 : w) / (1 - d.y);
    ky = h / d.dx;
    nav.ky = ky;

    y.domain([d.x, d.x + d.dx]);
    x.domain([d.y,1]).range([d.y ? 40 : 0, w]);
    nav.x = x;

    scope();

    var duration = 600;

    var t = g.transition()
    .duration(duration)
    .style('left', function(d) { return (x(d.y)).px() })
    .style('top' , function(d) { return (y(d.x)).px() })
    .style("width", (d.dy * kx - 1).px())
    .style("height", function(d) { return (d.dx * ky).px(); });

    g.each(function(d){
        opacity.call(this, d, 150);
    });

    if(d3.event !== null) {
        d3.event.stopPropagation();
    }
},


transform = function(d){
    if(d.dx * nav.ky < (nav.labelTitleHeight + nav.labelValueHeight + 5)) {
        return "translate(8," + ((d.dx * nav.ky / 2) - nav.labelTitleHeight/2) + ")";
    }
    return "translate(8," + ((d.dx * nav.ky / 2) - (nav.labelTitleHeight + nav.labelValueHeight + 5)/2) + ")";
};

scope = function() {
    nav.divs.style('display', function(d) { 
        if( d.dx * nav.ky < 2 ) {
            return 'none';
        } else {
            return 'table';
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