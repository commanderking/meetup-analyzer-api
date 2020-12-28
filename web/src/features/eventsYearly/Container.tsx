import React, { useState, useEffect } from "react";
import { RawEvent } from "./types";
import { getYearlyEventsChart } from "./utils";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";

const YearlyEventsContainer = () => {
  const [events, setEvents] = useState([]);

  const getEvents = async () => {
    const results = await (await fetch(
      "http://localhost:5000/meetupapi/events"
    )).json();
    setEvents(results);
  };
  useEffect(() => {
    getEvents();
  }, []);

  const eventsChart = getYearlyEventsChart(events);

  return (
    <div>
      <div style={{ margin: "auto", width: "500px", display: "block" }}>
        <h3>Events Per Year</h3>
        <BarChart width={500} height={250} data={eventsChart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis
            ticks={[0, 5, 10, 15, 20, 25, 30]}
            label={{
              value: "Events",
              angle: -90,
              offset: 20,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Bar dataKey="eventsCount" fill="#8884D8" />
        </BarChart>
      </div>
      <div style={{ margin: "auto", width: "500px", display: "block" }}>
        <h3>Events Per Year</h3>
        <BarChart width={500} height={250} data={eventsChart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis
            label={{
              value: "Total RSVPs",
              angle: -90,
              offset: 0,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Bar dataKey="rsvpCount" fill="lightred" />
        </BarChart>
      </div>
    </div>
  );
};

export default YearlyEventsContainer;
