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
* URL en DOM van patternweb voor het scrapen van de festivaldata

Voor het toevoegen van de data voor de coordinaten van plaatsen:
* csv voor het kunnen lezen en aanpassen van csv bestand


## Data Visualisatie

* D3 plugin
  * Slider (d3-slider) (https://github.com/sujeetsr/d3.slider)
  * Play button (http://bl.ocks.org/darrenjaworski/5544599) en misschien (http://bl.ocks.org/mbostock/3081153)
  * Cirkeldiagram (https://bl.ocks.org/mbostock/3887235) of (https://bl.ocks.org/cflavs/ff1c6005fd7edad32641)
  * Staafdiagram (https://bl.ocks.org/mbostock/3885304)
  * Tooltip met extra info (http://bl.ocks.org/Caged/6476579)
* SVG Map van Nederland (http://bl.ocks.org/phil-pedruco/9344373)
  * Manier nodig om coordinaten om te zetten naar een positie op de map. (Hopelijk gemakkelijk te doen met d3 scale)

## Interactie elementen

* Met een slider zal er een keuze gemaakt kunnen worden tussen verschillende jaren. Per jaar is te zien:
  * Een map van Nederland met bolletjes op de posities van festivals. Interactief door een popup met achtergrondinformatie van een festival als je eroverheen hovert.
  * Een staafdiagram met het aantal festivals per maand.
  * Een cirkeldiagram dat het verschil in soorten festivals laat zien.
* Met selecties zal er kunnen worden gekeken naar bijv info van een provincie.
* Met een afspeelknop zal de toename automatisch te zien zijn.
