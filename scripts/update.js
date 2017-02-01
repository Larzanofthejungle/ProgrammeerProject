function updatePlaceData()
{
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
}

function updateBarData()
{
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
}

function updatePieData()
{
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

            piedata = d3.nest()
                .key(function(d) { return d.province; })
                .entries(placedata);

            piedata = piedata.filter(x => x.key === festSelection)[0].values

            var piegood = [];

            for (var i = 0; i < piedata.length; i = i + 1) {
                piegood = piegood.concat(piedata[i].festivals);
            };

            piedata = d3.nest()
                .key(function(d) { return d[pieSelection]; })
                .entries(piegood);
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

function updateData()
{
    festivaldata = [];

    for (var i = 0; i < 12; i = i + 1) {
        festivaldata = festivaldata.concat(festivals_total[year][current_year][i][i]);
    };

    updatePlaceData();
    updateBarData();
    updatePieData();

}
