import React from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import Card from "@material-ui/core/Card";
import moment from "moment";
import { EventResponse } from "../../../requests/eventTypes";
import EventCardStat from "./EventCardStat";
// @ts-ignore
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

type Props = {
  event: EventResponse;
};

const EventCard = ({ event }: Props) => {
  const { name, date, attendees, rsvps, attendeesWhoRsvpd, id } = event;
  const attendancePercent = `${Math.round((attendeesWhoRsvpd / rsvps) * 100)}%`;

  return (
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
            margin-bottom: 30px;
          }
        `}
      >
        <EventCardStat stat={attendees} description="Attendees" />
        <EventCardStat stat={attendancePercent} description="Show Rate" />
      </div>
      <Link
        to={`/event/${id}`}
        css={css`
           {
            text-decoration: none;
            &:focus,
            &:hover,
            &:visited,
            &:link,
            &:active {
              text-decoration: none;
            }
          }
        `}
      >
        <Button color="primary" variant="outlined">
          Details
        </Button>
      </Link>
    </Card>
  );
};

export default EventCard;
