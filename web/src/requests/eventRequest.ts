import { AttendeeData, EventData } from "./eventTypes";

const BACKEND_BASE_URL = "localhost:5000";
const EVENT_ENDPOINT = `http://${BACKEND_BASE_URL}/events`;

type EventWithAttendees = EventData & { attendees: AttendeeData[] };

export const postEvent = async (eventWithAttendees: EventWithAttendees) => {
  try {
    const data = await fetch(EVENT_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(eventWithAttendees),
    });

    const dataJson = await data.json();
    return dataJson;
  } catch (err) {
    console.log("err", err);
  }
};

export const getEvents = async () => {
  try {
    const data = await fetch(EVENT_ENDPOINT, {
      method: "GET",
    });

    const dataJson = await data.json();
    return dataJson.data;
  } catch (err) {
    console.log("err", err);
  }
};
