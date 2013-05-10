            var colors = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"];
            var revenuesColor = ["#006699", "#46ABDE", "#3997D1", "#E76354", "#33CC66", "#46ABDE"];
            var homecolors = ["#006699", "#33CC66", "#CC0000"];

            var home;

            // constants
            var section;

            var firstYear = 2008,
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

            function pushUrl(section, year, node){
                var url = '/' + section + '/' + thisYear + '/' + node;
                window.history.pushState({section : section, year : thisYear, nodeId : node},"", url);
            }

            function popUrl(event){
                if(event.state === null){
                    //avb.navigation.open(root.hash);
                } else {
                    avb.navigation.open(event.state.nodeId);
                }
            }

            function onjsonload(jsondata) {
                root = jsondata;
                currentSelection.data = root;
                
                avb.cards.initialize();
                avb.cards.draw();
                avb.navigation.initialize(jsondata);
                avb.chart.initialize('#chart');
                avb.chart.initializeSwitch();
                $(".rectangle:first").trigger('click');

                console.log("UI Loaded.");
                
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
            }

            function modalOpen(dialog) {
                $('.popover').hide();

                dialog.data.show();
                dialog.container.show();

                avb.navigation.updateTitle(currentSelection);
                $('#bottom-switch').appendTo('#modal-switch');
                $('#bottom-right div :first').appendTo('#modal-right');
                avb.chart.initialize("#modal-chart");
                avb.chart.drawline();


                dialog.overlay.fadeIn('fast');
            }

            function modalClose(dialog){
                $('#bottom-switch').appendTo('#bottom-controls');
                $('#modal-right div :first').prependTo('#bottom-right');

                $("#layer-switch").attr('checked', false);


                avb.chart.initialize("#chart");
                avb.chart.drawline();

                dialog.data.hide();
                dialog.container.hide();
                dialog.overlay.fadeOut('fast');
                $.modal.close();


            }

            function shadeColor(color, percent) {   
                var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, B = (num >> 8 & 0x00FF) + amt, G = (num & 0x0000FF) + amt;
                return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
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

            function initialize(params) {

                // year checks
                if(params.year !== undefined && !isNaN(parseInt(params.year)) && 
                    params.year < lastYear && params.year > firstYear){
                        thisYear = params.year;
                        yearIndex = thisYear - firstYear;
                }

                avb.navbar.enableYears();

                d3.select("#avb-home").style("display","none");
                d3.select("#avb-body").style("display","block");
                d3.selectAll("svg").remove();

                home = false;
                section = params.section;
                d3.json("/data/" + params.section + ".json", onjsonload);
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
                currentSelection = root;
                pushUrl(section,year,root.hash)
                thisYear = year;
                yearIndex = thisYear - firstYear;
                avb.navigation.update(root);
                avb.chart.initialize('#chart');
                avb.chart.drawline();
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


        function hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }


        function translate(obj,x,y) {
            obj.attr("transform", "translate(" + (x).toString() +"," + (y).toString() + ")");
        }

        function rotate(obj,degrees) {
            obj.attr("transform","rotate(" + degrees.toString() + " 100 100)");
        }

        $.fn.center = function () {
            this.css("margin-top", Math.max(0, $(this).parent().height() - $(this).height())/2);
            return this;
        }

        $.fn.availableHeight = function() {
            var available = $(this).height();
            $(this).children().each(function(){
                available -= $(this).outerHeight();
            })
            return Math.max(0, availableHeight);
        }

        $.fn.textfill = function(maxFontSize) {
        maxFontSize = parseInt(maxFontSize, 10);
        return this.each(function(){
            var ourText = $("span", this),
                parent = ourText.parent(),
                maxHeight = parent.height(),
                maxWidth = parent.width(),
                fontSize = parseInt(ourText.css("fontSize"), 10),
                multiplier = maxWidth/ourText.width(),
                newSize = (fontSize*(multiplier-0.1));
            ourText.css(
                "fontSize", 
                (maxFontSize > 0 && newSize > maxFontSize) ? 
                    maxFontSize : 
                    newSize
            );
        });
    };244


        // window action code

        // On resize
        $(window).resize(function() {
        });

        window.onpopstate = popUrl;

        // feedbackify

        var fby = fby || [];
        (function () {
            var f = document.createElement('script'); f.type = 'text/javascript'; f.async = true;
            f.src = '//cdn.feedbackify.com/f.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(f, s);
        })();