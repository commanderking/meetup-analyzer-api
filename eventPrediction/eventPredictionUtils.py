from functools import reduce
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn import metrics

# Modeling based on: https://towardsdatascience.com/a-beginners-guide-to-linear-regression-in-python-with-scikit-learn-83a8f7ae2b4f


def getLinearRegressionPrediction(regressionInput):
    dataset = pd.DataFrame.from_dict(regressionInput)
    X = dataset[['previousAttendanceRatesSummed', 'rsvp_count']]
    y = dataset['attendee_count'].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=0)

    regressor = LinearRegression()
    regressor.fit(X_train, y_train)

    coeff_df = pd.DataFrame(regressor.coef_, X.columns,
                            columns=['Coefficient'])

    y_pred = regressor.predict(X_test)

    df = pd.DataFrame({'Actual': y_test, 'Predicted': y_pred})

    '''
    print(df.head(25))
    print('Mean Absolute Error:', metrics.mean_absolute_error(y_test, y_pred))
    print('Mean Squared Error:', metrics.mean_squared_error(y_test, y_pred))
    print('Root Mean Squared Error:', np.sqrt(
        metrics.mean_squared_error(y_test, y_pred)))
    '''
