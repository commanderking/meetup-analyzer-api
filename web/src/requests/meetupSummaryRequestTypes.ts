export type MeetupSummaryDTO = {
  currentYear: {
    attendeesWhoRSVPd: number;
    participation: number;
    totalAttendees: number;
    totalRSVPs: number;
    uniqueAttendees: number;
    uniqueRSVPs: number;
    nonMeetupAttendees: number;
  };
  attendeesWhoRSVPd: number;
  totalAttendees: number;
  totalRSVPs: number;
  uniqueAttendees: number;
  uniqueRSVPs: number;
  nonMeetupAttendees: number;
};
