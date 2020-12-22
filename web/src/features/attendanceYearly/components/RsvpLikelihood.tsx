import React from "react";
import { CategoryCount } from "features/attendanceYearly/types";
import _ from "lodash";
import { Grid } from "@material-ui/core";
type Props = {
  data: CategoryCount[];
};

const RsvpLikelihood = ({ data }: Props) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "100px 100px",
        width: "200px",
        margin: "auto",
      }}
    >
      {_.map(data, (rsvps) => {
        return (
          <React.Fragment>
            <div>{rsvps.category} RSVPs</div>
            <div>{rsvps.count}</div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default RsvpLikelihood;
