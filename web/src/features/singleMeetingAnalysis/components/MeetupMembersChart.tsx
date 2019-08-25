import React from "react";
import { PieChart, Pie, Legend, Cell, ResponsiveContainer } from "recharts";
import _ from "lodash";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red"];

const CategoryDisplayNames = {
  pastThirtyDays: "Last 30 Days",
  pastSixMonths: "Last 6 Months",
  pastYear: "Past Year",
  pastTwoYears: "Past Two Years",
  overTwoYearsAgo: "2+ years ago"
};

const MeetupMemberSummary = ({
  attendeesByDate,
  title
}: {
  attendeesByDate: any;
  title: string;
}) => {
  const keys = _.keys(attendeesByDate);

  const pieChartData = _.map(keys, key => ({
    // @ts-ignore - need to type key to ensure it exists in summary?
    name: CategoryDisplayNames[key],
    // @ts-ignore - need to type key to ensure it exists in summary?
    value: attendeesByDate[key]
  }));

  return (
    <div>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={80}
            label
          >
            {pieChartData.map((entry, index) => {
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              );
            })}
          </Pie>
          <Legend layout="horizontal" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MeetupMemberSummary;
