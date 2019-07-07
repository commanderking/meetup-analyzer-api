from functools import reduce
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn import metrics


# Out of all the attendees who've RSVPed before, gets the predicted number of them that will show up
# based on their individual historical rsvp rates
def getPredictedAttendeesOfMembers(attendanceHistoryForUsersAtEvent):
    attendanceRates = []
    for userAttendanceHistory in attendanceHistoryForUsersAtEvent:
        (id, attended, rsvped) = userAttendanceHistory
        attendanceRates.append(attended / rsvped)

    return sum(attendanceRates)

# params: Array<{ meetupUserId: int, count_did_attend: int, count_did_rsvp: int}>
# return: { attended: int, rsvped: int }


def getAttendanceRateForThoseAttendingSingleMeetup(attendance):
    attendeeHistoryForThoseWhoAttendedOnlyOneMeetup = {
        "attended": 0,
        "rsvped": 0
    }
    for attendee in attendance:
        (meetupUserId, didAttend, didRSVP) = attendee
        attendeeHistoryForThoseWhoAttendedOnlyOneMeetup["attended"] += didAttend
        attendeeHistoryForThoseWhoAttendedOnlyOneMeetup["rsvped"] += 1
    return attendeeHistoryForThoseWhoAttendedOnlyOneMeetup


# Modeling based on: https://towardsdatascience.com/a-beginners-guide-to-linear-regression-in-python-with-scikit-learn-83a8f7ae2b4f


def getLinearRegressionPrediction(regressionInput, newEvent):
    dataset = pd.DataFrame.from_dict(regressionInput)
    newEventDataset = pd.DataFrame.from_dict(newEvent)
    (rowsCount, columnsCount) = dataset.shape
    x_columns = ['previous_attendance_rates_sum', 'new_attendees']

    # We probably want to leave more rows unusued at the beginning since then we'll have better records
    # of previous attendees
    training_rows = dataset[4: rowsCount]
    prediction_rows = newEventDataset.tail(1)

    X_train = training_rows[x_columns]
    y_train = training_rows['attendees_who_rsvped_count'].values

    X_test = prediction_rows[x_columns]

    X = dataset[x_columns]
    y = dataset['attendees_who_rsvped_count'].values

    regressor = LinearRegression()
    regressor.fit(X_train, y_train)

    coeff_df = pd.DataFrame(regressor.coef_, X.columns,
                            columns=['Coefficient'])

    y_pred = regressor.predict(X_test)

    df = pd.DataFrame({'Predicted': y_pred})

    print(df)

    return y_pred[0]

    # if we want to just check how predictions are going for the last two
    # just for reference
    # extra_pred = regressor.predict(dataset.tail(2)[x_columns])

    '''
    print('Mean Absolute Error:', metrics.mean_absolute_error(y_test, y_pred))
    print('Mean Squared Error:', metrics.mean_squared_error(y_test, y_pred))
    print('Root Mean Squared Error:', np.sqrt(
        metrics.mean_squared_error(y_test, y_pred)))
    '''
