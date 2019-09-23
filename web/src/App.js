import React, { Component } from "react";
import "./App.css";
import SingleMeetingAnalysisContainer from "./features/singleMeetingAnalysis/SingleMeetingAnaylsisContainer";
import { BrowserRouter as Router, Route } from "react-router-dom";
import DashboardContainer from "features/dashboard/DashboardContainer";
import { EventsProvider } from "./context/eventsContext";
import EventContainer from "./features/event/EventContainer";
import AttendancePredictorContainer from "features/attendancePredictor/AttendancePredictorContainer";

class App extends Component {
  render() {
    // Some awful emotion/typescript/react-app issue -
    // https://github.com/emotion-js/emotion/issues/1303
    window.React = React;
    return (
      <Router>
        <div className="App">
          <Route path="/" exact component={SingleMeetingAnalysisContainer} />
          <EventsProvider>
            <Route
              path="/dashboard"
              render={props => <DashboardContainer {...props} />}
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
