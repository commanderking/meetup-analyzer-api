import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import { RouteComponentProps } from "react-router-dom";
import { fetchGroupMemberdata } from "requests/meetupAPIRequest";

const consumerKey = process.env.REACT_APP_MEETUP_CONSUMER_KEY;
const redirectUri = `${process.env.REACT_APP_MEETUP_REDIRECT_URI}/base/groupmembers`;

const meetupSigninUrl: string = `https://secure.meetup.com/oauth2/authorize?client_id=${consumerKey}&response_type=token&redirect_uri=${redirectUri}`;

const getGroupMemberData = async (accessToken: string | null) => {
  if (!accessToken) {
    return [];
  }

  await fetchGroupMemberdata(accessToken);
};

type MatchParams = {
  id: string;
};

interface Props extends RouteComponentProps<MatchParams> {}

const GroupMembersContainer = ({ location }: Props) => {
  console.log("location", location);

  const parsedHash = new URLSearchParams(
    window.location.hash.substr(1) // skip the first char (#)
  );

  console.log("parsedHash", parsedHash);
  console.log();

  const accessToken = parsedHash.get("access_token");
  useEffect(() => {
    const test = getGroupMemberData(accessToken);
  });
  return (
    <div>
      <span>Group Members</span>
      <a href={meetupSigninUrl}>
        <Button>Login to Meetup to See Group Member Data</Button>
      </a>
      <span>You will be redirect to meetup page</span>
    </div>
  );
};

export default GroupMembersContainer;
