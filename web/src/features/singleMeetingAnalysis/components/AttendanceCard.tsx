import React from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { DesignColors } from "../../constants/Design";
type AttendanceCardProps = {
  headerText: string;
  bodyText: number | string;
  subBodyText?: string;
};

const AttendanceCard = ({
  headerText,
  bodyText,
  subBodyText
}: AttendanceCardProps) => {
  return (
    <div
      css={css`
         {
          background-color: #bcbec0;
          margin: auto;
          width: 80%;
          margin-bottom: 20px;
          height: 100%;
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
            0 6px 20px 0 rgba(0, 0, 0, 0.19);
        }
      `}
    >
      <h4
        css={css`
           {
            background-color: ${DesignColors.THEME_1};
            padding: 10px;
          }
        `}
      >
        {headerText}
      </h4>
      <div
        css={css`
           {
            padding: ${subBodyText ? 10 : 20}px;
          }
        `}
      >
        <h2
          css={css`
             {
              margin-bottom: 0;
            }
          `}
        >
          {bodyText}
        </h2>
        {subBodyText && <div>({subBodyText})</div>}
      </div>
    </div>
  );
};

export default AttendanceCard;
