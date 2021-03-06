/*
  Lars Overwater
  10800077
  ProgrammeerProject
*/

// changes longitude and latitude values to x and y values on the map
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

// places all places with festivals on the map
function placeFestivals()
{
    // removes all old circles
    d3.selectAll("svg#circles").remove();

    // appends new svg element
    var circle = d3.select("svg").append("svg").attr("id", "circles")

    // scale for the circle size
    var circlescale = d3.scale.linear().range([5, 150])
    		.domain([1, 250])

    // places all circles
    circle.selectAll("g")
    		.data(placedata)
    	.enter()
    		.append("circle")
    		.attr("id", "circle")
    		.attr("r", function(d) {return circlescale(d.festivals.length);})
    		.attr("cx", function(d) {return convertGeoToPixel(d.lat, d.long).x;})
    		.attr("cy", function(d) {return convertGeoToPixel(d.lat, d.long).y;})

        // shows list of the names of all festivals on click
        .on("click", function(d) {
            hidefesttip = false;
            var festivalhtml = "Festivals in " + d.place + " in " + current_year + ":<br/>";
            for(var i = 0; i < d.festivals.length; i++) {
                festivalhtml += "<br/>" + d.festivals[i].name ;
            }

            // shows the festivaltip
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

            // scales the festivaltip if the list of names to max 300px
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

        // shows tooltip with place and amount on mouseover
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d.place + "<br/> Festivals:" + d.festivals.length)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 50) + "px");
        })

        // sets tooltip to the background on mouseout
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
}
