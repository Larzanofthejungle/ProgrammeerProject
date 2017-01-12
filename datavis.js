d3.xml('nederland.svg', 'image/svg+xml', function(error, xml) {
	if (error) throw error;
	document.getElementById('map').appendChild(xml.documentElement);
});

console.log(festivals_total)
