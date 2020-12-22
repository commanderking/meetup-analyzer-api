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
          const { category, count } = group;
          return (
            <React.Fragment>
              <div style={{ textAlign: "right" }}>
                {category} {category === "1" ? "event" : "events"}
              </div>
              <svg width={count + 50} height={20}>
                <rect fill={"lightblue"} width={count} height={20}></rect>
                <text x={count + 5} y={15}>
                  {count}
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
