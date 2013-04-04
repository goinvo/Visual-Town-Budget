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
            var years = [];
            var min_year = 2006;
            var max_year = 2018;
            var cur_year = 2012;

            var root_total = 125000000;
            
            // object references
            var mysvg;
            var tooltip;
            var filter;
            var nosel_opacity = 0.3;
            var sel_opacity = 0.8;


            // HOME ELEMENTS
            var homebars;
            var homescale;
            var hometexts;
            var homebars_width;
            var homebars_height;

            var layout = new Object();

            var cur_json;

            // init years array
            for(var i = min_year; i <= max_year; i++){
                years.push((i).toString());
            }

            Number.prototype.px=function()
            {
                return this.toString() + "px";
            };
            
             
            function activatelinks() {
               
               d3.select("#home_0").on("click", function() {
                console.log("click");
                   avb_init("revenues");
               });
            }

            function drawhome(){
                home = true;
                d3.json("data/home.json", onhomedata);
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

            function getex(){
                return 0;
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

            }


            function onjsonload(jsondata) {
                cur_json = jsondata;
                titlebox_init();
                titlebox_fill(jsondata);

                avb.cards.initialize();
                
                init_tooltip();
                //initmultiple(jsondata);
                avb.breadcrumbs.initialize();
                avb.breadcrumbs.push(jsondata);

                initsingle(jsondata);
                avb.timeline.initialize();
                avb.timeline.update(jsondata);
            }

            function initmultiple(jsondata) {
                mode = 2;
                d3.select("#multichart").style("display", "inline");
                graph_w = d3.select("#multichart").property("clientWidth");
                layout.multichartsvg = d3.select("#multichart").append("svg")
                           .attr("height", graph_w/2)
                           .attr("width", graph_w);
                graph_h = graph_w * 9/20;
                avb.multichart.draw(jsondata, 0, 0, graph_w, graph_h);

            }

            function initsingle(jsondata){
                mode = 1; // single year mode

                layoutsingle_init();

                avb.navigation.initialize(jsondata, 0, 0);

                avb.chart.initialize(0,layout.chartsvg.height - 30);
                avb.chart.drawline(jsondata, "steelblue", true);

                avb.cards.draw(2, 2);
                avb.cards.update(jsondata); 

                console.log("UI Loaded.");
            }

            function single_remove() {
                avb.navigation.fadeout();
                d3.select("#cards").selectAll("div").transition().duration(500).style("margin-left",get_winsize("w").px());
                d3.select("#singlelayout").transition().delay(500).style("display", "none");
                d3.select("#cards").selectAll("div").transition().delay(500).remove();
                d3.select("#chart").selectAll("svg").transition().delay(500).remove();
                d3.select("#bars").selectAll("svg").transition().delay(500).remove();
                avb.cards.clear();
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

            function avb_init(name) {
                d3.select("#avb-home").style("display","none");
                d3.select("#avb-body").style("display","block");
                d3.selectAll("svg").remove();

                home = false;
                section = name.toLowerCase();

                d3.json("data/arlington.json", onjsonload);
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


            
            function titlebox_init(x, y, width, height) {
                titlebox = d3.select("#title-head");
                titlebox.bottom = d3.select("#title-descr");
            }

            
            function titlebox_fill(data){
                titlebox.text(data.name);
                titlebox.bottom.text(data.descr);
            }

            
            function translate(obj,x,y) {
                obj.attr("transform", "translate(" + (x).toString() +"," + (y).toString() + ")");
            }
            
            function rotate(obj,degrees) {
                obj.attr("transform","rotate(" + degrees.toString() + " 100 100)");
            }
            
            
            
            function get_minyear(data) {
                var i = min_year;
                while( data[i.toString()] === undefined && i <= max_year) {
                    i++;
                }
                return i;
            }
            
                    