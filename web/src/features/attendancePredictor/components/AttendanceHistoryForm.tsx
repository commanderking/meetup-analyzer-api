import React from "react";
import { Button, Label, FormGroup, Input, Form, Col } from "reactstrap";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import TextField from "@material-ui/core/TextField";

const inputColumns = 12;

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
          <Col sm={inputColumns}>
            {/* <Input
              rows={10}
              type="textarea"
              value={rawMeetupData}
              placeholder={"Enter csv data here..."}
              onChange={(event: any) => {
                setRawMeetupData(event.target.value);
              }}
            /> */}
            <TextField
              id="outlined-dense-multiline"
              label="Event Attendance Data"
              margin="normal"
              variant="outlined"
              multiline
              fullWidth
              autoFocus
              rows="10"
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
