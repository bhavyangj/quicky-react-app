import { useDispatch, useSelector } from "react-redux";
import { changeModel } from "../../../redux/actions/modelAction";
import { DEFAULT_IMAGE } from "../../Layout/HomePage/HomePage";
import { CREATE_GROUP, GROUP, NEW_CHAT, PRIVATE, PROFILE_PIC } from "../Models/models";
import { getProfileStatus } from "./ChatsContentSidebar";
import { ReactComponent as BusySvg } from "../../../assets/media/heroicons/solid/minus-circle.svg";
import { ReactComponent as CircleSvg } from "../../../assets/media/heroicons/solid/circle.svg";
import { ReactComponent as OfflineSvg } from "../../../assets/media/heroicons/solid/offline.svg";
import { ReactComponent as IdelSvg } from "../../../assets/media/heroicons/solid/moon.svg";
import { ReactComponent as SearchSvg } from "../../../assets/media/heroicons/solid/search.svg";
import { changeProfileStatus } from "../../../utils/wssConnection/wssConnection";
import { BREAK, BUSY, FREE, OFFLINE, ONCALL, ONLINE } from "../../../redux/constants/userContants";

export const ChatsContentSidebarHeader = (props) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const ModelHandler = (name) => dispatch(changeModel(name));
    const onFilterUsersHandler = (type) => props.setFilterUsers(type);
    const updateProfilePicture = () => {
        dispatch(changeModel(PROFILE_PIC));
    }

    return (<div className="sidebar-header sticky-top p-2">
        <div className="d-flex justify-content-between align-items-center">
            <div className="media align-items-center contacts-link">
                <div className={`avatar ${getProfileStatus(user?.profileStatus)} d-sm-inline-block mr-2 user-avatar`} title="Upload Profile" onClick={() => updateProfilePicture()}>
                    <img src={user?.profilePicture ? user.profilePicture : DEFAULT_IMAGE} alt="Profile" />
                </div>
                <div className="contacts-content align-self-center">
                    <div className="contacts-info">
                        <h6 className="chat-name text-truncate username-text mb-0">{user?.name}</h6>
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
                                {/* <li className="dropdown-item" onClick={() => changeProfileStatus(VACATION)}>
                                    <BusySvg color="#fdff00" height="14px" />
                                    <span className="ml-1">Vacation</span>
                                </li> */}
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
            <ul className="nav flex-nowrap">
                <li className="nav-item list-inline-item mr-0">
                    <div className="dropdown mr-2">
                        <button className="btn nav-link text-muted p-0" id="chatHeadDropdown" data-bs-toggle="dropdown">
                            <svg className="hw-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>
                        <ul className="dropdown-menu m-0" aria-labelledby="chatHeadDropdown">
                            <li className="dropdown-item" onClick={() => ModelHandler(NEW_CHAT)}>New Chat</li>
                            <li className="dropdown-item" onClick={() => ModelHandler(CREATE_GROUP)}>Create Group</li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
        <div className="sidebar-sub-header mt-2">
            <div className="dropdown mr-2">
                <button className="btn btn-outline-default dropdown-toggle text-capitalize" id="chatFilterDropdown" data-bs-toggle="dropdown">
                    {props.filterUsers}
                </button>
                <ul className="dropdown-menu m-0" aria-labelledby="chatFilterDropdown">
                    <li className="dropdown-item" onClick={() => onFilterUsersHandler("All Chats")}>All Chats</li>
                    <li className="dropdown-item" onClick={() => onFilterUsersHandler(PRIVATE)}>Private</li>
                    <li className="dropdown-item" onClick={() => onFilterUsersHandler(GROUP)}>Groups</li>
                </ul>
            </div>
            {/* <form className="form-inline">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control search border-right-0 transparent-bg pr-0 text-white-70"
                        placeholder="Search User/Group"
                        onChange={(e) => props.setSearchUser(e.target.value.trim())} />
                    <div className="input-group-append">
                        <div className="input-group-text transparent-bg border-left-0" role="button">
                            <SearchSvg className="text-muted hw-20" />
                        </div>
                    </div>
                </div>
            </form> */}
            <form className="form-inline ml-auto">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control search border-right-0 transparent-bg pr-0 text-white-70"
                        placeholder="Search chat, messages..."
                        onChange={(e) => props.setSearchGlobal(e.target.value.trim())} />
                    <div className="input-group-append">
                        <div className="input-group-text transparent-bg border-left-0" role="button">
                            <SearchSvg className="text-muted hw-20" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
        {/* <div className="sidebar-sub-header d-flex">
            <form className="form-inline ml-auto">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control search border-right-0 transparent-bg pr-0 text-white-70"
                        placeholder="Search chat, messages..."
                        onChange={(e) => props.setSearchGlobal(e.target.value.trim())} />
                    <div className="input-group-append">
                        <div className="input-group-text transparent-bg border-left-0" role="button">
                            <SearchSvg className="text-muted hw-20" />
                        </div>
                    </div>
                </div>
            </form>
        </div> */}
    </div>);
}