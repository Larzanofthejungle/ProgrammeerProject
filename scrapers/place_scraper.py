
import csv

INPUT_CSV = 'postcodetabel.csv'
OUTPUT_JS = 'places.js'
current_place = "none"
places = []

with open(INPUT_CSV,'rb') as input_file:
    postcodes = csv.reader(input_file, delimiter=',', quotechar='|')

    for row in postcodes:
        if current_place != row[8]:
            current_place = row[8]
            place_info = "{\"place\":\"" + row[8] + "\", \"province\":\"" + row[10] + "\", \"lat\":\"" + row[11] + "\", \"long\":\"" + row[12] + "\"}"
            places.append(place_info)

    with open(OUTPUT_JS, 'wb') as output_file:
        output = "var places = [" + ',\n\t'.join(places) + "];"
        output_file.write(output)
