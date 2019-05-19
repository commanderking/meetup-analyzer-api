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

from models import Events, Attendance

@app.route('/')
def hello():
    return "Hello World!"

@app.route('/events', methods=['GET', 'POST'])
def events():
    my_data = json.loads(request.data.decode('utf-8'))
    name = my_data['eventDate']
    print(name)
    event = Events(
        event_name = my_data['eventName'],
        event_date = my_data['eventDate']
    )
    
    try:
        db.session.add(event)

        # Need to commit event first so I can use the event_id to link two tables
        db.session.commit()
        attendees = []
        for attendee in my_data['attendees']:
            attendees.append(Attendance(
                meetup_user_id = attendee['userId'],
                event_id = event.id,
                did_attend = attendee['didAttend'],
                did_rsvp = attendee['didRSVP'],
                title = attendee['title'],
                event_host = attendee['eventHost'],
                rsvp_date = attendee['rsvpDate'],
                date_joined_group = attendee['dateJoinedGroup']
            ))
        print(attendees)
        print(event)
        db.session.bulk_save_objects(attendees)
        db.session.commit()

        
    except Exception as exception: 
        print(exception)
    return jsonify(my_data)


if __name__ == '__main__':
    app.run()