from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
import json
import requests


app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Might need to reference here for heroku deployment: https://realpython.com/flask-by-example-part-2-postgres-sqlalchemy-and-alembic/

# Start up notes: 
# export APP_SETTINGS="config.DevelopmentConfig"
# export DATABASE_URL="postgresql://localhost/meetup_attendees"

@app.route('/')
def hello():
    return "Hello World!"

@app.route('/events', methods=['GET', 'POST'])
def events():
    my_data = json.loads(request.data.decode('utf-8'))
    print(my_data['name'])
    print(request.method)
    return jsonify(my_data)


if __name__ == '__main__':
    app.run()