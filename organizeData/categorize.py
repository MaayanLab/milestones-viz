%load_ext autoreload
%autoreload 2
import sys
sys.path.append(r'C:\Users\Luke\Documents\qn\py')
import os
os.chdir(r'D:\Qiaonan Working\projects\milestones\chart\organizeData')
import qn

coll = qn.getcoll('milestones',db="LINCS",inst="loretta",u="readWriteUser",
			   p="askQiaonan")[0]
categoryMap = {}
deferredDocs = []
for doc in coll.find():
	print(str(doc["_id"]))
	print(doc["cell-lines"][0])
	if "perturbagens" in doc:
		print(doc["perturbagens"][0])
	else:
		print("no information about perturbagens")
	pertCategoryHint = input('Enter the category for perturbagens: ')
	if pertCategoryHint == "c":
		pertCategory = "external"
	elif pertCategoryHint == "g":
		pertCategory = "genetic"
	elif pertCategoryHint == "d":
		pertCategory = "disease"
	elif pertCategoryHint == "n":
		pertCategory = "none"
	else:
		pertCategory = "defer"
	
	print(doc["assay"])
	assayOutcomeHint = input('Enter the category for assay: ')
	if assayOutcomeHint == "t":
		assayOutcome = "Transcriptomic"
	elif assayOutcomeHint == "p":
		assayOutcome = "Proteomic"
	elif assayOutcomeHint == "h":
		assayOutcome = "phenotipic"
	elif assayOutcomeHint == "i":
		assayOutcome = "image"
	elif assayOutcomeHint == "e"
		assayOutcome = "phenotipic"
	else:
		assayOutcome = "defer"

	if pertCategory == "defer" or assayOutcome == "defer":
		deferredDocs.append(doc)
	else:
		categoryMap[str(doc["_id"])] = {}
		categoryMap[str(doc["_id"])]["pertClass"] = pertCategory
		categoryMap[str(doc["_id"])]["assayClass"] = assayOutcome
	print('\n\n')