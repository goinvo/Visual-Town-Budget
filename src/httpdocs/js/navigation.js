
var avb = avb || {};

avb.navigation = function(){
	var nav, currentLevel,
    white = { r : 255, b : 255, g : 255 },


    initialize = function(data) {
        var width = $('#navigation').width(),
        height = $('#navigation').height();

        var margin = {top: 0, right: 0, bottom: 0, left: 0},
        height = height - margin.top - margin.bottom,
        formatNumber = d3.format(",d"),
        transitioning;

        /* create svg */
        nav = d3.select("#navigation").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top)
        .style("margin-left", -margin.left + "px")
        .style("margin.right", -margin.right + "px")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .style("shape-rendering", "crispEdges");

        /* create x and y scales */
        nav.x = d3.scale.linear()
        .domain([0, width])
        .range([0, width]);

        nav.y = d3.scale.linear()
        .domain([0, height])
        .range([0, height]);

        nav.h = height;
        nav.w = width;
        nav.m = margin;

        nav.color = d3.scale.category20();

        $('#zoombutton').center();

        update(data);

    },


    update = function(data){
        nav.selectAll("g").remove();

        var layout = function (d) {
            if (d.sub) {
                treemap.nodes({values : d.values, children : d.sub});
                d.sub.forEach(function(c) {
                    c.x = d.x + c.x * d.dx;
                    c.y = d.y + c.y * d.dy;
                    c.dx *= d.dx;
                    c.dy *= d.dy;
                    c.parent = d;
                    layout(c);
                });
            }
        }

        var init = function(root) {
            root.x = root.y = 0;
            root.dx = nav.w;
            root.dy = nav.h;
            root.depth = 0;
        }

        var treemap = d3.layout.treemap()
        .children(function(d, depth) { return depth ? null : d.children; })
        .value(function(d) { return d.values[yearIndex].val})
        .sort(function(a, b) { return a.values[yearIndex].val - b.values[yearIndex].val; })
        .ratio(nav.h / nav.w * 0.5 * (1 + Math.sqrt(5)))
        .round(false);

        var root = data;

        nav.grandparent = nav.append("g")
        .attr("class", "grandparent");

        init(root);
        layout(root);

        currentLevel = display(root);


} 

display = function(d) {

        $('.no-value').popover('destroy');

        var formatNumber = d3.format(",d"),transitioning;

        function name(d) {
            return d.parent ? name(d.parent) + "." + d.key : d.key;
        }

        var g1 = nav.insert("g", ".grandparent")
        .datum(d)
        .attr("class", "depth")
        .on("click", function(){
            zoneClick.call(this, d3.select(this).datum(), true);
        })

        /* add in data */
        var g = g1.selectAll("g")
        .data((d.sub.length === 0) ? [d] : d.sub)
        .enter().append("g");

        /* create grandparent bar at top */
        nav.grandparent
        .datum((d.parent === undefined) ? d : d.parent)
        .attr("nodeid", (d.parent === undefined) ? d.hash : d.parent.hash)
        .on("click", function(){
            zoneClick.call(this, d3.select(this).datum(), true);
        });


        updateTitle(d);

        /* transition on child click */
        g.filter(function(d) { return d.sub; })
        .classed("children", true)
        .on("click", function(){
            zoneClick.call(this, d3.select(this).datum(), true);
        })

        // assign new color only if not last node
        if(d.sub.length !== 0 && d.color === undefined) {
            d.color = nav.color(0);
        }
        for(var i=0; i<d.sub.length; i++) {
            d.sub[i].color = nav.color(i);
        }

        g.append("rect")
            .attr("class", "parent")
            .call(rect)
            .style("fill", function(d) {return background(d.color,0.8);});


        /* write children rectangles */
        function addChilds(d, g){ 
            g.selectAll(".child")
            .data(function(d) { return d.sub || [d]; })
            .enter().append("g")
            .attr("class", "child")
            .each( function() {
                var group = d3.select(this);
                if(d.sub !== undefined) {
                    $.each(d.sub, function(){
                        addChilds(this, group);
                    })
                }
            })
            .append("rect")
            .call(rect);
        }

        addChilds(d, g);

        /* Adding a foreign object instead of a text object, allows for text wrapping */
        g.each(function(){

            var label = d3.select(this).append("foreignObject")
            .call(rect)
            .attr("class","foreignobj")
            .append("xhtml:div") 
            .attr("dy", ".75em")
            .html(function(d) { 
                var title = '<div class="titleLabel">' + d.key + '</div>',
                    values = '<div class="valueLabel">' + formatcurrency(d.values[yearIndex].val) + '</div>';
                return title + values; })
            .attr("class","textdiv");

           textLabels.call(this);

        });

        return g;

}


textLabels = function(d){
    var d = d3.select(this).datum(),
        containerHeight = nav.y(d.y + d.dy) - nav.y(d.y) ,
        containerWidth = nav.x(d.x + d.dx) - nav.x(d.x),
        title = $(this).find('.titleLabel').first(),
        div = $(this).find('.textdiv').first();

    $(this).find('div').first().popover('destroy');
    d3.select(this).classed("no-value", false);
    d3.select(this).classed("no-label", false);

    if (containerHeight < title.outerHeight() || containerWidth < 60) {
        d3.select(this).classed("no-label", true);
        d3.select(this).select('div').style("height", containerHeight.px());
        $(this).find('div').first().popover({container : 'body', trigger : 'hover', placement: 'top', content : d.key});
    }
    if(containerHeight < div.outerHeight()) {
        d3.select(this).classed("no-value", true);
    }
}

updateTitle = function (data) {
    var title = $(".title-head .text");

    var zoom = $('#zoombutton');
    var parent = d3.select('.grandparent').node();

    zoom.unbind();
    title.text(data.key);
    $(title).textfill(48, $('.title-head').width() - 120);

    if (currentSelection === root){
        zoom.addClass('disabled');
    } else {
        zoom.removeClass('disabled');
    }

    zoom.click(function(){
        zoneClick.call(parent, d3.select(parent).datum(), true);
    })

}

open = function(nodeId, pushUrl) {
        var rect = d3.select('g[nodeid*="' + nodeId +'"]');
        log(nodeId)
        log(rect);
        zoneClick.call(rect.node(), rect.datum(), pushUrl);
    },

zoneClick= function(d, click) {

    if (nav.transitioning || !d || !currentSelection || (currentSelection.year  === yearIndex && currentSelection.data === d)) return;

    if(click === true) {
        log(d.key); log(d.hash);
        pushUrl( section, thisYear, d.hash);
    }

      updateSelection(d, yearIndex, d.color);


      nav.transitioning = true;

      currentLevel.selectAll(".parent").style("opacity", 1);

       var g2 = display(d);
          t1 = currentLevel.transition().duration(750),
          t2 = g2.transition().duration(750);

      // Update the domain only after entering new elements.
      nav.x.domain([d.x, d.x + d.dx]);
      nav.y.domain([d.y, d.y + d.dy]);

      // Enable anti-aliasing during the transition.
      nav.style("shape-rendering", null);

      // Draw child nodes on top of parent nodes.
      nav.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

      // Fade-in entering text.
      g2.selectAll(".foreignobj").style("fill-opacity", 0);

      // Transition to the new view.
      t1.selectAll(".foreignobj").call(rect);
      t2.selectAll(".foreignobj").call(rect);
      t1.selectAll("rect").call(rect);
      t2.selectAll("rect").call(rect);
      t2.each(function(){
        textLabels.call(this);
      })
      t2.each("end", function(){
        textLabels.call(this);
      })

      // Remove the old node when the transition is finished.
      t1.remove().each("end", function() {
        nav.style("shape-rendering", "crispEdges");
        nav.transitioning = false;

      });
        currentLevel = g2;
    }



   rect = function(rect) {
            rect.attr("x", function(d) { return nav.x(d.x); })
            .attr("y", function(d) { return nav.y(d.y); })
            .attr("width", function(d) { return nav.x(d.x + d.dx) - nav.x(d.x); })
            .attr("height", function(d) { return nav.y(d.y + d.dy) - nav.y(d.y); });
        }


    background = function(color, opacity) {
        var startRgb = mixrgb(hexToRgb(color), white, opacity);
        return 'rgba(' + startRgb.r + ',' + startRgb.g + ',' + startRgb.b + ',' + 1.0 + ')';
    };

    return{
       initialize : initialize,
       update : update,
       open : open,
       updateTitle : updateTitle
   }
}();