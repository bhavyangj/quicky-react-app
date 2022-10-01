import React, { useEffect, useState } from 'react'
import { getDateXDaysAgo } from '../../Dashboard/ListofDateLogs';
import { DateLogs } from './DateLogs'
import { DayLogs } from './DayLogs'

export const UsersAttendanceLogs = ({ user, userData, setUserData }) => {
    const [LogsList, setLogsList] = useState(user.LogsList);
    const [userDayLogs, setUserDayLogs] = useState();
    const [filters, setFilters] = useState({
        dateFrom: getDateXDaysAgo(5),
        dateTo: new Date(),
    });

    useEffect(() => {
        setLogsList(user.searchUserLogs);
    }, [user.searchUserLogs]);

    return (
        <div className='row m-0 mt-1'>
            <div className="col-xl-3 col-lg-12 dashboard-clock-logs py-2">
                <DayLogs userData={userData} userDayLogs={userDayLogs} setUserDayLogs={setUserDayLogs} />
            </div>
            <div className="col-xl-9 col-lg-12 dashboard-date-logs py-2">
                <DateLogs
                    userData={userData}
                    setUserData={setUserData}
                    LogsList={LogsList}
                    setLogsList={setLogsList}
                    filters={filters}
                    setFilters={setFilters}
                    setUserDayLogs={setUserDayLogs}
                />
            </div>
        </div>
    )
}
