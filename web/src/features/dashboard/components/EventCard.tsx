import React from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import Card from "@material-ui/core/Card";
import moment from "moment";
import { EventResponse } from "../../../requests/eventTypes";
import EventCardStat from "./EventCardStat";
// @ts-ignore
import { Link } from "react-router-dom";
type Props = {
  event: EventResponse;
};

const EventCard = ({ event }: Props) => {
  const { name, date, attendees, rsvps, attendeesWhoRsvpd, id } = event;
  const attendancePercent = `${Math.round((attendeesWhoRsvpd / rsvps) * 100)}%`;

  return (
    <Link to={`/event/${id}`}>
      <button
        css={css`
         {
          border: none;
          padding 0;
          height: 100%;
          width: 100%;
        }
      `}
      >
        <Card
          css={css`
             {
              padding: 25px;
              height: 100%;
            }
          `}
        >
          <div
            css={css`
               {
                min-height: 100px;
              }
            `}
          >
            <h5>{name}</h5>
            <h6>{moment(date).format("MM/DD/YY")}</h6>
          </div>
          <div
            css={css`
               {
                display: flex;
                flex-direction: row;
                justify-content: center;
              }
            `}
          >
            <EventCardStat stat={attendees} description="Attendees" />
            <EventCardStat stat={attendancePercent} description="Show Rate" />
          </div>
        </Card>
      </button>
    </Link>
  );
};

export default EventCard;
