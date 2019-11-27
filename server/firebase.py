"""Utilities for connecting to Firebase's Firestore DB"""
from os import environ
from json import loads
from firebase_admin import initialize_app
from firebase_admin import credentials
from firebase_admin import firestore
from dotenv import load_dotenv

# Credentials resolution
cred_val = environ.get("GOOGLE_CREDENTIALS")
if cred_val is None:
    print("Didn't find environment credentials! Reverting to local file.\n")
    cred = credentials.Certificate("./keys.json")
else:
    print("Found environment credentials! Converting to json.\n")
    cred_json = loads(cred_val)
    cred = credentials.Certificate(cred_json)

# Firebase initialization
initialize_app(cred)
db = firestore.client()
rooms_ref = db.collection("rooms")
