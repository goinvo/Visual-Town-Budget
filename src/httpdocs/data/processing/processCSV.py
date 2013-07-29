import csv, json, hashlib, zlib, sys, os

FIRST_YEAR = None
LAST_YEAR = None
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


# given a csv file generates a list of entry object,
# each representing one row of the csv file.
def generateList(inputFile):
	global FIRST_YEAR
	global LAST_YEAR
	csventries = []
	
	# attempt opening file if inputFile is not 
	# a file descriptor
	if isinstance(inputFile, str):
		filename = inputFile.split('/')[-1].split('.')[0]
		try:
			csvfile = open(inputFile, 'rU')
		except Exception, e:
			print('Error opening ' + inputFile)
			exit(1)
	else:
		csvfile = inputFile

	dataline = csv.DictReader(csvfile, delimiter=',', quotechar='"', dialect='excel')

	#keep current row count for printing errors
	currentRow = 0
	yearSet = False

	for row in dataline:

		#initialize year-range
		if not yearSet:
			for key, value  in row.iteritems() :
				if(key.isdigit()):
					FIRST_YEAR = int(key) if FIRST_YEAR == None else min(FIRST_YEAR, int(key))
					LAST_YEAR = int(key) if LAST_YEAR == None else max(LAST_YEAR, int(key))
			yearSet = True

		try:
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

		except Exception, e:
			print('Error parsing line ' + str(currentRow) + ': ' + str(row))
			exit(1)

		#update row number (useful for printing errors)
		currentRow += 1

	csvfile.close()

	return csventries

# takes a flat list of entries and transforms them
# into a tree structure
def generateTree(csventries, filename):

	#reverse list for tree creation
	csventries.reverse()

	#assign name to root
	csventries[0].key = filename.capitalize()

	#tree-structure creation
	stack = []
	duplicates = []
	lastNode = None
	for node in csventries:
		try:
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
		except Exception, e:
			print(e)
			print('Error reconstructing tree at node: ' + str(node))
			exit(1)

	# delete duplicates
	for dup in duplicates:
		csventries.pop(csventries.index(dup))

	root = stack[0]

	curnode = root
	while(curnode.children != []):
		curnode = curnode.children[0]

	# tree to json format
	try:
		outputFile = open(filename + '.json', 'w')
	except  Exception, e:
		print('Error opening output file.')
		exit(1)

	# dump in json structure
	jsontext = json.dumps(root.reprJSON(), indent=0).replace('\n', '').replace('\r', '')
	outputFile.write(jsontext)

	#success ! print output file
	print(filename + '.json')


def updateHome():
	global FIRST_YEAR, LAST_YEAR

	# the files used to generate home data
	files = ['../revenues.csv', '../expenses.csv', '../funds.csv']
	sections = []

	# add root entries from all 3 files to sections []
	for file in files:
		FIRST_YEAR = None
		LAST_YEAR = None
		try:
			fd = open(os.path.dirname(__file__) + file, 'rU')
			csventries = generateList(fd)
			sections += [csventries[-1]]
		except Exception, e:
			print('Error in proceesing files for homepage update.')
			exit(1)

	# create root and add the 3 sections as children
	root = entry('root','', '', '', [], 0)
	root.children += sections

	# dump data to json file
	try:
		outputFile = open('home.json', 'w')
	except  Exception, e:
		print('Error opening home.json for write.')
		exit(1)

	outputFile.write(json.dumps(root.reprJSON(), indent=4))
	outputFile.close()

	# print output file name
	print('home.json')
		
def updateData(inputFile):
	outputFile = inputFile.split('/')[-1].split('.')[0]
	csventries = generateList(inputFile)
	generateTree(csventries, outputFile)


def main():
	if len(sys.argv) < 2:
		print('Usage: processCSV.py {updatehome|filename}')
	elif (sys.argv[1] == 'updatehome'):
		updateHome()
	else:
		updateData(sys.argv[1])

if __name__ == '__main__':
	main()


