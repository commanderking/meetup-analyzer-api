export type RawAttendeeData = {
  Name: string;
  Attendance: string;
  "User ID": string;
  Title: string;
  "Event Host": string;
  RSVP: string;
  Guests: string;
  "RSVPed on": string;
  "Joined Group on": string;
  "URL of Member Profile": string;
  Notes: string;
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

export type RelativeMeetupRegistrationDates = {
  pastThirtyDays: number;
  pastSixMonths: number;
  pastYear: number;
  pastTwoYears: number;
  overTwoYearsAgo: number;
};

export type AttendeeCountsForDate = {
  rsvped: number;
  attended: number;
};

export type AttendanceRateBySignupDate = {
  [key: string]: AttendeeCountsForDate;
};

export type AttendanceBySignupDateForTable = AttendeeCountsForDate & {
  percent: number;
};
