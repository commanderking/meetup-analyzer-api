import { Years } from "common/enum/Years";

export const getMeetupSummaryData = async (year: Years) => {
  const data = await fetch("http://localhost:5000/meetup/summary", {
    method: "POST",
    body: JSON.stringify({
      year
    })
  });
  const dataJson = await data.json();
  return dataJson.data;
};
