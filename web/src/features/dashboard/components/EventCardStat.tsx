import React from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

type Props = {
  stat: number | string;
  description: string;
};

const EventCardStat = ({ stat, description }: Props) => {
  return (
    <div
      css={css`
         {
          flex-grow: 1;
        }
      `}
    >
      <h1>{stat}</h1>
      <span>{description}</span>
    </div>
  );
};

export default EventCardStat;
