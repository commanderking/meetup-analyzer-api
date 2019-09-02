import React, { useState } from "react";
import { Label, FormGroup, Input, Form, Col } from "reactstrap";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import Button from "@material-ui/core/Button";
import AttendanceHistoryDropZone from "features/attendancePredictor/components/AttendanceHistoryDropZone";

const inputColumns = 12;

type Props = {
  rawMeetupData: any;
  setRawMeetupData: any;
  submitJSON: any;
};

const AttendanceHistoryForm = ({ setRawMeetupData, submitJSON }: Props) => {
  const [canSubmit, setCanSubmit] = useState(false);
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
            <AttendanceHistoryDropZone
              setCanSubmit={setCanSubmit}
              setRawMeetupData={setRawMeetupData}
            />
          </Col>
        </FormGroup>
        <div />
      </div>

      <Button
        variant="contained"
        color="primary"
        type="submit"
        onClick={submitJSON}
        disabled={!canSubmit}
      >
        Summarize Data
      </Button>
    </Form>
  );
};

export default AttendanceHistoryForm;
