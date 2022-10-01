import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { saveNotificationSettings } from '../../../redux/actions/chatAction';
import { changeTask } from '../../../redux/actions/modelAction';
import { SET_NOTIFICATION_STATUS } from '../../../redux/constants/chatConstants';
import { SETTINGS } from '../Models/models';
import { ChatBckground } from './Settings/ChatBckground';

export const Settings = ({ taskName, dispatch }) => {
    const { user } = useSelector((state) => state.user);
    const { activeChat } = useSelector((state) => state.chat);
    const userIndex = activeChat.chatusers.findIndex(item => item.userId === user.id);
    const { isRoutineNotificationMute, isEmergencyNotificationMute, isUrgentNotificationMute } = activeChat.chatusers[userIndex];
    const [muteAllNotification, setMuteAllNotification] = useState(isRoutineNotificationMute && isEmergencyNotificationMute && isUrgentNotificationMute);
    const [routineNotification, setRoutineNotification] = useState(isRoutineNotificationMute);
    const [emergencyNotification, setEmergencyNotification] = useState(isEmergencyNotificationMute);
    const [urgentNotification, setUrgentNotification] = useState(isUrgentNotificationMute);
    const [Loading, setLoading] = useState(false);

    const onCloseHandler = () => {
        dispatch(changeTask(""));
    }
    const OnChangeMuteAllHandler = (e) => {
        setMuteAllNotification(e.target.checked);
        if (routineNotification !== e.target.checked) setRoutineNotification(e.target.checked)
        if (emergencyNotification !== e.target.checked) setEmergencyNotification(e.target.checked)
        if (urgentNotification !== e.target.checked) setUrgentNotification(e.target.checked)
    }
    const onSubmithandler = async () => {
        setLoading(true);
        if (isRoutineNotificationMute !== routineNotification || isEmergencyNotificationMute !== emergencyNotification || isUrgentNotificationMute !== urgentNotification) {
            const data = await saveNotificationSettings(activeChat.id, routineNotification, emergencyNotification, urgentNotification);
            if (data.status === 1) dispatch({ type: SET_NOTIFICATION_STATUS, payload: data.data });
        }
        setTimeout(() => {
            setLoading(false);
        }, 300);
    }

    return (
        <div className={`tab-pane h-100 ${taskName === SETTINGS ? 'active' : ''}`} id="quick-settings" role="tabpanel" aria-labelledby="quick-settings-tab">
            <div className="appnavbar-content-wrapper">
                <div className="appnavbar-scrollable-wrapper">
                    <div className="appnavbar-heading sticky-top">
                        <ul className="nav justify-content-between align-items-center">
                            <li className="text-center">
                                <h5 className="text-truncate mb-0">Settings</h5>
                            </li>
                            <li className="nav-item list-inline-item close-btn" onClick={() => onCloseHandler()}>
                                <div data-appcontent-close>
                                    <svg className="hw-22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="appnavbar-body">
                        <div className="settings-container p-0">
                            <div className="mute-setting p-2">
                                <div className="todo-title">
                                    <h6 className="">Mute Notifications</h6>
                                </div>
                                <ul className="list-group border list-group-flush">
                                    <li className="list-group-item py-2">
                                        <div className="media align-items-center">
                                            <div className="media-body">
                                                <p className="mb-0">All</p>
                                            </div>
                                            <div className="custom-control custom-switch ml-2">
                                                <input type="checkbox" className="custom-control-input" id="quickSettingSwitch1" checked={muteAllNotification} onChange={OnChangeMuteAllHandler} />
                                                <label className="custom-control-label" htmlFor="quickSettingSwitch1">&nbsp;</label>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="list-group-item py-2">
                                        <div className="media align-items-center">
                                            <div className="media-body">
                                                <p className="mb-0">Routine</p>
                                            </div>
                                            <div className="custom-control custom-switch ml-2">
                                                <input type="checkbox" className="custom-control-input" id="quickSettingSwitch2" checked={routineNotification} onChange={() => setRoutineNotification(!routineNotification)} />
                                                <label className="custom-control-label" htmlFor="quickSettingSwitch2">&nbsp;</label>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="list-group-item py-2">
                                        <div className="media align-items-center">
                                            <div className="media-body">
                                                <p className="mb-0">Emergency</p>
                                            </div>
                                            <div className="custom-control custom-switch ml-2">
                                                <input type="checkbox" className="custom-control-input" id="quickSettingSwitch3" checked={emergencyNotification} onChange={() => setEmergencyNotification(!emergencyNotification)} />
                                                <label className="custom-control-label" htmlFor="quickSettingSwitch3">&nbsp;</label>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="list-group-item py-2">
                                        <div className="media align-items-center">
                                            <div className="media-body">
                                                <p className="mb-0">Urgent</p>
                                            </div>
                                            <div className="custom-control custom-switch ml-2">
                                                <input type="checkbox" className="custom-control-input" id="quickSettingSwitch4" checked={urgentNotification} onChange={() => setUrgentNotification(!urgentNotification)} />
                                                <label className="custom-control-label" htmlFor="quickSettingSwitch4">&nbsp;</label>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <ChatBckground user={user} />
                        </div>
                    </div>
                    <div className="appnavbar-footer">
                        {!Loading ?
                            <button className="btn btn-primary btn-block" onClick={() => onSubmithandler()}
                                disabled={!(isRoutineNotificationMute !== routineNotification || isEmergencyNotificationMute !== emergencyNotification || isUrgentNotificationMute !== urgentNotification)}>
                                Save settings
                            </button>
                            : <div className="btn btn-primary btn-block" style={{ opacity: '0.5' }}>Saving...</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}
