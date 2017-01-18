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

var current_year = 2000;
var year = current_year - 2000;

var festivaldata = [];

for (var i = 0; i < 12; i = i + 1) {
		festivaldata = festivaldata.concat(festivals_total[year][current_year][i][i]);
};

console.log(festivaldata)

bardata = d3.values(festivals_total[year])[0].map(function(d) { return {
			  month: d3.keys(d)[0],
				festivals: d3.values(d)[0].length
		};
});

var margin = {top: 20, right: 0, bottom: 50, left: 50},
		width = 800 - margin.left - margin.right,
		height = 375 - margin.top - margin.bottom,
		barMargin = 5;

var x = d3.time.scale()
    .domain([new Date(2012, 0, 1), new Date(2012, 11, 31)])
    .range([0, width]);

var y = d3.scale.linear().range([height, 0])
		.domain([0, d3.max(bardata, function(d) { return d.festivals; })])

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(d3.time.months)
    .tickSize(14, 0)
    .tickFormat(d3.time.format("%B"));

var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

var barchart = d3.select("svg#barchart")
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var barWidth = width / bardata.length;

barchart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .selectAll(".tick text")
    .style("text-anchor", "start")
    .attr("x", 6)
    .attr("y", 6);

barchart.append("g")
		.attr("class", "y axis")
		.call(yAxis);

barchart.selectAll(".bar")
		.data(bardata)
	.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { return x(new Date(2012, d.month, 1)) + barMargin; })
		.attr("y", function(d) { return y(d.festivals); })
		.attr("height", function(d) { return height - y(d.festivals); })
		.attr("width", barWidth - (2 * barMargin));
