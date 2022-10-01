import React, { useEffect, useState } from 'react'
import moment from 'moment-timezone';
import { days } from '../../Dashboard/components/ClockTime';
import { useSelector } from 'react-redux';

export const TimeTracker = ({ taskDetails, onTaskToggler, isDisable, isTrackerRunning, setTracker }) => {
    const { user } = useSelector((state) => state.user);
    const [currSession, setCurrSession] = useState(null);
    const [currTimer, setTimer] = useState(null);

    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);
    const [second, setSecond] = useState(0);

    useEffect(() => {
        if (taskDetails.clockTime &&
            taskDetails.clockTime.started && taskDetails.clockTime.ended) {
            if (taskDetails.clockTime.started.length !== taskDetails.clockTime.ended.length) {
                const [lastLog] = taskDetails.clockTime.started.reverse();
                setCurrSession(lastLog?.time ? moment(lastLog?.time).utc().format() : null);
                setTracker(true);
            } else {
                setTracker(false);
                setCurrSession();
            }
        }
        //eslint-disable-next-line
    }, [taskDetails?.clockTime]);

    useEffect(() => {
        const update = () => {
            if (currSession) {
                let utcLive = moment.utc().format();
                let momentUTC = moment(`${utcLive.split('T')[0]} ${utcLive.split('T')[1].split('Z')[0]}`, 'YYYY-MM-DD hh:mm:ss')
                let momentCurrSession = moment(`${currSession.split('T')[0]} ${currSession.split('T')[1].split('Z')[0]}`, 'YYYY-MM-DD hh:mm:ss')
                setHour(momentUTC.diff(momentCurrSession, 'hours'));
                setMinute(momentUTC.diff(momentCurrSession, 'minutes') % 60);
                setSecond(momentUTC.diff(momentCurrSession, 'seconds') % 60);
            }
            if (taskDetails.clockTime && taskDetails.clockTime.started && taskDetails.clockTime.ended &&
                taskDetails.clockTime.started.length === taskDetails.clockTime.ended.length) {
                const totalTime = [];
                for (let index = 0; index < taskDetails.clockTime.ended.length; index++) {
                    const endedTime = new Date(taskDetails.clockTime.ended[index].time).getTime();
                    const startedTime = new Date(taskDetails.clockTime.started[index].time).getTime();
                    const diff = endedTime - startedTime;
                    totalTime.push(diff);
                }
                const tempTime = totalTime.reduce((total, num) => { return total + num; }, 0);
                setTimer(new Date(tempTime));
            }
        }
        update();
        const interval = setInterval(() => {
            update();
        }, 1000);

        return () => clearInterval(interval);
    }, [currSession, taskDetails.clockTime]);

    return (
        <div className="row justify-content-between m-auto">
            <div className='mr-2'>
                <div className="d-flex">
                    <h5 className="mb-0 mr-3">
                        {!currSession && '00 : 00 hrs'}
                        {currSession && `${String(hour).padStart(2, "0")} : ${String(minute).padStart(2, "0")}: ${String(second).padStart(2, "0")} hrs`}
                    </h5>
                    <div className="custom-control custom-switch"
                        title={(user.clockTime.clockin.length === user.clockTime.clockout.length) ? `Clock-In first` : (!isTrackerRunning) ? 'Start Timer' : 'Stop Timer'}
                    >
                        <input type="checkbox" className="custom-control-input" id="quickSettingSwitch2" checked={isTrackerRunning}
                            onChange={() => {
                                onTaskToggler(taskDetails);
                                // if (!isTrackerRunning) setCurrSession(moment.utc(new Date().toUTCString()).toDate());
                                if (isTrackerRunning) setCurrSession(null);
                            }}
                            disabled={isDisable || user.clockTime?.clockin?.length === user.clockTime?.clockout?.length} />
                        <label className="custom-control-label" htmlFor="quickSettingSwitch2">{isTrackerRunning ? 'Online' : 'Offline'}</label>
                    </div>
                </div>
                <p>{`Current session (${user.clockTime.clockin.length !== user.clockTime.clockout.length ? 'Clocked-In' : 'not in yet'})`}</p>
            </div>
            <div className="text-right">
                <h5 className="mb-0">
                    {!currTimer && '00 : 00 hrs'}
                    {currTimer && `${String(currTimer.getUTCHours()).padStart(2, "0")} : ${String(currTimer.getUTCMinutes()).padStart(2, "0")} hrs`}
                </h5>
                <p>{`Today (${days[new Date().getUTCDay()]} UTC)`}</p>
            </div>
        </div>
    )
}
