export type MemberAttendanceHistory = {
  attended: number;
  rsvped: number;
  meetupUserId: number;
};

export type AttendanceHistory = {
  singleAttendanceCountAndRSVPs: {
    attended: number;
    rsvped: number;
  };
  memberAttendanceHistory: MemberAttendanceHistory[];
};
