            var colors = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"];
            var homecolors = ["#006699", "#33CC66", "#CC0000"];

            var home;

            var in_use;
            // dimensions (no timeline included)
            var timeline_height = 50;
            var title_height = 0;

            var graph_h;
            var graph_w;
            // bar dimensions
            var bar_width;
            var bar_height;
            var bar_intra_padding ;
            var bar_left_padding = 20;

            // cards update constants
            var value_height;
            var chart_height;
            
            // constants
            var viewmode;
            var section;
            var years = [];
            var min_year = 2006;
            var max_year = 2018;
            var cur_year = 2012;

            var root_total = 125000000;
            
            // levelstack
            var levels = [];
            var cardstack = [];

            // object references
            var mysvg;
            var chart;
            var textbox;
            var titlebox;
            var tooltip;
            var curly;
            var filter;
            var timeline;
            var deck;
            var navigation;
            var nosel_opacity = 0.3;
            var sel_opacity = 0.8;
            var multichart;
            var ntl;

            // HOME ELEMENTS
            var homebars;
            var homescale;
            var hometexts;
            var homebars_width;
            var homebars_height;

            // NAV VARIABLES
            var maxlevel = 2;
            var offset_w;
            var offset_h;

            var layout = new Object();

            var cur_json;

            // init years array
            for(var i = min_year; i <= max_year; i++){
                years.push((i).toString());
            }

            drawhome();
            activatelinks();
            // opensection("Revenues");


            Number.prototype.px=function()
            {
                return this.toString() + "px";
            };
            

             
            function activatelinks() {
               
               d3.select("#home_0").on("click", function() {
                console.log("click");
                   opensection("revenues");
               });
            }

            function drawhome(){
                home = true;
                d3.json("js/home.js", onhomedata);
            }

            function onhomedata(jsondata) {
                var max = 0;
                home_width = 300;
                var homediv = d3.select("#homeb")
                mysvg = homediv.append("svg")
                                         .attr("width", homediv.property("clientWidth"))
                                         .attr("height", 160)
                                         .style("margin-top", "1%");
                drawbars(jsondata.sub, 0, 0, 150, 60);
                //drawtimeline(0, homebars_height + 25, get_winsize("w"), 30);
            }


            function h_growth(data, key){
                var res = "";
                if(key === min_year.toString()) {
                    // CUR : 100 = NEXT - CUR : X
                    return "+0.00%";
                } else {
                    var perc = Math.round(100 * 100 * (data[key] - data[(parseInt(key) - 1).toString()]) / data[key])/100;
                    if(perc > 0) {
                        return "+" + perc.toString() + "%";
                    } else {
                        return perc.toString() + "%";
                    }
                }
            }


            function adjust_width(div, target_h) {
                var cur_size = parseInt(div.style("font-size"));

                while(div.property("clientHeight") > target_h && cur_size >= 1) {
                    div.style("font-size", (cur_size).px());
                    cur_size--;
                }

            }

            function initdeck(){
                var deck = [];

                // amount card
                var newcard = new Object();
                newcard.title = "AMOUNT";
                newcard.icon = "img/coin.svg"
                newcard.back = "this is the back of the card";
                newcard.value = function(data) { return formatcurrency(data[cur_year.toString()]); };
                newcard.side = function(data) { return "as of " + cur_year.toString()};
                deck.push(newcard);

                var newcard = new Object();
                newcard.title = "IMPACT";
                newcard.icon = "img/build.png";
                newcard.back = "this is the back of the card";
                newcard.value = function(data) { return Math.max(0.01,(Math.round(data[cur_year]*100*100/root_total)/100)).toString() + "%"; };
                newcard.side = "of total " + section;
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

                var newcard = new Object();
                newcard.title = "ADDITIONAL";
                newcard.icon = "img/info_30.png";
                newcard.back = "this is the back of the card";
                newcard.value = function(data) { return "Additional card"; };
                newcard.side = "";
                deck.push(newcard);

                return deck;
            }


            function getex(){
                return 0;
            }

            function draw_stack(x, y, width, height){

                var container = layout.cardsvg.append("svg:g");
                var levels = (deck.length + deck.length%2) / 2;
                var padding_h = 0.02*height;
                var padding_w = 0.03*width;
                var card_height = (height / levels) - 2*padding_h;
                var card_width = (width-2*padding_w) / 2;

                for(var i=0; i < deck.length; i++) {

                    var newcard = drawcard(container, deck[i], card_width, card_height - 2*padding_h);
                    var inner_x = (card_width + padding_w)*(i%2),
                        inner_y = (card_height + padding_h)*((i - i%2)/2);
                    placedivs(newcard, x + inner_x, y + inner_y);

                    translate(newcard, inner_x, inner_y);
                    cardstack.push(newcard);
                }
                translate(container, x, y);
            }

            function placedivs(card, x, y) {
                card.divs.style("left", (x + d3.select("#cards").property("offsetLeft")).px());
                card.divs.style("top", (y + d3.select("#cards").property("offsetTop")).px());
            }



            function drawcard(container, card, width, height) {
                var newcard  = container.append("svg:g")
                                        .attr("class", "card");
                var title_h = height / 3.5,
                    padding = 5,
                    value_ratio = 0.7;
                value_height = height - title_h;
                var rect = newcard.append("svg:rect")
                                    .attr("width", width.px())
                                    .attr("height", Math.max(1,height).px())
                                    .attr("rx", (10))
                                    .attr("ry", (10));

                newcard.append("svg:line")
                        .attr("x1", 0)
                        .attr("x2", width)
                        .attr("y1", title_h)
                        .attr("y2", title_h);

                newcard.divs =  d3.select("#cards").append("div")
                                                 .attr("class","carddiv")
                                                 .style("position","absolute")
                                                 .style("height", height.px())
                                                 .style("width", width.px());
                
                newcard.title = newcard.divs.append("div")
                       .style("height", title_h.px())
                       .append("div")
                       .style("heigth","100%")
                       .style("width", width.px())
                       .style("font-size", (30).px())
                       .text(card.title);
                console.log("call");
                adjust_width(newcard.title, title_h);
                newcard.title.append("img")
                            .attr("src", card.icon)
                            .attr("height", title_h)
                            .attr("width", title_h)
                            .style("position", "absolute")
                            .style("left", "10px");


                if( card.side === "") {
                    value_ratio = 1;
                }

                newcard.bottom = newcard.divs.append("div")
                                                  .style("height", (height - title_h).px())
                                                  .style("width", "100%")
                                                  .style("height", height - title_h)
                                                  .style("float","bottom");
                newcard.bottom.left = newcard.bottom.append("div")
                                                    .style("width", (value_ratio*100).toString() + "%")
                                                    .style("float","left")
                                                    .style("height", "100%")
                                                    .style("display", "table")
                                                    .append("div")
                                                    .style("top","50%")
                                                    .style("display","table-cell")
                                                    .style("vertical-align", "middle")
                                                    .style("font-size", (width/5).px());

                newcard.bottom.right = newcard.bottom.append("div")
                                    .style("width", ((1 - value_ratio)*100).toString() + "%")
                                    .style("float","left")
                                    .style("height", "100%")
                                    .style("display", "table")
                                    .append("div")
                                    .style("top","50%")
                                    .style("display","table-cell")
                                    .style("vertical-align", "middle")
                                    .style("font-size", (width/14).px());
                
                return newcard;
            }


            function cards_update(data) {
                for(var i=0; i < deck.length; i++) {
                    cardstack[i].bottom.left.text(deck[i].value(data));
                    adjust_width(cardstack[i].bottom.left, value_height);
                    var text;
                    if ( typeof(deck[i].side) === 'string') {
                        text = deck[i].side;
                    } else {
                        text = deck[i].side(data);
                    }
                    cardstack[i].bottom.right.text(text);
                    adjust_width(cardstack[i].bottom.right, value_height);
                }

            }

            function layoutsingle_init() {

                d3.select("#singlelayout").style("display","inline");

                layout.navsvg = d3.select("#bars").append("svg");
                layout.navsvg.width = d3.select("#bars").property("clientWidth");
                layout.navsvg.height = layout.navsvg.width;
                layout.navsvg.attr("height", layout.navsvg.height )
                             .attr("width", layout.navsvg.width);
                
                layout.chartsvg = d3.select("#chart").append("svg");
                layout.chartsvg.width = d3.select("#bars").property("clientWidth");
                layout.chartsvg.height = layout.navsvg.height/2;
                layout.chartsvg.attr("height", layout.navsvg.height/2 )
                             .attr("width", layout.chartsvg.width);

                layout.cardsvg = d3.select("#cards").append("svg");
                layout.cardsvg.width = d3.select("#cards").property("clientWidth");
                layout.cardsvg.height = layout.navsvg.height/2;
                layout.cardsvg.attr("height", layout.navsvg.height/2 )
                               .attr("width", layout.cardsvg.width);

            }


            function onjsonload(jsondata) {
               //  drawtimeline(0, graph_h, 0, graph_w);
                cur_json = jsondata;
                drawtitlebox(0, d3.select("#navbar").property("clientHeight") , 600, 0);
                filltitle(jsondata);


                deck = initdeck();
                
               init_tooltip();
                //initmultiple(jsondata);
                initsingle(jsondata);
                timeline_init();
                timeline_update(jsondata);
            }

            function initmultiple(jsondata) {
                mode = 2;

                d3.select("#multichart").style("display", "inline");
                graph_w = d3.select("#multichart").property("clientWidth");
                layout.multichartsvg = d3.select("#multichart").append("svg")
                           .attr("height", graph_w/2)
                           .attr("width", graph_w);
                //graph_h = d3.select("#avb").property("clientHeight");
                graph_h = graph_w * 9/20;
                multichart_draw(jsondata, 0, 0, graph_w, graph_h);

            }

            function initsingle(jsondata){
                mode = 1; // single year mode

                layoutsingle_init();

                initfilter(10);

                // // navigation
                init_nav(jsondata, 0, 0);

                // // chart
                init_chart(0,layout.chartsvg.height - 30);
                drawline(jsondata, "steelblue", true);

                // // new cards
                draw_stack(2, 2, layout.cardsvg.width , layout.cardsvg.height );
                cards_update(jsondata); 

                console.log("UI Loaded.");
            }

            function single_remove() {
                d3.select("#singlelayout").transition().duration(500).style("margin-left", (get_winsize("w")).px());
                d3.select("#cards").transition().duration(500).selectAll("div").style("left", (get_winsize("w")).px());
                d3.select("#singlelayout").transition().delay(500).style("display", "none");
                d3.select("#cards").selectAll("div").transition().delay(500).remove();
                d3.select("#cards").selectAll("svg").transition().delay(500).remove();
                d3.select("#chart").selectAll("svg").transition().delay(500).remove();
                d3.select("#bars").selectAll("svg").transition().delay(500).remove();
                cardstack.length = 0;
            }

            function get_maxyear(data) {
                var i = max_year;
                while( data[i.toString()] === undefined && i >= min_year ) {
                    i--;
                }
                return i;
            }
            
            var get_max = function (d) {
                var arr = toarray(d);
                return d3.max(arr.values, get_values);
            };

            function gm(d) {
                var curmax = 0;
                for( var i=min_year; i <=max_year; i++) {
                    if(d[i.toString()] !== undefined && d[i.toString()] > curmax) {
                        curmax = d[i.toString()];
                    }
                }
                return curmax;
            };

            function init_timeline_sel(timeline) {
                var selector = timeline.append("svg:g")
                  .attr("class", "tselect");

                selector.append("svg:path")
                              .attr("d","M0,0H20L10,20L0,0")
                              .attr("class", "tselect")
                              .attr("transform", "translate(0," + (ntl.padding/3).toString() + ")");

                selector.append("svg:line")
                              .attr("x1", selector.node().getBBox().width/2)
                              .attr("x2", selector.node().getBBox().width/2)
                              .attr("y1", selector.node().getBBox().height)
                              .attr("y2", ntl.height - ntl.padding)
                              .attr("stroke", "black");
                return selector;
            }

            function draw_multchart_scale(start, end) {
                // var scale = ntl.xscale.range()[1] / (end - start);
                // multichart.areas.attr("transform", "scale(" + scale.toString() + ",1)");
                // multichart.lines.attr("transform", "scale(" + scale.toString() + ",1)");
                // console.log(scale);
                // multichart.xaxis.remove();

                // // multichart.xaxis = multichart.append("g")
                // //       .attr("class", "multiaxis")
                // //       .attr("transform", "translate(0," + chart_h + ")")
                // //       .call(multichart.xAxis.scale());
            }

            function timeline_switch(start, end) {
                if(end === undefined) {
                    if (mode === 2) {
                        multichart_remove();
                        setTimeout(function() {initsingle(cur_json);}, 600);
                    }
                } else {
                    if (mode === 1) {
                        single_remove();

                        setTimeout(function() {initmultiple(cur_json);}, 600);
                    }
                }
            }

            var timeline_onclick  = function () {
                // ntl.selrange.attr("width",0);
                // ntl.selector.transition().attr("transform", "translate(" + d3.mouse(this)[0] + ",0)");
                // console.log("click");
            };

            var timeline_ondragstart = function() {
                console.log("start");
                ntl.selrange.attr("width",0);
                ntl.actionstart = new Date();
                ntl.selectend.attr("display", "none");
                ntl.selrange.start = d3.mouse(this)[0];
                ntl.selector.attr("transform", "translate(" + ntl.selrange.start + ",0)");
                ntl.selrange.attr("x", ntl.selrange.start + ntl.selector.node().getBBox().width/2);
            };

            var timeline_ondrag = function() {
                if( (new Date() - ntl.actionstart) <= 100) {
                    return;
                }
                if ((d3.mouse(this)[0] - ntl.selrange.start) > 0)  {
                    ntl.selrange.attr("width", d3.mouse(this)[0] - ntl.selrange.start)
                }
            };

            var timeline_ondragend = function() {
                console.log("dragend");
                if( (new Date() - ntl.actionstart) <= 100) {
                    ntl.selrange.attr("width",0);
                    ntl.selector.transition().attr("transform", "translate(" + d3.mouse(this)[0] + ",0)");
                    timeline_switch(ntl.xscale.invert(d3.mouse(this)[0]));
                    return;
                }
                translate(ntl.selectend, d3.mouse(this)[0], 0);
                ntl.selectend.attr("display", "inline");
                //draw_multchart_scale(ntl.selrange.start ,d3.mouse(this)[0]);
                timeline_switch(ntl.xscale.invert(ntl.selrange.start), ntl.xscale.invert(d3.mouse(this)[0]));
            };


            function timeline_init() {
                var tl_w = d3.select("#tl").property("clientWidth");
                var tl_h = tl_w * 0.05;
                //var tl_h = d3.select("#tl").property("clientHeight");
                ntl = d3.select("#tl").append("svg")
                                          .attr("width", tl_w)
                                          .attr("height", tl_h);


                ntl.width = tl_w;
                ntl.height = tl_h;
                ntl.padding = tl_h*0.4;
                ntl.xscale = d3.scale.linear().domain([min_year, max_year]).range([ntl.padding, tl_w - ntl.padding]);
                ntl.background = ntl.append("svg:rect").attr("class","tlb")
                                      .attr("width", ntl.width - ntl.padding*2/3)
                                      .attr("height", ntl.height - ntl.padding/2)
                                      .attr("x", ntl.padding/3)
                                      .attr("y", ntl.padding/3)
                                      .attr("rx",10)
                                      .attr("ry",10);



                ntl.selector = init_timeline_sel(ntl);
                ntl.selectend = init_timeline_sel(ntl).attr("display","none");


                ntl.selrange = ntl.append("svg:rect")
                                  .attr("height", ntl.height - ntl.padding/2)
                                  .attr("y", ntl.padding/3)
                                  .attr("opacity", 0.2)
                                  .attr("fill", "steelblue");

                ntl.selrange.start = 0;
                ntl.actionstart = 0;



                ntl.call(d3.behavior.drag()
                    .on("dragstart", timeline_ondragstart)
                    .on("drag", timeline_ondrag)
                    .on("dragend", timeline_ondragend)
                );

                ntl.on("click", timeline_onclick);


                var xAxis = d3.svg.axis()
                            .scale(ntl.xscale)
                            .orient("bottom")
                            .tickSize(0)
                            .tickPadding(5)
                            .tickFormat(function (d) { 
                            return d.toString();});

                ntl.append("g")
                      .attr("class", "tlaxis")
                      .attr("transform", "translate(0," + (tl_h - ntl.padding) + ")")
                      .call(xAxis);

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

            var get_year = function (d) {
                return d.year;
            }

            var get_values = function (d) {
                return d.val;
            }

            function timeline_update(jsondata){
                var data = toarray(jsondata);
                var yscale = d3.scale.linear().domain(d3.extent(data.values, get_values))
                                              .range([ntl.height - ntl.padding, ntl.padding]);
                var line = d3.svg.line()
                                 .interpolate("basis")
                                 .x(function(d) { return ntl.xscale(d.year); })
                                 .y(function(d) { return (yscale(d.val)); });

                var area = d3.svg.area()
                                 .interpolate("basis")
                                 .x(function(d) { return ntl.xscale(d.year); })
                                 .y1(function(d) { return (yscale(d.val)); })
                                 .y0(function(d) { return (ntl.height - ntl.padding); });


                ntl.append("svg:path").attr("d", line(data.values))
                                      .attr("class","graphline")
                                      .style("stroke", "steelblue")
                                      .style("stroke-width", 1);
                ntl.append("svg:path").attr("d", area(data.values))
                                      .attr("fill", "lightblue")
                                      .attr("opacity",0.3);
            }

            function multichart_remove() {
                console.log(get_winsize('w'));
                multichart.transition().duration(500).attr("transform", "translate(" + get_winsize("w") + ", 0)");
                d3.select("#multichart").transition().delay(500).style("display", "none");
                d3.select("#multichart").selectAll("svg").transition().delay(500).remove();
            }

            function multichart_draw(jsondata, x, y, width, height){
                multichart = layout.multichartsvg.append("svg:g");
                
                var padding = 35;
                var margin_h = 25;
                var chart_w = width - padding * 2;
                var chart_h = height;

                multichart.width = chart_w;
                multichart.height = chart_h;

                rev = jsondata;
                var yscale = d3.scale.linear()
                                      .domain([0,gm(rev) * 1.3])
                                      .range([chart_h, 0]);
                

                var xscale = d3.scale.linear().domain([min_year, max_year]).range([padding, chart_w]);
                multichart.xscale = xscale;
                var color = d3.scale.category20();

                var area = d3.svg.area()
                            .interpolate("basis")
                            .x(function(d,i) { return xscale(d.x); })
                            .y0(function(d) { return yscale(d.y0); })
                            .y1(function(d) { return yscale(d.y0 + d.y); });

                var line = d3.svg.line()
                            .interpolate("basis")
                            .x(function(d,i) { return xscale(d.x); })
                            .y(function(d) { return yscale(d.y0 + d.y); });

                
                var stack = d3.layout.stack()
                              .values(function(d) { return d.val; });

                var layers = rev.sub;
                var convert = layers.map(function(d) {
                    var values = [];
                            for(var i=min_year; i <= max_year ; i++){
                                if( d[i.toString()] === undefined ) {
                                    values.push({ "x" : i , "y" : 4000000});
                                } else {
                                    values.push({ "x" : i , "y" : d[i.toString()]});
                                }
                            }
                            return {
                                name : d.name,
                                val : values
                            }
                });

                var instance = stack(convert);

                multichart.xgrid_axis = d3.svg.axis()
                            .scale(xscale)
                            .orient("bottom")
                            .tickSize(-multichart.height, 0, 0)
                            .tickFormat(function (d) { 
                                return "";});

                multichart.xgrid = multichart.append("g")
                      .attr("class", "multigrid")
                      .attr("transform", "translate(0," + chart_h + ")")
                      .call(multichart.xgrid_axis);

                multichart.ygrid_axis = d3.svg.axis()
                            .scale(yscale)
                            .orient("left")
                            .tickSize(-multichart.width + padding, 0, 0)
                            .tickFormat(function (d) { 
                                return "";});

                multichart.grid = multichart.append("g")
                      .attr("class", "multigrid")
                      .attr("transform", "translate(" + padding + ",0)")                 
                      .call(multichart.ygrid_axis);         



                var browser = multichart.selectAll(".browser")
                                   .data(instance)
                                   .enter().append("g")
                                   .attr("class", "browser");

                multichart.areas = browser.append("path")
                       .attr("class", "multiarea")
                       .attr("d", function(d) { return area(d.val); })
                       .style("fill", function(d,i) { return colors[i%20]; });

                multichart.lines = browser.append("path")
                            .attr("class", "multiline")
                            .attr("d", function(d) { return line(d.val); })
                            .style("stroke", function(d,i) { return colors[i%20]; });

                multichart.areas.on("mouseout", function(d,i) {
                    tooltip.style("visibility", "hidden");
                    d3.select(this).attr("opacity","1");
                });        
                multichart.areas.on("mouseover", function(d) {
                    d3.select(this).attr("opacity","0.7");
                    tooltip.style("visibility","visible")
                    .style("left", (d3.event.x + 10).px())
                    .style("top", (d3.event.y + 2).px())
                    .text(d.name);
                });
                multichart.areas.on("mousemove", function(d) {
                     tooltip.style("left", (d3.event.x + 10).px())
                            .style("top", (d3.event.y + 2).px())
                            .text(d.name);
                });

              browser.append("text")
                      .datum(function(d) { return {name: d.name, val: d.val[d.val.length - 1]}; })
                      .attr("transform", function(d) { return "translate(" + xscale(d.val.x) + "," + yscale(d.val.y0 + d.val.y / 2) + ")"; })
                      .attr("x", -5)
                      .attr("dy", ".35em")
                      .text(function(d) { 
                                            console.log(yscale.range()[0] - yscale(d.val.y));
                                            if((yscale.range()[0] - yscale(d.val.y)) > 20) {
                                                return d.name;
                                            } else {
                                                return "";
                                            }
                                        });


                multichart.xAxis = d3.svg.axis()
                            .scale(xscale)
                            .orient("bottom")
                            .ticks(5)
                            .tickFormat(function (d) { 
                                return d.toString();});   

                var yAxis = d3.svg.axis()
                            .scale(yscale)
                            .orient("left")
                            .tickFormat( function(d) {
                                return formatcurrency(d);
                            })

               multichart.xscale = multichart.append("g")
                      .attr("class", "multiaxis")
                      .attr("transform", "translate(0," + chart_h + ")")
                      .call(multichart.xAxis);

               multichart.append("g")
                      .attr("class", "multiaxis")
                      .attr("transform", "translate(" + padding + ",0)")
                      .call(yAxis);



                translate(multichart, x + padding, y + 5);

            }



            var rectclick = function(d,i) {
                        drawline(d, d3.select(this).attr("fill"), true);
                        cards_update(d);
                        filltitle(d);
                        // fix this parentnode mess !
                        if( levels[levels.length-1].lev == d3.select(this.parentNode.parentNode).attr("lev")){
                        } else {
                            levels.pop().remove();
                            if(curly !== undefined) {
                            curly.remove();
                            }
                        }
                        console.log(d.sub);
                        if ( d["sub"] === undefined ) {
                            return;
                        }

                        for(var i=0; i < levels.length; i++) {

                            //container = levels[parseInt(d3.select(this.parentNode.parentNode).attr("lev"))];
                            container = levels[i];
                            container.x = container.x - bar_width - bar_intra_padding;
                            container.transition().duration(500).attr("transform", " translate(" + (container.x).toString() +"," + (container.y).toString() + ")");
                            if(container.curly !== undefined) {
                                container.curly.transition().duration(500).attr("transform", " translate(" + (container.x + bar_width + container.curly.padding).toString() + "," + (container.y).toString() + ")");
                            }
                        }

                        container.curly = drawcurly(container, Math.floor(d3.select(this).attr("y")) + d3.select(this).attr("height")/2, container.x + bar_width, layout.navsvg.height - bar_height, 100, d3.select(this).attr("fill"));
                        d3.select(this).attr("opacity",sel_opacity.toString());
                        newzone = drawzone(d3.select(this).data()[0], cur_year.toString(), container.x, navigation.height - bar_height, bar_width, bar_height);
                        newzone.x = layout.navsvg.width - bar_width - 30;
                        newzone.transition()
                               .delay(1000)
                               .duration(500)
                               .attr("transform", " translate(" + (newzone.x).toString() +"," + (container.y).toString() + ")")
                               .attr("display", "inline");
                };

            function init_nav(jsondata, x, y) {
                var width = layout.navsvg.width;
                var height = layout.navsvg.height;
                navigation = layout.navsvg.append("svg:g");
                navigation.height = height;
                navigation.width = width;
                bar_width = width/4;
                offset_w = bar_width * 0.6;
                bar_intra_padding = offset_w;
                offset_h = 0;
                bar_height = height - offset_h*maxlevel;
                drawzone(jsondata, cur_year.toString(), width - bar_width - 30, height - bar_height, bar_width, bar_height).attr("display","inline");


            }

            function get_change(){
                return "f0";
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
            
            function drawbars(jsondata, x, y, height, width, xpadding) {
                homebars_width = width;//
                homebars_height = height;
                var heightscale = d3.scale.linear()
                                          .domain([0,120000000])
                                          .range([0, height]);
                console.log(width);

                homescale = heightscale;
                var container = mysvg.append("svg:g");
                translate(container, x, y);
                var tracecontainer = mysvg.append("svg:g");
                translate(tracecontainer, x, y);
                var getoffset = function (id) {
                    var divoffset = d3.select("#" + id).property("offsetLeft") - 30;
                    return d3.select("#" + id).property("offsetLeft") - d3.select("#homeb").property("offsetLeft");
                }

                tracecontainer.selectAll("rect")
                                .data(jsondata)
                                .enter()
                                .append("svg:rect")
                                .attr("width", width)
                                .attr("y", function(d) {
                                        return height - heightscale(get_max(d));
                                })
                                .attr("height", function(d) {
                                        return heightscale(get_max(d));
                                })
                                .attr("x", function(d, i) {
                                    return getoffset("home_" + i.toString());
                                })
                                .attr("fill", function(d,i) {
                                    return homecolors[i];
                                })
                                .attr("opacity", 0.3);
                homebars = container.selectAll("rect")
                                .data(jsondata)
                                .enter()
                                .append("svg:rect")
                                .attr("width", width)
                                .attr("height", 0)
                                .attr("x", function(d, i) {
                                    return getoffset("home_" + i.toString());
                                })
                                .attr("fill", function(d,i) {
                                    return homecolors[i];
                                })
                                .attr("opacity", 0.6);
                hometexts  = container.selectAll("text")
                                  .data(jsondata)
                                  .enter()
                                  .append("svg:text")
                                  .attr("x", function(d, i){
                                    return getoffset("home_" + i.toString()) + homebars_width + 5;
                                  })
                                  .attr("y", homebars_height)
                                  .attr("height", homebars_height)
                                  .attr("width", 100)
                                  .attr("class", "homeval")
                                  .text("");
                refresh();
            }


            function refresh() {
                if(home) {
                    console.log("refreshing home");
                    homebars.transition()
                            .attr("height", function (d) {
                                            return homescale(d[cur_year.toString()]);
                            })
                            .attr("y", function(d) {
                                            return homebars_height - homescale(d[cur_year.toString()]);
                            
                            });
                    hometexts.transition()
                             .text(function(d) {
                                return formatcurrency(d[cur_year]);
                             });
                } else {
                }
            }

            function opensection(name) {
                d3.select("#cont").style("display","none");
                d3.selectAll("svg").remove();

                home = false;
                section = name.toLowerCase();

                d3.json("js/arlington.js", onjsonload);
            }



                
            // helper functions
            function initfilter(stdev) {
                    // filter = mysvg.append("svg:defs")
                    //               .append("svg:filter")
                    //               .attr("id", "blur")
                    //               .append("svg:feGaussianBlur")
                    //               .attr("stdDeviation", stdev);
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


            function add_label(group, rect, label){
                var padding = 5;
                var t = group.append("text")
                              .attr("class", "lab")
                              .attr("x", rect.attr("x"))
                              .attr("y", rect.attr("y"));
                var words = label.split(" ");
                var tempText = "";
                var maxWidth = rect.attr("width");

                var get_tspan = function () {
                    var new_tspan = t.append("tspan");
                    var dy = new_tspan.style("font-size");
                    return new_tspan.attr("x",5)//
                                    .attr("dy", dy.toString());
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

            function drawcurly(container, target_y, x, y, init_height, color){
                console.log(color);
                if(container.curly !== undefined ) {
                    container.curly.remove();
                }
                curly = layout.navsvg.append("svg:g");
                var radius = Math.floor(bar_intra_padding/5);
                var points = 6;

                var angle = d3.scale.linear()
                    .domain([0, points-1])
                    .range([0, Math.PI/2]);
                
                var curvedline = d3.svg.line.radial()
                    .interpolate("basis")
                    .tension(0)
                    .radius(radius)
                    .angle(function(d, i) { return angle(i); });
    
                // 1st curl



                curly.append("svg:path").datum(d3.range(points))
                                            .attr("d", curvedline)
                                            .attr("class","curly_b")
                                            .attr("transform", "rotate(270 0 0), translate(" + (-radius).toString() +  ", " + (2*radius).toString() + ") ");

                curly.append("svg:line").attr("x1",radius)
                                            .attr("y1",radius)
                                            .attr("x2",radius)
                                            .attr("y2",target_y - radius)
                                            .attr("class","curly_b");

                curly.append("svg:path").datum(d3.range(points))
                                            .attr("d", curvedline)
                                            .attr("class","curly_b")
                                            .attr("transform", "translate(0, " + (radius + target_y).toString() + ") ");

                curly.append("svg:path").datum(d3.range(points))
                                            .attr("d", curvedline)
                                            .attr("class","curly_b")
                                            .attr("transform", "rotate(90 0 0), translate(" + (-radius + target_y).toString() +  ", 0)");
                
                curly.append("svg:line").attr("x1",radius)
                                            .attr("y1",radius + target_y)
                                            .attr("x2",radius)
                                            .attr("y2",bar_height - radius)
                                            .attr("class","curly_b");
                
                curly.append("svg:path").datum(d3.range(points))
                                            .attr("d", curvedline)
                                            .attr("class","curly_b")
                                            .attr("transform", "rotate(180 0 0), translate(" + (-radius*2).toString() +  ", " + (-bar_height + radius).toString() + ") ");
                //translate(curly, x + (bar_intra_padding-radius*2)/2, y);
                curly.padding = (bar_intra_padding-radius*2)/2;
                curly.attr("display","none");
                curly.attr("transform", "scale(0, " + init_height/bar_height + " ), translate(" + (x + (bar_intra_padding-radius*2)/2).toString() +"," + (y).toString() + ")");
                curly.transition().delay(500)
                                  .duration(500)
                                  .attr("transform", "translate(" + (x + curly.padding).toString() +"," + (y).toString() + ")")
                                  .attr("display", "inline");
                return curly;
            }
            
            function drawtitlebox(x, y, width, height) {
                titlebox = d3.select("#titlebox");
                titlebox.section = titlebox.append("div")
                                                    .attr("class","tsection");
                titlebox.top = titlebox.append("div")
                                                    .attr("class","tname");
                titlebox.bottom = titlebox.append("div")
                                                    .attr("class","tdesc");
            }

            
            function filltitle(data){
                if(section !== data.name) {
                    titlebox.section.text(section.toUpperCase());
                } else {
                    titlebox.section.text("");
                }
                titlebox.top.text(data.name);
                titlebox.bottom.text(data.descr);
            }

            
            function translate(obj,x,y) {
                obj.attr("transform", "translate(" + (x).toString() +"," + (y).toString() + ")");
            }
            
            function rotate(obj,degrees) {
                obj.attr("transform","rotate(" + degrees.toString() + " 100 100)");
            }
            
            function drawzone(obj, key, x, y, width, height) {

                bar_width = width;
                bar_height = height;
                bar_left_padding = x;
                var container = navigation.append("svg:g")
                    .attr("stroke", "white")
                    .attr("stroke-width", 2)
                    .attr("fill", "orange")
                    .attr("lev", levels.length)
                    .attr("name", obj["name"]);

                container.x = x;
                container.y = y;
                
                //stack push
                container.lev = levels.length;
                levels.push(container);
                var data = obj.sub;
                var maxvalue = d3.max(data, function(d) { return d[key]; });
                var heightscale = d3.scale.linear().domain([0,maxvalue])
                                                   .range([0,bar_height*maxvalue/d3.sum(data, function (d) {return d[key]})]);
                var cur_y = 0;
                for(var i=0; i<data.length; i++) {
                    var group = container.append("g");
                    var entities = group.append("svg:rect");
                    if(data[i][key] === undefined) continue;
                    entities.attr("x", 0)
                            .attr("y", bar_height - heightscale(data[i][key]) - cur_y )
                            .attr("width", bar_width)
                            .attr("height", heightscale(data[i][key]))
                            .attr("fill", colors[i%20])
                            .attr("rx", 5)
                            .attr("ry", 5)
                            .attr("opacity", nosel_opacity.toString());
                    if ( entities.attr("height") >= 20 ) {
                            add_label(group,entities,data[i]["name"]);
                    }
                    cur_y += heightscale(data[i][key]);
                }
                container.selectAll("rect").data(data).enter;
                container.selectAll("rect").on("click", rectclick);

                // container.selectAll("rect").call(d3.behavior.drag()
                //       .on("dragstart", function(d) {
                //         //console.log("dstart");
                //       })
                //       .on("drag", function(d) {
                //         //console.log("dtag");
                //       })
                //       .on("dragend", function() {
                //         var color = d3.select(this).attr("fill");
                //         drawline(d3.select(this).data()[0],color,false);
                //       }));

                container.selectAll("rect").on("mouseout", function(d,i) {
                    tooltip.style("visibility", "hidden");
                    d3.select(this).attr("opacity","0.3");
                });        
                container.selectAll("rect").on("mouseover", function(d) {
                    console.log("tool");
                    d3.select(this).attr("opacity","0.7");
                    tooltip.style("visibility","visible")
                    .style("left", (d3.event.x + 10).px())
                    .style("top", (d3.event.y + 2).px())
                    .text(d.name);
                });
                container.selectAll("rect").on("mousemove", function(d) {
                     tooltip.style("left", (d3.event.x + 10).px())
                            .style("top", (d3.event.y + 2).px())
                            .text(d.name);
                });
                translate(container, x, y);
                container.attr("display","none");
                return container;
            }
            
            function get_minyear(data) {
                var i = min_year;
                while( data[i.toString()] === undefined && i <= max_year) {
                    i++;
                }
                return i;
            }
            

            function drawline(data, color, clear) {
                if(typeof(clear)==='undefined') clear = false;
                if(clear) {
                    for(var i=0; i<chart.linestack.length; i++) {
                        chart.linestack[i].remove();   
                    }
                }

                
                var values = [];
                var min_year = get_minyear(data);
                var max_year = get_maxyear(data);
                var projected = cur_year - min_year + 1 ;
               
                for(var j = min_year; j<= max_year; j++) {
                        values.push(data[j.toString()]);
                }
                
                var yscale = d3.scale.linear().domain([0,d3.max(values)]).range([chart.height - chart.padding, 5]);
                var xscale = d3.scale.linear().domain([0, max_year-min_year]).range([chart.padding, chart.width]);

                var container = chart.append("svg:g");
                chart.linestack.push(container);

                container.xgrid_axis = d3.svg.axis()
                            .scale(xscale)
                            .orient("bottom")
                            .tickSize(-chart.height, 0, 0)
                            .tickFormat(function (d) { 
                                return "";});

                container.xgrid = container.append("g")
                      .attr("class", "multigrid")
                      .attr("transform", "translate(0," + (chart.height - chart.padding) + ")")
                      .call(container.xgrid_axis);

                container.ygrid_axis = d3.svg.axis()
                            .scale(yscale)
                            .orient("left")
                            .tickSize(-chart.width + chart.padding, 0, 0)
                            .tickFormat(function (d) { 
                                return "";});

                container.ygrid = container.append("g")
                      .attr("class", "multigrid")
                      .attr("transform", "translate(" + chart.padding + ",0)")                 
                      .call(container.ygrid_axis);   
                
                var line = d3.svg.line()
                                   .x(function(d,i) { return xscale(i); })
                                   .y(function(d) { return  yscale(d); });
                
                // area
                var area = d3.svg.area()
                            .x(function(d,i) { return xscale(i); })
                            .y0(function(d) { return (chart.height - chart.padding); })
                            .y1(function(d) { return yscale(d); });
                         
                // non-projection area
                container.append("svg:path").attr("d", area(values.slice(0,projected)))
                                            .attr("class","grapharea")
                                            .style("fill", color)
                                            .style("opacity", nosel_opacity);
                
                // projection area
                container.append("svg:path").attr("d", area(values.slice(projected-1,years.length)))
                                            .attr("class","grapharea_proj")
                                            .attr("transform", "translate(" + (xscale(projected-1) - chart.padding).toString() + ",0)")
                                            .style("fill", color)
                                            .style("opacity", 0.15);
                    
                // non-projection line
                container.append("svg:path").attr("d", line(values.slice(0,projected )))
                                            .attr("class","graphline")
                                            .style("stroke", color)
                                            .style("opacity", 0.7);
                
                // projection line
                container.append("svg:path").attr("d", line(values.slice(projected-1,years.length)))
                                            .attr("class","graphline_proj")
                                            .attr("transform", "translate(" + (xscale(projected-1) - chart.padding).toString() + ",0)")
                                            .style("stroke", color)
                                            .style("opacity", 0.7);
                
                // hotspots
                container.selectAll("circle")
                         .data(values)
                         .enter()
                         .append("circle")
                         .attr("class","graphcircle")
                         .attr("cx", function(d,i) { return xscale(i); })
                         .attr("cy", function(d) { return yscale(d); })
                         .attr("r","5")
                         .attr("stroke", color)
                         .attr("stroke-opacity",0.8)
                         .attr("fill-opacity",0.50)
                         .attr("fill", color);
            
                               //axes
               var xAxis = d3.svg.axis(container)
                     .scale(xscale)
                     .orient("bottom")
                     .tickSize(2, 0, 0)
                     .tickFormat(function(d, i){
                        return years[i]; });
                
               var yAxis = d3.svg.axis()
                                 .scale(yscale)
                                 .ticks(5)
                                 .orient("left")
                                 .tickSize(2, 0, 0)
                                 .tickFormat(function(d,i){
                                     return formatcurrency(d);
                                 });
                
                chart.xAxisSocket.call(xAxis);
                chart.yAxisSocket.call(yAxis);

                chart_height = chart.node().getBBox().height;
                
            }


            function init_chart (x, y){
                var width = layout.chartsvg.width;
                var height = layout.chartsvg.height;
                if(chart !== undefined ) {
                    chart.remove();
                }
                chart = layout.chartsvg.append("svg:g");
                
                chart.padding = 50;
                chart.x = x;
                chart.y = y;
                chart.width = width - chart.padding;
                chart.height = height;
                chart.linestack = [];
                
                chart.xAxisSocket = chart.append("g")
                  .attr("class", "axis")
                  .attr("transform", "translate(0," + (chart.height - chart.padding) + ")");

                chart.yAxisSocket = chart.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate( " + chart.padding + ",0)");

            }
                    