#Author Ivan DiLernia
#simple KML to CSV converter

import csv

newfile = open("history-12-03-2012.kml",'r')
csvfile = csv.writer(open('converted2.csv', 'wb'))
cur = []
for line in newfile.readlines():
	if(len(cur) == 0):
		cur.append(line[6:-8]);
	else:
		cur += line[10:-12].split(' ')[:-1];
		csvfile.writerow(cur)
		cur = []