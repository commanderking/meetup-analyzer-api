from models import Events, Attendance
from extensions import db
from flask import Flask, request, jsonify, _request_ctx_stack, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func, case, literal_column

import os
import json
import requests
from datetime import datetime

from functools import wraps
from flask_cors import cross_origin
from flask_cors import CORS

from eventPrediction.eventPredictionUtils import getLinearRegressionPrediction, getAttendanceRateForThoseAttendingSingleMeetup, getPredictedAttendeesOfMembers

app = Flask(__name__, static_folder="web/build/static",
            template_folder="web/build")
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
CORS(app)

# Might need to reference here for heroku deployment: https://realpython.com/flask-by-example-part-2-postgres-sqlalchemy-and-alembic/
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def single_page_app(path):
    return render_template('index.html')


@app.route('/events', methods=['GET', 'POST'])
def events():

    if request.method == "POST":
        my_data = json.loads(request.data.decode('utf-8'))
        name = my_data['eventDate']
        print(name)
        event = Events(
            event_name=my_data['eventName'],
            event_date=my_data['eventDate']
        )

        try:
            db.session.add(event)

            # Need to commit event first so I can use the event_id to link two tables
            db.session.commit()
            attendees = []
            for attendee in my_data['attendees']:
                attendees.append(Attendance(
                    meetup_user_id=attendee['userId'],
                    event_id=event.id,
                    did_attend=attendee['didAttend'],
                    did_rsvp=attendee['didRSVP'],
                    title=attendee['title'],
                    event_host=attendee['eventHost'],
                    rsvp_date=attendee['rsvpDate'],
                    date_joined_group=attendee['dateJoinedGroup']
                ))
            print(attendees)
            print(event)
            db.session.bulk_save_objects(attendees)
            db.session.commit()

        except Exception as exception:
            print(exception)
        return jsonify(my_data)
    else:
        events = []
        for event in Events.query.order_by(Events.event_date.desc()).all():
            try:
                attendees = Attendance.query.filter(
                    Attendance.event_id == event.id, Attendance.did_attend == True).all()
                rsvps = Attendance.query.filter(Attendance.event_id ==
                                                event.id, Attendance.did_rsvp == True).all()
                attendees_who_rsvpd = Attendance.query.filter(Attendance.event_id ==
                                                              event.id, Attendance.did_rsvp == True, Attendance.did_attend == True).all()
                events.append({
                    # Needs to be string here beacuse when front end sends event id back to get attendance data
                    # Database expects getting rows by matching id string, not number
                    "id": event.id,
                    "name": event.event_name,
                    "date": event.event_date,
                    "attendees": len(attendees),
                    "rsvps": len(rsvps),
                    "attendeesWhoRsvpd": len(attendees_who_rsvpd)
                })
            except Exception as exception:
                print(exception)
                return "Could not get the event data"
        return jsonify(data=events)


@app.route('/attendance', methods=['POST'])
def attendance():
    try:
        data = json.loads(request.data.decode("utf-8"))
        events = data["eventIds"]
        attendance = Attendance.query.filter(
            Attendance.event_id.in_(events)).all()

        full_attendance = []
        for attendee_event in attendance:
            full_attendance.append({
                "meetupUserId": attendee_event.meetup_user_id,
                "id": attendee_event.id,
                "didAttend": attendee_event.did_attend,
                "didRSVP": attendee_event.did_rsvp,
                "title": attendee_event.title,
                "eventHost": attendee_event.event_host,
                "rsvpDate": attendee_event.rsvp_date,
                "dateJoinedGroup": attendee_event.date_joined_group
            })
        return jsonify(data=full_attendance)
    except Exception as exception:
        print(exception)
        return "Bad Job"


@app.route('/meetup/summary', methods=['GET'])
def meetupSummary():
    try:
        meetupAttendees = Attendance.query.filter(
            Attendance.did_attend, Attendance.did_rsvp).count()
        totalAttendees = Attendance.query.filter(
            Attendance.did_attend).count()
        totalRSVPs = Attendance.query.filter(
            Attendance.did_rsvp).count()
        uniqueAttendees = Attendance.query.filter(
            Attendance.did_attend, Attendance.did_rsvp).distinct(Attendance.meetup_user_id).count()
        uniqueRSVPs = Attendance.query.filter(
            Attendance.did_rsvp).distinct(Attendance.meetup_user_id).count()

        # Need to be smarter about this - hardcoded just for 2019
        firstDateOfYear = "2019/01/01"
        dateTimedFirstDateOfYear = datetime.strptime(
            firstDateOfYear, "%Y/%m/%d")

        uniqueAttendeesThisYear = Attendance.query.join(Events).filter(
            Attendance.did_attend, Attendance.did_rsvp, Events.event_date >= dateTimedFirstDateOfYear).distinct(Attendance.meetup_user_id).count()

        attendeesThisYear = Attendance.query.join(Events).filter(
            Events.event_date >= dateTimedFirstDateOfYear, Attendance.did_attend).count()

        attendeesWhoRSVPdThisYear = Attendance.query.join(Events).filter(
            Attendance.did_rsvp, Attendance.did_attend, Events.event_date >= dateTimedFirstDateOfYear, Attendance.did_attend).count()

        uniqueRSVPsThisYear = Attendance.query.join(Events).filter(
            Attendance.did_rsvp, Events.event_date >= dateTimedFirstDateOfYear).distinct(Attendance.meetup_user_id).count()

        rsvpsThisYear = Attendance.query.join(Events).filter(
            Attendance.did_rsvp, Events.event_date >= dateTimedFirstDateOfYear).count()

        participationThisYear = Attendance.query.join(Events).filter(
            Events.event_date >= dateTimedFirstDateOfYear).count()

        # SELECT COUNT(id), meetup_user_id FROM event_attendance GROUP BY meetup_user_id;
        counts = Attendance.query.group_by(
            Attendance.meetup_user_id).filter().with_entities(Attendance.meetup_user_id, func.count(Attendance.id)).all()

        print(counts)

        test = Attendance.query.join(Events).filter(
            Events.event_date >= dateTimedFirstDateOfYear, Attendance.did_attend)
        print(test.filter(Attendance.did_rsvp).all())

        meetupGroupSummary = {
            "attendeesWhoRSVPd": meetupAttendees,
            "totalAttendees": totalAttendees,
            "totalRSVPs": totalRSVPs,
            "uniqueAttendees": uniqueAttendees,
            "uniqueRSVPs": uniqueRSVPs,
            "currentYear": {
                "totalAttendees": attendeesThisYear,
                "uniqueAttendees": uniqueAttendeesThisYear,
                "attendeesWhoRSVPd": attendeesWhoRSVPdThisYear,
                "totalRSVPs": rsvpsThisYear,
                "uniqueRSVPs": uniqueRSVPsThisYear,
                "participation": participationThisYear
            }
        }

        return jsonify(data=meetupGroupSummary)

    except Exception as exception:
        print(exception)
        return "Bad Job"


@app.route('/event/prediction', methods=['POST'])
def prediction():
    data = json.loads(request.data.decode("utf-8"))
    users = data["userIds"]

    # Getting previous attendance rates for each attendee at the upcoming event
    attendanceHistoryForUsersAtUpcomingEvent = (
        Attendance.query
        .filter(
            Attendance.meetup_user_id.in_(users)
        )
        .with_entities(
            Attendance.meetup_user_id,
            func.count(case([((Attendance.did_attend == True), 1)],
                            else_=literal_column("NULL"))).label('count_did_attend'),
            func.count(Attendance.did_rsvp).label('count_did_rsvp'))
        .group_by(Attendance.meetup_user_id)
        .all()
    )

    # For those who this is the first recorded attendance, (they may have attended before, just not up to the point where we started recording)
    # let's just use the average attendance rate for those who've attended once
    attendanceForThoseWhoAttdendedOneMeetup = (
        Attendance.query
        .with_entities(
            Attendance.meetup_user_id,
            func.count(case([(Attendance.did_attend == True, Attendance.did_attend)],
                            else_=literal_column("NULL"))).label('count_did_attend'),
            func.count(Attendance.did_rsvp).label('count_did_rsvp')
        )
        .filter(
            # Filter out those attendees that attended, but did not RSVP (there's no way for us to predict them)
            Attendance.meetup_user_id != None
        )
        .group_by(Attendance.meetup_user_id).having(func.count(Attendance.did_rsvp) == 1).all()
    )

    singleAttendanceCountAndRSVPs = getAttendanceRateForThoseAttendingSingleMeetup(
        attendanceForThoseWhoAttdendedOneMeetup)
    singleAttendanceRate = (singleAttendanceCountAndRSVPs["attended"] /
                            singleAttendanceCountAndRSVPs["rsvped"])

    # Linear Regression - Get important data for each event
    events = (
        Attendance.query
        .with_entities(
            Attendance.event_id,
            Events.event_name,
            Events.event_date,
            func.count(case([(Attendance.did_attend, 1)],
                            else_=literal_column("NULL"))).label('count_did_attend'),

            func.count(case([(Attendance.did_rsvp, 1)],
                            else_=literal_column("NULL"))).label('count_did_rsvp'),
            # Right now this includes those without user_ids such as (NONE)
            func.array_agg(Attendance.meetup_user_id).label('meetup_user_ids')
        )
        .join(Events)
        .filter(
            # Filter out those attendees that attended, but did not RSVP (there's no way for us to predict them)
            Attendance.meetup_user_id != None
        )
        .group_by(Attendance.event_id, Events.event_name, Events.event_date)
        # Order for sake of pandas and being able to use training data from middle
        .order_by(Events.event_date.asc())
        .all()
    )

    # Loop through events to get the previous attendane rate prior to each event
    events_with_attendees = []
    for event in events:
        (event_id, event_name, event_date,
         attendees_who_rsvped_count, rsvp_count, attendeeIds) = event

        # Getting previous attendance rates for each attendee at the event
        attendanceHistoryForUsersAtEvent = (
            Attendance.query
            .filter(
                Attendance.meetup_user_id.in_(attendeeIds),
                # We only care about events that were before the date of the event (not the overall history of the attendee up to today)
                Events.event_date < event_date
            )
            .with_entities(
                Attendance.meetup_user_id,
                func.count(case([((Attendance.did_attend == True), 1)],
                                else_=literal_column("NULL"))).label('count_did_attend'),
                func.count(Attendance.did_rsvp).label('count_did_rsvp'))
            .group_by(Attendance.meetup_user_id)
            .join(Events)
            .all()
        )

        count_previous_attendees = len(attendanceHistoryForUsersAtEvent)
        events_with_attendees.append({
            "event_id": event_id,
            "event_name": event_name,
            "event_date": event_date,
            "attendees_who_rsvped_count": attendees_who_rsvped_count,
            "rsvp_count": rsvp_count,
            "previous_attendance_rates_sum": getPredictedAttendeesOfMembers(attendanceHistoryForUsersAtEvent),
            "count_previous_attendees": count_previous_attendees,
            "old_attendees": count_previous_attendees,
            "new_attendees": (rsvp_count - count_previous_attendees) * singleAttendanceRate
        })

    rsvps = len(users)
    oldAttendees = len(attendanceHistoryForUsersAtEvent)
    new_event = {
        "rsvp_count": rsvps,
        "old_attendees": oldAttendees,
        "previous_attendance_rates_sum": getPredictedAttendeesOfMembers(attendanceHistoryForUsersAtEvent),
        "new_attendees": (rsvps - oldAttendees) * singleAttendanceRate
    }

    regressionPrediction = getLinearRegressionPrediction(
        regressionInput=events_with_attendees, newEvent=[new_event])

    print(regressionPrediction)

    # format data we have for front end consumption
    attendanceHistory = []
    for attendee in attendanceHistoryForUsersAtUpcomingEvent:
        (meetupUserId, eventsAttendedCount, eventsRSVPedCount) = attendee
        attendanceHistory.append({
            "meetupUserId": meetupUserId,
            "attended": eventsAttendedCount,
            "rsvped": eventsRSVPedCount
        })

    return jsonify(data={
        "memberAttendanceHistory": attendanceHistory,
        "singleAttendanceCountAndRSVPs": singleAttendanceCountAndRSVPs,
        "regressionPrediction": regressionPrediction
    })


if __name__ == '__main__':
    app.run()
