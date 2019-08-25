import React, { useState } from "react";
import { AttendeeData } from "../SingleMeetupTypes";
import SignUpAreaChart from "./SignUpAreaChart";
import _ from "lodash";
import { ButtonGroup, Button } from "reactstrap";
import {
  getSignupsPerDay,
  getSignupsAccumulated
} from "../SingleMeetingAnalysisUtils";

const SignupViews = {
  ACCUMULATED: "ACCUMULATED",
  DAILY: "DAIY"
};

const SignupSummary = ({
  attendees,
  eventDate
}: {
  attendees: AttendeeData[];
  eventDate: string;
}) => {
  const [signupView, setShowSignupView] = useState(SignupViews.ACCUMULATED);

  const signupDataAccumulated = getSignupsAccumulated(attendees, eventDate);
  const signupDataDaily = getSignupsPerDay(attendees, eventDate);

  return (
    <div>
      <h3>Signups Over Time</h3>
      <ButtonGroup>
        <Button
          size="sm"
          color={signupView === SignupViews.ACCUMULATED ? "info" : "secondary"}
          onClick={() => {
            setShowSignupView(SignupViews.ACCUMULATED);
          }}
        >
          Accumulated
        </Button>
        <Button
          size="sm"
          color={signupView === SignupViews.DAILY ? "info" : "secondary"}
          onClick={() => {
            setShowSignupView(SignupViews.DAILY);
          }}
        >
          Daily
        </Button>
      </ButtonGroup>
      {signupView === SignupViews.ACCUMULATED ? (
        <SignUpAreaChart data={_.values(signupDataAccumulated)} />
      ) : (
        <SignUpAreaChart data={_.values(signupDataDaily)} />
      )}
    </div>
  );
};

export default SignupSummary;
