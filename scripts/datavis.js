var current_year = 2000;
var year = current_year - 2000;
var festivaldata, placedata, bardata, piedata = [];
var barSelection = "months";
var pieSelection = "duration";
var hidefesttip = true;
var festtipheight = null;
var festSelected = false;
var festSelection = null;
var prev_sel = null;

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
        return {
            place: d.key,
            festivals: d.values.map(function(a) { return {name: a.name, camping: a.camping, duration: a.duration, sold_out: a.sold_out};}),
            province: places.filter(x => x.place === d.key)[0].province,
            lat: places.filter(x => x.place === d.key)[0].lat,
            long: places.filter(x => x.place === d.key)[0].long
        };

    });

    placedata = placedata.sort(function(x, y){
        return d3.descending(x.festivals.length, y.festivals.length);
    });

    if (barSelection == "months"){
        bardata = d3.values(festivals_total[year])[0].map(function(d) { return {
        			  month: d3.keys(d)[0],
        				festivals: d3.values(d)[0].length
        		};
        });
    }

    if (barSelection == "provinces")
    {
        bardata = d3.nest()
            .key(function(d) { return d.province; })
            .rollup(function(v) { return d3.sum(v, function(d) { return d.festivals.length; }); })
            .entries(placedata);

        bardata = bardata.map(function(d) {
            return {
                province: d.key,
                festivals: d.values
            };
        });
    }

    if (!festSelected) {

        piedata = d3.nest()
            .key(function(d) { return d[pieSelection]; })
            .entries(festivaldata);

    }

    else {
        if (!isNaN(festSelection)){

            piedata = d3.nest()
                .key(function(d) { return d[pieSelection]; })
                .entries(festivals_total[year][current_year][festSelection][festSelection]);

        }
        else {

            console.log(placedata);
            console.log(festSelection);

            piedata = d3.nest()
                .key(function(d) { return d.province; })
                .entries(placedata);

            piedata = piedata.filter(x => x.key === festSelection)[0].values

            console.log(piedata);

            var piegood = [];

            for (var i = 0; i < piedata.length; i = i + 1) {
                piegood = piegood.concat(piedata[i].festivals);
            };

            console.log(piegood);

            piedata = d3.nest()
                .key(function(d) { return d[pieSelection]; })
                .entries(piegood);

            console.log(piedata);
        }
    }



    piedata = piedata.map(function(d) {
    		return {
    			  category: d.key,
    				amount: d.values.length
    		};
    });

    piedata = piedata.sort(function(x, y){
        return d3.ascending(x.category[0], y.category[0]);
    });

}

function placeFestivals()
{
    // verwijdert de oude piechart
    d3.selectAll("svg#circles").remove();

    var circle = d3.select("svg").append("svg").attr("id", "circles")

    var circlescale = d3.scale.linear().range([5, 150])
    		.domain([1, 250])

    circle.selectAll("g")
    		.data(placedata)
    	.enter()
    		.append("circle")
    		.attr("id", "circle")
    		.attr("r", function(d) {return circlescale(d.festivals.length);})
    		.attr("cx", function(d) {return convertGeoToPixel(d.lat, d.long).x;})
    		.attr("cy", function(d) {return convertGeoToPixel(d.lat, d.long).y;})
        .on("click", function(d) {
            hidefesttip = false;
            var festivalhtml = "Festivals in " + d.place + " in " + current_year + ":<br/>";
            for(var i = 0; i < d.festivals.length; i++) {
                festivalhtml += "<br/>" + d.festivals[i].name ;
            }

            festivaltip.transition()
                .duration(400)
                .style("opacity", .9)
                .style("z-index", 1)
                .style("height", function(a) {
                    if (((d.festivals.length * 16) + 32)>= 300){
                        festtipheight = 300;
                        return "300px";
                    }
                    else {
                        festtipheight = ((d.festivals.length * 16) + 32);
                    };
                    return festtipheight + "px"
                });
            festivaltip.html(festivalhtml)
                .style("left", (d3.event.pageX) + "px")
                .style("top", function(a) {
                    if ((d3.event.pageY -50) >= 550){
                        return (d3.event.pageY - festtipheight + 50)  + "px";
                    }
                    else {
                        return ((d3.event.pageY) + "px");
                    };
                });
        })
        .on("mouseover", function(d) {
            placetip.transition()
                .duration(200)
                .style("opacity", .9);
            placetip.html(d.place + "<br/> Festivals:" + d.festivals.length)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 50) + "px");
        })
        .on("mouseout", function(d) {
            placetip.transition()
                .duration(500)
                .style("opacity", 0);
        });
}

function makeBarChart()
{
    d3.select("svg#barchart").selectAll("g").remove();

    var margin = {top: 20, right: 0, bottom: 50, left: 50},
    		width = 800 - margin.left - margin.right,
    		height = 375 - margin.top - margin.bottom,
    		barMargin = 5
        provinces = ["Drenthe", "Flevoland", "Friesland", "Gelderland", "Groningen", "Limburg", "Noord-Brabant", "Noord-Holland", "Overijssel", "Utrecht", "Zeeland", "Zuid-Holland", null];

    var x = null;
    var xAxis = null;

    if (barSelection == "months"){
        x = d3.time.scale()
            .domain([new Date(2012, 0, 1), new Date(2012, 11, 31)])
            .range([0, width]);

        xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(d3.time.months)
            .tickSize(14, 0)
            .tickFormat(d3.time.format("%B"));
    }

    if (barSelection == "provinces"){
        x = d3.scale.ordinal()
            .domain(provinces)
            .rangePoints([0, width]);

        xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(places)
            .tickSize(14, 0);

    }

    var y = d3.scale.linear().range([height, 0])
    		.domain([0, d3.max(bardata, function(d) { return d.festivals; })])

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


    if (barSelection == "months"){
        barchart.selectAll(".bar")
            .data(bardata)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(new Date(2012, d.month, 1)) + barMargin; })
            .attr("y", function(d) { return y(d.festivals); })
            .attr("height", function(d) { return height - y(d.festivals); })
            .attr("width", barWidth - (2 * barMargin))
            .on("click", function(d) {
                if ((festSelected) && (festSelection == d.month)){
                    d3.select(this).style("stroke-width", "0px");
                    festSelected = false;
                    updateData();
                    makePieChart();
                } else {
                    if (prev_sel != null)
                    {
                        prev_sel.style("stroke-width", "0px");
                    }
                    d3.select(this).style("stroke-width", "3px");
                    prev_sel = d3.select(this);
                    festSelected = true;
                    festSelection = d.month;
                    updateData();
                    makePieChart();
                }
            });
    }

    if (barSelection == "provinces"){
        barchart.selectAll(".bar")
        		.data(bardata)
        	.enter().append("rect")
        		.attr("class", "bar")
        		.attr("x", function(d) { return x(d.province) + barMargin; })
        		.attr("y", function(d) { return y(d.festivals); })
        		.attr("height", function(d) { return height - y(d.festivals); })
        		.attr("width", barWidth - (2 * barMargin))
            .on("click", function(d) {
                if ((festSelected) && (festSelection == d.province)){
                    d3.select(this).style("stroke-width", "0px");
                    festSelected = false;
                    updateData();
                    makePieChart();
                } else {
                    if (prev_sel != null)
                    {
                        prev_sel.style("stroke-width", "0px");
                    }
                    d3.select(this).style("stroke-width", "3px");
                    prev_sel = d3.select(this);
                    festSelected = true;
                    festSelection = d.province;
                    updateData();
                    makePieChart();
                }
            });
    }


}

function makePieChart()
{

    d3.select("svg#piechart").selectAll("g").remove();

    // maakt nieuwe piechart aan
    var width = 400,
        height = 275,
        radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(50);

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
        .attr("class", function(d) { return d.category; })
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.category); });

    arcs.append("text")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.data.category; });
}

var slider = d3.slider().min(2000).max(2016)
    .tickValues([2000,2004,2008,2012,2016])
    .stepValues([2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016])
    .tickFormat(d3.format('d'))
    .callback(function(evt) {
        if (self.slider.value() != current_year) {
          current_year = self.slider.value();
          year = current_year - 2000;
          festSelected = false;
          updateData();
          placeFestivals();
          makeBarChart();
          makePieChart();
        }
    });

d3.select('#slider').call(slider);

var barRad = document.barSortForm.barSortRad;
var barPrev = "months";
for(var i = 0; i < barRad.length; i++) {
    barRad[i].onclick = function() {
        if(this !== barPrev) {
            barPrev = this;
            barSelection = this.value;
            updateData();
            makeBarChart();
        }
    };
}

var pieRad = document.pieCatForm.pieCatRad;
var piePrev = "duration";
for(var i = 0; i < pieRad.length; i++) {
    pieRad[i].onclick = function() {
        if(this !== piePrev) {
            piePrev = this;
            pieSelection = this.value;
            updateData();
            makePieChart();
        }

    };
}

var placetip = d3.select("body").append("div")
    .attr("id", "placetip")
    .attr("class", "tooltip")
    .style("opacity", 0);

var festivaltip = d3.select("body").append("div")
    .attr("id", "festivaltip")
    .attr("class", "tooltip")
    .style("opacity", 0);

var pietip = d3.select("body").append("div")
    .attr("id", "pietip")
    .attr("class", "tooltip")
    .style("opacity", 0);

document.body.addEventListener('click', function(){
  if (hidefesttip == false) {
      hidefesttip = true;
  }
  else {
      festivaltip.transition()
          .duration(500)
          .style("opacity", 0)
          .style("z-index", -1);
  }

});

updateData();
placeFestivals();
makeBarChart();
makePieChart();

document.getElementById('festivaltip').addEventListener('click', function(e){
  e.stopPropagation();
});
