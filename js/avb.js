            var colors = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"];
            var homecolors = ["#006699", "#33CC66", "#CC0000"];

            var home;

            var in_use;
            // dimensions (no timeline included)
            var timeline_height = 50;
            var title_height = 0;


            console.log(d3.select("#avb").property("clientHeight"));

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


            // init years array
            for(var i = min_year; i <= max_year; i++){
                years.push((i).toString());
            }

            // drawhome();
            // activatelinks();
            opensection("Revenues");


            Number.prototype.px=function()
            {
                return this.toString() + "px";
            };
            
            var get_max = function (d) {
                var curmax = 0;
                for( var i=0; i <=years.length; i++) {
                    if(d[years[i]] !== undefined && d[years[i]] > curmax) {
                        curmax = d[years[i]];
                    }
                }
                return curmax;
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
                                         .attr("height", 250)
                                         .style("margin-top", "1%");
                drawbars(jsondata.sub, 0, 0, 150, 60);
                drawtimeline(0, homebars_height + 25, get_winsize("w"), 30);
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
                    console.log("Res");
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

                var container = mysvg.append("svg:g");
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
                card.divs.style("left", (x + mysvg.x).px());
                card.divs.style("top", (y + mysvg.y + d3.select("#avb").property("offsetTop")).px());
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

                newcard.divs =  d3.select("body").append("div")
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
                         //           .style("text-align", "left")
                                    .style("font-size", (width/14).px());
                
                return newcard;
            }

            function updatecards(data) {
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


            function onjsonload(jsondata) {
                //drawtimeline(0, graph_h, 0, graph_w);

                drawtitlebox(0, d3.select("#navbar").property("clientHeight") , 600, 0);
                filltitle(jsondata);

                graph_h = get_winsize("h") - title_height - 60 - 60;
                graph_w = graph_h * 16/9;

                mysvg = d3.select("#avb").style("position","absolute")
                                         .style("top", title_height.px())
                                         .append("svg")
                                         .attr("width", graph_w)
                                         .attr("height", graph_h)
                                         .attr("class", "avbsvg");
                mysvg.x = mysvg.property("offsetLeft");
                mysvg.y = mysvg.property("offsetTop");

                initfilter(10);
                init_tooltip();
                var bar_offset = bar_width * 2 + bar_left_padding + bar_intra_padding + 80;

                var padding = 20;

                                // title

                // navigation
                init_nav(jsondata, 0, 0, graph_w/2, graph_h);

                
                // timeline
                //drawtimeline(0, graph_h * 1.02, bar_offset + leftside_width, 0);
                deck = initdeck();

                // chart
                chart_width = graph_w/2;
                chart_height = chart_width * 9/20;
                init_chart(graph_w/2, graph_h/2, chart_width,  chart_height);
                drawline(jsondata, "steelblue", true);
                translate(chart, 0, - chart.xAxisSocket.node().getBBox().height);

                // new cards
                draw_stack(graph_w/2, graph_h/2 + 20, graph_w/2 , graph_h/2 );
                updatecards(jsondata); 


                 // drawtext(jsondata, section);


                console.log("UI Loaded.");
            }


            var rectclick = function(d,i) {
                        drawline(d, d3.select(this).attr("fill"), true);
                        updatecards(d);
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

                        container.curly = drawcurly(container, Math.floor(d3.select(this).attr("y")) + d3.select(this).attr("height")/2, container.x + bar_width, graph_h - bar_height, 100, d3.select(this).attr("fill"));
                        d3.select(this).attr("opacity",sel_opacity.toString());
                        newzone = drawzone(d3.select(this).data()[0], cur_year.toString(), container.x, navigation.height - bar_height, bar_width, bar_height);
                        newzone.x = graph_w/2 - bar_width - 30;
                        newzone.transition()
                               .delay(1000)
                               .duration(500)
                               .attr("transform", " translate(" + (newzone.x).toString() +"," + (container.y).toString() + ")")
                               .attr("display", "inline");
                };

            function init_nav(jsondata, x, y, width, height) {
                navigation = mysvg.append("svg:g");
                navigation.height = height;
                navigation.width = width;
                bar_width = width/4;
                offset_w = bar_width * 0.6;
                bar_intra_padding = offset_w;
                offset_h = 0;
                bar_height = height - offset_h*maxlevel;
                drawzone(jsondata, cur_year.toString(), graph_w/2 - bar_width - 30, height - bar_height, bar_width, bar_height).attr("display","inline");


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
                                          .domain([0,d3.max(jsondata, get_max)])
                                          .range([0, height]);
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
                    filter = mysvg.append("svg:defs")
                                  .append("svg:filter")
                                  .attr("id", "blur")
                                  .append("svg:feGaussianBlur")
                                  .attr("stdDeviation", stdev);
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
                curly = mysvg.append("svg:g");
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
                titlebox = d3.select("body").append("div")
                                            .attr("id", "titlebox")
                                            .style("margin-top", "1%")
                                            .style("margin-left", "1%");
                titlebox.style('position','absolute')
                	   .style('height', height.px())
                       .style('left', (0).px())
                       .style('top', y.px())
                       .style('width', width.px());
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
                title_height = titlebox.section.property("clientHeight") + titlebox.top.property("clientHeight") + titlebox.bottom.property("clientHeight");
                console.log(title_height);
            }


            function changeyear(year) {
                if(year == cur_year) return;
                cur_year = year;
                timeline.selector.transition()
                                 .attr("cx", timeline.timescale(year));
                refresh();
            }
            
            function drawtimeline(x, y, width, height){
                timeline = mysvg.append("svg:g");
                var w_padding = width * 0.02;
                
                // timescale + axis
                timeline.timescale = d3.scale.linear()
                                        .domain([parseInt(years[0]),parseInt(years[years.length -1])])
                                        .range([w_padding, width - w_padding]);

                var timeAxis = d3.svg.axis()
                                 .scale(timeline.timescale)
                                 .orient("bottom")
                                 .ticks(years.length)
                                 .tickSize(1)
                                 .tickPadding(12)
                                 .tickFormat(function(d, i){
                                    return "'" + years[i].substring(2,4); });
                
                timeline.call(timeAxis)
                         .attr("class", "timeaxis");
                                
                timeline.append("rect")
                        .attr("width", width)
                        .attr("height", height)
                        .attr("opacity", 0);

                // selector circle
                timeline.selector =
                timeline.append("circle")
                         .attr("class","timeselector")
                         .attr("cx", timeline.timescale(cur_year))
                         .attr("cy", "0")
                         .attr("r","8")
                         .call(d3.behavior.drag()
                            .on("drag", function() {
                                this.parentNode.appendChild(this);
                                var dragTarget = d3.select(this);
                                dragTarget
                                    .attr("cx", function(){
                                        var curx = parseFloat(d3.select(this).attr("cx"));
                                        if(curx > timeline.timescale.range()[1]) {
                                            d3.select(this).attr("cx", timeline.timescale.range()[1]);
                                        } else if (curx < timeline.timescale.range()[0]) {
                                            d3.select(this).attr("cx", timeline.timescale.range()[0]);
                                        } else {}
                                        return d3.event.dx + parseInt(dragTarget.attr("cx"));});
                            })
                            .on("dragend", function() {
                                var curx = parseFloat(d3.select(this).attr("cx"));
                                changeyear(Math.round(timeline.timescale.invert(curx)));
                          }));

                timeline.on("click", function() {
                    changeyear(Math.round(timeline.timescale.invert(d3.mouse(this)[0])));
                });
                translate(timeline,x,y);
                timeline_height = timeline.property("clientHeight");
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

                container.selectAll("rect").call(d3.behavior.drag()
                      .on("dragstart", function(d) {
                        //console.log("dstart");
                      })
                      .on("drag", function(d) {
                        //console.log("dtag");
                      })
                      .on("dragend", function() {
                        var color = d3.select(this).attr("fill");
                        drawline(d3.select(this).data()[0],color,false);
                      }));

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
            
            function get_maxyear(data) {
                var i = max_year;
                while( data[i.toString()] === undefined && i >= min_year ) {
                    i--;
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
                
                var padding = 30;
                
                var values = [];
                var min_year = get_minyear(data);
                var max_year = get_maxyear(data);
                var projected = cur_year - min_year + 1 ;
               
                for(var j = min_year; j<= max_year; j++) {
                        values.push(data[j.toString()]);
                }
                
                var yscale = d3.scale.linear().domain([0,d3.max(values)]).range([padding, chart.height - padding]);
                var xscale = d3.scale.linear().domain([0, max_year-min_year]).range([padding, chart.width - padding ]);

                var container = chart.append("svg:g");
                translate(container, chart.x, chart.y);
                chart.linestack.push(container);
                
                var line = d3.svg.line()
                                    .x(function(d,i) { return xscale(i); })
                                    .y(function(d) { return -1 * (yscale(d)); });
                
                // area
                var area = d3.svg.area()
                            .x(function(d,i) { return xscale(i); })
                            .y1(function(d) { return -1 * (yscale(d)); });
                         
                // non-projection area
                container.append("svg:path").attr("d", area(values.slice(0,projected)))
                                            .attr("class","grapharea")
                                            .style("fill", color)
                                            .style("opacity", nosel_opacity);
                
                // projection area
                container.append("svg:path").attr("d", area(values.slice(projected-1,years.length)))
                                            .attr("class","grapharea_proj")
                                            .attr("transform", "translate(" + (xscale(projected-1) - padding).toString() + ",0)")
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
                                            .attr("transform", "translate(" + (xscale(projected-1) - padding).toString() + ",0)")
                                            .style("stroke", color)
                                            .style("opacity", 0.7);
                
                // hotspots
                container.selectAll("circle")
                         .data(values)
                         .enter()
                         .append("circle")
                         .attr("class","graphcircle")
                         .attr("cx", function(d,i) { return xscale(i); })
                         .attr("cy", function(d) { return -1 * (yscale(d)); })
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
                                 .scale(yscale.range([chart.height -padding, padding]))
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


            function init_chart (x, y, width, height){
                if(chart !== undefined ) {
                    chart.remove();
                }
                chart = mysvg.append("svg:g");
                
                var padding = 30;
                chart.x = x;
                chart.y = y;
                chart.width = width;
                chart.height = height;
                chart.linestack = [];
                
                chart.xAxisSocket = chart.append("g")
                  .attr("class", "axis")
                  .attr("transform", "translate(" + (x).toString() +"," + (y).toString() + ")");

                chart.yAxisSocket = chart.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + ((x + padding)).toString() +"," + (y - height + padding).toString() + ")");
            }
                    