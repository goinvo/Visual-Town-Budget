            var colors = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"];

            var firstYear = 2008,
            lastYear = 2018,
                currentYear = 2013, // only used for projections
                thisYear = 2013,
                yearIndex = thisYear - firstYear;

                var section;
                var mode;
                var root;
                var currentSelection = new Object();

                stats = {
                    amount : {
                        title : "Amount",
                        class : "span6 separator top",
                        icon : "/img/Amount@High.png",
                        value : function(d) { return formatcurrency(d.values[yearIndex].val); },
                        side : function() { return " in " + thisYear.toString() + "."},
                        cellClass : "value sum numeric textleft",
                        cellFunction : function(d,cell) { avb.table.renderAmount(d, cell)}
                    },
                    impact : {
                        title : "Impact",
                        class : "span6 separator ",
                        icon : "/img/Impact@High.png",
                        value : function(d) { return Math.max(0.01,(Math.round(d.values[yearIndex].val*100*100/root.values[yearIndex].val)/100)).toString() + "%"; },
                        side : function() { return " of total " + section + "."},
                        cellClass : "value sum",
                        cellFunction : function(d, cell) { avb.table.renderImpact(d,cell)}
                    },
                    growth : {
                        title : "Growth",
                        class : "span6 separator top",
                        icon : "/img/Growth@High.png",
                        value : function(d) { return growth(d); },
                        side : " compared to last year.",
                        cellFunction : function(d, cell) { avb.table.renderGrowth(d,cell)},
                        cellClass : "value"
                    },
                    source : {
                        title : "Source",
                        class : "span12 card-source separator",
                        icon : "/img/Growth@High.png",
                        value : function() { return "Cherry sheet"; },
                        side : "is the data source for this entry."
                    },
                    mean : {
                        title : "Average",
                        class : "span6 separator",
                        icon : "/img/Growth@High.png",
                        value : function(d) { return formatcurrency(d3.mean(d.values, get_values)); },
                        side : "on average."
                    },
                    filler : {
                        title : "",
                        class : "span6 separator",
                        icon : "",
                        value : function(d) { return ""; },
                        side : ""
                    },
                    name : {
                        title : "Name",
                        cellClass : "value name long textleft",
                        value : function(d) { return d.key; }
                    },
                    sparkline : {
                        title : "Change",
                        cellClass : "value sparkline",
                        cellFunction : function(d,cell) { avb.table.renderSparkline(d,cell) }
                    }
                },

                decks = {
                    revenues : [stats.amount, stats.growth, stats.impact, stats.mean, stats.source],
                    expenses : [stats.amount, stats.growth, stats.impact, stats.mean, stats.source],
                    funds : [stats.amount, stats.growth, stats.impact, stats.mean, stats.source]
                },

                tables = {
                    revenues : [stats.name,  stats.growth, stats.sparkline, stats.impact, stats.amount],
                    expenses : [stats.amount, stats.growth, stats.impact, stats.mean, stats.source],
                    funds : [stats.amount, stats.growth, stats.impact, stats.mean, stats.source]
                }

                Number.prototype.px=function()
                {
                    return this.toString() + "px";
                };

                function pushUrl(section, year, node){
                    log("push url")
                    var url = '/' + section + '/' + thisYear + '/' + mode + '/' + node;
                    window.history.pushState({section : section, year : thisYear, nodeId : node},"", url);
                }

                function popUrl(event){
                    if(event.state === null){
                    //avb.navigation.open(root.hash);
                } else {
                    avb.navigation.open(event.state.nodeId, false);
                }
            }

            function name(d) {
                return d.parent ? name(d.parent) + "." + d.key : d.key;
            }

            function onjsonload(jsondata) {
                root = jsondata;
                
                avb.cards.initialize();
                avb.cards.draw();
                avb.navigation.initialize(jsondata);
                avb.navigation.open(root.hash, true);
                
                console.log("UI Loaded.");
                
            }

            function updateSelection(data, year, color) {
                currentSelection.data = data;
                currentSelection.year = year;
                log("update")
                avb.chart.drawline(data, color);
                avb.cards.update(data);
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

            function formatCurrencyExact(value){
                var commasFormatter = d3.format(",.0f")
                return "$ " + commasFormatter(value);
            }

            function formatPercentage(value){
                if(value > 0) {
                    return "+ " + value.toString() + "%";
                } else {
                    return "- " + Math.abs(value).toString() + "%";
                }
            }

            function growth(data){
                var previous = (data.values[yearIndex-1] !== undefined) ? data.values[yearIndex-1].val : 0;
                var perc = Math.round(100 * 100 * (data.values[yearIndex].val - previous) / data.values[yearIndex].val)/100;
                return formatPercentage(perc);
            };


            function initialize(params) {
                // year checks

                if(params.year !== undefined && !isNaN(parseInt(params.year)) && 
                    params.year < lastYear && params.year > firstYear){
                    thisYear = params.year;
                yearIndex = thisYear - firstYear;
            }

                avb.navbar.enableYears();
                section = params.section;

                setMode(params.mode);

                loadData();
            }

            function setMode(mode) {
                var container = $('#avb-wrap'),
                table = $('#table-template'),
                treemap = $('#treemap-template');

                // initialize code
                if(mode && mode === 't') {
                    avb.navigation = avb.table;
                    container.html(Mustache.render(table.html()));
                    mode = 't';
                } else {
                    avb.navigation = avb.treemap;
                    container.html(Mustache.render(treemap.html()));
                    mode = 'tm';
                }
                console.log(mode);
            }

            function switchMode(mode) {
                setMode(mode);
                loadData();
            }

            function loadData(){
                if(root) {
                    onjsonload(root);
                } else {
                    d3.json("/data/" + section + ".json", onjsonload);
                }
            }

            function changeyear(year){
                if(year === thisYear) return;
                currentSelection = root;
                pushUrl(section,year,root.hash);
                thisYear = year;
                yearIndex = thisYear - firstYear;
                avb.navigation.update(root);
                avb.navigation.open(root.hash);
            }

            function hexToRgb(hex) {
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r : parseInt(result[1], 16),
                    g : parseInt(result[2], 16),
                    b : parseInt(result[3], 16)
                } : null;
            }

            function mixrgb(rgb1, rgb2, p) {
                return { r : Math.round(p*rgb1.r + (1-p)*rgb2.r), 
                 g : Math.round(p*rgb1.g + (1-p)*rgb2.g), 
                 b : Math.round(p*rgb1.b + (1-p)*rgb2.b)  };
             }

             function shadeColor(color, percent) {   
                var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, B = (num >> 8 & 0x00FF) + amt, G = (num & 0x0000FF) + amt;
                return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
            }

            function translate(obj,x,y) {
                obj.attr("transform", "translate(" + (x).toString() +"," + (y).toString() + ")");
            }

            function rotate(obj,degrees) {
                obj.attr("transform","rotate(" + degrees.toString() + " 100 100)");
            }


            $.fn.center = function () {
                this.css("margin-top", Math.max(0, $(this).parent().height() - $(this).outerHeight())/2);
                return this;
            }

            $.fn.availableHeight = function() {
                var available = $(this).height();
                $(this).children().each(function(){
                    available -= $(this).outerHeight();
                })
                return Math.max(0, availableHeight);
            }

            $.fn.textfill = function(maxFontSize, targetWidth) {
                var fontSize = 10;
                $(this).css({ 'font-size' : fontSize });
                while(($(this).width() < targetWidth) && (fontSize < maxFontSize)){
                    fontSize += 1;
                    $(this).css({ 'font-size' : fontSize });
                }
                $(this).css({ 'font-size' : fontSize-1 });

            };

        // Back button action
        window.onpopstate = popUrl;

        // Feedback button
        var fby = fby || [];
        (function () {
            var f = document.createElement('script'); f.type = 'text/javascript'; f.async = true;
            f.src = '//cdn.feedbackify.com/f.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(f, s);
        })();