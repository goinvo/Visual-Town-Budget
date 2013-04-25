import csv
import json

FIRST_YEAR = 2006
LAST_YEAR = 2017
MAX_LEVEL = 3

class entry:

	__slots__ = ['key', 'descr', 'values', 'level' 'children']

	def __init__(self, key, descr, values, level):
		self.key = key
		self.descr = descr
		self.values = values
		self.level = level
		self.children = []

def main():
	csventries = []
	with open('revenues.csv', 'rU') as csvfile:
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
				rowValues.append((year, row[str(year)]))
			#create new entry object and add to list	
			csventries.append(entry(name,'',rowValues, int(row['LEVEL'])))

	#reverse list for tree creation
	csventries.reverse()

	#assign name to root
	csventries[0].key = 'Revenues'

	#tree-structure creation
	stack = []
	for node in csventries:
		#going one level deeper
		if(node.level > (len(stack)-1)):
			if(node.level != 0):
				stack[-1].children.append(node)
			stack.append(node)
		#staying on same level
		elif (node.level == (len(stack)-1)):
			stack[-2].children.append(node)
		#pop deeper levels
		else:
			while (node.level < (len(stack))):
				stack.pop()
			stack[-1].children.append(node)
			stack.append(node)

	root = stack[0]

	curnode = root
	while(curnode.children != []):
		print(curnode.children[0].key)
		curnode = curnode.children[0]

main()