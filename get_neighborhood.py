import firebase_admin
import json
import os
from firebase_admin import credentials
from firebase_admin import firestore


STATES=['AL','OR','TN']


# Use the application default credentials
cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred, {
  'projectId': 'dvaspring2021madss',
})

db = firestore.client()
target_node_id='15'
nodes_ref = db.collection(u'nodes').document(target_node_id)
root = nodes_ref.get().to_dict()


neighbor_nodes = []
neighbor_edges = []
# Check that the given node passes the filters
if not (root['State'] in STATES):
    print('The given university does not meet the supplied criteria. Please update your filter settings and try again.')
else:
    neighbor_nodes.append(root)
    edges_ref = db.collection('default_edges_FULL').where('source','==',target_node_id)