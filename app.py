from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
import json
import requests


app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

from extensions import db
db.init_app(app)


# Might need to reference here for heroku deployment: https://realpython.com/flask-by-example-part-2-postgres-sqlalchemy-and-alembic/

# Start up notes: 
# export APP_SETTINGS="config.DevelopmentConfig"
# export DATABASE_URL="postgresql://localhost/meetup_attendees"

from models import Events


@app.route('/')
def hello():
    return "Hello World!"

@app.route('/events', methods=['GET', 'POST'])
def events():
    my_data = json.loads(request.data.decode('utf-8'))
    print(my_data)
    name = my_data['eventDate']
    print(name)
    event = Events(
        event_name = my_data['eventName'],
        event_date = my_data['eventDate']
    )
    print(event)
    try:
        db.session.add(event)
        db.session.commit()
    except: 
        print("Unable to add item to database.")
    return jsonify(my_data)


if __name__ == '__main__':
    app.run()