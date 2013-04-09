if (typeof(Number.prototype.toRad) === "undefined") {
	Number.prototype.toRad = function() {
		return this * Math.PI / 180;
	}
}

var get_dist = function(lat1, lon1, lat2, lon2) {
		var R = 6371; // km
		var dLat = (lat2-lat1).toRad();
		var dLon = (lon2-lon1).toRad();

		var lat1 = (lat1).toRad();
		var lat2 = (lat2).toRad();

		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c;
		return d;
	}

	var data_process = function (data) {

		var conv = data.map(function(d) {
			return {
				time : new Date(d.time),
				lat : parseFloat(d.lat),
				lon : parseFloat(d.lon),
				speed : 0,
				homed : 0
			}
		})
		for(var i=1; i < conv.length; i++) {

			var d = get_dist(conv[i-1].lat, conv[i-1].lon, conv[i].lat, conv[i].lon);
			var timegap = (conv[i].time.getTime() - conv[i-1].time.getTime())/1000;
			var homelat = -71.0639403;
			var homelon = 42.4307174;
			conv[i].homed = get_dist(homelat, homelon, conv[i].lat, conv[i].lon);
			conv[i].speed = d/(timegap/3600);
		}
		draw(conv);
	};

	function draw(data) {

		var svgw =5000;
		var svgh = 1000;

		var mysvg = d3.select("body").append("svg")
		.attr("id","graph")
		.attr("width", svgw)
		.attr("height", svgh);

		var xscale = d3.scale.linear()
		.domain(d3.extent(data, function(d) { return d.homed }))
		//.domain([0,1000])
		.range([20, svgw - 20]);

		console.log(xscale.domain());

		var colorscale = d3.scale.linear()
		.domain([0,200])
		.range([0,255]);

		var yscale = d3.scale.linear()
		.domain([0,70])
		.range([0,svgh - 100]);

		var cgroup = mysvg.append("svg:g")
		.attr("transform","translate(0," + (20).toString() + ")");

		cgroup.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", 
			function (d) {
				return xscale(d.homed);
			})
		.attr("cy",0)
		.attr("r", 2);


		var lines = [];
		for(var i=1; i < data.length; i++){
			var newline = []
			if ((data[i-1].homed - data[i].homed) == 0) continue;
			newline.push({
				"x" : xscale(data[i-1].homed),
				"y" : 0
			});
			newline.push({
				"x" : 0,
				"y" : yscale(Math.abs(data[i-1].homed - data[i].homed)/2)
			});
			newline.push({
				"x" : xscale(data[i].homed),
				"y" : 0
			});


			if(newline[0].x < newline[2].x) {
				newline[1].x = newline[0].x + (newline[2].x - newline[0].x)/2;
			} else {
				newline[1].x = newline[2].x + (newline[0].x - newline[2].x)/2;
			}
			newline.color = Math.round(colorscale(data[i].speed));

			lines.push(newline);
		};
		
		var lineFunction = d3.svg.line()
							.x(function(d) { return d.x; })
							.y(function(d) { return d.y; })
							.interpolate("basis");


		for (var i=0; i<lines.length; i++) {
			var color = "rgb( " + (lines[i].color).toString() + ",0," + (255 -lines[i].color).toString() + ")";
			cgroup.append("svg:path")
			.attr("d", lineFunction(lines[i]))
			.style("stroke", color) 
			.style("fill", "none");
		}

	};

	var data_parse = function (filename) {
		d3.csv(filename, function(d) {
			data_process(d);
		});
	};

	function init() {
		console.log("hello");
		data_parse("converted2.csv");

	}