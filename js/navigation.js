var avb = avb || {};

avb.navigation = function(){
	var navigation,


    initialize = function(data) {
        var w = $('#navigation').width(),
        h = $('#navigation').height(),
        x = d3.scale.linear().range([0, w]),
        y = d3.scale.linear().range([0, h]),
        color = d3.scale.category20c();

        navigation = d3.select("#navigation").append("div")
        .attr("class", "chart")
        .style("width", w)
        .style("height", h)
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h);

        var partition = d3.layout.partition()
        .value(function(d) { return d.values[cur_index].val; })
        .children(function(d) { return d.sub;});

        var g = navigation.selectAll("g")
        .data(partition.nodes(data))
        .enter().append("svg:g")
        .attr("transform", function(d) { return "translate(" + (x(d.y)) + "," + y(d.x) + ")"; })
        .on("click", zoneClick);

        var kx = w / (data.dx),
        ky = h / 1;

        navigation.x = x;
        navigation.y = y;
        navigation.kx = kx;
        navigation.ky = ky;
        navigation.h = h;
        navigation.w = w;

        var color = d3.scale.category20c();

        g.append("svg:rect")
        .attr("width", data.dy * kx)
        .attr("height", function(d) { return d.dx * ky; })
        .attr("class", function(d) { return d.children ? "parent" : "parent"; })
        .style("fill", function(d) { return color((d.children ? d : d.parent).key); });

        navigation.labelTitleHeight = 12,
        navigation.labelValueHeight = 18;

        g.append("svg:text")
        .attr("dy", ".35em");

        g.selectAll("text").each(function(d) {
            var zoneHeight = d.dx * ky;

                // title
                var titleLabel = d3.select(this)
                .append("tspan")
                .text(d.key)
                .attr("x", 0)
                .attr("dy",navigation.labelTitleHeight)
                .style("opacity", 0);

                // value
                var valueLabel = d3.select(this)
                .append("tspan")
                .text(formatcurrency(d.values[cur_index].val))
                .attr("x", 0)
                .attr("dy", function(d) {
                    return navigation.labelTitleHeight + navigation.labelValueHeight/2;
                })
                .attr("font-size", navigation.labelValueHeight)

                .style("opacity", 0);

                d3.select(this).attr("transform", transform)
                opacity.call(this, d);

            });

        navigation.g = g;
        navigation.rootnode = navigation.select("g");

        d3.select(window)
        .on("click", function() { zoneClick(data); })
    },

    zoneClick = function(d){

        // back to rootnode if clicked on same level
        if(navigation.lastClicked !== undefined &&
            navigation.lastClicked.depth !== 0 &&
            d.depth === navigation.lastClicked.depth){
            zoneClick.call(navigation.rootnode.node(),navigation.rootnode.datum());
        return;
    }
    navigation.lastClicked = d;
    avb.chart.drawline(d, d3.select(this).select("rect").style("fill"), true);
    avb.cards.update(d);
    titlebox_fill(d);

    var x = navigation.x,
    y = navigation.y,
    kx = navigation.kx,
    ky = navigation.ky,
    h = navigation.h,
    w = navigation.w,
    g = navigation.g;

    kx = (d.y ? w - 40 : w) / (1 - d.y);
    ky = h / d.dx;
    navigation.ky = ky;

    y.domain([d.x, d.x + d.dx]);
    x.domain([d.y,1]).range([d.y ? 40 : 0, w]);
    navigation.x = x;

    var t = g.transition()
    .duration(d3.event.altKey ? 7500 : 750)
    .attr("transform", function(d) { 
      return "translate(" + x(d.y)+ "," + y(d.x) + ")"; });

    g.each( function(d) {
        opacity.call(this, d, 400);
    })

    t.select("rect")
    .attr("width", d.dy * kx)
    .attr("height", function(d) { return d.dx * ky; });

    t.select("text")
    .attr("transform", transform);


    d3.event.stopPropagation();
},


transform = function(d){

    if (d.dx * navigation.ky < (navigation.labelTitleHeight + navigation.labelValueHeight + 5)) {
        return "translate(8," + (d.dx * navigation.ky / 2 - navigation.labelTitleHeight/2 ) + ")";
    } else {
        return "translate(8," + (d.dx * navigation.ky / 2 - this.getBBox().height/2) + ")";
    }
};

opacity = function(d, duration) {
    if(duration === undefined) duration = 0;

    var zoneHeight = d.dx * navigation.ky,
        titleOpacity = 0,
        valueOpacity = 0;
    if(zoneHeight > (navigation.labelTitleHeight + navigation.labelValueHeight + 8)) {
        valueOpacity = 1;
    } 
    if(zoneHeight > ( navigation.labelValueHeight + 8)) {
        titleOpacity = 1;
    } 

    $(this).find("tspan :first").animate({"opacity": titleOpacity}, duration);
    $(this).find("tspan :last").animate({"opacity": valueOpacity}, duration);

};

return{
 initialize : initialize
}
}();