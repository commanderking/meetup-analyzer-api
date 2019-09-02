// @flow
import React, { useState } from "react";
import csv from "csvtojson";
import {
  bindRawMeetupData,
  getMeetupUserIds
} from "features/singleMeetingAnalysis/SingleMeetingAnalysisUtils";
import { getAttendanceHistoryForUsers } from "requests/attendanceHistoryRequest";
import AttendanceHistoryResults from "features/attendancePredictor/components/AttendanceHistoryResults";
import AttendanceHistoryForm from "features/attendancePredictor/components/AttendanceHistoryForm";
import { Collapse, Button } from "reactstrap";

const loadAttendanceHistory = async (
  userIds: string[],
  setAttendanceHistory: any
) => {
  const attendanceHistory = await getAttendanceHistoryForUsers({ userIds });
  setAttendanceHistory(attendanceHistory);
};

const AttendancePredictorContainer = () => {
  const [rawMeetupData, setRawMeetupData] = useState("");
  const [attendanceHistory, setAttendanceHistory]: [any, any] = useState({
    singleAttendanceCountAndRSVPs: {
      attended: 0,
      rsvped: 0
    },
    memberAttendanceHistory: []
  });
  const [attendeeIds, setAttendeeIds]: [string[], any] = useState([]);

  const [showForm, setShowForm] = useState(true);

  const submitJSON = (event: any) => {
    event.preventDefault();
    csv()
      .fromString(rawMeetupData)
      .then(result => {
        const bindedData = bindRawMeetupData(result);
        const attendeeIds = getMeetupUserIds(bindedData);
        loadAttendanceHistory(attendeeIds, setAttendanceHistory);
        setAttendeeIds(attendeeIds);
        setShowForm(false);
      });
  };

  return (
    <div>
      {!showForm && (
        <Button onClick={() => setShowForm(true)}>Edit Data</Button>
      )}
      <Collapse isOpen={showForm}>
        <AttendanceHistoryForm
          rawMeetupData={rawMeetupData}
          setRawMeetupData={setRawMeetupData}
          submitJSON={submitJSON}
        />
      </Collapse>
      {!showForm && (
        <AttendanceHistoryResults
          attendanceHistory={attendanceHistory}
          attendeeIds={attendeeIds}
        />
      )}
    </div>
  );
};

export default AttendancePredictorContainer;
