import { useState, useEffect, useContext } from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { useEventsCall } from "../../context/eventsHook";
import EventCard from "features/dashboard/components/EventCard";
import AttendanceCard from "features/singleMeetingAnalysis/components/AttendanceCard";
import { EventResponse } from "../../requests/eventTypes";
import { getMeetupSummaryData } from "requests/meetupSummaryRequest";
import { MeetupSummaryDTO } from "requests/meetupSummaryRequestTypes";
import Button from "@material-ui/core/Button";
// @ts-ignore
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { FirebaseContext } from "auth/FirebaseContext";

const loadMeetupSummaryData = async (setSummaryData: any) => {
  const data = await getMeetupSummaryData();
  setSummaryData(data);
};

const DashboardContainer = () => {
  const { isLoading, events } = useEventsCall();
  const { user, firebase } = useContext(FirebaseContext);

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
      <h3>Actions</h3>
      <Link to="/">
        <Button variant="contained">Summarize Event</Button>
      </Link>

      <Link to="prediction">
        <Button variant="contained">Predict Attendance for Next Event</Button>
      </Link>
      <div
        css={css`
           {
            padding: 10px;
            margin-top: 30px;
          }
        `}
      >
        <h3>Event Details</h3>
        <Grid container spacing={3}>
          {events.map((event: EventResponse) => (
            <Grid item xs={12} sm={6} md={4}>
              <EventCard key={event.id} event={event} />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default DashboardContainer;
