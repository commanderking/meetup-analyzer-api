const BACKEND_BASE_URL = "localhost:5000";
const YEARLY_ATTENDANCE_ENDPOINT = `http://${BACKEND_BASE_URL}/meetup/attendanceByUser`;

export const getYearlyAttendance = async (
  year: string,
  minAttendances: number
) => {
  try {
    const data = await fetch(YEARLY_ATTENDANCE_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        year,
        minAttendances,
      }),
    });
    const dataJson = await data.json();
    return dataJson.data.attendanceByUser;
  } catch (err) {
    console.log("err", err);
  }
};
