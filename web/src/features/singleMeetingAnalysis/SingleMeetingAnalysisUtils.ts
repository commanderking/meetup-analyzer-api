import Moment from "moment";
import { extendMoment } from "moment-range";
import _ from "lodash";

import {
  RawAttendeeData,
  AttendeeData,
  RelativeMeetupRegistrationDates,
  AttendeeCountsForDate,
  AttendanceRateBySignupDate,
  AttendanceBySignupDateForTable
} from "./SingleMeetupTypes";

// @ts-ignore
const moment = extendMoment(Moment);
const defaultAttendedMarker = "Y";

const attendedMeetup = (user: RawAttendeeData) => {
  return user.Attendance === defaultAttendedMarker ? true : false;
};

const didRSVP = (user: RawAttendeeData) => {
  return user.RSVP === "Yes" ? true : false;
};

export const bindRawMeetupData = (
  meetupData: RawAttendeeData[]
): AttendeeData[] => {
  return meetupData.map((user: RawAttendeeData) => {
    return {
      userId:
        user["User ID"] !== "" ? user["User ID"].replace("user ", "") : null,
      didAttend: attendedMeetup(user),
      didRSVP: didRSVP(user),
      title: user.Title,
      eventHost: user["Event Host"],
      rsvpDate: user["RSVPed on"] !== "" ? new Date(user["RSVPed on"]) : null,
      dateJoinedGroup: user["Joined Group on"]
        ? new Date(user["Joined Group on"])
        : null
    };
  });
};

export const getMeetupUserIds = (meetupData: AttendeeData[]): string[] => {
  // @ts-ignore - seems like I'm filtering out all null values with Boolean, but still says it can be null?
  return meetupData
    .map((attendee: AttendeeData) => {
      return attendee && attendee.userId;
    })
    .filter(Boolean);
};

const registeredWithin30DaysOfEvent = (
  dateJoined: Date,
  eventDate: Date
): boolean =>
  moment(dateJoined).isBetween(
    moment(eventDate).subtract(30, "days"),
    moment(eventDate)
  );

const registeredWithinPastSixMonthsOfEvent = (
  dateJoined: Date,
  eventDate: Date
): boolean =>
  moment(dateJoined).isBetween(moment(eventDate).subtract(180, "days"));

const registeredWithinPastYearOfEvent = (
  dateJoined: Date,
  eventDate: Date
): boolean =>
  moment(dateJoined).isBetween(
    moment(eventDate).subtract(365, "days"),
    moment(eventDate)
  );

const registeredWithinTwoYearsOfEvent = (
  dateJoined: Date,
  eventDate: Date
): boolean =>
  moment(dateJoined).isBetween(
    moment(eventDate).subtract(710, "days"),
    moment(eventDate)
  );

const getRelativeRegistrationDate = (
  acc: RelativeMeetupRegistrationDates,
  attendee: AttendeeData,
  eventDate: Date
) => {
  const { dateJoinedGroup } = attendee;
  if (!dateJoinedGroup) {
    return acc;
  }

  if (registeredWithin30DaysOfEvent(dateJoinedGroup, eventDate)) {
    return {
      ...acc,
      pastThirtyDays: acc.pastThirtyDays + 1
    };
  }

  if (registeredWithinPastSixMonthsOfEvent(dateJoinedGroup, eventDate)) {
    return {
      ...acc,
      pastSixMonths: acc.pastSixMonths + 1
    };
  }

  if (registeredWithinPastYearOfEvent(dateJoinedGroup, eventDate)) {
    return {
      ...acc,
      pastYear: acc.pastYear + 1
    };
  }

  if (registeredWithinTwoYearsOfEvent(dateJoinedGroup, eventDate)) {
    return {
      ...acc,
      pastTwoYears: acc.pastTwoYears + 1
    };
  }

  return {
    ...acc,
    overTwoYearsAgo: acc.overTwoYearsAgo + 1
  };
};

const isMeetupGroupMemberAttendee = (attendee: AttendeeData): boolean =>
  Boolean(attendee.didAttend && attendee.dateJoinedGroup && attendee.didRSVP);

const isAttendeeWhoJoinedMeetupForEvent = (attendee: AttendeeData): boolean => {
  const { rsvpDate, dateJoinedGroup, didAttend } = attendee;
  return Boolean(
    rsvpDate &&
      dateJoinedGroup &&
      didAttend &&
      moment(rsvpDate).isSame(dateJoinedGroup, "day")
  );
};

export const getMeetupMembersWhoAttendedSummary = (
  attendees: AttendeeData[],
  eventDate: string
): RelativeMeetupRegistrationDates => {
  return attendees
    .filter(attendee => isMeetupGroupMemberAttendee(attendee))
    .reduce(
      (acc, currentAttendee) => {
        return getRelativeRegistrationDate(
          acc,
          currentAttendee,
          new Date(eventDate)
        );
      },
      {
        pastThirtyDays: 0,
        pastSixMonths: 0,
        pastYear: 0,
        pastTwoYears: 0,
        overTwoYearsAgo: 0
      }
    );
};

export const getMeetupMembersWhoRSVPd = (
  attendees: AttendeeData[],
  eventDate: string
): RelativeMeetupRegistrationDates => {
  return attendees
    .filter(attendee => Boolean(attendee.didRSVP))
    .reduce(
      (acc, currentAttendee) =>
        getRelativeRegistrationDate(acc, currentAttendee, new Date(eventDate)),
      {
        pastThirtyDays: 0,
        pastSixMonths: 0,
        pastYear: 0,
        pastTwoYears: 0,
        overTwoYearsAgo: 0
      }
    );
};

const getPercent = (num: number, den: number): string => {
  if (!den) {
    return "N/A";
  }

  return `${Math.round((num / den) * 100)}%`;
};

type MembershipLengths =
  | "pastThirtyDays"
  | "pastSixMonths"
  | "pastYear"
  | "pastTwoYears"
  | "overTwoYearsAgo";

const getMembershipTenureTableDataRowCreator = (
  attendedCounts: RelativeMeetupRegistrationDates,
  rsvpCounts: RelativeMeetupRegistrationDates
) => (membershipLength: MembershipLengths, labelName: string) => {
  return {
    name: labelName,
    attendees: attendedCounts[membershipLength],
    rsvps: rsvpCounts[membershipLength],
    rsvpPercent: getPercent(
      attendedCounts[membershipLength],
      rsvpCounts[membershipLength]
    )
  };
};

export const getMeetupAttendanceByTenureTableData = (
  attendees: AttendeeData[],
  eventDate: string
) => {
  const rsvpCounts = getMeetupMembersWhoRSVPd(attendees, eventDate);
  const attendedCounts = getMeetupMembersWhoAttendedSummary(
    attendees,
    eventDate
  );

  const getTableRow = getMembershipTenureTableDataRowCreator(
    attendedCounts,
    rsvpCounts
  );

  return [
    getTableRow("pastThirtyDays", "< 1 month"),
    getTableRow("pastSixMonths", "1 - 6 months"),
    getTableRow("pastYear", "6 - 12 months"),
    getTableRow("pastTwoYears", "12 -24 months"),
    getTableRow("overTwoYearsAgo", "24+ months")
  ];
};

export const getSummaryData = (attendees: AttendeeData[]) => {
  return attendees.reduce(
    (acc, currentAttendee) => {
      const { didRSVP, didAttend } = currentAttendee;

      return {
        ...acc,
        totalCount: acc.totalCount + 1,
        numberRSVPs: acc.numberRSVPs + (didRSVP ? 1 : 0),
        numberAttendees: acc.numberAttendees + (didAttend ? 1 : 0),
        attendeesWhoRSVPd:
          acc.attendeesWhoRSVPd +
          (isMeetupGroupMemberAttendee(currentAttendee) ? 1 : 0),
        attendeesWhoJoinedMeetupForEvent:
          acc.attendeesWhoJoinedMeetupForEvent +
          (isAttendeeWhoJoinedMeetupForEvent(currentAttendee) ? 1 : 0)
      };
    },
    {
      totalCount: 0,
      numberRSVPs: 0,
      numberAttendees: 0,
      attendeesWhoRSVPd: 0,
      attendeesWhoJoinedMeetupForEvent: 0
    }
  );
};

const getFirstDateAttendeeSignedUp = (attendees: AttendeeData[]) => {
  return attendees.reduce((earliestDate: any, attendee: AttendeeData) => {
    const momentStartDate =
      attendee.rsvpDate && moment(attendee.rsvpDate) < earliestDate
        ? moment(attendee.rsvpDate).startOf("day")
        : earliestDate;
    return momentStartDate;
  }, moment());
};

// TODO: Type this better
const weekdayNumberToTextMap: any = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat"
};

const createInitialSignups = (days: number, firstDate: any) => {
  let initialSignups: any = {};
  _.times(days + 1, index => {
    const dateOfSignup = moment(firstDate).add(index, "days");
    const dayOfWeek = weekdayNumberToTextMap[dateOfSignup.day()];

    const displayDate = `${dateOfSignup.month() + 1}/${dateOfSignup.date()}`;

    initialSignups[index] = {
      daysSinceFirstSignupDay: index,
      rawDate: dateOfSignup,
      count: 0,
      attendedCount: 0,
      rsvpNotAttendedCount: 0,
      dayOfWeek,
      displayDate,
      attendees: []
    };
  });

  return initialSignups;
};

export const getSignupsPerDay = (
  attendees: AttendeeData[],
  eventDate: string
) => {
  const firstDate = getFirstDateAttendeeSignedUp(attendees);
  const difference = moment()
    .range(firstDate.startOf("day"), moment(eventDate).startOf("day"))
    .diff("days");

  const attendeesWhoRSVPd = attendees.filter(attendee => attendee.didRSVP);

  const initialSignups = createInitialSignups(difference, firstDate);

  return attendeesWhoRSVPd.reduce((acc: any, attendee: AttendeeData) => {
    const signupDate =
      (attendee.rsvpDate && moment(attendee.rsvpDate)) || moment(eventDate);

    const daysAfterFirstDay = moment()
      .range(
        moment(firstDate).startOf("day"),
        moment(signupDate).startOf("day")
      )
      .diff("days");

    const { didAttend, didRSVP } = attendee;

    return {
      ...acc,
      [daysAfterFirstDay]: {
        ...acc[daysAfterFirstDay],
        count: acc[daysAfterFirstDay].count + 1,
        attendedCount:
          acc[daysAfterFirstDay].attendedCount + (didAttend ? 1 : 0),
        rsvpNotAttendedCount:
          acc[daysAfterFirstDay].rsvpNotAttendedCount +
          (didRSVP && !didAttend ? 1 : 0),
        attendees: [...acc[daysAfterFirstDay].attendees, attendee]
      }
    };
  }, initialSignups);
};

export const getSignupsAccumulated = (
  attendees: AttendeeData[],
  eventDate: string
) => {
  const signupsPerDay = getSignupsPerDay(attendees, eventDate);

  const signupsAfterFirstDay = _.omit(signupsPerDay, "0");
  const accumulatedSignUpsPerDay = _.reduce(
    signupsAfterFirstDay,
    (acc, day) => {
      return {
        ...acc,
        [day.daysSinceFirstSignupDay]: {
          ...day,
          // @ts-ignore
          count: day.count + acc[day.daysSinceFirstSignupDay - 1].count
        }
      };
    },
    { 0: signupsPerDay["0"] }
  );
  return accumulatedSignUpsPerDay;
};

export const getAttendanceRateBySignupDate = (
  attendees: AttendeeData[],
  eventDate: string
): AttendanceRateBySignupDate => {
  const signupsPerDay = getSignupsPerDay(attendees, eventDate);

  return _.reduce(
    signupsPerDay,
    (days, value, key) => {
      const attendees = value.attendees;

      const initialCounts = {
        rsvped: 0,
        attended: 0
      };

      const attendeeSummaryPerDay = attendees.reduce(
        (attendeeCounts: AttendeeCountsForDate, attendee: AttendeeData) => {
          return {
            ...attendeeCounts,
            rsvped: attendeeCounts.rsvped + 1,
            attended: attendee.didAttend
              ? attendeeCounts.attended + 1
              : attendeeCounts.attended
          };
        },
        initialCounts
      );

      return {
        ...days,
        [key]: {
          ...attendeeSummaryPerDay,
          displayDate: value.displayDate
        }
      };
    },
    {}
  );
};
const sumAttendanceRates = (
  attendance: AttendeeCountsForDate,
  value: AttendeeCountsForDate
): AttendeeCountsForDate => ({
  rsvped: attendance.rsvped + value.rsvped,
  attended: attendance.attended + value.attended
});

export const getFirstWeekSignups = (
  attendanceRateBySignupDate: AttendanceRateBySignupDate
) => {
  if (_.size(attendanceRateBySignupDate) < 7) {
    return null;
  }

  const firstWeekAttendanceRate = _.filter(
    attendanceRateBySignupDate,
    (value, key) => {
      const daysAfterFirstDay = parseInt(key);
      return daysAfterFirstDay > 0 && daysAfterFirstDay < 7;
    }
  );
  // @ts-ignore
  return _.reduce(firstWeekAttendanceRate, sumAttendanceRates, {
    rsvped: 0,
    attended: 0
  });
};

export const getLastWeekSignups = (
  attendanceRateBySignupDate: AttendanceRateBySignupDate
) => {
  const totalDays = _.size(attendanceRateBySignupDate);
  if (totalDays < 7) {
    return null;
  }

  const lastDay = totalDays - 1;

  const firstWeekAttendanceRate = _.filter(
    attendanceRateBySignupDate,
    (value, key) => {
      const daysAfterFirstDay = parseInt(key);
      return daysAfterFirstDay > lastDay - 7;
    }
  );
  // @ts-ignore
  return _.reduce(firstWeekAttendanceRate, sumAttendanceRates, {
    rsvped: 0,
    attended: 0
  });
};

export const getAttendeesBySignupDateTable = (
  attendanceRateBySignupDate: AttendanceRateBySignupDate
): AttendanceBySignupDateForTable[] => {
  return _.map(attendanceRateBySignupDate, date => {
    return {
      ...date,
      percent: Math.round((date.attended / date.rsvped) * 100)
    };
  })
    .filter(date => date.rsvped >= 5)
    .sort();
};
