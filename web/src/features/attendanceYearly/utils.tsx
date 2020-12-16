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
