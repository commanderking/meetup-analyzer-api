import React, { useState } from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import Button from "@material-ui/core/Button";
import CsvDropZone from "common/components/CsvDropZone";

type Props = {
  rawMeetupData: any;
  setRawMeetupData: any;
  submitJSON: any;
};

const AttendanceHistoryForm = ({ setRawMeetupData, submitJSON }: Props) => {
  const [canSubmit, setCanSubmit] = useState(false);
  return (
    <form
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
        <CsvDropZone
          setCanSubmit={setCanSubmit}
          setCsvData={setRawMeetupData}
        />
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
    </form>
  );
};

export default AttendanceHistoryForm;
