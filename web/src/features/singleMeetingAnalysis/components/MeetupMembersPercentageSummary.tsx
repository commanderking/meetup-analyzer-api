import React from "react";
import { RelativeMeetupRegistrationDates } from "../SingleMeetupTypes";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import PercentageProgressBar from "./PercentageProgressBar";
type Props = {
  meetupMembersWhoAttended: RelativeMeetupRegistrationDates;
  meetupMembersWhoRSVPd: RelativeMeetupRegistrationDates;
};

const MeetupMembersPercentageSummary = ({
  meetupMembersWhoAttended,
  meetupMembersWhoRSVPd
}: Props) => {
  return (
    <div>
      <h3>% of RSVPs who Attended By Meetup Sign Up Date</h3>
      <div
        id="AttendeePercentagesByMeetupRegistrationDate"
        css={css`
          display: grid;
          grid-template-columns: 2fr 3fr;
        `}
      >
        <PercentageProgressBar
          text="Past Thirty Days"
          numerator={meetupMembersWhoAttended.pastThirtyDays}
          denominator={meetupMembersWhoRSVPd.pastThirtyDays}
        />
        <PercentageProgressBar
          text="Past Six Months"
          numerator={meetupMembersWhoAttended.pastSixMonths}
          denominator={meetupMembersWhoRSVPd.pastSixMonths}
        />
        <PercentageProgressBar
          text="Past Year"
          numerator={meetupMembersWhoAttended.pastYear}
          denominator={meetupMembersWhoRSVPd.pastYear}
        />
        <PercentageProgressBar
          text="Past Two Years"
          numerator={meetupMembersWhoAttended.pastTwoYears}
          denominator={meetupMembersWhoRSVPd.pastTwoYears}
        />
        <PercentageProgressBar
          text="More than 2 years"
          numerator={meetupMembersWhoAttended.overTwoYearsAgo}
          denominator={meetupMembersWhoRSVPd.overTwoYearsAgo}
        />
      </div>
    </div>
  );
};

export default MeetupMembersPercentageSummary;
