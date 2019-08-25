export const getMeetupSummaryData = async () => {
  const data = await fetch("http://localhost:5000/meetup/summary", {
    method: "GET"
  });
  const dataJson = await data.json();
  return dataJson.data;
};
