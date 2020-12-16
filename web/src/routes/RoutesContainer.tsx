import React from "react";
import SingleMeetingAnalysisContainer from "features/singleMeetingAnalysis/SingleMeetingAnaylsisContainer";
import { BrowserRouter as Router, Route } from "react-router-dom";
import DashboardContainer from "features/dashboard/DashboardContainer";
import EventContainer from "features/event/EventContainer";
import AttendancePredictorContainer from "features/attendancePredictor/AttendancePredictorContainer";
import LoginContainer from "auth/LoginContainer";
import SignupContainer from "auth/SignupContainer";
import MenuBar from "common/components/MenuBar";
import GroupMembersContainer from "features/groupMembers/GroupMembersContainer";
import YearlyAttendanceContaniner from "features/attendanceYearly/Container";

const baseUrl = "base";
const getPath = (path: string) => `/${baseUrl}/${path}`;

const Routes = () => {
  return (
    <div className="App">
      <Router>
        <MenuBar />

        <Route path="/" exact component={SingleMeetingAnalysisContainer} />
        <Route path={getPath("dashboard")} component={DashboardContainer} />
        <Route path={getPath("event/:id")} component={EventContainer} />
        <Route
          path={getPath("prediction")}
          component={AttendancePredictorContainer}
        />
        <Route path={getPath("login")} component={LoginContainer} />
        <Route path={getPath("signup")} component={SignupContainer} />
        <Route
          path={getPath("groupmembers")}
          component={GroupMembersContainer}
        />
        <Route
          path={getPath("yearlyattendance")}
          component={YearlyAttendanceContaniner}
        />
      </Router>
    </div>
  );
};
export default Routes;
