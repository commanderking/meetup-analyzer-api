import { useState, useEffect, useContext, ChangeEvent } from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { useEventsCall } from "../../context/eventsHook";
import EventCard from "features/dashboard/components/EventCard";
import AttendanceCard from "features/singleMeetingAnalysis/components/AttendanceCard";
import { EventResponse } from "../../requests/eventTypes";
import { getMeetupSummaryData } from "requests/meetupSummaryRequest";
import { MeetupSummaryDTO } from "requests/meetupSummaryRequestTypes";
import Button from "@material-ui/core/Button";
// @ts-ignore
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { FirebaseContext } from "auth/FirebaseContext";
import EventsTable from "features/dashboard/components/EventsTable";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import { isEventInYear } from "features/dashboard/dashboardUtils";
import { Years, YearsEnum } from "common/enum/Years";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

const loadMeetupSummaryData = async (setSummaryData: any) => {
  const data = await getMeetupSummaryData();
  setSummaryData(data);
};

const DashboardContainer = () => {
  const { isLoading, events } = useEventsCall();
  // const { user, firebase } = useContext(FirebaseContext);
  // console.log("dashboardUser", user);
  const [summaryData, setSummaryData]: [
    MeetupSummaryDTO | null,
    any
  ] = useState(null);
  const classes = useStyles();

  const [selectedYear, setSelectedYear]: [Years, any] = useState<Years>("ALL");
  useEffect(() => {
    loadMeetupSummaryData(setSummaryData);
  }, []);

  const handleChange = (
    event: ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => {
    if (event) {
      // @ts-ignore
      setSelectedYear(event.target.value);
    }
  };

  const eventsInSelectedYear = events.filter(event =>
    isEventInYear(event, selectedYear)
  );

  // if (isLoading || !user) return <div>Loading...</div>;

  if (!summaryData) return <div>Loading...</div>;

  const { currentYear } = summaryData;
  const {
    totalAttendees,
    totalRSVPs,
    uniqueAttendees,
    uniqueRSVPs,
    nonMeetupAttendees
  } = currentYear;
  return (
    <div>
      <div
        css={css`
           {
            padding: 10px;
          }
        `}
      >
        <h3>Year to Date Statistics (2019)</h3>
        <FormControl variant="outlined" className={classes.formControl}>
          <Select
            id="demo-simple-select-outlined"
            value={selectedYear}
            onChange={handleChange}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="2020">2020</MenuItem>
            <MenuItem value="2019">2019</MenuItem>
            <MenuItem value="2018">2018</MenuItem>
          </Select>
        </FormControl>
        <div
          id="SingleMeetupSummary"
          css={css`
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
          `}
        >
          <AttendanceCard
            headerText="Total Attendees"
            bodyText={totalAttendees}
          />
          <AttendanceCard headerText="Total RSVPs" bodyText={totalRSVPs} />
          <AttendanceCard
            headerText="Unique Attendees"
            bodyText={`${uniqueAttendees} - ${uniqueAttendees +
              nonMeetupAttendees}`}
          />
          <AttendanceCard headerText="Unique RSVPs" bodyText={uniqueRSVPs} />
        </div>
      </div>
      <h3>Actions</h3>
      <Link to="/">
        <Button variant="contained">Summarize Event</Button>
      </Link>

      <Link to="prediction">
        <Button variant="contained">Predict Attendance for Next Event</Button>
      </Link>
      <div
        css={css`
           {
            padding: 10px;
            margin-top: 30px;
          }
        `}
      >
        <h3>Event Details</h3>
        <EventsTable events={eventsInSelectedYear} />
        <Grid container spacing={3}>
          {eventsInSelectedYear.map((event: EventResponse) => (
            <Grid item xs={12} sm={6} md={4}>
              <EventCard key={event.id} event={event} />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default DashboardContainer;
