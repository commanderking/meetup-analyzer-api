import _ from "lodash";
import { AttendanceCount } from "./types";

export const getGroupsByCount = (
  attendees: AttendanceCount[],
  countType: "attendedCount" | "rsvpedCount"
) => {
  const attendeesByAttendanceCount = _.groupBy(attendees, (attendee) => {
    if (attendee[countType] >= 5) {
      return "5+";
    }
    return attendee[countType];
  });

  const attendanceCounts = Object.keys(attendeesByAttendanceCount);

  return attendanceCounts.map((count) => {
    return {
      category: count,
      count: attendeesByAttendanceCount[count].length,
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

// I.e - we want to know for members who attended 1 event, how many RSVps did they make?
export const getRSVPsForAttendeesOfXEvents = (eventsAttended: number) => (
  attendees: AttendanceCount[]
) => {
  const filteredAttendees = getAttendeesOfXEvents(eventsAttended)(attendees);

  return getGroupsByCount(filteredAttendees, "rsvpedCount");
};
