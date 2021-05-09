import flask
from flask import Flask, request, url_for, render_template, redirect, make_response
import pymongo
from flask_pymongo import PyMongo
from flask_mongoengine import MongoEngine
import cargo



app = Flask(__name__)
mongo = PyMongo(app, uri="mongodb://localhost:27017/cargo_app")


@app.route("/")
def home():

    cargo_data = cargo.get_data()
    return render_template('index.html', cargo_data=cargo_data)

@app.route("/data")
def data():

    
    mongo.db.collection.replace_one({}, cargo_data, upsert=True)
    
    data = mongo.db.collection.find_one()
    return render_template('index.html', cargo_data=data)

if __name__ == "__main__":
    app.run(debug=True)