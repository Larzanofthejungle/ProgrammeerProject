# week 1

## dag 2

Alvast begonnen met het schrijven van een scraper voor de data.

Misschien een manier om de play button te morphen naar een pause button. (http://bl.ocks.org/mbostock/3081153) Het ziet er volgens mij heel mooi uit. Is niet noodzakelijk voor het werken van het programma.

## dag 3

Dataset voor plaatsnamen, die gelinkt kunnen worden aan coordinaten, is gevonden. Is alleen erg groot en nog onhandig. Beslis morgen of het handig deze dataset in te korten of om alternatief te zoeken.

Dataset voor festivals is nu grotendeels compleet en kan gebruikt worden. Scraper zal nog aangepast moeten worden voor achtergrondinformatie van festivals. Alhoewel het misschien juist handig is om dit extern te laden en niet in het jsonf bestand te hebben.

Voor het probleem van meerdere festivals op 1 plaats zou gebruik gemaakt kunnen worden van transparantie, waardoor een stip donkerder kleurt wanneer er meer festivals zijn.

## dag 4

Het inladen van een datamap ging moeilijker dan verwacht, vanwege het gebruik van een enkel land. Nu heb ik er voor gekozen om een svg map in te laden via xml. (Met dank aan Dirk).

Scraper voor festivals is af. En festival data kan worden ingelezen.

# week 2

## dag 1

Alle datasets zijn klaar voor het kunnen maken van de visualisaties. Grootste punt nu is het punten weergeven op de kaart.

## dag 2

Plaatsen worden nu op de juiste positie geplaatst, echter bevinden ze zich achter de map.

## dag 3

De SVG map wordt nu ingeladen als achtergrond afbeelding. Het gebruik van de SVG elementen van deze kaart is namelijk (voor nu) niet nodig, doordat met een projectie te plaatsen gepositioneerd worden en die afgestemd is op de breedte en hoogte van de afbeelding.  

Verder is de kolomdiagram ook geimplementeerd en laat al de juiste data zien van een bepaald jaar.

## dag 4

Posities van festivals worden juist weergegeven van de jaren 2000 tot en met 2013. Idee om te werken met een schaal voor de grootte van het stipje van een plaats, zodat plekken met weinig festivals wel zichtbaar zijn. En de plekken met veel niet uiterst groot worden. Hier kan ook nog gewerkt worden met transparantie.

# week 3

## dag 1

Posities van festivals worden juist weergegeven van alle jaren. Transparantie van cirkels is toegepast. Piechart en slider geimplementeerd. Piechart moet hierbij nog qua style netter en overzichtelijker (en vrolijker).

## dag 2

Er kunnen nu selecties gemaakt worden. Oftewel bij de barchart kan er geswitcht worden tussen maanden en provincies. En bij de piechart tussen duur festival en of het festival een camping heeft of uitverkocht is. Volgende stap: Extra informatie voor festivals en interactie voor de bar- en piechart.

## dag 3

Interactie is toegevoegd aan de plaatsen. Bij hoveren laat het het aantal festivals zien per plaats. Bij klikken een lijst van alle festivals die er zijn geweest op die plek.

## dag 4

Data gecomplementeerd.

# week 4

## dag 1

Tijd om code op te schonen en pagina mooi te stylen.

## dag 2

Interactie barchat geimplementeerd, morgen perfectioneren. Verdere code ook opschonen. En morgen ook overal commenten.
