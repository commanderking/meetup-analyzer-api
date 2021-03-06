import React from "react";
import { PieChart, Pie, Cell } from "recharts";

type Props = {
  attendeesWhoRSVPd: number;
  numberRSVPs: number;
};

type DataEntry = {
  value: number;
  color: string;
};

const AttendanceRatePieChart = ({ attendeesWhoRSVPd, numberRSVPs }: Props) => {
  const rsvpsWhoDidNotAttend = numberRSVPs - attendeesWhoRSVPd;

  const data = [
    { value: attendeesWhoRSVPd, color: "#8884d8" },
    { value: rsvpsWhoDidNotAttend, color: "#BCBEC0" }
  ];

  const attendancePercent = Math.round((attendeesWhoRSVPd / numberRSVPs) * 100);
  return (
    <PieChart width={165} height={165} style={{ margin: "auto" }}>
      <Pie
        data={data}
        cx={80}
        cy={80}
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        startAngle={-270}
        isAnimationActive={false}
      >
        {data.map((entry: DataEntry, index) => {
          return <Cell key={`cell-${index}`} fill={entry.color} />;
        })}
      </Pie>
      <text
        x={85}
        y={85}
        dy={8}
        textAnchor="middle"
        fill={"#8884d8"}
        fontSize="2em"
      >
        {`${attendancePercent}%`}
      </text>
    </PieChart>
  );
};

export default AttendanceRatePieChart;
