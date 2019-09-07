import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const CsvSetupSteps = () => {
  return (
    <div>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <span>How to Get and Format Meetup CSV Data</span>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary="1) Download Attendees Excel File From Meetup"
                secondary={
                  <div>
                    <a href="https://help.meetup.com/hc/en-us/articles/360004373231-How-do-I-download-print-my-event-attendee-list-">
                      Meetup Steps
                    </a>
                    <ol>
                      <li>Navigate to the event's page.</li>
                      <li>
                        Select Organizer tools and choose Manage Attendees.
                      </li>
                      <li>Select Tools and choose Download attendees.</li>
                    </ol>
                  </div>
                }
              />
            </ListItem>
            <Divider component="li" />
            <ListItem alignItems="flex-start">
              <ListItemText
                primary="2) Add Attendance Column and Y for each attendee"
                secondary={
                  <div>
                    <ol>
                      <li>Open the downloaded excel file.</li>
                      <li>
                        Add a new column and type "Attendance" into the first
                        row.
                      </li>
                      <li>
                        For each attendee that attended, type "Y" in the
                        Attendance Column
                      </li>
                    </ol>
                  </div>
                }
              />
            </ListItem>
            <Divider component="li" />
            <ListItem alignItems="flex-start">
              <ListItemText primary="3) Save excel file as a CSV." />
            </ListItem>
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

export default CsvSetupSteps;
