import moment from 'moment-timezone'
import React from 'react'
import { CONST } from '../../../utils/constants'

export const DayLogs = ({ userDayLogs, userData }) => {
    if (userDayLogs) {
        const userClockIn = userDayLogs?.logs?.filter((item) => item.type === 'clockin');
        const userClockOut = userDayLogs?.logs?.filter((item) => item.type === 'clockout');
        const grossHours = userDayLogs.grossHours.split(":");
        return (<>
            <div className="text-left m-1 text-white">
                <p className="m-0 text-capitalize">{'Username : ' + userData?.name}</p>
                <p className="m-0">{'Date : ' + moment(new Date(userDayLogs.date).toISOString()).format("MM/DD/YY")}</p>
                <p className="m-0">{`Hours : ${grossHours[0]}h ${grossHours[1]}m`}</p>
            </div>
            <div className='user-logs-data'>
                {!!userClockIn?.length && <>
                    <div className="row m-2">
                        <div className="col-6 mt-10 text-center">
                            <div className="d-flex align-items-center justify-content-center">
                                <h6 className='my-1'>Clock-In</h6>
                            </div>
                            {!!userClockIn?.length && userClockIn.map(item => {
                                return (
                                    <div key={item.id} className="d-flex align-items-center justify-content-center mb-1">
                                        <svg className="mr-1 rotate-180deg" height="20" width="20" fill="green"><path d="M3.062 15 2 13.938l5.854-5.855 3.167 3.167 4.417-4.396H13v-1.5h5v5h-1.5V7.917l-5.479 5.458-3.167-3.167Z" /></svg>
                                        <small className='text-white-70'>{moment(item.time).tz(CONST.TIMEZONE).format("hh:mm:ss A")}</small>
                                    </div>)
                            })}
                        </div>
                        <div className="col-6 mt-10 text-center">
                            <div className="d-flex align-items-center justify-content-center">
                                <h6 className='my-1'>Clock-out</h6>
                            </div>
                            {!!userClockOut?.length && userClockOut.map(item => {
                                return (
                                    <div key={item.id} className="d-flex align-items-center justify-content-center mb-1">
                                        <svg className='mr-1' xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="red"><path d="M3.062 15 2 13.938l5.854-5.855 3.167 3.167 4.417-4.396H13v-1.5h5v5h-1.5V7.917l-5.479 5.458-3.167-3.167Z" /></svg>
                                        <small className='text-white-70'>{moment(item.time).tz(CONST.TIMEZONE).format("hh:mm:ss A")}</small>
                                    </div>)
                            })}
                        </div>
                    </div>
                </>}
            </div>
        </>);
    } else {
        return (<div className="text-center align-items-center">
            <p className='text-muted'>Select data from log table</p>
        </div>)
    }
}
