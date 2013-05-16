            var firstYear = 2008,
                lastYear = 2018,
                currentYear = 2013, // only used for projections
                thisYear = 2013,
                yearIndex = thisYear - firstYear;

            var section;
            var root;
            var currentSelection = new Object();

            Number.prototype.px=function()
            {
                return this.toString() + "px";
            };

            function pushUrl(section, year, node){
                log("push url")
                var url = '/' + section + '/' + thisYear + '/' + node;
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
                avb.chart.initialize('#chart');
                avb.chart.initializeSwitch();
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

            function initialize(params) {
                // year checks
                if(params.year !== undefined && !isNaN(parseInt(params.year)) && 
                    params.year < lastYear && params.year > firstYear){
                        thisYear = params.year;
                        yearIndex = thisYear - firstYear;
                }

                avb.navbar.enableYears();
                d3.selectAll("svg").remove();

                home = false;
                section = params.section;
                d3.json("/data/" + params.section + ".json", onjsonload);
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
            log($(this).text());
            var fontSize = 10;
            $(this).css({ 'font-size' : fontSize });
            while(($(this).width() < targetWidth) && (fontSize < maxFontSize)){
                fontSize += 1;
                $(this).css({ 'font-size' : fontSize });
            }
            $(this).css({ 'font-size' : fontSize-1 });

        };

        // Resize action
        $(window).resize(function() {});

        // Back button action
        window.onpopstate = popUrl;

        // Feedback button
        var fby = fby || [];
        (function () {
            var f = document.createElement('script'); f.type = 'text/javascript'; f.async = true;
            f.src = '//cdn.feedbackify.com/f.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(f, s);
        })();