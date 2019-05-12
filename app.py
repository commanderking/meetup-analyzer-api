from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Might need to reference here for heroku deployment: https://realpython.com/flask-by-example-part-1-project-setup/

# Start up notes: 
# export APP_SETTINGS="config.DevelopmentConfig"
# export DATABASE_URL="postgresql://localhost/meetup_attendees"

@app.route('/')
def hello():
    return "Hello World!"

if __name__ == '__main__':
    app.run()