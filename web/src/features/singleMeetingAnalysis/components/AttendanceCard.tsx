import React from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { DesignColors } from "../../constants/Design";
import Card from "@material-ui/core/Card";

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
    <Card
      css={css`
         {
          margin: auto;
          width: 90%;
          height: 100%;
        }
      `}
    >
      <div
        css={css`
           {
            background-color: #bcbec0;
            padding-bottom: 20px;
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
    </Card>
  );
};

export default AttendanceCard;
