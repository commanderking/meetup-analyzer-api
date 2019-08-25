/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { useState } from "react";
import csv from "csvtojson";
import { bindRawMeetupData } from "../SingleMeetingAnalysisUtils";
import { Button, Label, FormGroup, Input, Form, Col } from "reactstrap";

const labelColumns = 3;
const inputColumns = 9;

// TODO: Update types here
const SingleMeetingForm = ({
  setAttendees,
  eventDate,
  setEventDate,
  eventName,
  setEventName
}: any) => {
  const [rawMeetupData, setMeetupData] = useState("");

  const handleChange = (event: any) => {
    setMeetupData(event.target.value);
  };

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

  return (
    <div>
      <h1>Enter Meetup Attendance CSV Data</h1>
      <div
        css={css`
          width: 700px;
          margin: auto;
        `}
      >
        <Form>
          <FormGroup row>
            <Label sm={labelColumns}>Event Name: </Label>
            <Col sm={inputColumns}>
              <Input
                value={eventName}
                placeholder="Name of your event..."
                onChange={handleEventNameChange}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={labelColumns}>Event Date: </Label>
            <Col sm={inputColumns}>
              <Input
                value={eventDate}
                placeholder="MM/DD/YYYY"
                onChange={handleEventDateChange}
              />
            </Col>
          </FormGroup>

          <div>
            <FormGroup row>
              <Label sm={labelColumns}>Event Attendance Data: </Label>
              <Col sm={inputColumns}>
                <Input
                  rows={10}
                  type="textarea"
                  value={rawMeetupData}
                  placeholder={"Enter csv data here..."}
                  onChange={handleChange}
                />
              </Col>
            </FormGroup>
            <div />
          </div>
          <Button color="success" type="submit" onClick={submitJSON}>
            Summarize Data
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default SingleMeetingForm;
