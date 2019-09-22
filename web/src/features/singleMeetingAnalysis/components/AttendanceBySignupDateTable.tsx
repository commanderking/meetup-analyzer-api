import React from "react";
import MUIDataTable from "mui-datatables";
import AttendancePercentProgressBar from "features/singleMeetingAnalysis/components/AttendancePercentProgressBar";

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

const AttendanceBySignupDateTable = ({ data }: any) => {
  return (
    <MUIDataTable
      columns={columns}
      data={data}
      title="Attendance by Membership Length"
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
