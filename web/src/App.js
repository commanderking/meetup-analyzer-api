import React, { Component } from "react";
import "./App.css";
import SingleMeetingAnalysisContainer from "./features/singleMeetingAnalysis/SingleMeetingAnaylsisContainer";
import { BrowserRouter as Router, Route } from "react-router-dom";
import DashboardContainer from "features/dashboard/DashboardContainer";
import { EventsProvider } from "./context/eventsContext";
import EventContainer from "./features/event/EventContainer";
import AttendancePredictorContainer from "features/attendancePredictor/AttendancePredictorContainer";
import { MuiThemeProvider } from "@material-ui/core/styles";
import getMuiTheme from "themes/muiTheme";
import LoginContainer from "auth/LoginContainer";
import initializeFirebase, { FirebaseContext } from "auth/FirebaseContext";
import SignupContainer from 'auth/SignupContainer';

const urlPrefix = "base";
const getPath = path => `/${urlPrefix}/${path}`;

class App extends Component {
  render() {
    // Some awful emotion/typescript/react-app issue -
    // https://github.com/emotion-js/emotion/issues/1303
    window.React = React;
    return (
      <FirebaseContext.Provider value={new initializeFirebase()}>
        <Router>
          <MuiThemeProvider theme={getMuiTheme()}>
            <div className="App">
              <Route
                path="/"
                exact
                component={SingleMeetingAnalysisContainer}
              />
              <EventsProvider>
                <Route
                  path={getPath("dashboard")}
                  render={props => <DashboardContainer {...props} />}
                />
                <Route
                  path={getPath("event/:id")}
                  render={props => <EventContainer {...props} />}
                />
                <Route
                  path={getPath("prediction")}
                  render={props => <AttendancePredictorContainer {...props} />}
                />
                <Route
                  path={getPath("login")}
                  render={props => <LoginContainer {...props} />}
                />
                <Route
                  path={getPath("signup")}
                  render={props => <SignupContainer {...props} />}
                />
              </EventsProvider>
            </div>
          </MuiThemeProvider>
        </Router>
      </FirebaseContext.Provider>
    );
  }
}

export default App;
