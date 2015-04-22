# -*- coding: utf-8 -*-
"""
Created on Tue Mar 31 16:41:33 2015

@author: Luke
"""

%load_ext autoreload
%autoreload 2
import sys
sys.path.append(r'C:\Users\Luke\Documents\qn\py')
import os
os.chdir(r'D:\Qiaonan Working\projects\milestones\chart\organizeData')
import qn

coll = qn.getcoll('milestones',db="LINCS",inst="loretta",u="readWriteUser",
			   p="askQiaonan")[0]
import json
with open('categorized.txt','w') as cf:
    for doc in coll.find():
        if "perturbagens" in doc:
            perturbagen = doc["perturbagens"][0]
        else:
            perturbagen = "none"
        cf.write("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\n".format(doc["lincs_id"],doc["center"],doc["assay"],
                 doc["assay-info"], perturbagen, json.dumps(doc["cell-lines"][0])))