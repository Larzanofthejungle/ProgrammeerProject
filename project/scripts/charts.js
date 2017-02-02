/*
  Lars Overwater
  10800077
  ProgrammeerProject
*/

function makeBarChart()
{
    // deletes old barchart
    d3.select("svg#barchart").selectAll("g").remove();

    // sets margins, width and height for barchart
    var margin = {top: 20, right: 0, bottom: 50, left: 50},
    		width = 800 - margin.left - margin.right,
    		height = 375 - margin.top - margin.bottom,
    		barMargin = 5,
        x, xAxis = null;

    // initializes x time scale and x axis if months are selected
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

    // initializes x ordinal scale and x axis if provinces are selected
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

    // initializes y linear scale and y axis
    var y = d3.scale.linear().range([height, 0])
    		.domain([0, d3.max(bardata, function(d) { return d.festivals; })])
    var yAxis = d3.svg.axis()
    		.scale(y)
    		.orient("left");

    // selects svg element for barchart
    var barchart = d3.select("svg#barchart")
    	.append("g")
    		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var barWidth = width / bardata.length;

    // appends x axis
    barchart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .selectAll(".tick text")
        .style("text-anchor", "start")
        .attr("x", 6)
        .attr("y", 6);

    // appends y axis
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

            // shows tooltip with month and amount on mouseover
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(months[d.month] + "<br/> Festivals:" + d.festivals)
                    .style("left", (d3.event.pageX - 50) + "px")
                    .style("top", (d3.event.pageY - 50) + "px");
            })

            // hides tooltip
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })

            // updates piechart on click
            .on("click", function(d) {

                // deselects bar if bar is clicked twice
                if ((festSelected) && (festSelection == d.month)){
                    d3.select(this).style("stroke-width", "0px");
                    festSelected = false;
                    updateData();
                    makePieChart();
                }

                // selects new bar
                else {

                    // sets prev_sel border to 0px
                    if (prev_sel != null)
                    {
                        prev_sel.style("stroke-width", "0px");
                    }

                    // gives new bar a border
                    d3.select(this).style("stroke-width", "3px");

                    // updates piechart
                    prev_sel = d3.select(this);
                    festSelected = true;
                    festSelection = d.month;
                    updatePieData();
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

            // shows tooltip with province and amount on mouseover
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(d.province + "<br/> Festivals:" + d.festivals)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 50) + "px");
            })

            // hides tooltip
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })

            // updates piechart on click
            .on("click", function(d) {

                // deselects bar if bar is clicked twice
                if ((festSelected) && (festSelection == d.province)){
                    d3.select(this).style("stroke-width", "0px");
                    festSelected = false;
                    updatePieData();
                    makePieChart();
                }

                // selects new bar
                else {

                    // sets prev_sel border to 0px
                    if (prev_sel != null)
                    {
                        prev_sel.style("stroke-width", "0px");
                    }

                    // gives new bar a border
                    d3.select(this).style("stroke-width", "3px");

                    // updates piechart
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
    // deletes old piechart
    d3.select("svg#piechart").selectAll("g").remove();

    // initializes parts of piechart
    var width = 255,
        height = 250,
        radius = Math.min(width, height) / 2,
        legendRectSize = 18,
        legendSpacing = 4;
    var color = d3.scale.ordinal()
        .range(["#238b45", "#41ae76", "#66c2a4", "#99d8c9"]);
    var arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(75);
    var labelArc = d3.svg.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);
    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.amount; });
    var piechart = d3.select("svg#piechart")
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // appends all arcs of the piechart
    var arcs = piechart.selectAll(".arc")
        .data(pie(piedata))
        .enter()
      .append("g")
        .attr("class", "arc");
    arcs.append("path")
        .attr("class", function(d) { return d.category; })
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.category); })

        // shows tooltip on mouseover with category and amount
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d.data.category + "<br/> Festivals:" + d.data.amount)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 50) + "px");
        })

        // hides tooltip
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // appends legend for every category
    var legend = piechart.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height * color.domain().length / 2;
            var horz = -2 * legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });
    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color);
    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function(d) { return d; });
}
