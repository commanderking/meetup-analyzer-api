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

export type DailyAttendance = {
  daysSinceFirstSignupDay: number;
  rawDate: any; // TODO_TYPES: Date doesn't work, should be a specific moment type?
  count: number;
  attendedCount: number;
  rsvpNotAttendedCount: number;
  dayOfWeek: string;
  displayDate: string;
  attendees: AttendeeData[];
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

export type MembershipLengthTableRow = {
  name: string;
  attendees: number;
  rsvps: number;
  rsvpPercent: number | null;
};

export type SignupPeriodTableRow = {
  name: string;
  attendees: number | null;
  rsvps: number | null;
  rsvpPercent: number | null;
};

export type MembershipLengths =
  | "pastThirtyDays"
  | "pastSixMonths"
  | "pastYear"
  | "pastTwoYears"
  | "overTwoYearsAgo";
