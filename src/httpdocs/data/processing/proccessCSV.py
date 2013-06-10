import csv
import json
import hashlib
import zlib

FIRST_YEAR = 2008
LAST_YEAR = 2018
MAX_LEVEL = 3

class entry:

	__slots__ = ['key', 'descr', 'values', 'level' 'children']

	def __init__(self, key, descr, source, url, values, level):
		self.key = key
		self.descr = descr
		self.values = values
		self.level = level
		self.source = source
		self.url = url
		self.children = []

	#node hash
	def hashEntry(self):
		m = hashlib.md5()
		m.update(self.key)
		m.update(str(self.values))
		m.update(self.descr)
		return m.hexdigest()

	#node to json-ready data structute
	def reprJSON(self):
		values = []
		for value in self.values:
			values.append(dict(year=value[0], val=value[1]))
		children = []
		for child in self.children:
			children.append(child.reprJSON())
		return dict(key=self.key, descr=self.descr, src= self.source, url= self.url, values=values, hash=self.hashEntry()[:8], sub=children) 

def convert(inputFile, outputFile):
	csventries = []
	with open(inputFile, 'rU') as csvfile:
		dataline = csv.DictReader(csvfile, delimiter=',', quotechar='"', dialect='excel')
		for row in dataline:
			#find name
			name = ''
			for level in reversed(range(1,MAX_LEVEL+1)):
				if(row['LEVEL' + str(level)] != ''):
					name = row['LEVEL' + str(level)]
					break
			#populate yearly values
			rowValues = []
			for year in range(FIRST_YEAR, LAST_YEAR+1):

				#attempt parsing, value=0 in case of fails
				value = 0
				try:
					value = float(row[str(year)].replace(',', '').replace(' ', ''))
				except:
					value = 0
				rowValues.append((year, value))
			#create new entry object and add to list	
			csventries.append(entry(name.replace(' Total',''),row['TOOLTIP'], row['SOURCE'], row['SOURCE URL'], rowValues, int(row['LEVEL'])))

	#reverse list for tree creation
	csventries.reverse()

	#assign name to root
	csventries[0].key = 'Revenues'

	#tree-structure creation
	stack = []
	duplicates = []
	lastNode = None
	for node in csventries:
		#print('@' + node.key)
		#checking for total of 1 field
		if(lastNode != None and node.key == lastNode.key):
			#print('skipping ' + node.key)
			if(lastNode.descr == ''):
				lastNode.descr = node.descr
			duplicates += [node]
			continue
		#going one level deeper
		if(node.level > (len(stack)-1)):
			if(node.level != 0):
				#print('+ ' + stack[-1].key + ' -> ' + node.key)
				stack[-1].children.append(node)
			stack.append(node)
		#staying on same level
		elif (node.level == (len(stack)-1)):
			stack.pop().key;
			stack.append(node)
			stack[-2].children.append(node)
			#print("= " + stack[-2].key + ' -> ' + node.key)
		#pop deeper levels
		else:
			while (node.level < (len(stack))):
				stack.pop()
			stack[-1].children.append(node)
			#print("- " + stack[-1].key + ' -> ' + node.key)
			stack.append(node)
		lastNode = node

	# delete duplicates
	for dup in duplicates:
		csventries.pop(csventries.index(dup))

	root = stack[0]

	curnode = root
	while(curnode.children != []):
		curnode = curnode.children[0]

	# tree to json format
	outputFile = open(outputFile, 'w')
	outputFile.write(json.dumps(root.reprJSON(), indent=0))

convert('funds.csv', 'funds.json')