import _ from "lodash";
import { AttendanceCount } from "./types";

export const getGroupsByEventsAttended = (attendees: AttendanceCount[]) => {
  const attendeesByAttendanceCount = _.groupBy(attendees, (attendee) => {
    if (attendee.attendedCount >= 5) {
      return "5+";
    }
    return attendee.attendedCount;
  });

  const attendanceCounts = Object.keys(attendeesByAttendanceCount);

  return attendanceCounts.map((count) => {
    return {
      attendanceCount: count,
      memberCount: attendeesByAttendanceCount[count].length,
    };
  });
};

export const getAttendeesOfXEvents = (eventsAttended: number) => (
  attendees: AttendanceCount[]
) => {
  const attendeesOfXEvents = attendees.filter(
    (attendee) => attendee.attendedCount === eventsAttended
  );

  return attendeesOfXEvents;
};

export const getRSVPsForAttendeesOfXEvents = (eventsAttended: number) => (
  attendees: AttendanceCount[]
) => {
  const filteredAttendees = getAttendeesOfXEvents(eventsAttended)(attendees);

  const attendeesByAttendanceCount = _.groupBy(
    filteredAttendees,
    (attendee) => {
      if (attendee.rsvpedCount >= 5) {
        return "5+";
      }
      return attendee.rsvpedCount;
    }
  );

  const attendanceCounts = Object.keys(attendeesByAttendanceCount);

  return attendanceCounts.map((count) => {
    return {
      rsvpCount: count,
      memberCount: attendeesByAttendanceCount[count].length,
    };
  });
};
