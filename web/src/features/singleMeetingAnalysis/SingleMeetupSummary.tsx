import React from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { SummaryData } from "./SingleMeetingAnalysisTypes";
import Typography from "@material-ui/core/Typography";
import AttendanceRatePieChart from "features/singleMeetingAnalysis/components/AttendanceRatePieChart";
type Props = {
  summaryData: SummaryData;
};

export const SingleMeetupSummary = ({ summaryData }: Props) => {
  const {
    numberRSVPs,
    numberAttendees,
    attendeesWhoRSVPd,
    attendeesWhoJoinedMeetupDuringEventWindow,
    attendeesWithoutRSVP
  } = summaryData;

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
          numberRSVPs={numberRSVPs}
        />
        <div> {numberAttendees} Attendees</div>
        {attendeesWithoutRSVP > 0 && (
          <div>
            <i>({attendeesWhoRSVPd} rsvped on meetup)</i>
          </div>
        )}
        <div> {numberRSVPs} RSVPs</div>
        <div>{attendeesWhoJoinedMeetupDuringEventWindow} New Members</div>
      </div>
    </div>
  );
};
