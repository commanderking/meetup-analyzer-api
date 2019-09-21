import React from "react";
import { SingleMeetupSummary } from "features/singleMeetingAnalysis/SingleMeetupSummary";
import DetailsTabs from "features/singleMeetingAnalysis/components/DetailsTabs";
import Button from "@material-ui/core/Button";
import { postEvent } from "requests/eventRequest";
import AttendanceBySignupDate from "features/singleMeetingAnalysis/components/AttendanceBySignupDate";

type ContentProps = {
  setAttendees: Function;
  eventName: string;
  eventDate: string;
  attendees: any[]; // TODO: Update with attendees type
};

const SingleMeetingContent = ({
  setAttendees,
  eventName,
  eventDate,
  attendees
}: ContentProps) => {
  return (
    <div>
      {attendees.length > 0 && (
        <React.Fragment>
          <SingleMeetupSummary attendees={attendees} />
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setAttendees([]);
            }}
          >
            Enter new Data
          </Button>
          <DetailsTabs attendees={attendees} eventDate={eventDate} />
          <Button
            onClick={async () => {
              await postEvent({
                eventName,
                eventDate,
                attendees
              });
            }}
          >
            Save Summary
          </Button>
          <AttendanceBySignupDate attendees={attendees} eventDate={eventDate} />
        </React.Fragment>
      )}
    </div>
  );
};

export default SingleMeetingContent;
