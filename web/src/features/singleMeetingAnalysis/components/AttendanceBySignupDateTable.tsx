import React from "react";
import Table from "rc-table";

const columns = [
  {
    title: "Date",
    dataIndex: "displayDate",
    key: "displayDate",
    width: 60
  },
  {
    title: "RSVPs",
    dataIndex: "rsvped",
    key: "rsvped",
    width: 60
  },
  {
    title: "Attended",
    dataIndex: "attended",
    key: "attended",
    width: 60
  },
  {
    title: "Percent",
    dataIndex: "percent",
    key: "percent",
    render: (percent: any) => {
      return `${percent}%`;
    },
    width: 60
  }
];

const AttendanceBySignupDateTable = ({ data }: any) => {
  return (
    <Table
      className="table"
      data={data}
      columns={columns}
      style={{ width: "318px", margin: "auto" }}
    />
  );
};

export default AttendanceBySignupDateTable;
