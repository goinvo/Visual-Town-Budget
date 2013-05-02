            var colors = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"];
            var homecolors = ["#006699", "#33CC66", "#CC0000"];

            var home;


            // constants
            var section;

            var firstYear = 2006,
                lastYear = 2018,
                currentYear = 2012, // only used for projections
                thisYear = 2012,
                yearIndex = thisYear - firstYear;

            var root;
            var currentSelection = new Object();
            
            // object references
            var mysvg;

            var layout = new Object();

            Number.prototype.px=function()
            {
                return this.toString() + "px";
            };



            function onjsonload(jsondata) {
                root = jsondata;
                currentSelection.data = root;
                
                titlebox_init();
                avb.cards.initialize();
                avb.cards.draw();
                avb.navigation.initialize(jsondata);
                avb.chart.initialize('#chart');
                avb.chart.initializeLayers();



                console.log("UI Loaded.");

                updateSelection(root, "steelblue")
            }

            function triggerModal() {
                $('#modal-container').modal({
                    onOpen : modalOpen,
                    onClose : modalClose,
                    opacity : 70
                });
            }

            function updateSelection(data, color) {
                currentSelection.data = data;
                currentSelection.color = color;

                avb.chart.drawline(data, color, true);
                avb.cards.update(data);
                titlebox_fill(data);
            }

            function modalOpen(dialog) {
                $('.popover').hide();

                dialog.data.show();
                dialog.container.show();

                $('#modal-title .title-head').html(currentSelection.data.key);
                $('#modal-title .title-descr').html(currentSelection.data.descr);
                $('#bottom-switch').appendTo('#modal-switch');
                log($('#bottom-right'))
                $('#bottom-right div :first').appendTo('#modal-right');
                avb.chart.initialize("#modal-chart");
                avb.chart.drawline();


                dialog.overlay.fadeIn('fast');
            }

            function modalClose(dialog){
                $('#bottom-switch').prependTo('#bottom-center-wrap');
                console.log($('modal-right div :first'))
                $('#modal-right div :first').appendTo('#bottom-right');
                avb.chart.initialize("#chart");
                avb.chart.drawline();

                dialog.data.hide();
                dialog.container.hide();
                dialog.overlay.fadeOut('fast');
                $.modal.close();
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

                avb.navbar.enableYears();

                d3.select("#avb-home").style("display","none");
                d3.select("#avb-body").style("display","block");
                d3.selectAll("svg").remove();

                home = false;
                section = name;
                d3.json("/data/" + section + ".json", onjsonload);
            }


            function add_filter(container){
                filter = container.append("svg:defs")
                .append("svg:filter")
                .attr("id", "blur");

            }

            function toarray(d){
                values = [];
                for(var i=firstYear; i <= lastYear ; i++){
                    if( d[i.toString()] !== undefined ) {
                        values.push({ year : i , val : d[i.toString()]});
                    }
                }
                return {
                    name : d.name,
                    values : values
                }
            }

            function changeyear(year){
                if(year === thisYear) return;
                thisYear = year;
                yearIndex = thisYear - firstYear;
                avb.navigation.update(root);
                avb.chart.initialize();
                avb.chart.drawline(root, "steelblue", true);
                titlebox_fill(root);
                avb.cards.update(root);
            }


            function loadthumbails(){
                getthumbail($("#home-thumb1"),homecolors[0]);
                getthumbail($("#home-thumb2"),homecolors[2]);
                getthumbail($("#home-thumb3"),homecolors[1]);
            }



            function getthumbail(div, color){

                d3.json("/data/home.json", function(data){
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
                    .domain([firstYear, lastYear])
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
                    .attr("width", Math.floor(width/(lastYear - firstYear)))
                    .attr("height", function(d) {
                        return yscale(d.val);
                    })
                    .style("fill", color)
                    .style("opacity",0.5);
                });
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
            console.log("here");
            if (data.descr !== undefined && data.descr !== ''){
                titlebox.bottom.text(data.descr);
            } else {
                titlebox.bottom.text("No description available.");
            }
            var margin = Math.max(0, $("#bottom-container").height() - $("#title-head").height() - $("#title-descr").height());
            $("#titledescr-container").css("margin-top", margin/2);
        }


        function translate(obj,x,y) {
            obj.attr("transform", "translate(" + (x).toString() +"," + (y).toString() + ")");
        }

        function rotate(obj,degrees) {
            obj.attr("transform","rotate(" + degrees.toString() + " 100 100)");
        }

        // window action code

        // On resize
        $(window).resize(function() {
            avb.navbar.reposition();
        });

        // feedbackify

        // var fby = fby || [];
        // (function () {
        //     var f = document.createElement('script'); f.type = 'text/javascript'; f.async = true;
        //     f.src = '//cdn.feedbackify.com/f.js';
        //     var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(f, s);
        // })();