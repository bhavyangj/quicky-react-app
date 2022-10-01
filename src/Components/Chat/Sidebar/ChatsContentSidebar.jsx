import React, { useEffect, useState } from 'react'
import { BREAK, BUSY, FREE, OFFLINE, ONCALL, ONLINE, VACATION } from '../../../redux/constants/userContants';
import useDebounce from '../../hooks/useDebounce';
import { ChatsContentSidebarHeader } from './ChatsContentSidebarHeader';
import { ChatsContentSidebarList } from './ChatsContentSidebarList';
import { ReactComponent as MuteSound } from '../../../assets/media/heroicons/mute-sound.svg';
import { reqSearchChatMessage } from '../../../utils/wssConnection/wssConnection';

export const ChatsContentSidebar = () => {
    const [filterUsers, setFilterUsers] = useState("All Chats");
    const [searchGlobal, setSearchGlobal] = useState("");
    const [searchUser, setSearchUser] = useState("");
    const newUser = useDebounce(searchUser, 500);
    const newGlobal = useDebounce(searchGlobal, 500);

    useEffect(() => {
        reqSearchChatMessage({ search: newGlobal.trim() });
    }, [newGlobal]);

    return (<div className="tab-pane active" id="chats-content">
        <div className="d-flex flex-column h-100">
            <div className="hide-scrollbar h-100" id="chatContactsList">
                <ChatsContentSidebarHeader filterUsers={filterUsers} setFilterUsers={setFilterUsers} setSearchUser={setSearchUser} setSearchGlobal={setSearchGlobal} />
                <ChatsContentSidebarList filterUsers={filterUsers} searchUser={newUser} searchGlobal={searchGlobal} />
            </div>
        </div>
    </div>);
}

const MAX_COUNT_SHOW = 99;
export const NotificationBadge = ({ myChatDetails }) => {
    if ((myChatDetails.routineUnreadMessageCount || myChatDetails.emergencyUnreadMessageCount || myChatDetails.urgentUnreadMessageCount) && (myChatDetails.routineUnreadMessageCount + myChatDetails.emergencyUnreadMessageCount + myChatDetails.urgentUnreadMessageCount) > 0)
        return (<span>
            {myChatDetails.atTheRateMentionMessageCount > 0 && <div className="badge badge-rounded bg-at-the-rate text-white ml-50 position-relative badge-custom">
                {myChatDetails.atTheRateMentionMessageCount <= MAX_COUNT_SHOW ? <span>{`@ ${myChatDetails?.atTheRateMentionMessageCount}`}</span> : <span>{'@' + MAX_COUNT_SHOW}<span className="badge-plus">+</span></span>}
            </div>}
            {myChatDetails.hasMentionMessageCount > 0 && <div className="badge badge-rounded bg-hashtag text-white ml-50 position-relative badge-custom">
                {myChatDetails.hasMentionMessageCount <= MAX_COUNT_SHOW ? <span>{`# ${myChatDetails?.hasMentionMessageCount}`}</span> : <span>{'#' + MAX_COUNT_SHOW}<span className="badge-plus">+</span></span>}
            </div>}
            {myChatDetails.emergencyUnreadMessageCount > 0 && <div className="badge badge-rounded bg-emergency text-white ml-50 position-relative badge-custom">
                {myChatDetails.emergencyUnreadMessageCount <= MAX_COUNT_SHOW ? <span>{myChatDetails?.isEmergencyNotificationMute && <MuteSound height={14} />}{myChatDetails.emergencyUnreadMessageCount}</span> : <span>{MAX_COUNT_SHOW}<span className="badge-plus">+</span></span>}
            </div>}
            {myChatDetails.urgentUnreadMessageCount > 0 && <div className="badge badge-rounded bg-urgent text-white ml-50 position-relative badge-custom">
                {myChatDetails.urgentUnreadMessageCount <= MAX_COUNT_SHOW ? <span>{myChatDetails?.isUrgentNotificationMute && <MuteSound height={14} />}{myChatDetails.urgentUnreadMessageCount}</span> : <span>{MAX_COUNT_SHOW}<span className="badge-plus">+</span></span>}
            </div>}
            {myChatDetails.routineUnreadMessageCount > 0 && <div className="badge badge-rounded bg-routine text-white ml-50 position-relative badge-custom">
                {myChatDetails.routineUnreadMessageCount <= MAX_COUNT_SHOW ? <span>{myChatDetails?.isRoutineNotificationMute && <MuteSound height={14} />}{myChatDetails.routineUnreadMessageCount}</span> : <span>{MAX_COUNT_SHOW}<span className="badge-plus">+</span></span>}
            </div>}
        </span>);
}

export const getProfileStatus = (status) => {
    switch (status) {
        case ONLINE:
            return "avatar-online";
        case OFFLINE:
            return "avatar-offline";
        case FREE:
            return "avatar-away";
        case BUSY:
            return "avatar-busy";
        case BREAK:
            return "avatar-vacation";
        case ONCALL:
            return "avatar-vacation";
        case VACATION:
            return "avatar-vacation";
        default:
            return "";
    }
};
