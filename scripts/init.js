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
var provinces = ["Drenthe", "Flevoland", "Friesland", "Gelderland", "Groningen", "Limburg", "N-Brabant", "N-Holland", "Overijssel", "Utrecht", "Zeeland", "Z-Holland", null];
var months =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var slider = null;
var barRad = document.barSortForm.barSortRad;
var barPrev = "months";
var pieRad = document.pieCatForm.pieCatRad;
var piePrev = "duration";
var tooltip, festivaltip = null;
var infobtn, infotip = null;

function makeSlider(){

    slider = d3.slider().min(2000).max(2016)
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
              festivaltip.transition()
                  .duration(500)
                  .style("opacity", 0)
                  .style("z-index", -1);
            }
        });

    d3.select('#slider').call(slider);

}

function initSelections(){

    for(var i = 0; i < barRad.length; i++) {
        barRad[i].onclick = function() {
            if(this !== barPrev) {
                barPrev = this;
                barSelection = this.value;
                updateBarData();
                makeBarChart();
            }
        };
    }

    for(var i = 0; i < pieRad.length; i++) {
        pieRad[i].onclick = function() {
            if(this !== piePrev) {
                piePrev = this;
                pieSelection = this.value;
                updatePieData();
                makePieChart();
            }

        };
    }
}

function initTooltips()
{
    tooltip = d3.select("body").append("div")
        .attr("id", "tooltip")
        .attr("class", "tooltip")
        .style("opacity", 0);

    festivaltip = d3.select("body").append("div")
        .attr("id", "festivaltip")
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

    document.getElementById('festivaltip').addEventListener('click', function(e){
        e.stopPropagation();
    });
}

function initInfo()
{

    infobtn = d3.select("body").append("button")
        .attr("id", "infobtn")
        .attr("style", "button")
        .text("i")
        .style("left", "50px")
        .style("top", "30px")
        .on('click', function(){
            infotip.transition()
            .duration(100)
            .style("opacity", 0.7)
            .style("z-index", 5);
        });

    infotip = d3.select("body").append("div")
        .attr("id", "infotip")
        .attr("class", "tooltip")
        .style("left", "10px")
        .style("top", "50px")
        .on('click', function(){
            infotip.transition()
            .duration(100)
            .style("opacity", 0)
            .style("z-index", -2);
        });

}

makeSlider();
initSelections();
initTooltips();
initInfo();
updateData();
placeFestivals();
makeBarChart();
makePieChart();
