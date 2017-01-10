#!/usr/bin/env python
# Name: Lars Overwater
# Student number: 10800077
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

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

    # gets list of div tags lister-item-content
    for festival in dom.by_tag("section.festival_rows_info  "):
        for name in festival.by_tag("div.td_1 last"):
            name = name.content[9:-10]
        for place in festival.by_tag("div.td_2 last"):
            if place.content[-9:] == 'Nederland':
                place = place.content[:-17].strip()
            else:
                place = False
        for duration in festival.by_tag("div.td_3 last"):
            duration = duration.content
        if place != False:
            print name, place, duration
    return True

if __name__ == '__main__':

    for year in range(YEAR_RANGE):
        for month in range(MONTH_RANGE):
            current_page = URL_FRONT + str(BEGIN_MONTH + month).zfill(2) + URL_MID + str(BEGIN_YEAR + year)
            url = URL(current_page)
            html = url.download()

            with open(BACKUP_HTML, 'wb') as f:
                f.write(html)

            # Parse the HTML file into a DOM representation
            dom = DOM(html)

            # Extract the festivals
            extract_festivals(dom)
