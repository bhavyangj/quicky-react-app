import React, { useEffect, useState } from 'react'
import classes from './clock.module.css';
import moment from 'moment-timezone';
import { CONST } from '../../../utils/constants';

export const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const ClockTime = ({ h24 = false }) => {

    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);
    const [second, setSecond] = useState(0);
    const [day, setDay] = useState(0);
    const [pm, setPm] = useState(false);

    useEffect(() => {
        // const update = () => {
        //     const date = momentTimzone().toDate();
        //     let hour = date.getHours();
        //     if (!h24) {
        //         hour = (hour % 12) || 12;
        //     }
        //     setHour(hour);
        //     setMinute(date.getMinutes());
        //     setSecond(date.getSeconds());
        //     setDay(date.getDay());
        //     setPm(date.getHours() >= 12);
        // }
        const update = () => {
            const date = moment.tz(CONST.TIMEZONE);
            let hour = date.hours();
            if (!h24) {
                hour = (hour % 12) || 12;
            }
            setHour(hour);
            setMinute(date.minutes());
            setSecond(date.seconds());
            setDay(date.days());
            setPm(date.hours() >= 12);
        }

        update();

        const interval = setInterval(() => {
            update();
        }, 1000);

        return () => clearInterval(interval);
    }, [h24]);

    return (
        <div className={classes["clock"]}>
            <div className={classes["calendar"]}>
                <p className='mb-0'>
                    {`${days[day]}, ${moment.tz(CONST.TIMEZONE).format("MMMM Do YYYY")}`}
                </p>
            </div>
            <div className={classes["row"]}>
                <div className={classes["hour"]}>
                    <Number value={hour} />
                    <Word value={':'} />
                    <Number value={minute} />
                    <Word value={':'} />
                    <Number value={second} />
                </div>
                <div className={classes["ampm"]}>
                    {!pm ?
                        <Word value={'AM'} hidden={pm} />
                        : <Word value={'PM'} hidden={!pm} />
                    }
                </div>
            </div>
        </div>
    )

}

export const Number = ({ value = 0 }) => {
    const result = String(value).padStart(2, "0");
    return (
        <div className={classes["digital"]}>
            <p>{result}</p>
        </div>
    )
}

export const Word = ({ value, hidden = false }) => {
    return (
        <div className={classes["digital"]}>
            <p>{value}</p>
        </div>
    )
}