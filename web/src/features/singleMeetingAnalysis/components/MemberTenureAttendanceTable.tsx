import React from "react";
import MUIDataTable from "mui-datatables";

const data = [
  { name: "< 1 month", rsvps: 20, attendees: 8, rsvpPercent: 63 },
  {
    name: "1 - 6 months",
    rsvps: 10,
    attendees: 4,
    rsvpPercent: 40
  }
];

type Props = {
  tenureTableData: any; // TODO: Update
};

const MemberTenureAttendanceTable = ({ tenureTableData }: Props) => {
  return (
    <div style={{ maxWidth: "100%" }}>
      <MUIDataTable
        columns={[
          { name: "name", label: "Member for...", options: { sort: false } },
          { name: "attendees", label: "Attendees" },
          { name: "rsvps", label: "RSVPs" },
          {
            name: "rsvpPercent",
            label: "Attendance %"
          }
        ]}
        data={tenureTableData}
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
    </div>
  );
};

export default MemberTenureAttendanceTable;
