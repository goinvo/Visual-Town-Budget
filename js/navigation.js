var avb = avb || {};

avb.navigation = function(){
	var nav,


    initialize = function(data) {
        var w = $('#navigation').width(),
        h = $('#navigation').height(),
        color = d3.scale.category20c();


        nav = d3.select("#navigation").append("div")
        .attr("class", "chart")
        .style("width", w)
        .style("height", h)
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h);

        nav.h = h;
        nav.w = w;

        update(data);
    },

    update = function(data){

        nav.x = d3.scale.linear().range([0, nav.w]),
        nav.y = d3.scale.linear().range([0, nav.h])

        var partition = d3.layout.partition()
        .value(function(d) { 
            // return Math.max(20000000,d.values[cur_index].val);
            return d.values[cur_index].val;
        })
        .children(function(d) { return d.sub;});

        nav.selectAll("g").remove();

        var g = nav.selectAll("g")
        .data(partition.nodes(data))
        .enter().append("svg:g")
        .attr("transform", function(d) { return "translate(" + (nav.x(d.y)) + "," + nav.y(d.x) + ")"; })
        .on("click", zoneClick)
        .html('');

        nav.kx = nav.w / (data.dx),
        nav.ky = nav.h / 1;

        var color = d3.scale.category20c();

        g.append("svg:rect")
        .attr("width", data.dy * nav.kx)
        .attr("height", function(d) { return d.dx * nav.ky; })
        .attr("class", function(d) { return d.children ? "parent" : "parent"; })
        .style("fill", function(d) { return color((d.children ? d : d.parent).key); });

        nav.labelTitleHeight = 12,
        nav.labelValueHeight = 18;

        g.append("svg:g")
        .classed("labels", true);

        g.selectAll("g .labels").each(function(d) {
                var zoneHeight = d.dx * nav.ky;

                // title
                var titleLabel = d3.select(this)
                .append("text")
                .text(d.key)
                .attr("x", 0)
                .attr("y", nav.labelTitleHeight)
                .attr("font-size",nav.labelTitleHeight)
                .style("opacity", 0);

                // value
                var valueLabel = d3.select(this)
                .append("text")
                .text(formatcurrency(d.value))
                .attr("x", 0)
                .attr("y", nav.labelTitleHeight +nav.labelTitleHeight + 5)
                .attr("font-size", function(d) {
                    return nav.labelTitleHeight + nav.labelValueHeight/2;
                })
                .attr("font-size", nav.labelValueHeight)

                .style("opacity", 0);

                d3.select(this).attr("transform", transform)
                opacity.call(this, d);

            });

        nav.g = g;
        nav.rootnode = nav.select("g");

        d3.select(window)
        .on("click", function() { zoneClick(data); })

        log("updated");
    },


    zoneClick = function(d){

        // back to rootnode if clicked on same level
        if(nav.lastClicked !== undefined &&
            nav.lastClicked.depth !== 0 &&
            d.depth === nav.lastClicked.depth){
            zoneClick.call(nav.rootnode.node(),nav.rootnode.datum());
        return;
    }
    nav.lastClicked = d;
    avb.chart.drawline(d, d3.select(this).select("rect").style("fill"), true);
    avb.cards.update(d);
    titlebox_fill(d);

    var x = nav.x,
    y = nav.y,
    kx = nav.kx,
    ky = nav.ky,
    h = nav.h,
    w = nav.w,
    g = nav.g;

    kx = (d.y ? w - 40 : w) / (1 - d.y);
    ky = h / d.dx;
    nav.ky = ky;

    y.domain([d.x, d.x + d.dx]);
    x.domain([d.y,1]).range([d.y ? 40 : 0, w]);
    nav.x = x;

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

    t.select("g .labels")
    .attr("transform", transform);


    d3.event.stopPropagation();
},


transform = function(d){
    if(d.dx * nav.ky < (nav.labelTitleHeight + nav.labelValueHeight + 5)) {
        return "translate(8," + ((d.dx * nav.ky / 2) - nav.labelTitleHeight/2) + ")";
    }
    return "translate(8," + ((d.dx * nav.ky / 2) - (nav.labelTitleHeight + nav.labelValueHeight + 5)/2) + ")";
};

opacity = function(d, duration) {
    if(duration === undefined) duration = 0;

    var zoneHeight = d.dx * nav.ky,
        titleOpacity = 0,
        valueOpacity = 0;
    if(zoneHeight > (nav.labelTitleHeight + nav.labelValueHeight + 5)) {
        valueOpacity = 1;
    } 
    if(zoneHeight > ( nav.labelValueHeight + 8)) {
        titleOpacity = 1;
    } 

    $(this).find("text :first").animate({"opacity": titleOpacity}, duration);
    $(this).find("text :last").animate({"opacity": valueOpacity}, duration);

};

return{
 initialize : initialize,
 update : update
}
}();