import React from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { AttendanceHistory } from "requests/attendanceHistoryTypes";
import {
  getPredictedAttendanceFromMembersWithHistory,
  getPredictedAttendanceCount,
  getFirstTimeAttendeeRate
} from "features/attendancePredictor/attendancePredictorUtils";
import { Card } from "reactstrap";

const getPercentage = (decimal: number): string => {
  return `${Math.round(decimal * 100)}%`;
};

const AttendanceHistoryResults = ({
  attendanceHistory,
  attendeeIds
}: {
  attendanceHistory: AttendanceHistory;
  attendeeIds: string[];
}) => {
  const predictedAttendanceForMembersWithHistory = getPredictedAttendanceFromMembersWithHistory(
    attendanceHistory
  );

  const firstTimeAttendeeRate = getFirstTimeAttendeeRate(attendanceHistory);
  const predictedAttendanceCount = getPredictedAttendanceCount(
    attendanceHistory,
    attendeeIds
  );
  const attendeesWithHistory = attendanceHistory.memberAttendanceHistory.length;
  const attendeesWithoutHistory = attendeeIds.length - attendeesWithHistory;
  return (
    <div>
      <Card>
        <h3>Expected Attendance</h3>
        <h2>{predictedAttendanceCount}</h2>
      </Card>
      <Card>
        <h3>RSVPs</h3>
        <h2>{attendeeIds.length}</h2>
      </Card>
      <div
        css={css`
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-column-gap: 20px;
          grid-row-gap: 20px;
          grid-auto-rows: 1fr;
          padding: 20px;
        `}
      >
        <Card>
          <h2>{attendeesWithHistory}</h2>
          <p> have rsvped to at least one previous event</p>
        </Card>
        <Card>
          <h2>{attendeesWithoutHistory}</h2>
          <p>have never rsvped to an event</p>
        </Card>
        <Card>
          <h2>{Math.round(predictedAttendanceForMembersWithHistory)}</h2>
          <p>
            Expected Members to Show Up Based on Previous Attendance of each
            Individual
          </p>
        </Card>
        <Card>
          <h2>{getPercentage(firstTimeAttendeeRate)}</h2>
          <p>Average Attendance Rate</p>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceHistoryResults;
