import { EventResponse } from "requests/eventTypes";
import moment from "moment";
import { getPercentage } from "common/utils/formatUtils";
import { Years, YearsEnum } from "common/enum/Years";

export const isEventInYear = (event: EventResponse, year: Years): boolean => {
  if (year === YearsEnum.ALL) {
    return true;
  }
  const eventYear = moment(event.date).format("YYYY");
  return eventYear === year;
};

export const getEventsTableData = (events: EventResponse[]) => {
  return events.map(event => {
    const { id, name, date, attendees, rsvps, attendeesWhoRsvpd } = event;
    return {
      id,
      name,
      date: moment(date).format("MM/DD/YYYY"),
      attendeesWhoRsvpd,
      attendees,
      rsvps,
      meetupAttendancePercent: getPercentage(attendeesWhoRsvpd, rsvps)
    };
  });
};
