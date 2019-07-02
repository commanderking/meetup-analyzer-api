from functools import reduce


def formatDataForModel(attendeeHistoryForThoseWhoAttendedOnlyOneMeetup, memberAttendanceHistory):
    noRecordAttendanceRate = attendeeHistoryForThoseWhoAttendedOnlyOneMeetup["attended"] / \
        attendeeHistoryForThoseWhoAttendedOnlyOneMeetup["rsvped"]
    print(noRecordAttendanceRate)
