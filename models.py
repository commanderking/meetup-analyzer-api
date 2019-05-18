from extensions import db

class Events(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.String())
    event_name = db.Column(db.String())
    event_date = db.Column(db.DateTime())

    def __init__(self, event_name, event_date ):
        self.event_name = event_name
        self.event_date = event_date

    def __repr__(self):
        return '<event_name {}>'.format(self.event_name)

'''
class Result(db.Model):
    __tablename__ = 'event_attendance'

    id = db.Column(db.Integer, primary_key=True)
    meetup_user_id = db.Column(db.String())
    meeting_id = db.Column(db.String())
    did_attend = db.Column(db.Boolean())
    did_rsvp = db.Column(db.Boolean())
    title = db.Column(db.String())
    event_host = db.Column(db.String())
    rsvp_date = db.Column(db.DateTime())
    date_joined_group = db.Column(db.DateTime())

    def __init__(self, meetup_user_id):
        self.meetupUserId = meetup_user_id

    def __repr__(self):
        return '<id {}>'.format(self.id)
'''