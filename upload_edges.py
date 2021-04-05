import firebase_admin
import json
import os
from firebase_admin import credentials
from firebase_admin import firestore

# Use the application default credentials
cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred, {
  'projectId': 'dvaspring2021madss',
})

db = firestore.client()

collection_names = ['campus_experience_edges', 'location_edges', 'default_edges','selectivity_edges']
file_names = ['edgesA_campus_experience.json', 'edgesA_location.json', 'edgesA_no_preference.json', 'edgesA_selectivity.json']

i=1
for k, v in enumerate(file_names):
    f = open(os.path.join('public','data',v))
    data = json.load(f)
    for edge in data['edgesA']:
        doc_ref = db.collection(collection_names[k]).document(str(i))
        doc_ref.set(edge)
        i+=1
    f.close()


# f = open(os.path.join('public','data','nodes.json'))

# data = json.load(f)
# for node in data['nodes']:
#     doc_ref = db.collection(u'nodes').document(str(node['id']))
#     doc_ref.set(node)