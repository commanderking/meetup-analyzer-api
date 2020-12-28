import moment from "moment";
import { RawEvent } from "./types";
import _ from "lodash";

const getEventsByYear = (events: RawEvent[]) => {
  const eventsByYear = _.groupBy(events, (event) =>
    moment(event.local_date).year()
  );
  return eventsByYear;
};

export const getYearlyEventsChart = (events: RawEvent[]) => {
  const eventsByYear = getEventsByYear(events);
  const chartData = _.map(eventsByYear, (events, key) => {
    const rsvpCount = events.reduce((rsvps, event) => {
      return rsvps + event.yes_rsvp_count;
    }, 0);
    return {
      id: key,
      year: key,
      events,
      eventsCount: events.length,
      rsvpCount,
    };
  });

  return chartData;
};
