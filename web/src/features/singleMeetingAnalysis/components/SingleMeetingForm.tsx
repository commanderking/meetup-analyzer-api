/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { useState } from "react";
import csv from "csvtojson";
import { bindRawMeetupData } from "../SingleMeetingAnalysisUtils";
// import { Button, Label, FormGroup, Input, Form, Col } from "reactstrap";
import { Button, FormControl, Input, InputLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import CsvDropZone from "common/components/CsvDropZone";

const useStyles = makeStyles({
  formControl: {
    display: "block"
  }
});

// TODO: Update types here
const SingleMeetingForm = ({
  setAttendees,
  eventDate,
  setEventDate,
  eventName,
  setEventName
}: any) => {
  const classes = useStyles();
  const [rawMeetupData, setMeetupData] = useState("");

  const handleEventDateChange = (event: any) => {
    setEventDate(event.target.value);
  };

  const handleEventNameChange = (event: any) => {
    setEventName(event.target.value);
  };

  const submitJSON = (event: any) => {
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
          width: 700px;
          margin: auto;
        `}
      >
        <form>
          <FormControl className={classes.formControl}>
            <InputLabel>Event Name: </InputLabel>
            <Input
              value={eventName}
              placeholder="Name of your event..."
              onChange={handleEventNameChange}
              required
              fullWidth
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel>Event Date: </InputLabel>
            <Input
              value={eventDate}
              placeholder="MM/DD/YYYY"
              onChange={handleEventDateChange}
              required
              fullWidth
            />
          </FormControl>
          <CsvDropZone setCsvData={setMeetupData} setCanSubmit={() => true} />

          <Button type="submit" onClick={submitJSON} disabled={!canSubmit}>
            Summarize Data
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SingleMeetingForm;
