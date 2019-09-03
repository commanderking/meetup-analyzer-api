import React from "react";
import { AttendeeData } from "../SingleMeetupTypes";
import {
  getMeetupMembersWhoAttendedSummary,
  getMeetupMembersWhoRSVPd
} from "../SingleMeetingAnalysisUtils";
import MeetupMembersPercentageSummary from "features/singleMeetingAnalysis/components/MeetupMembersPercentageSummary";
type Props = {
  attendees: AttendeeData[];
  eventDate: string;
};

const MeetupMembersSummary = ({ attendees, eventDate }: Props) => {
  const meetupMembersWhoAttended = getMeetupMembersWhoAttendedSummary(
    attendees,
    eventDate
  );

  const meetupMembersWhoRSVPd = getMeetupMembersWhoRSVPd(attendees, eventDate);

  return (
    <div>
      <div>
        <MeetupMembersPercentageSummary
          meetupMembersWhoAttended={meetupMembersWhoAttended}
          meetupMembersWhoRSVPd={meetupMembersWhoRSVPd}
        />
      </div>
    </div>
  );
};

export default MeetupMembersSummary;
