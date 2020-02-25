from datetime import datetime

def getDateRange(year):
    dateRange = { "earliestDate": "2018/01/01", "latestDate": datetime.today().strftime("%Y/%m/%d")}

    if year != "ALL": 
        dateRange["earliestDate"] = f"{year}/01/01"
        dateRange["latestDate"] = f"{year}/12/31"
    
    return dateRange
