import React, { useEffect, useState, useContext } from "react";
import { useEventsState } from "../../context/eventsContext";
import { getAttendanceForEvents } from "../../requests/attendanceRequest";
import moment from "moment";
import { useEventsCall } from "../../context/eventsHook";
import SingleMeetingContent from "features/singleMeetingAnalysis/components/SingleMeetingContent";
import { RouteComponentProps } from "react-router-dom";
import { FirebaseContext } from "auth/FirebaseContext";
type MatchParams = {
  id: string;
};

interface Props extends RouteComponentProps<MatchParams> {}

// TODO: Update user with UserAuth Type
const getAttendance = async (
  eventId: number,
  setAttendance: any,
  user: any
) => {
  const attendance = await getAttendanceForEvents([eventId]);
  await setAttendance(attendance);
};

const EventContainer = ({ match }: Props) => {
  const [attendance, setAttendance] = useState([]);
  const { isLoading } = useEventsCall();
  const { user } = useContext(FirebaseContext);

  const { events } = useEventsState();
  const event = events.find((event) => event.id === parseInt(match.params.id));
  useEffect(() => {
    if (event) {
      getAttendance(event.id, setAttendance, user);
    }
  }, [event]);

  if (isLoading) return <div>Loading...</div>;
  if (!event) return <div>No event found</div>;

  const eventDateFormatted = moment.utc(event.date).format("MM/DD/YY");
  console.log("attendance", attendance);
  return attendance ? (
    <SingleMeetingContent
      attendees={attendance}
      eventDate={eventDateFormatted}
      eventName={event.name}
    />
  ) : null;
};

export default EventContainer;
