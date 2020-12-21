import React, { useEffect, useState } from "react";
import { getYearlyAttendance } from "requests/yearlyAttendanceRequest";
import {
  getGroupsByEventsAttended,
  getRSVPsForAttendeesOfXEvents,
} from "./utils";
import YearlyAttendanceChart from "features/attendanceYearly/components/YearlyAttendanceChart";
const getAttendance = async (year: string, setAttendees: any) => {
  const attendance = await getYearlyAttendance(year, 0);
  await setAttendees(attendance);
};

const YearlyAttendanceContainer = () => {
  const [attendees, setAttendees] = useState([]);
  const [attendees2019, setAttendees2019] = useState([]);

  console.log("attendees", attendees);
  useEffect(() => {
    getAttendance("2020", setAttendees);
    getAttendance("2019", setAttendees2019);
  }, []);

  const attendedOneEvent = getRSVPsForAttendeesOfXEvents(1)(attendees);
  console.log("attendedOneEvent", attendedOneEvent);

  const attendedTwoEvents = getRSVPsForAttendeesOfXEvents(2)(attendees);
  console.log("attendedTwoEvents", attendedTwoEvents);

  const groups = getGroupsByEventsAttended(attendees);

  const groups2019 = getGroupsByEventsAttended(attendees2019);
  return (
    <div>
      <h3>Yearly Attendance</h3>
      <YearlyAttendanceChart year={"2019"} attendanceGroups={groups2019} />
      <YearlyAttendanceChart year={"2020"} attendanceGroups={groups} />
    </div>
  );
};

export default YearlyAttendanceContainer;
