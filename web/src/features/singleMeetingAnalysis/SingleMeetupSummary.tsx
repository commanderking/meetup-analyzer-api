import React from "react";
import { getSummaryData } from "./SingleMeetingAnalysisUtils";
import AttendanceCard from "./components/AttendanceCard";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { AttendeeData } from "./SingleMeetupTypes";
import Typography from "@material-ui/core/Typography";

type Props = {
  attendees: AttendeeData[];
  eventName: string;
  eventDate: string;
};

export const SingleMeetupSummary = ({
  attendees,
  eventName,
  eventDate
}: Props) => {
  const summary = getSummaryData(attendees);
  const {
    numberRSVPs,
    numberAttendees,
    attendeesWhoRSVPd,
    attendeesWhoJoinedMeetupForEvent
  } = summary;
  return (
    <div
      css={css`
         {
          margin-left: 20px;
          margin-bottom: 20px;
          text-align: center;
        }
      `}
    >
      <div id="SingleMeetupSummary">
        <Typography variant="h5" gutterBottom>
          Summary
        </Typography>
        <div> {numberAttendees} Attendees</div>
        <div> {numberRSVPs} RSVPs</div>
        <div>{attendeesWhoJoinedMeetupForEvent} New Members</div>
      </div>
    </div>
  );
};
