import React, { useState } from "react";
import SingleMeetingForm from "./components/SingleMeetingForm";
import { AttendeeData } from "./SingleMeetingAnalysisTypes";
import SingleMeetingContent from "features/singleMeetingAnalysis/components/SingleMeetingContent";

const SingleMeetingAnalysisContainer = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [attendees, setAttendees] = useState<AttendeeData[]>([]);

  return (
    <div>
      {attendees.length === 0 && (
        <SingleMeetingForm
          setAttendees={setAttendees}
          eventName={eventName}
          eventDate={eventDate}
          setEventName={setEventName}
          setEventDate={setEventDate}
        />
      )}
      <SingleMeetingContent
        eventName={eventName}
        eventDate={eventDate}
        attendees={attendees}
        setAttendees={setAttendees}
      />
    </div>
  );
};

export default SingleMeetingAnalysisContainer;
