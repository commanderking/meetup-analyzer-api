import React from "react";
import { Button, Label, FormGroup, Input, Form, Col } from "reactstrap";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const labelColumns = 3;
const inputColumns = 9;

type Props = {
  rawMeetupData: any;
  setRawMeetupData: any;
  submitJSON: any;
};

const AttendanceHistoryForm = ({
  rawMeetupData,
  setRawMeetupData,
  submitJSON
}: Props) => {
  return (
    <Form
      css={css`
         {
          width: 700px;
          margin: auto;
          margin-top: 50px;
        }
      `}
    >
      <h3>Insert CSV Data for Upcoming Meetup</h3>

      <div>
        <FormGroup row>
          <Label sm={labelColumns}>Event Attendance Data: </Label>
          <Col sm={inputColumns}>
            <Input
              rows={10}
              type="textarea"
              value={rawMeetupData}
              placeholder={"Enter csv data here..."}
              onChange={(event: any) => {
                setRawMeetupData(event.target.value);
              }}
            />
          </Col>
        </FormGroup>
        <div />
      </div>
      <Button color="success" type="submit" onClick={submitJSON}>
        Summarize Data
      </Button>
    </Form>
  );
};

export default AttendanceHistoryForm;
