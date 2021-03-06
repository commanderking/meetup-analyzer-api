import React from "react";
import { SingleMeetupSummary } from "features/singleMeetingAnalysis/SingleMeetupSummary";
import Button from "@material-ui/core/Button";
import _ from "lodash";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import SignUpChartDaily from "features/singleMeetingAnalysis/components/SignUpChartDaily";
import MemberTenureAttendanceTable from "features/singleMeetingAnalysis/components/MemberTenureAttendanceTable";
import AttendanceBySignupDateTable from "features/singleMeetingAnalysis/components/AttendanceBySignupDateTable";
import {
  getSummaryData,
  getDailyAttendance,
  getAttendanceByMembershipLengthTableData,
  getAttendanceBySignupPeriodTableData
} from "features/singleMeetingAnalysis/SingleMeetingAnalysisUtils";
import { AttendeeData } from "features/singleMeetingAnalysis/SingleMeetingAnalysisTypes";
import { postEvent } from "requests/eventRequest";

type ContentProps = {
  setAttendees?: Function;
  eventName: string;
  eventDate: string;
  attendees: AttendeeData[];
};

const SingleMeetingContent = ({
  setAttendees,
  eventName,
  eventDate,
  attendees
}: ContentProps) => {
  const summaryData = getSummaryData(attendees);
  const singupData = getDailyAttendance(attendees, eventDate);
  const tenureTableData = getAttendanceByMembershipLengthTableData(
    attendees,
    eventDate
  );

  const signupPeriodTableData = getAttendanceBySignupPeriodTableData(
    attendees,
    eventDate
  );
  return (
    <div>
      {setAttendees && attendees.length > 0 && (
        <div>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setAttendees([]);
            }}
          >
            Enter new Data
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={async () => {
              await postEvent({
                eventName,
                eventDate,
                attendees
              });
            }}
          >
            Save Summary
          </Button>
        </div>
      )}
      {attendees.length > 0 && (
        <div style={{ maxWidth: "1280px", margin: "auto", padding: "40px" }}>
          <div style={{ textAlign: "left", padding: "40px" }}>
            <Typography variant="h5">{eventName}</Typography>
            {eventDate && <Typography variant="h6">{eventDate}</Typography>}
          </div>

          <Grid container spacing={2}>
            <Grid item md={3} sm={12} xs={12}>
              <Card style={{ height: "100%", padding: "10px" }}>
                <SingleMeetupSummary summaryData={summaryData} />
              </Card>
            </Grid>
            <Grid item md={9} sm={12} xs={12}>
              <Card
                style={{ height: "100%", padding: "10px", overflow: "scroll" }}
              >
                <SignUpChartDaily data={_.values(singupData)} />
              </Card>
            </Grid>
            <Grid item md={12}>
              <Card>
                <MemberTenureAttendanceTable
                  tenureTableData={tenureTableData}
                />
              </Card>
            </Grid>
            <Grid item md={12}>
              <Card>
                <AttendanceBySignupDateTable data={signupPeriodTableData} />
              </Card>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
};

export default SingleMeetingContent;
