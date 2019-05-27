from flask import Flask, request, jsonify, _request_ctx_stack
from flask_sqlalchemy import SQLAlchemy
import os
import json
import requests

from functools import wraps
from flask_cors import cross_origin
from jose import jwt

AUTH0_DOMAIN = os.environ["AUTH0_DOMAIN"]
API_AUDIENCE= os.environ["API_AUDIENCE"]
ALGORITHMS = ["RS256"]

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

from extensions import db
db.init_app(app)

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
        jsonurl = requests.get("https://"+AUTH0_DOMAIN+"/.well-known/jwks.json").json()
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

from models import Events, Attendance

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