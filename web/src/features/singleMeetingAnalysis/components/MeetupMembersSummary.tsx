import React, { useState } from "react";
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

const MeetupMembers = {
  ATTENDEES: "ATTENDEES",
  RSVPERS: "RSVPERS"
};

const MeetupMembersSummary = ({ attendees, eventDate }: Props) => {
  const [meetupMemberType, setMeetupMemberType] = useState(
    MeetupMembers.ATTENDEES
  );

  const meetupMembersWhoAttended = getMeetupMembersWhoAttendedSummary(
    attendees,
    eventDate
  );

  const meetupMembersWhoRSVPd = getMeetupMembersWhoRSVPd(attendees, eventDate);

  return (
    <div>
      {meetupMemberType === MeetupMembers.ATTENDEES && (
        <div>
          <MeetupMembersPercentageSummary
            meetupMembersWhoAttended={meetupMembersWhoAttended}
            meetupMembersWhoRSVPd={meetupMembersWhoRSVPd}
          />
        </div>
      )}
      {meetupMemberType === MeetupMembers.RSVPERS && (
        <div>
          <MeetupMembersPercentageSummary
            meetupMembersWhoAttended={meetupMembersWhoAttended}
            meetupMembersWhoRSVPd={meetupMembersWhoRSVPd}
          />
        </div>
      )}
    </div>
  );
};

/*
          <MeetupMembersChart
            title="Attendees Joined This Meetup Within..."
            attendeesByDate={meetupMembersWhoAttended}
          />
                    <MeetupMembersChart
            title="RSVPers Joined This Meetup Within..."
            attendeesByDate={meetupMembersWhoRSVPd}
          />

                <ButtonGroup>
        <Button
          size="sm"
          color={
            meetupMemberType === MeetupMembers.ATTENDEES ? "info" : "secondary"
          }
          onClick={() => {
            setMeetupMemberType(MeetupMembers.ATTENDEES);
          }}
        >
          Attendees
        </Button>
        <Button
          size="sm"
          color={
            meetupMemberType === MeetupMembers.RSVPERS ? "info" : "secondary"
          }
          onClick={() => {
            setMeetupMemberType(MeetupMembers.RSVPERS);
          }}
        >
          RSVPers
        </Button>
      </ButtonGroup>
      */

export default MeetupMembersSummary;
