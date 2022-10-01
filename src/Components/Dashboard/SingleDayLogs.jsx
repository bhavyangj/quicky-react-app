import React from 'react'
import ReactDatePicker from 'react-datepicker';
// import { ReactComponent as CalendarSVG } from '../../assets/media/heroicons/outline/calendar.svg';
import moment from 'moment-timezone'
import { CONST } from '../../utils/constants';

export const SingleDayLogs = ({ user, logDate, setLogDate }) => {

    return (<>
        <div className="row m-0 mb-2 justify-content-end">
            <div className="input-group d-flex px-0 flex-nowrap" title='Select Date to get logs'>
                <ReactDatePicker
                    id="logDate"
                    placeholderText="Select Date"
                    className="form-control search transparent-bg text-white"
                    selected={logDate}
                    value={logDate}
                    onChange={(date) => setLogDate(moment(date).tz(CONST.TIMEZONE).toDate())}
                    isClearable={false}
                />
            </div>
            <button
                className='btn btn-sm-outline text-link my-1 p-0'
                onClick={() => setLogDate(moment().toDate())}
                disabled={moment(logDate).format("MM/DD/YY") === moment().format("MM/DD/YY")}
            >
                Today
            </button>
        </div>
        <div className='user-logs-data py-1'>
            <div className='text-center'>
                <h6 className='my-1'>US - Pacific Time</h6>
            </div>
            <div className="row m-0 ">
                <div className="col-6 mt-10 text-center px-1">
                    <div className="d-flex align-items-center justify-content-center">
                        <h6 className='my-1'>Clock-In</h6>
                    </div>
                    {user?.dateClockTime?.clockin.map(item => {
                        return (
                            <div key={item.id} className="d-flex align-items-center justify-content-center mb-1">
                                <svg className="mr-1 rotate-180deg" height="20" width="20" fill="green"><path d="M3.062 15 2 13.938l5.854-5.855 3.167 3.167 4.417-4.396H13v-1.5h5v5h-1.5V7.917l-5.479 5.458-3.167-3.167Z" /></svg>
                                <small className='text-white-70'>{moment(item.time).tz(CONST.TIMEZONE).format("hh:mm:ss A")}</small>
                            </div>)
                    })}
                </div>
                <div className="col-6 mt-10 text-center px-1">
                    <div className="d-flex align-items-center justify-content-center">
                        <h6 className='my-1'>Clock-out</h6>
                    </div>
                    {!!user?.dateClockTime?.clockout?.length && user.dateClockTime.clockout.map(item => {
                        return (
                            <div key={item.id} className="d-flex align-items-center justify-content-center mb-1">
                                <svg className='mr-1' xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="red"><path d="M3.062 15 2 13.938l5.854-5.855 3.167 3.167 4.417-4.396H13v-1.5h5v5h-1.5V7.917l-5.479 5.458-3.167-3.167Z" /></svg>
                                <small className='text-white-70'>{moment(item.time).tz(CONST.TIMEZONE).format("hh:mm:ss A")}</small>
                            </div>)
                    })}
                </div>
            </div>
        </div>
    </>)
}
