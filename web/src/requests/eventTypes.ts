export type EventData = {
  eventName: string;
  eventDate: string;
  // meetupEventId: string;
};

// Data coming back from eventRequest is shaped into the following form:
export type EventResponse = {
  id: number;
  name: string;
  date: string;
  attendees: number;
  rsvps: number;
  attendeesWhoRsvpd: number;
};

export type AttendeeData = {
  userId: string | null;
  didAttend: boolean;
  didRSVP: boolean;
  title: string;
  eventHost: string;
  rsvpDate: Date | null;
  dateJoinedGroup: Date | null;
};
