import React, { useEffect, useState } from "react";
import _ from "lodash";
import { useEventsState } from "../../context/eventsContext";
import { getAttendanceForEvents } from "../../requests/attendanceRequest";
import { SingleMeetupSummary } from "../singleMeetingAnalysis/SingleMeetupSummary";
import moment from "moment";
import { useEventsCall } from "../../context/eventsHook";
import DetailsTabs from "features/singleMeetingAnalysis/components/DetailsTabs";
import AttendanceBySignupDate from "features/singleMeetingAnalysis/components/AttendanceBySignupDate";
import Grid from "@material-ui/core/Grid";
import SignUpChartDaily from "features/singleMeetingAnalysis/components/SignUpChartDaily";
import { getSignupsPerDay } from "features/singleMeetingAnalysis/SingleMeetingAnalysisUtils";

type Props = {
  match: any;
};

const getAttendance = async (eventId: number, setAttendance: any) => {
  const attendance = await getAttendanceForEvents([eventId]);
  await setAttendance(attendance);
};

const EventContainer = ({ match }: Props) => {
  const [attendance, setAttendance] = useState([]);
  const { isLoading } = useEventsCall();

  const { events } = useEventsState();
  const event = events.find(event => event.id === parseInt(match.params.id));
  useEffect(() => {
    if (event) {
      getAttendance(event.id, setAttendance);
    }
  }, [event]);

  if (isLoading) return <div>Loading...</div>;
  if (!event) return <div>No event found</div>;

  const eventDateFormatted = moment.utc(event.date).format("MM/DD/YY");

  const singupData = getSignupsPerDay(attendance, eventDateFormatted);
  return (
    <div>
      <h3>{event.name}</h3>
      {eventDateFormatted && <h5>{eventDateFormatted}</h5>}
      <Grid
        container
        spacing={1}
        style={{ maxWidth: "1000px", margin: "auto" }}
      >
        <Grid item sm={3} xs={12}>
          <SingleMeetupSummary
            attendees={attendance}
            eventName={event.name}
            eventDate={eventDateFormatted}
          />
        </Grid>
        <Grid item sm={9} xs={12}>
          <SignUpChartDaily data={_.values(singupData)} />
        </Grid>
      </Grid>
      <DetailsTabs attendees={attendance} eventDate={eventDateFormatted} />
      <AttendanceBySignupDate
        attendees={attendance}
        eventDate={eventDateFormatted}
      />
    </div>
  );
};

export default EventContainer;
