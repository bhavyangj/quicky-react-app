import React from 'react'
import { useEffect } from 'react';
import { reqUserLogs } from '../../utils/wssConnection/wssConnection';
import { ListofDateLogs } from './ListofDateLogs';
import { SingleDayLogs } from './SingleDayLogs';

export const AttendanceLogs = ({ user, logDate, setLogDate }) => {

    useEffect(() => {
        reqUserLogs({
            date: logDate
        })
    }, [logDate]);

    return (<>
        <div className='row m-0 mt-1'>
            <div className="col-xl-3 col-lg-12 dashboard-clock-logs py-2">
                <SingleDayLogs user={user} setLogDate={setLogDate} logDate={logDate} />
            </div>
            <div className="col-xl-9 col-lg-12 dashboard-date-logs py-2">
                <ListofDateLogs />
            </div>
        </div>
    </>);
}
