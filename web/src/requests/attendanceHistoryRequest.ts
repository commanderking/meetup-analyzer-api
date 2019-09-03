export const getAttendanceHistoryForUsers = async ({
  userIds
}: {
  userIds: string[];
}) => {
  const data = await fetch("http://localhost:5000/event/prediction", {
    method: "POST",
    body: JSON.stringify({ userIds })
  });
  const dataJson = await data.json();
  return dataJson.data;
};
