import moment from 'moment-timezone';
import React, { useState } from 'react'
import { useEffect } from 'react';
import ReactDatePicker from 'react-datepicker'
import { useSelector } from 'react-redux';
import { CLOCK_IN } from '../../redux/constants/userContants';
import { CONST } from '../../utils/constants';
import { reqListofDateLogs } from '../../utils/wssConnection/wssConnection';
import { ReactComponent as ExclamationSVG } from "../../assets/media/heroicons/outline/exclamation.svg";

export function getDateXDaysAgo(numOfDays, date = new Date()) {
    const daysAgo = new Date(date.getTime());
    daysAgo.setDate(date.getDate() - numOfDays);
    return daysAgo;
}

export const ListofDateLogs = () => {
    const { user } = useSelector((state) => state.user);
    const { LogsList } = user;
    const [filters, setFilters] = useState({
        dateFrom: getDateXDaysAgo(5),
        dateTo: new Date(),
    });

    useEffect(() => {
        reqListofDateLogs(filters);
    }, [filters]);

    const onChangeDate = (obj) => {
        setFilters((prev) => ({
            ...prev, ...obj
        }));
    }
    return (<>
        <div className="row m-0 mb-2 d-flex flex-wrap">
            <div className="input-group d-flex px-0 flex-nowrap max-width-fit m-1" title='Date From...'>
                <ReactDatePicker
                    id="logDateFrom"
                    placeholderText="Date from"
                    className="form-control search transparent-bg text-white"
                    selected={filters.dateFrom !== "" ? new Date(filters.dateFrom) : null}
                    value={filters.dateFrom !== "" ? new Date(filters.dateFrom) : null}
                    onChange={(date) => onChangeDate({ dateFrom: date })}
                    isClearable={false}
                    maxDate={filters.dateTo !== "" ? new Date(filters.dateTo) : null}
                />
            </div>
            <div className="input-group d-flex px-0 flex-nowrap max-width-fit m-1" title='Date To...'>
                <ReactDatePicker
                    id="logDateTo"
                    placeholderText="Date to"
                    className="form-control search transparent-bg text-white"
                    selected={filters.dateTo !== "" ? new Date(filters.dateTo) : null}
                    value={filters.dateTo !== "" ? new Date(filters.dateTo) : null}
                    onChange={(date) => onChangeDate({ dateTo: date })}
                    isClearable={false}
                    minDate={filters.dateFrom !== "" ? new Date(filters.dateFrom) : null}
                    maxDate={new Date()}
                />
            </div>
        </div>
        <div className="row m-0">
            <div className="table-responsive table-userlogs">
                {!LogsList?.data?.length && (
                    <div className="text-center text-muted align-items-center my-3">
                        <ExclamationSVG />
                        <p className="mb-0">No logs data available</p>
                    </div>
                )}
                {!!LogsList?.data?.length && (
                    <table className="table table-dark table-hover w-100">
                        <thead>
                            <tr className='list-task-table-row'>
                                <th>Date</th>
                                <th>Gross Hours</th>
                                <th>Arrival</th>
                                <th>Recent Log</th>
                            </tr>
                        </thead>
                        <tbody className='table-body-logs overflow-auto'>
                            {!!LogsList?.data?.length &&
                                LogsList?.data?.map((item, index) => {
                                    const grossHours = item.grossHours.split(":");
                                    const arrival = item.arrivalLog;
                                    const lastLog = item.recentLog;
                                    const DateString = moment(new Date(item.date).toISOString()).format("MM/DD/YY")
                                    return (
                                        <tr className="list-task-table-row" key={index}
                                            title={`Click here to view "${DateString}" logs`}>
                                            <td>
                                                <nobr>{DateString}</nobr>
                                            </td>
                                            <td>
                                                <nobr>
                                                    {`${grossHours[0]}h ${grossHours[1]}m`}
                                                </nobr>
                                            </td>
                                            <td>
                                                <nobr>
                                                    {arrival && arrival.type === CLOCK_IN ?
                                                        moment(arrival.time).tz(CONST.TIMEZONE).format("hh:mm A") :
                                                        'N/A'}
                                                </nobr>
                                            </td>
                                            <td>
                                                <nobr>
                                                    {lastLog ?
                                                        moment(lastLog.time).tz(CONST.TIMEZONE).format("hh:mm A") :
                                                        'N/A'}
                                                </nobr>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>)
                }
            </div>
        </div>
    </>)
}
