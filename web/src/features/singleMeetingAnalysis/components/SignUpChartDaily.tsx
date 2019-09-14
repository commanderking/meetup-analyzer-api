import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { DesignColors } from "../../constants/Design";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";

const CustomTooltip = ({ active, payload }: any) => {
  if (active) {
    const { dayOfWeek, displayDate, count, attendedCount } = payload[0].payload;
    return count > 0 ? (
      <Card>
        <div
          id="tooltip"
          css={css`
            background-color: red;
            text-align: left;
            padding: 10px;
          `}
          style={{
            backgroundColor: "white",
            padding: "10px",
            textAlign: "left"
          }}
        >
          <div>
            {dayOfWeek}, {displayDate}
          </div>
          <div>
            Attendance Rate: {attendedCount} / {count} (
            {Math.round((attendedCount / count) * 100)}%)
          </div>
        </div>
      </Card>
    ) : null;
  }
  return null;
};

const SignUpChartDaily = ({ data }: any) => {
  return (
    <div
      css={css`
        margin: auto;
      `}
    >
      <Typography variant="h5" gutterBottom>
        Daily Sign Up
      </Typography>
      <BarChart
        width={600}
        height={250}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0
        }}
        style={{
          margin: "auto"
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="displayDate" />
        <YAxis />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: "red", strokeWidth: 2, color: "white" }}
        />
        <Bar
          dataKey="attendedCount"
          stackId="a"
          fill={DesignColors.SIGNUP_DAILY_ATTENDED}
        />
        <Bar
          dataKey="rsvpNotAttendedCount"
          stackId="a"
          fill={DesignColors.SIGNUP_DAILY_DID_NOT_ATTEND}
        />
      </BarChart>
    </div>
  );
};

export default SignUpChartDaily;
