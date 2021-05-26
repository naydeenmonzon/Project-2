import json
from flask import Flask, render_template
from flask_pymongo import PyMongo
import cargo
import json
from flask import jsonify


app = Flask(__name__)
mongo = PyMongo(app, uri="mongodb://localhost:27017/cargo_app") 


@app.route("/")
def home():

    cargo_data = cargo.get_data()
    return render_template("/", cargo_data=cargo_data)

# @app.route("/data")
# def data():

    
#     mongo.db.collection.replace_one({}, cargo_data, upsert=True)
    
#     data = mongo.db.collection.find_one()
#     return render_template('index.html', cargo_data=data)

if __name__ == "__main__":
    app.run(debug=True)