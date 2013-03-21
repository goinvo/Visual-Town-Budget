            var colors = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"];
            
            var homecolors = ["#006699", "#33CC66", "#CC0000"]
            var home;

            var in_use;
            // dimensions (no timeline included)
            var graph_w = get_winsize("w");
            var graph_h = get_winsize("h")*0.9;
            
            // bar dimensions
            var bar_width = 120;
            var bar_height = 655;
            var bar_intra_padding = 70;
            var bar_left_padding = 20;
            

            // titlebox location
            var tbox_hpadding = 5;
            var tbox_wpadding = 30;
            
            // constants
            var section;
            var years = [];
            var min_year = 2006;
            var max_year = 2018;
            var cur_year = 2012;
            var root_total = 125000000;
            
            // levelstack
            var levels = [];

            // object references
            var mysvg;
            var chart;
            var textbox;
            var titlebox;
            var tooltip;
            var curly;
            var filter;
            var timeline;
            var nosel_opacity = 0.3;
            var sel_opacity = 0.8;

            // HOME ELEMENTS
            var homebars;
            var homescale;
            var hometexts;
            var homebars_width;
            var homebars_height;


            // init years array
            for(var i = min_year; i <= max_year; i++){
                years.push((i).toString());
            }

            drawhome();
            activatelinks();


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
               
               d3.select("#Revenues").on("click", function() {
                console.log("click");
                   opensection(this.id);
               });

            }

            function drawhome(){
                home = true;
                d3.json("js/home.js", onhomedata);
            }


            function onhomedata(jsondata) {
                var max = 0;
                home_width = 300;
                mysvg = d3.select("body").append("svg")
                                         .attr("width", get_winsize("w"))
                                         .attr("height", home_width);
                drawbars(jsondata.sub, 10, 0, 150, 60);
                drawtimeline(0, homebars_height + 25, get_winsize("w"), 30);
            }

            function formatcurrency(value) {
               return "$" + Math.round(value/Math.pow(10,6)).toString() + " MLN";
            }
            
            function drawbars(jsondata, x, y, height, width, xpadding) {
                homebars_width = width;//
                homebars_height = height;
                var heightscale = d3.scale.linear()
                                          .domain([0,d3.max(jsondata, get_max)])
                                          .range([0, height]);
                var xscale = d3.scale.linear()
                                          .domain([0,3])
                                          .range([0, get_winsize("w")]);
                homescale = heightscale;
                var container = mysvg.append("svg:g");
                translate(container, x, y);
                var tracecontainer = mysvg.append("svg:g");
                translate(tracecontainer, x, y);
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
                                    return xscale(i);
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
                                    return xscale(i);
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
                                    return xscale(i) + homebars_width + 10;
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
                d3.selectAll("div").remove();
                d3.selectAll("svg").remove();
                home = false;
                section = name;
                mysvg = d3.select("body").append("svg")
                                         .attr("width", get_winsize("w"))
                                         .attr("height", graph_h + 60);
                d3.json("js/arlington.js", onjsonload);
                //
            }


            function onjsonload(jsondata) {
                //drawtimeline(0, graph_h, 0, graph_w);
                initfilter(10);
                drawtimeline(0, graph_h, get_winsize("w"), 30);
                init_tooltip();
                init_chart(graph_w/2 - 30, graph_h/2, graph_w / 2,  (graph_w/2) * 9/16);
                drawbox(graph_w/2, graph_h/2 + 80, graph_w/2 - 30, 0);
                drawline(jsondata, "steelblue", true);
                drawtitlebox();
                filltitle(jsondata);
                drawzone(jsondata, cur_year.toString(), bar_left_padding);
                console.log("UI Loaded.");
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
                              .attr("class", "label")
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
                .attr("class","tooltip");
            }



            function drawcurly(target_y){
                if(curly !== undefined ) {
                    curly.remove();
                }
                curly = mysvg.append("svg:g");
                var radius = Math.floor(bar_intra_padding/3);
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

                
                translate(curly, bar_width + bar_left_padding + (bar_intra_padding - radius*2)/2 ,graph_h - bar_height);
                
            }
            
            function drawtitlebox(x, y, height, width, xpadding, ypadding) {
                var box_w = graph_w/2;
                var box_y = graph_h/3 - chart.height;
                titlebox = d3.select("body").append("div");
                titlebox.style('position','absolute')
                       .style('left', tbox_wpadding.px())
                       .style('top', (0).px())
                       .style('width', box_w.px());
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
            
            function drawbox(x, y, width, height) {

                textbox = d3.select("body").append("div");
                textbox.style('position','absolute')
                       .style('left', x.px())
                       .style('top', y.px())
                       .style('width', width.px())
                       .style('height', Math.round(height).px());


                textbox.left = textbox.append("div").style("float","left")
                                                     .style("width","60%");
                textbox.right = textbox.append("div").style("float","right")
                                                     .style("width","40%");
                textbox.year = textbox.right.append("div").attr("class","tright");
                textbox.percentage = textbox.right.append("div")
                                                  .attr("class","tperc");
                textbox.parent = textbox.right.append("div")
                                                  .attr("class","tright");
                textbox.value = textbox.right.append("div").attr("class","tvalue");
            }
            
            function drawtext(data, key, parentname) {
                var percentage = Math.max(0.01,(Math.round(data[key]*100*100/root_total)/100)).toString();
                textbox.percentage.text(percentage + "%");
                textbox.parent.text("of total " + parentname.toLowerCase() + " or ");
                var format = d3.format("0,000,000.00"); //returns 2489.8237000 (padding)
                textbox.value.text("$ " + format(data[key]).toString());
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
                var w_padding = 30;
                var h_padding = 5;
                
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
                translate(timeline,x,y + h_padding);
            }

            
            function translate(obj,x,y) {
                obj.attr("transform", "translate(" + (x).toString() +"," + (y).toString() + ")");
            }
            
            function rotate(obj,degrees) {
                obj.attr("transform","rotate(" + degrees.toString() + " 100 100)");
            }
            

            
            function drawzone(obj, key, xposition) {
                
                var container = mysvg.append("svg:g")
                    .attr("stroke", "white")
                    .attr("stroke-width", 2)
                    .attr("fill", "orange")
                    .attr("lev", levels.length)
                    .attr("name", obj["name"]);
                
                //stack push
                container.lev = levels.length;
                levels.push(container);
                var data = obj["sub"];
                var maxvalue = d3.max(data, function(d) { return d[key]; });
                var heightscale = d3.scale.linear().domain([0,maxvalue]).range([0,bar_height*maxvalue/d3.sum(data, function (d) {return d[key]})]);
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
                            .attr("opacity", nosel_opacity.toString());
                    if ( entities.attr("height") >= 20 ) {
                            add_label(group,entities,data[i]["name"]);
                    }
                    cur_y += heightscale(data[i][key]);
                }
                container.selectAll("rect").data(data).enter;
                container.selectAll("rect").on("click", function(d,i) {
                        drawline(d, d3.select(this).attr("fill"), true);
                        drawtext(d, key, d3.select(this.parentNode.parentNode).attr("name"));
                        filltitle(d);
                        // fix this parentnode mess !
                        if( levels[levels.length-1].lev == d3.select(this.parentNode.parentNode).attr("lev")){
                            console.log("proceed");   
                        } else {
                            levels.pop().remove();
                            if(curly !== undefined) {
                            curly.remove();
                            }
                            console.log("notlast"); 
                        }

                        if ( d["sub"] === undefined ) {
                            return;
                        }
                        if(curly !== undefined) {
                            curly.remove();
                        }
                        drawcurly(Math.floor(d3.select(this).attr("y")) + d3.select(this).attr("height")/2);
                        d3.select(this).attr("opacity",sel_opacity.toString());
                        drawcurly(Math.floor(d3.select(this).attr("y")) + d3.select(this).attr("height")/2);
                        var newpos = bar_width*2 + d3.select(this).attr("x");
                        console.log((d3.select(this).data()[0]).name);//
                        drawzone(d3.select(this).data()[0], key, xposition + bar_width + bar_intra_padding);
                });//
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
                
                container.attr("transform", "translate(" + xposition.toString() + ", " + (graph_h - bar_height).toString()  +")");
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
                
                var yscale = d3.scale.linear().domain([0,d3.max(values)]).range([padding, chart.height -padding]);
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
                     .tickFormat(function(d, i){
                        return years[i]; });
                

                
               var yAxis = d3.svg.axis()
                                 .scale(yscale.range([chart.height -padding, padding]))
                                 .ticks(5)
                                 .orient("left")
                                 .tickFormat(function(d,i){
                                     if(d > Math.pow(10,6)) {
                                        return (d/Math.pow(10,6)).toString() + " MLN";
                                     } else {
                                         return d;
                                     }
                                 });
                
                chart.xAxisSocket.call(xAxis);
                chart.yAxisSocket.call(yAxis);
                
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
                    