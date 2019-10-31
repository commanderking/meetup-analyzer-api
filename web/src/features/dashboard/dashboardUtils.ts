import { EventResponse } from "requests/eventTypes";
import moment from "moment";
import { getPercentage } from "common/utils/formatUtils";

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
