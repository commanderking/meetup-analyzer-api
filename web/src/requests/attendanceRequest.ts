const BACKEND_BASE_URL = "localhost:5000";
const ATTENDANCE_ENDPOINT = `http://${BACKEND_BASE_URL}/attendance`;

export const getAttendanceForEvents = async (eventIds: number[], user: any) => {
  if (!user) {
    return [];
  }
  try {
    const token = await user.getIdToken();
    const data = await fetch(ATTENDANCE_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        eventIds
      }),
      headers: {
        Authorization: "Bearer " + token
      }
    });
    const dataJson = await data.json();
    return dataJson.data;
  } catch (err) {
    console.log("err", err);
  }
};
