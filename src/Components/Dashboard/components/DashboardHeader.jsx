import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { onLogout, setInitState } from '../../../redux/actions/userAction';
import { changeProfileStatus, reqUserLogs, sendNewUserLog } from '../../../utils/wssConnection/wssConnection';
import { getProfileStatus } from '../../Chat/Sidebar/ChatsContentSidebar'
import { DEFAULT_IMAGE } from '../../Layout/HomePage/HomePage'
import { ClockTime } from './ClockTime';
import { ReactComponent as LogoutSvg } from "../../../assets/media/heroicons/outline/logout.svg";
import { ReactComponent as BusySvg } from "../../../assets/media/heroicons/solid/minus-circle.svg";
import { ReactComponent as CircleSvg } from "../../../assets/media/heroicons/solid/circle.svg";
import { ReactComponent as OfflineSvg } from "../../../assets/media/heroicons/solid/offline.svg";
import { ReactComponent as IdelSvg } from "../../../assets/media/heroicons/solid/moon.svg";
import { BREAK, BUSY, FREE, OFFLINE, ONCALL, ONLINE } from '../../../redux/constants/userContants';
import { PROFILE_PIC } from '../../Chat/Models/models';
import { changeModel } from '../../../redux/actions/modelAction';
import { useSelector } from 'react-redux';
import { ProfilePicUpdate } from '../../Chat/Models/ProfilePicUpdate';
import moment from 'moment-timezone';

export const DashboardHeader = ({ user, logDate }) => {
    const [isDisable, setDisableBtn] = useState(false);

    const reqClockIn = async () => {
        sendNewUserLog({
            clockin: true,
            date: logDate,
            isToday: moment(logDate).format("MM/DD/YY") === moment().format("MM/DD/YY")
        });
        reqUserLogs({ date: logDate });
        setDisableBtn(true);
        setTimeout(() => { setDisableBtn(false); }, 2000);
        changeProfileStatus(ONLINE);
        // console.log("request for clock-in, ", user.id);
    }

    const reqClockOut = () => {
        sendNewUserLog({
            clockout: true,
            date: logDate,
            isToday: moment(logDate).format("MM/DD/YY") === moment().format("MM/DD/YY")
        });
        reqUserLogs({ date: logDate });
        setDisableBtn(true);
        setTimeout(() => { setDisableBtn(false); }, 2000);
        // console.log("request for clock-out, ", user.id);
    }
    const reqOnCall = () => {
        // reqClockOut();
        if (user.profileStatus === ONCALL) changeProfileStatus(ONLINE);
        else changeProfileStatus(ONCALL);
    }
    const reqOnBreak = () => {
        reqClockOut();
        changeProfileStatus(BREAK);
    }
    return (
        <div className="col-12 my-2">
            <div className="card text-white box-shadow-0 dash-card">
                <div className="card-header d-flex flex-wrap align-items-center">
                    <h5 className="card-title text-white mb-0">Dashboard</h5>
                    <div className="heading-elements ml-auto">
                        <ul className="list-inline mb-0 d-flex">
                            <li><LogoutUser user={user} /></li>
                            <li><UserProfile user={user} /></li>
                        </ul>
                    </div>
                </div>
                <div className="card-content collapse show">
                    <div className="card-body row">
                        <div className="col-12 col-lg-6">
                            <div className="card text-white box-shadow-0">
                                <div className="card-header d-sm-flex flex-wrap justify-content-between">
                                    <ClockTime />
                                    <div className="heading-elements clock-menu d-flex flex-column flex-grow-1">
                                        <ul className="list-inline">
                                            {user?.clockTime?.clockin?.length === user?.clockTime?.clockout?.length ?
                                                <li className="text-center text-sm-right">
                                                    <button onClick={() => reqClockIn()} className='btn btn-info btn-sm ml-auto d-md-block' disabled={isDisable} title="Clock-in">Clock-In</button>
                                                </li>
                                                : <li className="text-center text-sm-right">
                                                    <button onClick={() => reqClockOut()} className='btn btn-danger btn-sm ml-auto d-md-block' disabled={isDisable} title="Clock-out">Clock-out</button>
                                                </li>
                                            }
                                        </ul>
                                        {user?.clockTime?.clockin?.length !== user?.clockTime?.clockout?.length &&
                                            <ul className="list-inline mt-auto mb-0 text-center text-sm-right">
                                                <button className='btn btn-info btn-sm mr-1' onClick={() => reqOnCall()} title="onCall">On Call</button>
                                                <button className='btn btn-info btn-sm' onClick={() => reqOnBreak()} title="onBreak">On Break</button>
                                            </ul>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-12 col-lg-6">
                            {user?.clockTime && !!user?.clockTime?.clockin?.length && <>
                                <div className='row mx-0 mt-2 mt-lg-0'>
                                    <div className="col-6 mt-10 text-center px-1">
                                        <div className="d-flex align-items-center">
                                            <h6>Clock-In</h6>
                                        </div>
                                        {user.clockTime.clockin.map(item => {
                                            return (
                                                <div key={item.id} className="d-flex align-items-center">
                                                    <svg className="mr-1 rotate-180deg" height="20" width="20" fill="green"><path d="M3.062 15 2 13.938l5.854-5.855 3.167 3.167 4.417-4.396H13v-1.5h5v5h-1.5V7.917l-5.479 5.458-3.167-3.167Z" /></svg>
                                                    <small className='text-white-70'>{moment(item.time).utc(0, true).local().format("hh:mm:ss A")}</small>
                                                </div>)
                                        })}
                                    </div>
                                    <div className="col-6 mt-10 text-center px-1">
                                        <div className="d-flex align-items-center">
                                            <h6>Clock-out</h6>
                                        </div>
                                        {!!user.clockTime.clockout?.length && user.clockTime.clockout.map(item => {
                                            return (
                                                <div key={item.id} className="d-flex align-items-center">
                                                    <svg className='mr-1' xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="red"><path d="M3.062 15 2 13.938l5.854-5.855 3.167 3.167 4.417-4.396H13v-1.5h5v5h-1.5V7.917l-5.479 5.458-3.167-3.167Z" /></svg>
                                                    <small className='text-white-70'>{moment(item.time).format("hh:mm:ss A")}</small>
                                                </div>)
                                        })}
                                    </div>
                                </div>
                            </>}
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

const LogoutUser = () => {
    const dispatch = useDispatch();

    const OnLogout = () => {
        dispatch(onLogout());
        dispatch(setInitState());
    }
    return (
        <div className="contacts-content align-self-center">
            <button className="btn btn-outlined text-light" onClick={OnLogout}>
                <LogoutSvg />
                <span className='px-1'>Logout</span>
            </button>
        </div>
    )
}

const UserProfile = ({ user }) => {
    const dispatch = useDispatch();
    const { name } = useSelector((state) => state.model);
    const updateProfilePicture = () => {
        dispatch(changeModel(PROFILE_PIC));
    }
    return (<>
        <div className="media align-items-center contacts-link primary">
            <div className={`avatar ${getProfileStatus(user?.profileStatus)} d-sm-inline-block mr-2 avatar-sm user-avatar`} title="Upload Profile" onClick={() => updateProfilePicture()}>
                <img src={user?.profilePicture ? user.profilePicture : DEFAULT_IMAGE} alt="Profile" />
            </div>
            <div className="contacts-content align-self-center">
                <div className="contacts-info line-height-1">
                    <h6 className="chat-name text-truncate username-text mb-0">{user?.name}</h6>
                    {/* <small className="text-capitalize text-white-50">{user?.profileStatus}</small> */}
                    <div className="dropdown">
                        <small className="dropdown-toggle text-muted text-capitalize cursor-pointer" id="userStatusDropdown" data-bs-toggle="dropdown">{user?.profileStatus}</small>
                        <ul className="dropdown-menu m-0" aria-labelledby="userStatusDropdown">
                            <li className="dropdown-item" onClick={() => changeProfileStatus(ONLINE)}>
                                <CircleSvg color="#45a675" height="14px" />
                                <span className="ml-1">Online</span>
                            </li>
                            <li className="dropdown-item" onClick={() => changeProfileStatus(BUSY)}>
                                <BusySvg color="#ff337c" height="14px" />
                                <span className="ml-1">Busy</span>
                            </li>
                            <li className="dropdown-item" onClick={() => changeProfileStatus(BREAK)}>
                                <BusySvg color="#fdff00" height="14px" />
                                <span className="ml-1">Break</span>
                            </li>
                            <li className="dropdown-item" onClick={() => changeProfileStatus(ONCALL)}>
                                <BusySvg color="#fdff00" height="14px" />
                                <span className="ml-1">On Call</span>
                            </li>
                            <li className="dropdown-item" onClick={() => changeProfileStatus(FREE)}>
                                <IdelSvg color="#f3a81b" height="14px" />
                                <span className="ml-1">Free</span>
                            </li>
                            <li className="dropdown-item" onClick={() => changeProfileStatus(OFFLINE)}>
                                <OfflineSvg color="#747f8d" height="14px" />
                                <span className="ml-1">Offline</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        {name === PROFILE_PIC && (<>
            <div className="backdrop backdrop-visible" />
            <ProfilePicUpdate />
        </>)}
    </>)
}