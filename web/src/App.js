import React, { Component } from "react";
import "./App.css";
import SingleMeetingAnalysisContainer from "./features/singleMeetingAnalysis/SingleMeetingAnaylsisContainer";
import { Router, Route } from "react-router-dom";
import LoginContainer from "./features/login/LoginContainer";
import DashboardContainer from "features/dashboard/DashboardContainer";
import AuthCallback from "./auth/AuthCallback";
import { EventsProvider } from "./context/eventsContext";
import EventContainer from "./features/event/EventContainer";
import AttendancePredictorContainer from "features/attendancePredictor/AttendancePredictorContainer";
import Auth from "./auth/auth";
import history from "./auth/history";

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
  console.log("update");
};

class App extends Component {
  render() {
    // Some awful emotion/typescript/react-app issue -
    // https://github.com/emotion-js/emotion/issues/1303
    window.React = React;
    return (
      <Router history={history}>
        <div className="App">
          <Route
            exact
            path="/authCallback"
            render={props => {
              handleAuthentication(props);
              return <AuthCallback {...props} />;
            }}
          />
          <Route
            exact
            path="/login"
            auth={auth}
            component={props => <LoginContainer auth={auth} {...props} />}
          />
          <Route path="/" exact component={SingleMeetingAnalysisContainer} />
          <EventsProvider>
            <Route
              path="/dashboard"
              render={props => <DashboardContainer auth={auth} {...props} />}
            />
            <Route
              path="/event/:id"
              render={props => <EventContainer {...props} />}
            />
            <Route
              path="/prediction"
              render={props => <AttendancePredictorContainer {...props} />}
            />
          </EventsProvider>
        </div>
      </Router>
    );
  }
}

export default App;
