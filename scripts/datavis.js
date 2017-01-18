d3.xml('nederland.svg', 'image/svg+xml', function(error, xml) {
	if (error) throw error;
	document.getElementById('map').appendChild(xml.documentElement);
});

// https://github.com/wbkd/d3-extended
d3.selection.prototype.moveToFront = function() {
	return this.each(function(){
		this.parentNode.appendChild(this);
	});
};
d3.selection.prototype.moveToBack = function() {
		return this.each(function() {
				var firstChild = this.parentNode.firstChild;
				if (firstChild) {
						this.parentNode.insertBefore(this, firstChild);
				}
		});
};

var g = d3.select("svg").append("svg").attr("id", "circles")

var mapWidth = 612;
var mapHeight = 724;

var mapLonLeft = 3.359403;
var mapLonRight = 7.227496;
var mapLonDelta = mapLonRight - mapLonLeft;

var mapLatBottom = 50.750938;
var mapLatBottomDegree = mapLatBottom * Math.PI / 180;

// http://stackoverflow.com/questions/2103924/mercator-longitude-and-latitude-calculations-to-x-and-y-on-a-cropped-map-of-the

function convertGeoToPixel(latitude, longitude)
{
    var x = (longitude - mapLonLeft) * (mapWidth / mapLonDelta);

    latitude = latitude * Math.PI / 180;
    var worldMapWidth = ((mapWidth / mapLonDelta) * 360) / (2 * Math.PI);
    var mapOffsetY = (worldMapWidth / 2 * Math.log((1 + Math.sin(mapLatBottomDegree)) / (1 - Math.sin(mapLatBottomDegree))));
    var y = mapHeight - ((worldMapWidth / 2 * Math.log((1 + Math.sin(latitude)) / (1 - Math.sin(latitude)))) - mapOffsetY);

    return { "x": x , "y": y};
}

g.selectAll("g")
		.data(places)
	.enter()
		.append("circle")
		.attr("id", function(d) {return d.place;})
		.attr("r",2)
		.attr("cx", function(d) {return convertGeoToPixel(d.lat,d.long).x;})
		.attr("cy", function(d) {return convertGeoToPixel(d.lat,d.long).y;});

d3.select("svg#svg").moveToBack()
d3.selectAll("circle").moveToFront()

var margin = {top: 20, right: 0, bottom: 130, left: 50},
		width = 650 - margin.left - margin.right,
		height = 375 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
		.rangeRoundBands([0, width]);

var y = d3.scale.linear()
		.range([height, 0]);

var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

var chart = d3.select(".chart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var year = "2000";

console.log(festivals_total);
console.log(festivals_total[0]);
console.log(d3.keys(festivals_total));
console.log(d3.keys(festivals_total[0]));
console.log(d3.values(festivals_total));
console.log(d3.values(festivals_total[0]));
console.log(d3.entries(festivals_total));
console.log(d3.entries(festivals_total[0]));



var barWidth = width / data.length;

chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
	.selectAll("text")
		.attr("y", 0)
		.attr("x", -10)
		.attr("dy", ".35em")
		.attr("transform", "rotate(270)")
		.style("text-anchor", "end");

chart.append("g")
		.attr("class", "y axis")
		.call(yAxis);

chart.selectAll(".bar")
		.data(data)
	.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { return x(d.state); })
		.attr("y", function(d) { return y(d.murder); })
		.attr("height", function(d) { return height - y(d.murder); })
		.attr("width", x.rangeBand());
