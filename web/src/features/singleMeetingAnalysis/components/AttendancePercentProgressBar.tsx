import React from "react";
import Progress from "reactstrap/lib/Progress";
import { DesignColors } from "features/constants/Design";

type Props = {
  attendancePercent: number | null;
};

const AttendancePercentProgressBar = ({ attendancePercent }: Props) => {
  if (!attendancePercent) {
    return <Progress color="info" value={0} />;
  }
  return (
    <Progress color="info" value={attendancePercent}>
      <span style={{ color: "black", backgroundColor: DesignColors.THEME_1 }}>
        {attendancePercent}%
      </span>
    </Progress>
  );
};

export default AttendancePercentProgressBar;
