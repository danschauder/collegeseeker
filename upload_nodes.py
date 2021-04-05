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

f = open(os.path.join('public','data','nodes.json'))

data = json.load(f)
for node in data['nodes']:
    doc_ref = db.collection(u'nodes').document(str(node['id']))
    doc_ref.set(node)