import React from "react";

type Props = {
  year: string;
  attendanceGroups: any[];
};

const YearlyAttendanceChart = ({ year, attendanceGroups }: Props) => {
  return (
    <div>
      <h4>{year}</h4>
      <p style={{ width: "500px", margin: "auto", textAlign: "center" }}>
        Members who RSVPed to at least one event attended...
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "100px 400px",
          width: "500px",
          margin: "auto",
          columnGap: "10px",
        }}
      >
        {attendanceGroups.map((group) => {
          const { attendanceCount, memberCount } = group;
          return (
            <React.Fragment>
              <div style={{ textAlign: "right" }}>
                {attendanceCount} {attendanceCount === "1" ? "event" : "events"}
              </div>
              <svg width={memberCount + 50} height={20}>
                <rect fill={"lightblue"} width={memberCount} height={20}></rect>
                <text x={memberCount + 5} y={15}>
                  {memberCount}
                </text>
              </svg>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default YearlyAttendanceChart;
