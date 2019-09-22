import React from "react";
import MUIDataTable from "mui-datatables";
import { Progress } from "reactstrap";
import { DesignColors } from "features/constants/Design";
type Props = {
  tenureTableData: any; // TODO: Update
};

const columns = [
  { name: "name", label: "Member for...", options: { sort: false } },
  { name: "attendees", label: "Attendees" },
  { name: "rsvps", label: "RSVPs" },
  {
    name: "rsvpPercent",
    label: "Attendance %",
    options: {
      customBodyRender: (value: number) => {
        if (!value) {
          return <Progress color="info" value={0} />;
        }
        return (
          <Progress color="info" value={value}>
            <span
              style={{ color: "black", backgroundColor: DesignColors.THEME_1 }}
            >
              {value}%
            </span>
          </Progress>
        );
      }
    }
  }
];

const MemberTenureAttendanceTable = ({ tenureTableData }: Props) => {
  return (
    <div style={{ maxWidth: "100%" }}>
      <MUIDataTable
        columns={columns}
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
