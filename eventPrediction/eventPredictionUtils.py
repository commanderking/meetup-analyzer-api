from functools import reduce
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn import metrics

# Modeling based on: https://towardsdatascience.com/a-beginners-guide-to-linear-regression-in-python-with-scikit-learn-83a8f7ae2b4f


def getLinearRegressionPrediction(regressionInput):
    dataset = pd.DataFrame.from_dict(regressionInput)

    (rowsCount, columnsCount) = dataset.shape

    x_columns = ['previousAttendanceRatesSummed',
                 'old_attendees', 'new_attendees']

    training_rows = dataset[4: rowsCount - 2]
    prediction_rows = dataset.tail(2)

    X_train = training_rows[x_columns]
    y_train = training_rows['attendees_who_rsvped_count'].values

    X_test = prediction_rows[x_columns]
    y_test = prediction_rows['attendees_who_rsvped_count'].values

    print(X_train)
    print(X_test)

    X = dataset[x_columns]
    y = dataset['attendees_who_rsvped_count'].values

    regressor = LinearRegression()
    regressor.fit(X_train, y_train)

    coeff_df = pd.DataFrame(regressor.coef_, X.columns,
                            columns=['Coefficient'])

    y_pred = regressor.predict(X_test)

    df = pd.DataFrame({'Actual': y_test, 'Predicted': y_pred})

    print(regressionInput)
    print(df.head(25))
    print(coeff_df)
    '''
    print('Mean Absolute Error:', metrics.mean_absolute_error(y_test, y_pred))
    print('Mean Squared Error:', metrics.mean_squared_error(y_test, y_pred))
    print('Root Mean Squared Error:', np.sqrt(
        metrics.mean_squared_error(y_test, y_pred)))
    '''
