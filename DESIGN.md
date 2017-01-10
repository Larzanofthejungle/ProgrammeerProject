# Design

## Benodigde Datasets

* Festivals per jaar in Nederland (festivalinfo.nl)
  * Naam
  * Plaatsnaam
  * Duur Festival
* Achtergrondinformatie festival (waarschijnlijk ook mogelijk via festivalinfo.nl)
  * Korte omschrijving
  * Muzieksoort
  * Hoofd-acts
* Lijst van Nederlandse plaatsnamen gekoppeld aan coordinaten
* Ticketprijs van ieder festival over meerdere jaren (optioneel)
* Bezoekersaantal van ieder festival over meerdere jaren (optioneel)

## Scrapen

Voor het scrapen van de festivalinfo zullen de volgende plugins nodig zijn:
* URL en DOM van patternweb voor het scrapen van de data
* json voor een nette output van de gescrapete data

## Data Visualisatie

* D3 plugin
  * Slider (d3-drag) (https://gist.github.com/mbostock/6452972)
  * Play button (http://bl.ocks.org/darrenjaworski/5544599) en misschien (http://bl.ocks.org/mbostock/3081153)
  * Cirkeldiagram (https://bl.ocks.org/mbostock/3887235) of (https://bl.ocks.org/cflavs/ff1c6005fd7edad32641)
  * Staafdiagram (https://bl.ocks.org/mbostock/3885304)
  * Tooltip met extra info (http://bl.ocks.org/Caged/6476579)
* SVG Map van Nederland (http://bl.ocks.org/phil-pedruco/9344373)
  * Manier nodig om coordinaten om te zetten naar een positie op de map. (Hopelijk gemakkelijk te doen met d3 scale)
