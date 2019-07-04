from models import Events, Attendance
from extensions import db
from flask import Flask, request, jsonify, _request_ctx_stack
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func, case, literal_column

import os
import json
import requests
from datetime import datetime

from functools import wraps
from flask_cors import cross_origin
from jose import jwt
from flask_cors import CORS

from eventPrediction.eventPredictionUtils import formatDataForModel

AUTH0_DOMAIN = os.environ["AUTH0_DOMAIN"]
API_AUDIENCE = os.environ["API_AUDIENCE"]
ALGORITHMS = ["RS256"]

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
CORS(app)

# Error handler


class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response


# /server.py

# Format error response and append status code
def get_token_auth_header():
    """Obtains the Access Token from the Authorization Header
    """

    auth = request.headers.get("Authorization", None)
    print('auth')
    print(auth)
    if not auth:
        raise AuthError({"code": "authorization_header_missing",
                         "description":
                         "Authorization header is expected"}, 401)

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise AuthError({"code": "invalid_header",
                         "description":
                         "Authorization header must start with"
                         " Bearer"}, 401)
    elif len(parts) == 1:
        raise AuthError({"code": "invalid_header",
                         "description": "Token not found"}, 401)
    elif len(parts) > 2:
        raise AuthError({"code": "invalid_header",
                         "description":
                         "Authorization header must be"
                         " Bearer token"}, 401)

    token = parts[1]

    return token


def requires_auth(f):
    """Determines if the Access Token is valid
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_auth_header()
        jsonurl = requests.get("https://"+AUTH0_DOMAIN +
                               "/.well-known/jwks.json").json()
        jwks = json.loads(json.dumps(jsonurl))
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
        if rsa_key:
            try:
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=ALGORITHMS,
                    audience=API_AUDIENCE,
                    issuer="https://"+AUTH0_DOMAIN+"/"
                )
            except jwt.ExpiredSignatureError:
                raise AuthError({"code": "token_expired",
                                 "description": "token is expired"}, 401)
            except jwt.JWTClaimsError:
                raise AuthError({"code": "invalid_claims",
                                 "description":
                                 "incorrect claims,"
                                 "please check the audience and issuer"}, 401)
            except Exception:
                raise AuthError({"code": "invalid_header",
                                 "description":
                                 "Unable to parse authentication"
                                 " token."}, 401)

            _request_ctx_stack.top.current_user = payload
            return f(*args, **kwargs)
        raise AuthError({"code": "invalid_header",
                         "description": "Unable to find appropriate key"}, 401)
    return decorated

# Might need to reference here for heroku deployment: https://realpython.com/flask-by-example-part-2-postgres-sqlalchemy-and-alembic/


@app.route('/')
def hello():
    return "Hello World!"


@app.route('/login', methods=['GET', 'POST'])
@cross_origin(headers=['Content-Type', 'Authorization'])
@requires_auth
def login():
    response = "Hello from a private endpoint! You need to be authenticated to see this."
    return jsonify(message=response)


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
            "meetupAttendeesWhoRSVPed": meetupAttendees,
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

    attendance = (
        Attendance.query
        .filter(
            Attendance.meetup_user_id.in_(users))
        .with_entities(
            Attendance.meetup_user_id,
            func.count(case([((Attendance.did_attend == True), Attendance.did_attend)],
                            else_=literal_column("NULL"))).label('count_did_attend'),
            func.count(Attendance.did_rsvp).label('count_did_rsvp'))
        .group_by(Attendance.meetup_user_id)
    )

    attendanceHistory = []
    for attendee in attendance:
        (meetupUserId, eventsAttendedCount, eventsRSVPedCount) = attendee
        attendanceHistory.append({
            "meetupUserId": meetupUserId,
            "attended": eventsAttendedCount,
            "rsvped": eventsRSVPedCount
        })

    attendanceForThoseWhoAttdendedOneMeetup = (
        Attendance.query
        .with_entities(
            Attendance.meetup_user_id,
            func.count(case([(Attendance.did_attend == True, Attendance.did_attend)],
                            else_=literal_column("NULL"))).label('count_did_attend'),
            func.count(Attendance.did_rsvp).label('count_did_rsvp')
        )
        .group_by(Attendance.meetup_user_id).having(func.count(Attendance.did_rsvp) == 1).all()
    )
    attendeeHistoryForThoseWhoAttendedOnlyOneMeetup = {
        "attended": 0,
        "rsvped": 0
    }
    for attendee in attendanceForThoseWhoAttdendedOneMeetup:
        (meetupUserId, didAttend, didRSVP) = attendee
        attendeeHistoryForThoseWhoAttendedOnlyOneMeetup["attended"] += didAttend
        attendeeHistoryForThoseWhoAttendedOnlyOneMeetup["rsvped"] += 1

    # Get important data for each event, necessary for linear regression
    events = (
        Attendance.query
        .with_entities(
            Attendance.event_id,
            Events.event_name,
            Events.event_date,
            func.count(case([(Attendance.did_attend == True, Attendance.did_rsvp)],
                            else_=literal_column("NULL"))).label('count_did_attend'),

            func.count(case([(Attendance.did_rsvp, 1)],
                            else_=literal_column("NULL"))).label('count_did_rsvp'),
            # Right now this includes those without user_ids such as (NONE)
            func.array_agg(Attendance.meetup_user_id).label('meetup_user_ids')
        )
        .join(Events)
        .group_by(Attendance.event_id, Events.event_name, Events.event_date)
        .all()
    )

    events_with_attendees = []
    for event in events:
        (event_id, event_name, event_date,
         attendee_count, rsvp_count, attendeeIds) = event

        # Getting previous attendance rates for each attendee at the event
        attendanceHistoryForUsersAtEvent = (
            Attendance.query
            .filter(
                Attendance.meetup_user_id.in_(attendeeIds),
                Attendance.rsvp_date <= event_date
            )
            .with_entities(
                Attendance.meetup_user_id,
                func.count(case([((Attendance.did_attend == True), 1)],
                                else_=literal_column("NULL"))).label('count_did_attend'),
                func.count(Attendance.did_rsvp).label('count_did_rsvp'))
            .group_by(Attendance.meetup_user_id)
            .all()
        )

        attendanceRates = []
        for userAttendanceHistory in attendanceHistoryForUsersAtEvent:
            (id, attended, rsvped) = userAttendanceHistory
            attendanceRates.append(attended / rsvped)

        events_with_attendees.append({
            "eventId": event_id,
            "event_name": event_name,
            "event_date": event_date,
            "attendee_count": attendee_count,
            "rsvp_count": rsvp_count,
            "previousAttendanceRatesSummed": sum(attendanceRates),
            "count": len(attendanceRates)
        })

    print(events_with_attendees)

    print(attendeeHistoryForThoseWhoAttendedOnlyOneMeetup)
    test = formatDataForModel(
        attendeeHistoryForThoseWhoAttendedOnlyOneMeetup=attendeeHistoryForThoseWhoAttendedOnlyOneMeetup, memberAttendanceHistory=attendanceHistory)

    return jsonify(data={"memberAttendanceHistory": attendanceHistory, "attendeeHistoryForThoseWhoAttendedOnlyOneMeetup": attendeeHistoryForThoseWhoAttendedOnlyOneMeetup})


if __name__ == '__main__':
    app.run()
