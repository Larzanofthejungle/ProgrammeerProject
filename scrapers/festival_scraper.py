#!/usr/bin/env python
# Name: Lars Overwater
# Student number: 10800077
'''
This script scrapes festivalinfo.nl and outputs a JS file with all festivals that have taken place in the Netherlands since 2000.
'''

from pattern.web import URL, DOM

BEGIN_YEAR = 2000
YEAR_RANGE = 17
BEGIN_MONTH = 1
MONTH_RANGE = 12
URL_FRONT = 'http://www.festivalinfo.nl/festivals/?type_select=maand&maand='
URL_MID = '&jaar='
TEST_PAGE = 'http://www.festivalinfo.nl/festivals/?type_select=maand&maand=08&jaar=2005'
OUTPUT_JS = 'festivals.js'
BACKUP_HTML = 'festivals.html'

def extract_festivals(dom):

    festivals = []

    # gets list of div tags lister-item-content
    for festival in dom.by_tag("section.festival_rows_info  "):
        for place in festival.by_tag("div.td_2 last"):
            if place.content[-9:] == 'Nederland':
                place = place.content[:-17].strip()
            else:
                place = False
        if place != False:
            camping = 'False'
            sold_out = 'False'
            for name in festival.by_tag("div.td_1 last"):
                name = name.content[9:-10]
            for duration in festival.by_tag("div.td_3 last"):
                duration = duration.content
            for camping in festival.by_tag("span.camping_festival"):
                if camping.title == 'festival heeft camping':
                    camping = 'True'
            for sold_out in festival.by_tag("span.uitverkocht_festival"):
                if sold_out.title == 'festival is uitverkocht':
                    sold_out = 'True'
            festival_info = "{\"name\":\"" + name + "\", \"place\":\"" + place + "\", \"duration\":\"" + duration + "\", \"camping\":\"" + camping + "\", \"sold_out\":\"" + sold_out + "\"}"
            festivals.append(festival_info)
    return '[' + ',\n\t\t\t'.join(festivals) + ']'

if __name__ == '__main__':

    festivals_total = []

    for year in range(YEAR_RANGE):

        print BEGIN_YEAR + year
        festivals_year = []

        for month in range(MONTH_RANGE):
            current_page = URL_FRONT + str(BEGIN_MONTH + month).zfill(2) + URL_MID + str(BEGIN_YEAR + year)
            url = URL(current_page)
            html = url.download()

            # Parse the HTML file into a DOM representation
            dom = DOM(html)

            # Extract the festivals
            festivals_month = "{\"" + str(BEGIN_MONTH + month).zfill(2) + "\":" + extract_festivals(dom) + "}"
            festivals_year.append(festivals_month)

        festivals_year = "{\"" + str(BEGIN_YEAR + year) + "\":[" + ',\n\t\t'.join(festivals_year) + "]}"
        festivals_total.append(festivals_year)

    with open(OUTPUT_JS,'wb') as output_file:
        output = "var festivals_total = " + ',\n\t'.join(festivals_total)
        output_file.write(output.encode('utf-8', 'ignore'))
