import React from "react";
import { getSummaryData } from "./SingleMeetingAnalysisUtils";
import AttendanceCard from "./components/AttendanceCard";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { AttendeeData } from "./SingleMeetupTypes";
import Typography from "@material-ui/core/Typography";
import AttendanceRatePieChart from "features/singleMeetingAnalysis/components/AttendanceRatePieChart";
type Props = {
  attendees: AttendeeData[];
};

export const SingleMeetupSummary = ({ attendees }: Props) => {
  const summary = getSummaryData(attendees);
  const {
    numberRSVPs,
    numberAttendees,
    attendeesWhoRSVPd,
    attendeesWhoJoinedMeetupForEvent
  } = summary;

  const rsvpsWhoDidNotAttend = numberRSVPs - attendeesWhoRSVPd;
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
        <AttendanceRatePieChart
          attendeesWhoRSVPd={attendeesWhoRSVPd}
          rsvpsWhoDidNotAttend={rsvpsWhoDidNotAttend}
        />
        <div> {numberAttendees} Attendees</div>
        <div> {numberRSVPs} RSVPs</div>
        <div>{attendeesWhoJoinedMeetupForEvent} New Members</div>
      </div>
    </div>
  );
};
