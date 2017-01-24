var current_year = 2000;
var year = current_year - 2000;
var festivaldata, placedata, bardata, piedata = [];


// http://stackoverflow.com/questions/2103924/mercator-longitude-and-latitude-calculations-to-x-and-y-on-a-cropped-map-of-the
function convertGeoToPixel(latitude, longitude)
{
    var mapWidth = 612;
    var mapHeight = 724;

    var mapLonLeft = 3.359403;
    var mapLonRight = 7.227496;
    var mapLonDelta = mapLonRight - mapLonLeft;

    var mapLatBottom = 50.750938;
    var mapLatBottomDegree = mapLatBottom * Math.PI / 180;

    var x = (longitude - mapLonLeft) * (mapWidth / mapLonDelta);

    latitude = latitude * Math.PI / 180;
    var worldMapWidth = ((mapWidth / mapLonDelta) * 360) / (2 * Math.PI);
    var mapOffsetY = (worldMapWidth / 2 * Math.log((1 + Math.sin(mapLatBottomDegree)) / (1 - Math.sin(mapLatBottomDegree))));
    var y = mapHeight - ((worldMapWidth / 2 * Math.log((1 + Math.sin(latitude)) / (1 - Math.sin(latitude)))) - mapOffsetY);

    return { "x": x , "y": y};
}

function updateData()
{
    festivaldata = [];

    for (var i = 0; i < 12; i = i + 1) {
        festivaldata = festivaldata.concat(festivals_total[year][current_year][i][i]);
    };

    placedata = d3.nest()
        .key(function(d) { return d.place; })
        .entries(festivaldata);

    placedata = placedata.map(function(d) {
        if (places.filter(x => x.place === d.key)[0] == undefined) {
            console.log(d.key)
        };
        return {
            place: d.key,
            festivals: d.values.map(function(a) { return {name: a.name};}),
            lat: places.filter(x => x.place === d.key)[0].lat,
            long: places.filter(x => x.place === d.key)[0].long
        };

    });

    bardata = d3.values(festivals_total[year])[0].map(function(d) { return {
    			  month: d3.keys(d)[0],
    				festivals: d3.values(d)[0].length
    		};
    });

    piedata = d3.nest()
    		.key(function(d) { return d.duration; })
    		.entries(festivaldata);

    piedata = piedata.map(function(d) {
    		return {
    			  duration: d.key,
    				amount: d.values.length
    		};
    });
}

function placeFestivals()
{
    // verwijdert de oude piechart
    d3.selectAll("svg#circles").remove();

    var g = d3.select("svg").append("svg").attr("id", "circles")

    g.selectAll("g")
    		.data(placedata)
    	.enter()
    		.append("circle")
    		.attr("id", "circle")
    		.attr("r", function(d) {return d.festivals.length;})
    		.attr("cx", function(d) {return convertGeoToPixel(d.lat, d.long).x;})
    		.attr("cy", function(d) {return convertGeoToPixel(d.lat, d.long).y;});
}

function makeBarChart()
{
    console.log(bardata)

    d3.select("svg#barchart").selectAll("g").remove();

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

}

function makePieChart()
{

    d3.select("svg#piechart").selectAll("g").remove();

    // maakt nieuwe piechart aan
    var width = 400,
        height = 275,
        radius = Math.min(width, height) / 2;

    var arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(0);

    var labelArc = d3.svg.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.amount; });

    var piechart = d3.select("svg#piechart")
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var arcs = piechart.selectAll(".arc")
        .data(pie(piedata))
        .enter()
      .append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("class", function(d) { return d.duration; })
        .attr("d", arc)

    arcs.append("text")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.duration; });
}

var slider = d3.slider().min(2000).max(2016)
    .tickValues([2000,2004,2008,2012,2016])
    .stepValues([2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016])
    .callback(function(evt) {
        if (self.slider.value() != current_year) {
          current_year = self.slider.value();
          year = current_year - 2000;
          updateData();
          placeFestivals();
          makeBarChart();
          makePieChart();
          console.log(self.slider.value());
        }
    });

d3.select('#slider').call(slider);

updateData();
placeFestivals();
makeBarChart();
makePieChart();
