import moment from 'moment-timezone';
import React from 'react'
import ReactDatePicker from 'react-datepicker';
import { CLOCK_IN } from '../../../redux/constants/userContants';
import { CONST } from '../../../utils/constants';
import { ReactComponent as ExclamationSVG } from "../../../assets/media/heroicons/outline/exclamation.svg";
import { UsersDropdown } from '../UsersDropdown';
import { ReqUserLogs } from '../../../utils/wssConnection/wssConnection';

export const DateLogs = ({
    userData,
    setUserData,
    LogsList,
    setLogsList,
    filters,
    setFilters,
    setUserDayLogs
}) => {

    const onChangeDate = (obj) => {
        setFilters((prev) => ({
            ...prev, ...obj
        }));
    }

    const getUserLogs = () => {
        ReqUserLogs({
            ...filters,
            userId: userData.id,
            userData
        });
    }
    const setUserDay = (item) => {
        setUserDayLogs(item);
    }

    return (
        <>
            <div className="row m-0 mb-2 d-flex flex-wrap align-items-center">
                <UsersDropdown user={userData} setUserData={setUserData} />
                <div className="input-group d-flex px-0 flex-nowrap max-width-fit m-1">
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
                    {/* <div className="input-group-append">
                    <div className="input-group-text transparent-bg border-left-0" role="button">
                        <CalendarSVG />
                    </div>
                </div> */}
                </div>
                <div className="input-group d-flex px-0 flex-nowrap max-width-fit m-1">
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
                    {/* <div className="input-group-append">
                    <div className="input-group-text transparent-bg border-left-0" role="button">
                        <CalendarSVG />
                    </div>
                </div> */}
                </div>
                <button className='btn btn-primary' onClick={getUserLogs}>Search</button>
            </div>
            <div className="row m-0">
                <div className="table-responsive table-userlogs">
                    {!LogsList?.data?.length && (
                        <div className="text-center text-muted align-items-center my-3">
                            <ExclamationSVG />
                            <p className="mb-0">No logs data available</p>
                        </div>
                    )}
                    {!!LogsList?.data?.length && <>
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
                                {
                                    !!LogsList?.data?.length &&
                                    LogsList?.data?.map((item, index) => {
                                        const grossHours = item.grossHours.split(":");
                                        const arrival = item.arrivalLog;
                                        const lastLog = item.recentLog;
                                        return (
                                            <tr className="list-task-table-row" key={index} onClick={() => setUserDay(item)}>
                                                <td>
                                                    <nobr>{moment(new Date(item.date).toISOString()).format("MM/DD/YY")}</nobr>
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
                        </table>
                        <h6>{`Total Hours: ${LogsList?.totalHours.split(":")[0]}h ${LogsList?.totalHours.split(":")[1]}m`}</h6>
                    </>}
                </div>
            </div>
        </>
    )
}
