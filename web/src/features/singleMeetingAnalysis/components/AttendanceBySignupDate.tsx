import React from "react";
import {
  getAttendanceRateBySignupDate,
  getFirstWeekSignups,
  getLastWeekSignups,
  getAttendeesBySignupDateTable
} from "features/singleMeetingAnalysis/SingleMeetingAnalysisUtils";
import { AttendeeData } from "features/singleMeetingAnalysis/SingleMeetupTypes";
import PercentageProgressBar from "./PercentageProgressBar";
import _ from "lodash";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import AttendanceBySignupDateTable from "./AttendanceBySignupDateTable";

type Props = {
  attendees: AttendeeData[];
  eventDate: string;
};
const AttendanceBySignupDate = ({ attendees, eventDate }: Props) => {
  const rateByDate = getAttendanceRateBySignupDate(attendees, eventDate);
  const lastDay = _.size(rateByDate) - 1;
  const lastDayKey = lastDay.toString();
  const secondLastDayKey = (lastDay - 1).toString();

  const firstWeek = getFirstWeekSignups(rateByDate);
  const lastWeek = getLastWeekSignups(rateByDate);

  const tableData = getAttendeesBySignupDateTable(rateByDate);
  return (
    <div
      css={css`
        width: 800px;
        margin: auto;
        margin-bottom: 200px;
        margin-top: 100px;
      `}
    >
      <h3>Attendance By Signup Date</h3>

      <div
        id="AttendeePercentagesByMeetupRegistrationDate"
        css={css`
          display: grid;
          grid-template-columns: 2fr 3fr;
          margin-bottom: 50px;
        `}
      >
        {!_.isEmpty(rateByDate) && (
          <React.Fragment>
            {firstWeek ? (
              <PercentageProgressBar
                text="First Week"
                numerator={firstWeek.attended}
                denominator={firstWeek.rsvped}
              />
            ) : (
              <div>Not enough days for first week data </div>
            )}
            {lastWeek ? (
              <PercentageProgressBar
                text="Last Week"
                numerator={lastWeek.attended}
                denominator={lastWeek.rsvped}
              />
            ) : (
              <div>Not enough days for first week data </div>
            )}
            <PercentageProgressBar
              text="Day Before"
              numerator={rateByDate[secondLastDayKey].attended}
              denominator={rateByDate[secondLastDayKey].rsvped}
            />
            <PercentageProgressBar
              text="Last Day"
              numerator={rateByDate[lastDayKey].attended}
              denominator={rateByDate[lastDayKey].rsvped}
            />
          </React.Fragment>
        )}
      </div>
      <div>
        <h4>Dates with More than 5 RSVPs</h4>
        <div>
          <AttendanceBySignupDateTable data={tableData} />
        </div>
      </div>
    </div>
  );
};

export default AttendanceBySignupDate;
