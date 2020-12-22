import React, { useEffect, useState } from "react";
import { getYearlyAttendance } from "requests/yearlyAttendanceRequest";
import { getGroupsByCount, getRSVPsForAttendeesOfXEvents } from "./utils";
import YearlyAttendanceChart from "features/attendanceYearly/components/YearlyAttendanceChart";
import RsvpLikelihood from "features/attendanceYearly/components/RsvpLikelihood";
const getAttendance = async (year: string, setAttendees: any) => {
  const attendance = await getYearlyAttendance(year, 0);
  await setAttendees(attendance);
};

const YearlyAttendanceContainer = () => {
  const [attendees2020, setAttendees] = useState([]);
  const [attendees2019, setAttendees2019] = useState([]);

  useEffect(() => {
    getAttendance("2020", setAttendees);
    getAttendance("2019", setAttendees2019);
  }, []);

  // Thinking about how to visualize/report for those who've attended one event
  // whether they RSVP for a future event
  const attendedOneEventRsvpCounts = getRSVPsForAttendeesOfXEvents(1)(
    attendees2020
  );

  const groups2020 = getGroupsByCount(attendees2020, "attendedCount");
  const groups2019 = getGroupsByCount(attendees2019, "attendedCount");
  return (
    <div>
      <h3>Yearly Attendance</h3>
      <YearlyAttendanceChart year={"2019"} attendanceGroups={groups2019} />
      <YearlyAttendanceChart year={"2020"} attendanceGroups={groups2020} />
      <h3>For those who Attended 1 Event</h3>
      <RsvpLikelihood data={attendedOneEventRsvpCounts} />
    </div>
  );
};

export default YearlyAttendanceContainer;
