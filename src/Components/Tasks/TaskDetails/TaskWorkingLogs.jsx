import moment from 'moment-timezone';
import React, { useState } from 'react'
import { useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import { useSelector } from 'react-redux';
import { CONST } from '../../../utils/constants';
import { reqTaskTimeLogs } from '../../../utils/wssConnection/wssConnection';

export const TaskWorkingLogs = ({ taskDetails, user }) => {
    let taskClockIn = [];
    let taskClockOut = [];
    const [userData, setUserData] = useState();
    const [logsData, setLogsData] = useState();
    const { searchUserTaskLogs } = useSelector((state) => state.task);
    const [tasklogsDate, setLogsDate] = useState(new Date());

    useEffect(() => {
        setLogsData();
    }, [taskDetails, taskDetails.id]);

    useEffect(() => {
        if (searchUserTaskLogs) {
            setLogsData(searchUserTaskLogs);
        }
    }, [searchUserTaskLogs]);

    const FindLogsData = () => {
        if (userData?.user?.id && taskDetails.id) {
            reqTaskTimeLogs({
                taskId: taskDetails.id,
                userId: userData.user.id,
                userData: userData.user,
                date: tasklogsDate
            });
        }
    }
    if (logsData) {
        taskClockIn = logsData?.data?.filter((item) => item.type === 'started');
        taskClockOut = logsData?.data?.filter((item) => item.type === 'ended');
        // const grossHours = logsData.grossHours.split(":");
    }
    return (<>
        <div className="col-sm-6 col-md-12 p-0">
            <div className="card mb-2">
                <div className="card-body p-1">
                    <div className="card-filers d-flex">
                        <div className="dropdown">
                            <button className="btn btn-outline-default dropdown-toggle text-capitalize p-4_8" id="memberDropdown" data-bs-toggle="dropdown">
                                {userData ? userData?.user?.name : 'Select user'}
                            </button>
                            <ul className="dropdown-menu m-0" aria-labelledby="memberDropdown">
                                {!taskDetails?.taskmembers?.length &&
                                    <span className='mx-1'>No User Assigned</span>
                                }
                                {!!taskDetails?.taskmembers?.length && taskDetails.taskmembers.map((item, index) => (
                                    <li key={index} className="d-flex dropdown-item" onClick={() => { setUserData(item) }}>
                                        <span>{item.user.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="input-group d-flex flex-nowrap max-width-fit mx-1">
                            <ReactDatePicker
                                id="logDate"
                                placeholderText="Select Date"
                                className="form-control search transparent-bg text-white p-4_8"
                                value={tasklogsDate}
                                selected={tasklogsDate}
                                onChange={(date) => { setLogsDate(date) }}
                                isClearable={false}
                                maxDate={new Date()}
                            />
                        </div>
                        <button className="btn btn-primary p-4_8 ml-auto" onClick={FindLogsData} disabled={!userData?.user?.id}>
                            Find
                        </button>
                    </div>
                    {logsData && logsData.data &&
                        <div className="card-data">
                            {!logsData?.data.length && userData?.user?.id &&
                                <div className='text-center'>
                                    <p className='m-2'>No Data Found.</p>
                                </div>}
                            {!!taskClockIn?.length && <>
                                <div className='user-logs-data m-2'>
                                    <div className="row">
                                        <div className="col-6 mt-10 text-center">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <h6 className='my-1'>Clock-In</h6>
                                            </div>
                                            {taskClockIn.map(item => {
                                                return (
                                                    <div key={item.id} className="d-flex align-items-center justify-content-center mb-1">
                                                        <svg className="mr-1 rotate-180deg" height="20" width="20" fill="green"><path d="M3.062 15 2 13.938l5.854-5.855 3.167 3.167 4.417-4.396H13v-1.5h5v5h-1.5V7.917l-5.479 5.458-3.167-3.167Z" /></svg>
                                                        <small className='text-white'>{moment(item.time).tz(CONST.TIMEZONE).format("hh:mm:ss A")}</small>
                                                    </div>)
                                            })}
                                        </div>
                                        <div className="col-6 mt-10 text-center">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <h6 className='my-1'>Clock-out</h6>
                                            </div>
                                            {!!taskClockOut?.length && taskClockOut.map(item => {
                                                return (
                                                    <div key={item.id} className="d-flex align-items-center justify-content-center mb-1">
                                                        <svg className='mr-1' xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="red"><path d="M3.062 15 2 13.938l5.854-5.855 3.167 3.167 4.417-4.396H13v-1.5h5v5h-1.5V7.917l-5.479 5.458-3.167-3.167Z" /></svg>
                                                        <small className='text-white'>{moment(item.time).tz(CONST.TIMEZONE).format("hh:mm:ss A")}</small>
                                                    </div>)
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </>}
                        </div>}
                </div>
            </div>
        </div>
    </>)
}