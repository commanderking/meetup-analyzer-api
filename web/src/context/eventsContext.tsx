import React, { useState, useContext } from "react";
import { EventResponse } from "../requests/eventTypes";
const EventsContext = React.createContext<{
  events: Array<EventResponse>;
  currentEvent: string;
  setEvents: any;
  setCurrentEvent: any;
} | null>(null);

const EventsProvider = (props: {}) => {
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState("");

  const value = React.useMemo(() => {
    return {
      events,
      setEvents,
      currentEvent,
      setCurrentEvent
    };
  }, [events, currentEvent]);

  return <EventsContext.Provider value={value} {...props} />;
};

const useEventsState = () => {
  const context = useContext(EventsContext);

  if (!context) {
    throw new Error(
      "useEventsState must be used within a EventsContext Provider"
    );
  }

  return context;
};

export { EventsProvider, useEventsState };
