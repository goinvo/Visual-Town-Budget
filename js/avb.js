            var colors = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"];
            var homecolors = ["#006699", "#33CC66", "#CC0000"];

            var home;

            var graph_h;
            var graph_w;
            // bar dimensions
            var bar_width;
            var bar_height;
            var bar_intra_padding ;

            // constants
            var viewmode;
            var section;
            var min_year = 2006;
            var max_year = 2018;
            var cur_year = 2012;
            var cur_index = cur_year - min_year;

            var root;
            
            // object references
            var mysvg;

            var layout = new Object();

            var cur_json;

            Number.prototype.px=function()
            {
                return this.toString() + "px";
            };



            function adjust_width(div, target_h) {
                var cur_size = parseInt(div.style("font-size"));

                while(div.property("clientHeight") > target_h && cur_size >= 1) {
                    div.style("font-size", cur_size.px());
                    cur_size--;
                }
            }

            function onjsonload(jsondata) {
                cur_json = jsondata;

                root = jsondata;
                
                titlebox_init();
                titlebox_fill(jsondata);

                avb.cards.initialize();
                
                init_tooltip();

                initsingle(jsondata);
                // avb.timeline.initialize();
                // avb.timeline.update(jsondata);
            }

            function initsingle(jsondata){
                mode = 1; // single year mode
                console.log(jsondata)
                d3.select("#singlelayout").style("display","inline");
                $("#breadcrumbs-row").slideDown();

                avb.navigation.initialize(jsondata);

                avb.cards.draw(2, 2);
                avb.cards.update(jsondata);

                avb.chart.initialize();
                avb.chart.drawline(jsondata, "steelblue", true);
                
                // $('#bottom-container').css("display","none");
                // avb.chartfork.initialize();
                // avb.chartfork.draw(jsondata);


                console.log("UI Loaded.");
            }

            function resize(){
                if (!home) {
                    avb.navigation.initialize(cur_json, 0, 0);
                    avb.chart.initialize();
                    avb.chart.drawline(cur_json, "steelblue", true);
                    avb.cards.reposition();
                }
            }
            
            var log = function(d) {
                console.log(d);
            }

            var get_year = function (d) {
                return d.year;
            }

            var get_values = function (d) {
                return d.val;
            }

            var svgtext_draw = function(container, x, y, text, css) {
                var newtext = container.append("text")
                .attr("x", x)
                .attr("y",y)
                .text(text);
                if(css !== undefined) {
                    newtext.classed(css,true);
                }
                return newtext;
            }

            function formatcurrency(value) {
                if(value === undefined) {
                    return "N/A";
                } else if(value >= 1000000) {
                    return "$" + Math.round(value/1000000).toString() + " M";
                } else if (value < 1000000 && value >= 1000){
                    return "$" + Math.round(value/1000).toString() + " K";
                } else if (value < 1 && value != 0) {
                	return "¢" + Math.round(value*100).toString();
                } else {
                	return "$ " + value.toString();
                }
            }

            function avb_init(name) {
                d3.select("#avb-home").style("display","none");
                d3.select("#avb-body").style("display","block");
                d3.selectAll("svg").remove();

                home = false;
                section = name.toLowerCase();
                d3.json("data/arlington2.json", onjsonload);
            }

            function add_filter(container){
                filter = container.append("svg:defs")
                .append("svg:filter")
                .attr("id", "blur");

            }

            function toarray(d){
                values = [];
                for(var i=min_year; i <= max_year ; i++){
                    if( d[i.toString()] !== undefined ) {
                        values.push({ year : i , val : d[i.toString()]});
                    }
                }
                return {
                    name : d.name,
                    values : values
                }
            }

            function getthumbail(div, color){

                d3.json("data/home.json", function(data){
                    var width = Math.floor(div.width());
                    var height = Math.round(div.height());
                    var barsvg = d3.select(div.get()[0]).append("svg")
                    .attr("width", width)
                    .attr("height", height);
                    var bardata;
                    for(var i=0; i<data.sub.length; i++) {
                        if(data.sub[i].name === div.attr('field')) {
                            bardata = toarray(data.sub[i]);
                        }
                    }
                    var xscale = d3.scale.linear()
                    .domain([min_year, max_year])
                    .range([0, width]);
                    var yscale = d3.scale.linear()
                    .domain([0,d3.max(bardata.values,get_values)])
                    .range([0, height]);
                    var bars = barsvg.append("svg:g")
                    .selectAll("rect")
                    .data(bardata.values)
                    .enter()
                    .append("rect")
                    .attr("x", function(d){
                        return xscale(d.year);
                    })
                    .attr("y", function(d){
                        return height - yscale(d.val);
                    })                    
                    .attr("width", Math.floor(width/(max_year - min_year)))
                    .attr("height", function(d) {
                        return yscale(d.val);
                    })
                    .style("fill", color)
                    .style("opacity",0.5);
                });
        }

        function get_winsize(coord){
            var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight|| e.clientHeight|| g.clientHeight;
            if(coord == "w") return x;
            if(coord == "h") return y;
            return undefined;
        }


    function add_label(group, rect, label, css){
        var padding = 5;
        var t = group.append("text")
        .attr("class", css)
        .attr("x", rect.attr("x"))
        .attr("y", rect.attr("y"));
        var words = label.split(" ");
        var tempText = "";
        var maxWidth = rect.attr("width");

        var get_tspan = function () {
            var new_tspan = t.append("tspan");
            var font_size = 15;
            var dy = new_tspan.style("font-size",font_size);
                    return new_tspan.attr("x",5)//
                    .attr("dy", font_size);
                };
                var c_tspan = get_tspan();
                for (var i=0; i<words.length; i++) {
                    c_tspan.text(tempText + " " + words[i]);
                    if ((t.node().getBBox().width  + padding) > maxWidth) {
                        c_tspan.text(tempText);
                        c_tspan = get_tspan();
                        tempText = words[i];
                    } else {
                        tempText += (" " + words[i]);
                    }
                    if (i == (words.length -1) && c_tspan.text() === ""){
                        c_tspan.remove();
                    }
                }
                if ((t.node().getBBox().height + padding) > rect.attr("height")) {
                    t.remove();
                } else                     
                // centering//
                var mid_y = (parseFloat(rect.attr("height")) - (t.node().getBBox().height))/2;
                t.attr("y",(parseFloat(rect.attr("y")) + mid_y));
                var mid_x = (parseFloat(rect.attr("width")) - (t.node().getBBox().width))/2;
                    t.selectAll("tspan").attr("x",(parseFloat(rect.attr("x")) + mid_x).toString());//
                    
                }


                function init_tooltip(){
                    tooltip = d3.select("body")
                    .append("div")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .style("visibility", "hidden")
                    .attr("class","toolt");
                }

                function titlebox_init(x, y, width, height) {
                    titlebox = d3.select("#title-head");
                    titlebox.bottom = d3.select("#title-descr");
                }


                function titlebox_fill(data){
                    titlebox.text(data.key);
                    titlebox.bottom.text(data.descr);
                    var margin = $("#bottom-container").height() - $("#title-head").height() - $("#title-descr").height();
                    log(margin)
                    $("#titledescr-container").css("margin-top", margin/2);
                }


                function translate(obj,x,y) {
                    obj.attr("transform", "translate(" + (x).toString() +"," + (y).toString() + ")");
                }

                function rotate(obj,degrees) {
                    obj.attr("transform","rotate(" + degrees.toString() + " 100 100)");
                }
