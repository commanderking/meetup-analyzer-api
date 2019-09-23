/** @jsx jsx */
import React, { Dispatch, SetStateAction } from "react";
import { css, jsx } from "@emotion/core";
import { useState, ChangeEvent, MouseEvent } from "react";
import csv from "csvtojson";
import { bindRawMeetupData } from "../SingleMeetingAnalysisUtils";
// import { Button, Label, FormGroup, Input, Form, Col } from "reactstrap";
import { Button, FormControl, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import CsvDropZone from "common/components/CsvDropZone";
import CsvSetupSteps from "features/singleMeetingAnalysis/components/CsvSetupSteps";
import { AttendeeData } from "features/singleMeetingAnalysis/SingleMeetingAnalysisTypes";
type Props = {
  setAttendees: Dispatch<SetStateAction<AttendeeData[]>>;
  setEventDate: Dispatch<SetStateAction<string>>;
  setEventName: Dispatch<SetStateAction<string>>;
  eventDate: string;
  eventName: string;
};

const useStyles = makeStyles({
  formControl: {
    display: "block"
  }
});

const SingleMeetingForm = ({
  setAttendees,
  eventDate,
  setEventDate,
  eventName,
  setEventName
}: Props) => {
  const classes = useStyles();
  const [rawMeetupData, setMeetupData] = useState("");

  const handleEventDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEventDate(event.target.value);
  };

  const handleEventNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEventName(event.target.value);
  };

  const submitJSON = (event: MouseEvent) => {
    event.preventDefault();
    csv()
      .fromString(rawMeetupData)
      .then(result => {
        const bindedData = bindRawMeetupData(result);
        setAttendees(bindedData);
      });
  };

  const canSubmit =
    Boolean(eventDate) && Boolean(eventName) && Boolean(rawMeetupData);

  return (
    <div>
      <h1>Enter Meetup Attendance CSV Data</h1>
      <div
        css={css`
          width: 500px;
          margin: auto;
        `}
      >
        <form>
          <FormControl className={classes.formControl}>
            <TextField
              margin="normal"
              label="Event Name"
              variant="outlined"
              value={eventName}
              placeholder="Name of your event..."
              onChange={handleEventNameChange}
              required
              fullWidth
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              margin="normal"
              variant="outlined"
              label="Event Date"
              value={eventDate}
              placeholder="MM/DD/YYYY"
              onChange={handleEventDateChange}
              required
              fullWidth
            />
          </FormControl>
          <CsvSetupSteps />
          <CsvDropZone setCsvData={setMeetupData} setCanSubmit={() => true} />
          <Button
            variant="outlined"
            type="submit"
            onClick={submitJSON}
            disabled={!canSubmit}
          >
            Summarize Data
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SingleMeetingForm;
