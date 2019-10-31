import React from "react";
import MUIDataTable from "mui-datatables";
import { EventResponse } from "requests/eventTypes";
import { getEventsTableData } from "features/dashboard/dashboardUtils";
type Props = {
  events: EventResponse[];
};

const columns = [
  { name: "name", label: "Event", options: { sort: false } },
  { name: "date", label: "Date" },
  { name: "attendeesWhoRsvpd", label: "Attendees who RSVPed" },
  { name: "rsvps", label: "RSVPs" },
  { name: "attendees", label: "Attendees" },
  {
    name: "meetupAttendancePercent",
    label: "Attendance % (from RSVPs)",
    options: {
      customBodyRender: (percent: number) => {
        return `${percent}%`;
      }
    }
    // options: {
    //   customBodyRender: (attendancePercent: number) => (
    //     <AttendancePercentProgressBar attendancePercent={attendancePercent} />
    //   )
    // }
  }
];

const EventsTable = ({ events }: Props) => {
  const formattedEvents = getEventsTableData(events);
  return (
    <MUIDataTable
      columns={columns}
      data={formattedEvents}
      title="Events for the Year"
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

export default EventsTable;
