from extensions import db


class Events(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.String())
    event_name = db.Column(db.String())
    event_date = db.Column(db.DateTime())
    attendance = db.relationship('Attendance', backref='events', lazy=True)

    def __init__(self, event_name, event_date):
        self.event_name = event_name
        self.event_date = event_date

    def __repr__(self):
        return '<event_name {}>'.format(self.event_name)


class Attendance(db.Model):
    __tablename__ = 'event_attendance'

    id = db.Column(db.Integer, primary_key=True)
    meetup_user_id = db.Column(db.String())
    event_id = db.Column(db.Integer, db.ForeignKey(
        'events.id'), nullable=False)
    did_attend = db.Column(db.Boolean())
    did_rsvp = db.Column(db.Boolean())
    title = db.Column(db.String())
    event_host = db.Column(db.String())
    rsvp_date = db.Column(db.DateTime())
    date_joined_group = db.Column(db.DateTime())

    def __init__(self, meetup_user_id, event_id, did_attend, did_rsvp, title, event_host, rsvp_date, date_joined_group):
        self.meetup_user_id = meetup_user_id
        self.event_id = event_id
        self.did_attend = did_attend
        self.did_rsvp = did_rsvp
        self.title = title
        self.event_host = event_host
        self.rsvp_date = rsvp_date
        self.date_joined_group = date_joined_group

    def __repr__(self):
        return '<meetup_user_id {}>'.format(self.meetup_user_id)
