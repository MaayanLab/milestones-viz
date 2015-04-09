%load_ext autoreload
%autoreload 2
import sys
sys.path.append(r'C:\Users\Luke\Documents\qn\py')
import qn


groups = []
with open('categorized-editted.txt','r') as cf:
	for line in cf:
		splits = line.strip('\r\n\t').split('\t')
		pertCategoryHint, assayOutcomeHint = splits[2].split(';')
		if pertCategoryHint == "defer" or assayOutcomeHint == "defer":
			continue
		else:
			group = {}
			group['id'] = splits[0]
			if pertCategoryHint == "c":
				pertCategory = "external"
			elif pertCategoryHint == "g":
				pertCategory = "genetic"
			elif pertCategoryHint == "m":
				pertCategory = "microenvironment"
			elif pertCategoryHint == "n":
				pertCategory = "none"
			else:
				raise("err")

			if assayOutcomeHint == "t":
				assayOutcome = "transcriptomic"
			elif assayOutcomeHint == "p":
				assayOutcome = "proteomic"
			elif assayOutcomeHint == "h":
				assayOutcome = "phenotypic"
			elif assayOutcomeHint == "i":
				assayOutcome = "image"
			elif assayOutcomeHint == "e":
				assayOutcome = "phenotypic"
			else:
				raise('err')

			group['pertClass'] = pertCategory
			group['assayClass'] = assayOutcome
			groups.append(group)

from bson.objectid import ObjectId
coll = qn.getcoll('milestones',db="LINCS",inst="loretta",u="readWriteUser",
			   p="askQiaonan")[0]
matches = []
eDocs = []
for group in groups:
	doc = coll.find_one({'_id':ObjectId(group['id'])})
	eDoc = False
	for cell in doc["cell-lines"]:
		if "name" not in cell:
			continue
		if group["pertClass"] == "none":
			match = {}
			match["cell"] = cell["name"]
			if "type" in cell:
				match["cellType"] = cell["type"]
			else:
				eDoc = True
				match["cellType"] = "cell line"
			match["pert"] = "none"
			match["pertClass"] = group["pertClass"]
			match["assayClass"] = group["assayClass"]
			match["center"] = doc["center"]
			match['id'] = group['id']
			matches.append(match)
		else:
			for pert in doc["perturbagens"]:
				if pert['type'] == 'disease':
					# disease is not a perturbagen
					continue
				match = {}
				match["cell"] = cell["name"]
				if "type" in cell:
					match["cellType"] = cell["type"]
				else:
					eDoc = True
					match["cellType"] = "cell line"
				match["cellType"] = "cell line"
				match["pert"] = pert["name"].strip(' ').lower()
				match["pertClass"] = group["pertClass"]
				match["assayClass"] = group["assayClass"]
				match["center"] = doc["center"]
				match['id'] = group['id']
				matches.append(match)
	if eDoc:
		eDocs.append(doc)

# format matches into what ECharts requires.
# fix 106 compounds in the future...
perts = list({(v['pert'],v['pertClass']):v for v in matches}.values())
cells = list({v['cell']:v for v in matches}.values())
sortedPerts = sorted(perts,key=lambda x: (x['pertClass'],x['pert']))

fourCenterCells = [cell for cell in cells if cell['center'] != "DTOXS" and
cell['center'] != 'NeuroLINCS']
twoCenterCells = [cell for cell in cells if cell['center'] == "DTOXS" or 
cell['center'] == 'NeuroLINCS']
sortedCells = (sorted(fourCenterCells,key=lambda x:(x['cellType'],x['cell'])) +
sorted(twoCenterCells,key=lambda x:(x['cellType'],x['cell'])))

pertIdx = {(pert['pert'],pert['pertClass']):i for i,pert in enumerate(sortedPerts)}
cellIdx = {cell['cell']:i for i,cell in enumerate(sortedCells)}

# build overlap meta info for each crosssection
tooltipInfo = {}
for match in matches:
	# coordinates start with 1
	matchPertIdx = pertIdx[(match['pert'], match['pertClass'])]+1
	matchCellIdx = cellIdx[match['cell']]+1
	if matchPertIdx not in tooltipInfo:
		tooltipInfo[matchPertIdx] = {}
	if matchCellIdx not in tooltipInfo[matchPertIdx]:
		tooltipInfo[matchPertIdx][matchCellIdx] = {}
		tooltipInfo[matchPertIdx][matchCellIdx]['centerAssays'] = []
		tooltipInfo[matchPertIdx][matchCellIdx]['ids'] = []
	tooltipInfo[matchPertIdx][matchCellIdx]['centerAssays'].append([match['center'],
		match['assayClass']])
	tooltipInfo[matchPertIdx][matchCellIdx]['ids'].append(match['id'])

for pIdx in tooltipInfo:
	for cIdx in tooltipInfo[pIdx]:
		tooltipInfo[pIdx][cIdx]['ids'] = list(set(tooltipInfo[pIdx][cIdx]['ids']))
		info = tooltipInfo[pIdx][cIdx]['centerAssays']
		if len(info) == 1:
			tooltipInfo[pIdx][cIdx]['centerAssays'] = info[0][0]+','+info[0][1]
		else:
			byCenter = {}
			for item in info:
				if item[0] not in byCenter:
					byCenter[item[0]] = []
				byCenter[item[0]].append(item[1])
			rows = []
			for key in byCenter:
				rows.append(key+','+'/'.join(list(set(byCenter[key]))))
			tooltipInfo[pIdx][cIdx]['centerAssays'] = '<br/>'.join(rows)

			

centerAssays = list(set([(item['center'],item['assayClass']) for item in matches]))
serieses = []
for centerAssay in centerAssays:
	# coordinates start with 1
	serieses.append([[pertIdx[(match['pert'], match['pertClass'])]+1,cellIdx[match['cell']]+1] for match in
		matches if match['center']==centerAssay[0] and match['assayClass']==centerAssay[1]])

chartInput = {}
chartInput['perts'] = sortedPerts
chartInput['cells'] = sortedCells
chartInput['centerAssays'] = centerAssays
chartInput['serieses'] = serieses
chartInput['tooltip'] = tooltipInfo
import json
with open('../app/public/data/chartInput','w') as cf:
	cf.write(json.dumps(chartInput))
