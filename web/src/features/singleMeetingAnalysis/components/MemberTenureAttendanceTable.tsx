import React from "react";
import MUIDataTable from "mui-datatables";
import { MembershipLengthTableRow } from "features/singleMeetingAnalysis/SingleMeetingAnalysisTypes";
import AttendancePercentProgressBar from "features/singleMeetingAnalysis/components/AttendancePercentProgressBar";

type Props = {
  tenureTableData: MembershipLengthTableRow[];
};

const columns = [
  { name: "name", label: "Member for...", options: { sort: false } },
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

const MemberTenureAttendanceTable = ({ tenureTableData }: Props) => {
  return (
    <MUIDataTable
      columns={columns}
      data={tenureTableData}
      title="Attendance by Signup Period"
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

export default MemberTenureAttendanceTable;
