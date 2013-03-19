            var colors = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"];
            
            var in_use;
            
            // dimensions (no timeline included)
            var graph_w = 1024;
            var graph_h = 768;
            
            // bar dimensions
            var bar_width = 120;                   
            var bar_intra_padding = 70;
            var bar_left_padding = 20;
            
            // timeline dimensions
            var timeline_h = 60;
            
            // constants
            var years = ["2006", "2007" ,"2008", "2009","2010","2011","2012","2013", "2014", "2015", "2016", "2017", "2018"];
            var min_year = 2006;
            var max_year = 2018;
            var cur_year = 2012;
            var root_total = 125000000;
            
            // levelstack
            var levels = [];

            // object references
            var chart;
            var textbox;
            var titlebox;
            var tooltip;
            var curly;
            var mysvg = d3.select("body").append("svg")
                                         .attr("width", graph_w)
                                         .attr("height", graph_h + timeline_h);
            
            
            var nosel_opacity = 0.3;
            var sel_opacity = 0.8;
            
            d3.json("arlington.js", onjsonload);
            
//            drawhome();
//            
//            function drawhome() {
//                //
//                console.log("hello");
//                console.log(d3.selectAll("div").text);
//            }

                var filter = mysvg.append("svg:defs")
                                  .append("svg:filter")
                                    .attr("id", "blur")
                                  .append("svg:feGaussianBlur")
                                    .attr("stdDeviation", 10);

            function onjsonload(jsondata) {
                init_tooltip();
                drawbox(jsondata);
                drawchart(jsondata, "steelblue");
                drawtitlebox();
                filltitle(jsondata);
                drawzone(jsondata, cur_year.toString(), bar_left_padding);
                drawtimeline();

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
                                            .attr("y2",graph_h - radius)
                                            .attr("class","curly_b");
                
                curly.append("svg:path").datum(d3.range(points))
                                            .attr("d", curvedline)
                                            .attr("class","curly_b")
                                            .attr("transform", "rotate(180 0 0), translate(" + (-radius*2).toString() +  ", " + (-graph_h + radius).toString() + ") ");

                
                translate(curly, bar_width + bar_left_padding + (bar_intra_padding - radius*2)/2 ,0);
                
            }
            
            function drawtitlebox() {
                var box_w = graph_w/2;
                var box_y = graph_h/3 - chart.c_height;
                titlebox = d3.select("body").append("div");
                titlebox.style('position','absolute')
                       .style('left', (graph_w/2).toString() + "px")
                       .style('top', (0).toString() + "px")
                       .style('width', box_w.toString() + "px");
                var title_y = box_y * 0.6;
                titlebox.top = titlebox.append("div")
                                                    .attr("class","tname")
                                                    .style("font-size", title_y.toString() + "px");
                titlebox.bottom = titlebox.append("div")
                                                     .attr("class","tdesc")
                                                    .style("font-size", (box_y - title_y).toString() + "px");;
            }
            
            function filltitle(data){
                console.log("here");
                console.log(titlebox);
                titlebox.top.text(data["name"]);
                titlebox.bottom.text(data["descr"]);
            }
            
            
            function drawbox(data) {
                var box_w = graph_w/2 - 3;
                var yloc = graph_h/2 + 80;
                textbox = d3.select("body").append("div");
                textbox.style('position','absolute')
                       .style('left', (graph_w/2).toString() + "px")
                       .style('top', (yloc).toString() + "px")
                       .style('width', box_w.toString() + "px")
                       .style('height', Math.round(box_w * 9/16).toString() + "px");


                textbox.left = textbox.append("div").style("float","left")
                                                     .style("width","60%");
//                textbox.name = textbox.left.append("div").style("height","10%")
//                                                    .attr("class","tname");
//                textbox.descr = textbox.left.append("div")
//                                                     .attr("class","tdesc");

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
//                textbox.name.text(data["name"]);
//                textbox.descr.text(data["descr"]);
                textbox.percentage.text(percentage + "%");
                textbox.parent.text("of total " + parentname + " or ");
                var format = d3.format("0,000,000.00"); //returns 2489.8237000 (padding)
                textbox.value.text("$ " + format(data[key]).toString());
            }

            
            function drawtimeline(){
                var container = mysvg.append("svg:g")
                var w_padding = 30;
                var h_padding = 30;
                
                // timescale + axis
                var timescale = d3.scale.linear().domain([parseInt(years[0]),parseInt(years[years.length -1])]).range([w_padding,graph_w - w_padding]);
                var timeAxis = d3.svg.axis()
                                 .scale(timescale)
                                 .orient("bottom")
                                 .ticks(years.length)
                                 .tickSize(1)
                                 .tickPadding(12)
                                 .tickFormat(function(d, i){
                                    return years[i]; });
                
                container.call(timeAxis)
                         .attr("class", "timeaxis");
                
                // selector circle
                var timeselect =
                container.append("circle")
                         .attr("class","timeselector")
                         .attr("cx", timescale(cur_year).toString())
                         .attr("cy", "0")
                         .attr("r","8")
                         .call(d3.behavior.drag().on("drag", function() {
                             this.parentNode.appendChild(this);
                            var dragTarget = d3.select(this);
                            
                            dragTarget
                                .attr("cx", function(){
                                    return d3.event.dx + parseInt(dragTarget.attr("cx"));});
                         }));

                timeselect.on("mouseup", function() {
                    console.log("mouseup");
                });
                
                                
                translate(container,0,graph_h + h_padding);
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
                var heightscale = d3.scale.linear().domain([0,maxvalue]).range([0,graph_h*maxvalue/d3.sum(data, function (d) {return d[key]})]);
                var cur_y = 0;
                for(var i=0; i<data.length; i++) {
                    var entities = container.append("rect");
                    entities.attr("x", 0)//
                            .attr("y", graph_h - heightscale(data[i][key]) - cur_y )
                            .attr("width", bar_width)
                            .attr("height", heightscale(data[i][key]))
                            .attr("fill", colors[i%20])
                            .attr("opacity", nosel_opacity.toString());
                    if ( entities.attr("height") >= 50 ) {
                        d3.select("body").append("div")
//                                 .text(data[i]["name"])
//                                 .style("position","absolute")
//                                 .style("width", bar_width.toString() + "px")
//                                 .style("height", heightscale(data[i][key]).toString() + "px")
//                                 .style("left", (xposition + 10).toString() + "px")
//                                 .style("top", Math.floor(graph_h - heightscale(data[i][key]) - cur_y).toString() + "px");

                    }
                    cur_y += heightscale(data[i][key]);
                }
                container.selectAll("rect").data(data).enter;
                container.selectAll("rect").on("click", function(d,i) {
                        console.log(d);//
                        drawchart(d, d3.select(this).attr("fill"));
                        drawtext(d, key, d3.select(this.parentNode).attr("name"));
                        filltitle(d);
                        if( levels[levels.length-1].lev == d3.select(this.parentNode).attr("lev")){
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
                        d3.select(this).attr("opacity",sel_opacity.toString())
                        drawcurly(Math.floor(d3.select(this).attr("y")) + d3.select(this).attr("height")/2);
                        var newpos = bar_width*2 + d3.select(this).attr("x");
                        console.log((d3.select(this).data()[0])["name"]);//
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
                        addline(d3.select(this).data()[0],color);
                      }));

                container.selectAll("rect").on("mouseout", function(d,i) {
                    tooltip.style("visibility", "hidden");
                    d3.select(this).attr("opacity","0.3");
                });        
                container.selectAll("rect").on("mouseover", function(d) {
                    d3.select(this).attr("opacity","0.7");
                    tooltip.style("visibility","visible")
                    .style("left", (d3.event.x + 10).toString() + "px")
                    .style("top", (d3.event.y + 2).toString() + "px")
                    .text(d["name"]);
                });
                container.selectAll("rect").on("mousemove", function(d) {
                     tooltip.style("left", (d3.event.x + 10).toString() + "px")
                            .style("top", (d3.event.y + 2).toString() + "px")
                            .text(d["name"]);
                });
                
                container.attr("transform", "translate(" + xposition.toString() + ", 0)");
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
            


            function addline(data, color) {
                var container = chart.append("svg:g");
                var padding = 15;
                container.attr("transform", "translate(" + (graph_w/2).toString() +"," + (graph_h/2).toString() + ")");
                var min_year = get_minyear(data);
                var max_year = get_maxyear(data);
                var projected = cur_year - min_year + 1 ;
                var values = [];
                for(var i = min_year; i<= max_year; i++) {
                        values.push(data[i.toString()]);
                }//
                var xscale = chart.xscale;
                var yscale = chart.yscale;
                var line = d3.svg.line()
                                    .x(function(d,i) { return xscale(i); })
                                    .y(function(d) { return -1 * (yscale(d)); });
                
                // area
                var area = d3.svg.area()
                            .x(function(d,i) { return xscale(i); })
                            .y1(function(d) { return -1 * (yscale(d)); });
                
               container.append("svg:path").attr("d", line(values.slice(0,years.length)))
                                            .attr("class","graphline_proj")
                                            .attr("transform", "translate(0,-10)")
                                            .style("filter", "url(#blur)")
                                            .style("stroke", "#000000")
                                            .style("opacity", 1.0);
                
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
                         .attr("stroke-opacity",0.30)
                         .attr("fill-opacity",0.80)
                         .attr("fill", color);
                

            }
            
            function drawchart(data ,color){
                if(chart !== undefined ) {
                    chart.remove();
                }
                chart = mysvg.append("svg:g");
                container = chart.append("svg:g");
                container.attr("transform", "translate(" + (graph_w/2).toString() +"," + (graph_h/2).toString() + ")");
                var c_width = graph_w / 2;
                var c_height = c_width * 9/16;
                var padding = 15;
                var values = [];
                var min_year = get_minyear(data);
                var max_year = get_maxyear(data);
                var projected = cur_year - min_year + 1 ;
               
                for(var i = min_year; i<= max_year; i++) {
                        values.push(data[i.toString()]);
                }
                var yscale = d3.scale.linear().domain([0,d3.max(values)]).range([padding, c_height -padding]);
                var xscale = d3.scale.linear().domain([0, max_year-min_year]).range([padding,c_width - padding ]);
                var line = d3.svg.line()
                                    //.interpolate("basis")
                                    .x(function(d,i) { return xscale(i); })
                                    .y(function(d) { return -1 * (yscale(d)); });
                
                // area
                var area = d3.svg.area()
                            .x(function(d,i) { return xscale(i); })
                            .y1(function(d) { return -1 * (yscale(d)); });
                
                container.append("svg:path").attr("d", line(values.slice(0,years.length)))
                                            .attr("class","graphline_proj")
                                            .attr("transform", "translate(0,-10)")
                                            .style("filter", "url(#blur)")
                                            .style("stroke", "#000000")
                                            .style("opacity", 1.0);
                
                
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


              var xAxis = d3.svg.axis()
                                 .scale(xscale)
                                 .orient("bottom")
                                 .tickFormat(function(d, i){
                                    return years[i]; });//
                
                //axes
                chart.append("g")
                    .call(xAxis)
                    .attr("class", "axis")
                    .attr("transform", "translate(" + (graph_w/2).toString() +"," + (graph_h/2).toString() + ")");
                
                
               var yAxis = d3.svg.axis()
                                 .scale(yscale.range([c_height -padding, padding]))
                                 .ticks(5)
                                 .orient("left")
                                 .tickFormat(function(d,i){
                                     if(d > Math.pow(10,6)) {
                                        return (d/Math.pow(10,6)).toString() + " MLN";
                                     } else {
                                         return d;
                                     }
                                 });
                
                chart.append("g")
                    .call(yAxis)
                    .attr("class", "axis")
                    .attr("transform", "translate(" + ((graph_w/2 + padding)).toString() +"," + (graph_h/2 - c_height + padding).toString() + ")");
                
                chart.xscale = xscale;
                chart.yscale = yscale;
                chart.c_width = c_width;
                chart.c_height = c_height;
                
                
            }
                    