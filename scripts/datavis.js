d3.xml('nederland.svg', 'image/svg+xml', function(error, xml) {
	if (error) throw error;
	document.getElementById('map').appendChild(xml.documentElement);
});

var x = d3.scale.linear().range([0, map.width]).domain([3.359403, 7.227496]);

var y = d3.scale.linear().range([map.height, 0]).domain([50.750938, 53.560406]);

var projection = d3.geo.projection(function(long, lat) {
  return [
    long,
    Math.log(Math.tan(Math.PI / 4 + lat / 2))
  ];
});

d3.select("svg")
	.data(places)
	.enter()
	.append("circle")
	.attr("r",5)
	.attr("transform", function(d) {return "translate(" + projection([d.long,d.lat]) + ")";});

console.log(map)
console.log(festivals_total)
console.log(places)
