import React from "react";
import { getSummaryData } from "./SingleMeetingAnalysisUtils";
import AttendanceCard from "./components/AttendanceCard";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { AttendeeData } from "./SingleMeetupTypes";

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
          padding: 20px;
          margin-bottom: 20px;
        }
      `}
    >
      <h3>
        Summary of Meetup: {eventName} {eventDate && `on ${eventDate}`}
      </h3>
      <div
        id="SingleMeetupSummary"
        css={css`
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
        `}
      >
        <AttendanceCard
          headerText="Total Attendees"
          bodyText={numberAttendees}
        />
        <AttendanceCard
          headerText="% of RSVPs that Attended"
          bodyText={`${Math.round((attendeesWhoRSVPd / numberRSVPs) * 100)}%`}
          subBodyText={`${attendeesWhoRSVPd} / ${numberRSVPs}`}
        />
        <AttendanceCard
          headerText="New Members"
          bodyText={attendeesWhoJoinedMeetupForEvent}
        />
      </div>
    </div>
  );
};
