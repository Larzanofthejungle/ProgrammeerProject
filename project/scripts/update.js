/*
  Lars Overwater
  10800077
  ProgrammeerProject
*/

function updatePlaceData()
{
    // groups the festvaldata by placename
    placedata = d3.nest()
        .key(function(d) { return d.place; })
        .entries(festivaldata);

    // links placename to province, latitude and longitude
    placedata = placedata.map(function(d) {
        return {
            place: d.key,
            festivals: d.values.map(function(a) { return {name: a.name, camping: a.camping, duration: a.duration, sold_out: a.sold_out};}),
            province: places.filter(x => x.place === d.key)[0].province,
            lat: places.filter(x => x.place === d.key)[0].lat,
            long: places.filter(x => x.place === d.key)[0].long
        };
    });

    // sorts the data on amount of festivals in descending order
    placedata = placedata.sort(function(x, y){
        return d3.descending(x.festivals.length, y.festivals.length);
    });
}

function updateBarData()
{
    if (barSelection == "months"){

        // if the barselection is months the bardata returns amount of festivals per month
        bardata = d3.values(festivals_total[year])[0].map(function(d) { return {
                month: d3.keys(d)[0],
                festivals: d3.values(d)[0].length
            };
        });
    }

    if (barSelection == "provinces")
    {
        // if the barselection is provinces the data is grouped by province
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

  // if a bar isn't selected it groups the data by selected category
  if (!festSelected) {

      piedata = d3.nest()
          .key(function(d) { return d[pieSelection]; })
          .entries(festivaldata);
  }

  else {
        if (barSelection == "months"){

            // groups festivals_total by selected category from only a certain month
            piedata = d3.nest()
                .key(function(d) { return d[pieSelection]; })
                .entries(festivals_total[year][current_year][festSelection][festSelection]);
        }
        else {

            // groups placedata by province
            piedata = d3.nest()
                .key(function(d) { return d.province; })
                .entries(placedata);

            // selects only data of selected province
            piedata = piedata.filter(x => x.key === festSelection)[0].values

            // makes a dataset containing only festival objects
            var piegood = [];
            for (var i = 0; i < piedata.length; i = i + 1) {
                piegood = piegood.concat(piedata[i].festivals);
            };

            // groups the data by selected category
            piedata = d3.nest()
                .key(function(d) { return d[pieSelection]; })
                .entries(piegood);
        }
    }

    // maps category and amount of festivals of piedata
    piedata = piedata.map(function(d) {
        return {
            category: d.key,
            amount: d.values.length
        };
    });

    // sorts categories alpabetically
    piedata = piedata.sort(function(x, y){
        return d3.ascending(x.category[0], y.category[0]);
    });

}

function updateData()
{
    // gets all festivals of a certain year
    festivaldata = [];
    for (var i = 0; i < 12; i = i + 1) {
        festivaldata = festivaldata.concat(festivals_total[year][current_year][i][i]);
    };

    updatePlaceData();
    updateBarData();
    updatePieData();

}
