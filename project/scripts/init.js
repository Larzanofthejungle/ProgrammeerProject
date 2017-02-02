/*
  Lars Overwater
  10800077
  ProgrammeerProject
*/

// initializes all variables
var current_year = 2000;
var year = current_year - 2000;
var festivaldata, placedata, bardata, piedata = [];
var barSelection = "months";
var barPrev = "months";
var pieSelection = "duration";
var piePrev = "duration";
var hidefesttip = true;
var festtipheight, festSelection, prev_sel, slider, tooltip, festivaltip, infobtn, infotip = null;
var festSelected = false;
var provinces = ["Drenthe", "Flevoland", "Friesland", "Gelderland", "Groningen", "Limburg", "N-Brabant", "N-Holland", "Overijssel", "Utrecht", "Zeeland", "Z-Holland", null];
var months =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var barRad = document.barSortForm.barSortRad;
var pieRad = document.pieCatForm.pieCatRad;

// initializes and places the slider
// https://github.com/sujeetsr/d3.slider
function makeSlider(){

    // initializes the slider
    slider = d3.slider().min(2000).max(2016)
        .tickValues([2000,2004,2008,2012,2016])
        .stepValues([2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016])
        .tickFormat(d3.format('d'))
        .callback(function(evt) {
            if (self.slider.value() != current_year) {

              // updates the year, festSelection and all data on slide
              current_year = self.slider.value();
              year = current_year - 2000;
              festSelected = false;
              festSelection = null;
              updateData();
              placeFestivals();
              makeBarChart();
              makePieChart();

              // sets the festivaltip to the background
              festivaltip.transition()
                  .duration(500)
                  .style("opacity", 0)
                  .style("z-index", -1);
            }
        });

    // sets the slider to the page
    d3.select('#slider').call(slider);
}

// initializes the interactivity of the radio buttons
function initSelections(){

    // gives every radiobutton an eventlistener
    for(var i = 0; i < barRad.length; i++) {
        barRad[i].onclick = function() {

            // if another radiobutton is selected it updates the data
            if(this !== barPrev) {
                barPrev = this;
                barSelection = this.value;
                updateBarData();
                makeBarChart();
            }
        };
    }

    // gives every radiobutton an eventlistener
    for(var i = 0; i < pieRad.length; i++) {
        pieRad[i].onclick = function() {

            // if another radiobutton is selected it updates the data
            if(this !== piePrev) {
                piePrev = this;
                pieSelection = this.value;
                updatePieData();
                makePieChart();
            }
        };
    }
}

// initializes the tooltips
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

    // if the body is clicked it sets the festivaltip to the background
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

    // if the festivaltip is clicked it won't be set to the background
    document.getElementById('festivaltip').addEventListener('click', function(e){
        e.stopPropagation();
    });
}

// initializes the infobutton
function initInfo()
{
    infobtn = d3.select("body").append("button")
        .attr("id", "infobtn")
        .attr("style", "button")
        .text("i")
        .style("left", "50px")
        .style("top", "30px")

        // if the infobutton is clicked it shows the infotip
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

        // if the infotip is clicked it sets the infotip to the background
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
