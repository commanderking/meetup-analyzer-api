import React from "react";
import { Progress } from "reactstrap";

type Props = {
  text: string;
  numerator: number;
  denominator: number;
};

const calculatePercentage = (numerator: number, denominator: number) =>
  Math.round((numerator / denominator) * 100);

const PercentageProgressBar = ({ text, numerator, denominator }: Props) => {
  const percent = calculatePercentage(numerator, denominator);
  return (
    <React.Fragment>
      <div>{text}</div>
      <Progress color="info" value={percent}>
        {percent}%
      </Progress>
    </React.Fragment>
  );
};

export default PercentageProgressBar;
