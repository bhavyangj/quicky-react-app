import { useDispatch, useSelector } from "react-redux";
import { ONLINE } from '../../../../../redux/constants/userContants';
import { changeTask } from '../../../../../redux/actions/modelAction';
import { DELETE_ACTIVE_CHAT } from '../../../../../redux/constants/chatConstants';
import { getImportantMessageList, getNoteList, getTaskList } from '../../../../../redux/actions/chatAction';
import { GROUP, NOTES, PRIVATE, TODO } from '../../../Models/models';
import { getDateLabel } from '../UserChat';
import { DEFAULT_IMAGE } from '../../../../Layout/HomePage/HomePage';
import * as momentTimzone from 'moment-timezone';
import { listenNotification } from "../../../../../utils/wssConnection/Listeners/messageListener";

export const ChatHeader = (props) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { activeChat } = useSelector((state) => state.chat);
    const onCloseActiveChat = () => {
        dispatch({ type: DELETE_ACTIVE_CHAT, payload: activeChat });
        listenNotification(dispatch, -1, user?.id);
    }
    const onTaskClickHandler = () => {
        dispatch(changeTask(TODO));
        dispatch(getTaskList(activeChat.id));
    }
    const onNotesClickHandler = () => {
        dispatch(changeTask(NOTES));
        dispatch(getNoteList(activeChat.id));
    }
    const privateUser = activeChat.chatusers.filter((item) => item.userId !== user.id)[0]?.user;
    return (<div className="chat-header">
        <button className="btn btn-secondary btn-icon btn-minimal btn-sm text-muted d-xl-none" type="button"
            data-close="" onClick={() => onCloseActiveChat()}>
            <svg className="hw-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </button>
        <div className="media chat-name align-items-center text-truncate">
            <div className={`avatar d-none d-sm-inline-block mr-3 ${activeChat.type === PRIVATE ? (privateUser.profileStatus === "online" ? 'avatar-online' : 'avatar-offline') : ''}`}>
                <img src={activeChat.image ? activeChat.image : DEFAULT_IMAGE} alt="" />
            </div>
            <div className="media-body align-self-center ">
                <h6 className="text-truncate mb-0 username-text">{activeChat.name}</h6>
                {activeChat.type === GROUP ?
                    <small className="text-muted">{`${activeChat.users.length} Participants`}</small>
                    : <small className="text-muted">{privateUser.profileStatus === ONLINE ? 'Online' :
                        `last seen ${getDateLabel(momentTimzone(privateUser.lastSeen).format("MM/DD/YY"))} at ${(momentTimzone(privateUser.lastSeen).format("hh:mm A"))}`}</small>
                }
            </div>
        </div>

        {/* <!-- Chat Options --> */}
        <ul className="nav flex-nowrap">
            <li className="nav-item list-inline-item d-none d-sm-block mr-1">
                <div className="nav-link text-muted px-1" data-toggle="collapse" data-target="/searchCollapse" aria-expanded={props.isSearchOpen} onClick={() => props.setSearch({ isOpen: !props.isSearchOpen.isOpen })}>
                    <svg className="hw-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </li>
            <li className="nav-item list-inline-item d-none d-sm-block d-xl-none mr-1">
                <div className="nav-link text-muted px-1" title="Task" onClick={() => onNotesClickHandler()}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
            </li>
            <li className="nav-item list-inline-item d-none d-sm-block d-xl-none mr-1">
                <div className="nav-link text-muted px-1" title="Task" onClick={() => onTaskClickHandler()}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                </div>
            </li>
            <li className="nav-item list-inline-item d-none d-sm-block d-xl-none mr-1">
                <div className="nav-link text-muted px-1" title="Task" onClick={() => {
                    dispatch(changeTask("important-message"));
                    dispatch(getImportantMessageList(activeChat.id));
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 18">
                        <g id="surface1">
                            <path stroke="currentColor" fillRule="nonzero" fill="none" fillOpacity="1" strokeWidth="1.5" d="M 4.367188 16.5 L 6.113281 10.800781 L 1.5 7.5 L 7.199219 7.5 L 9 1.5 L 10.800781 7.5 L 16.5 7.5 L 11.886719 10.800781 L 13.632812 16.5 L 9 12.976562 Z M 4.367188 16.5 " />
                        </g>
                    </svg>
                </div>
            </li>
            <li className="nav-item list-inline-item d-block mr-0">
                <div className="dropdown">
                    <div className="btn nav-link text-muted px-0" id="chatOptions" data-bs-toggle="dropdown">
                        <svg className="hw-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </div>
                    <ul className="dropdown-menu dropdown-menu-right m-0" aria-labelledby="chatOptions">
                        <li className="dropdown-item align-items-center d-flex" onClick={() => props.setChatInfoVisible(true)}>
                            <svg className="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>View Info</span>
                        </li>
                        <li className="dropdown-item align-items-center d-sm-none d-flex" onClick={() => {
                            dispatch(changeTask("important-message"));
                            dispatch(getImportantMessageList(activeChat.id));
                        }}>
                            <svg className="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <g id="surface1"><path stroke="currentColor" fillRule="nonzero" fill="none" fillOpacity="1" strokeWidth="1.5" d="M 4.367188 16.5 L 6.113281 10.800781 L 1.5 7.5 L 7.199219 7.5 L 9 1.5 L 10.800781 7.5 L 16.5 7.5 L 11.886719 10.800781 L 13.632812 16.5 L 9 12.976562 Z M 4.367188 16.5 " /></g>
                            </svg>
                            <span>Important</span>
                        </li>
                        <li className="dropdown-item align-items-center d-sm-none d-flex" onClick={() => onTaskClickHandler()}>
                            <svg className="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            <span>Tasks</span>
                        </li>
                        <li className="dropdown-item align-items-center d-sm-none d-flex" onClick={() => onNotesClickHandler()}>
                            <svg className="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span>All Notes</span>
                        </li>
                        <li className="dropdown-item align-items-center d-sm-none d-flex" onClick={() => props.setSearch({ isOpen: !props.isSearchOpen.isOpen })}>
                            <svg className="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span>Search</span>
                        </li>
                        <li className="dropdown-item align-items-center d-flex" onClick={() => dispatch(changeTask("settings"))}>
                            <svg className="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Settings</span>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
    </div>);
}