const urlName = "Boston-EdTech-Meetup";

// getting rsvps - https://secure.meetup.com/meetup_api/console/?path=/:urlname/events/:event_id/rsvps

// getting group members - https://api.meetup.com/:urlname/members

// const groupMembersEndpoint = https://api.meetup.com/:urlname/members

export const fetchGroupMemberdata = async (accessToken: string | null) => {
  try {
    const data = await fetch(`https://api.meetup.com/${urlName}/members`, {
      method: "GET",
      //   mode: "no-cors",
      headers: {
        Authorization: "Bearer " + accessToken,
        Origin: "http://localhost:3000",
        "Access-Control-Allow-Origin": "*"
      }
    });

    console.log("data", data);
  } catch (err) {
    console.log("err", err);
  }
};
