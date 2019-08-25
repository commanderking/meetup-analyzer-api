import {
  AttendanceHistory,
  MemberAttendanceHistory
} from "requests/attendanceHistoryTypes";

type AttendanceHistoryCount = {
  attended: number;
  rsvped: number;
};

export const getPredictedAttendanceFromMembersWithHistory = (
  attendanceHistory: AttendanceHistory
): number => {
  return attendanceHistory.memberAttendanceHistory.reduce(
    (acc: number, attendee: MemberAttendanceHistory) => {
      return acc + attendee.attended / attendee.rsvped;
    },
    0
  );
};

export const getFirstTimeAttendeeRate = (
  attendanceHistory: AttendanceHistory
): number => {
  const { attended, rsvped } = attendanceHistory.singleAttendanceCountAndRSVPs;

  return attended / rsvped;
};

export const getPredictedAttendanceCount = (
  attendanceHistory: AttendanceHistory,
  attendeeIds: string[]
): number => {
  const firstTimeAttendeeRate = getFirstTimeAttendeeRate(attendanceHistory);

  const regulars = attendanceHistory.memberAttendanceHistory.length;
  const firstTimers = attendeeIds.length - regulars;

  return Math.round(
    firstTimers * firstTimeAttendeeRate +
      getPredictedAttendanceFromMembersWithHistory(attendanceHistory)
  );
};
