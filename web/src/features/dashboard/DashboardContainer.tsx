import { useState, useEffect } from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import LoginContainer from "../login/LoginContainer";
import { useEventsCall } from "../../context/eventsHook";
import EventCard from "features/dashboard/components/EventCard";
import AttendanceCard from "features/singleMeetingAnalysis/components/AttendanceCard";
import { EventResponse } from "../../requests/eventTypes";
import { getMeetupSummaryData } from "requests/meetupSummaryRequest";
import { MeetupSummaryDTO } from "requests/meetupSummaryRequestTypes";
import { Button } from "reactstrap";
// @ts-ignore
import { Link } from "react-router-dom";

const login = async (authenticationToken: string) => {
  await fetch("http://localhost:5000/login", {
    method: "GET",
    // mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${authenticationToken}`
    }
  });
};

const loadMeetupSummaryData = async (setSummaryData: any) => {
  const data = await getMeetupSummaryData();
  setSummaryData(data);
};

const DashboardContainer = ({ auth }: any) => {
  useEffect(() => {
    // console.log("auth", auth);
    // console.log("auth", auth.getAccessToken());
    // console.log("auth", auth.getIdToken());
    // console.log("auth", auth.isAuthenticated());
    if (auth && auth.getAccessToken()) {
      login(auth.getIdToken());
    }
  }, [auth]);

  const { isLoading, events } = useEventsCall();

  const [summaryData, setSummaryData]: [
    MeetupSummaryDTO | null,
    any
  ] = useState(null);
  useEffect(() => {
    loadMeetupSummaryData(setSummaryData);
  }, []);

  if (isLoading) return <div>Loading...</div>;

  if (!summaryData) return <div>Loading...</div>;

  const { currentYear } = summaryData;
  const {
    totalAttendees,
    totalRSVPs,
    uniqueAttendees,
    uniqueRSVPs
  } = currentYear;
  return (
    <div>
      {/* <LoginContainer auth={auth} /> */}
      <div>Dashboard</div>
      <Link to="/prediction">
        <Button>Predict Attendance for Next Event</Button>
      </Link>
      <div
        css={css`
           {
            padding: 10px;
          }
        `}
      >
        <h3>Year to Date Statistics (2019)</h3>
        <div
          id="SingleMeetupSummary"
          css={css`
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
          `}
        >
          <AttendanceCard
            headerText="Total Attendees"
            bodyText={totalAttendees}
          />
          <AttendanceCard headerText="Total RSVPs" bodyText={totalRSVPs} />
          <AttendanceCard
            headerText="Unique Attendees"
            bodyText={uniqueAttendees}
          />
          <AttendanceCard headerText="Unique RSVPs" bodyText={uniqueRSVPs} />
        </div>
      </div>
      <div
        css={css`
           {
            padding: 10px;
            margin-top: 30px;
          }
        `}
      >
        <h3>Event Details</h3>
        <div
          css={css`
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-column-gap: 20px;
            grid-row-gap: 20px;
            grid-auto-rows: 1fr;
            padding: 20px;
          `}
        >
          {events.map((event: EventResponse) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardContainer;
