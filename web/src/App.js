import "./App.css";
import React from "react";

import { MuiThemeProvider } from "@material-ui/core/styles";

import getMuiTheme from "themes/muiTheme";
import { FirebaseProvider } from "auth/FirebaseContext";
import RoutesContainer from "routes/RoutesContainer";
import { EventsProvider } from "context/eventsContext";

const App = () => {
  return (
    <FirebaseProvider>
      <MuiThemeProvider theme={getMuiTheme()}>
        <EventsProvider>
          <RoutesContainer />
        </EventsProvider>
      </MuiThemeProvider>
    </FirebaseProvider>
  );
};

export default App;
