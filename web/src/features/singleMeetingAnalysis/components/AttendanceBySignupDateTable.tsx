import React from "react";
import MUIDataTable from "mui-datatables";
import AttendancePercentProgressBar from "features/singleMeetingAnalysis/components/AttendancePercentProgressBar";
import { SignupPeriodTableRow } from "features/singleMeetingAnalysis/SingleMeetingAnalysisTypes";

type Props = {
  data: SignupPeriodTableRow[];
};

const columns = [
  { name: "name", label: "Signup Period", options: { sort: false } },
  { name: "attendees", label: "Attendees" },
  { name: "rsvps", label: "RSVPs" },
  {
    name: "rsvpPercent",
    label: "Attendance %",
    options: {
      customBodyRender: (attendancePercent: number) => (
        <AttendancePercentProgressBar attendancePercent={attendancePercent} />
      )
    }
  }
];

const AttendanceBySignupDateTable = ({ data }: Props) => {
  return (
    <MUIDataTable
      columns={columns}
      data={data}
      title="Attendance by Signup Date"
      options={{
        pagination: false,
        filter: false,
        selectableRows: "none",
        search: false,
        print: false,
        download: false,
        viewColumns: false
      }}
    />
  );
};

export default AttendanceBySignupDateTable;
