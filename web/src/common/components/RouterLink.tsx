import { Link } from "react-router-dom";
import { ReactChild } from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

type Props = {
  to: string;
  children: ReactChild;
};

const RouterLink = ({ to, children }: Props) => (
  <Link
    to={to}
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
    {children}
  </Link>
);

export default RouterLink;
