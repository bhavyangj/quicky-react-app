import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveChat } from "../../../redux/actions/chatAction";
import { listenChatActivities } from "../../../utils/wssConnection/wssConnection";
import { getProfileStatus, NotificationBadge } from "./ChatsContentSidebar";
import { AUDIO, IMAGE, RELOAD_STATE, SET_FIND_MSG_ID, VIDEO } from "../../../redux/constants/chatConstants";
import { compareDateTime } from "../../../redux/reducers/chatReducer";
import { DEFAULT_IMAGE } from "../../Layout/HomePage/HomePage";
import { ALL_CHATS, GROUP } from "../Models/models";
import moment, * as momentTimzone from 'moment-timezone';
import { ReactComponent as ImageIconSVG } from '../../../assets/media/heroicons/image-icon.svg';
import { ReactComponent as VideoIconSVG } from '../../../assets/media/heroicons/video-icon.svg';
import { ReactComponent as AudioIconSVG } from '../../../assets/media/heroicons/audio-icon.svg';
import { ReactComponent as DocumentIconSVG } from '../../../assets/media/heroicons/document-icon.svg';
import { listenNotification } from "../../../utils/wssConnection/Listeners/messageListener";

export const ChatsContentSidebarList = (props) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { chatList, activeChat, chatListData } = useSelector((state) => state.chat);

    useEffect(() => {
        // Listen Notification for another chat than ActiveChat
        listenNotification(dispatch, activeChat && activeChat.id, user && user.id);
        dispatch(listenChatActivities(activeChat.id));
    }, [activeChat, user, dispatch]);

    useEffect(() => {
        chatList?.sort(compareDateTime);
        dispatch({ type: RELOAD_STATE });
    }, [chatList, dispatch]);
    const onClickMessage = (item) => {
        // console.log(item);
        dispatch({ type: SET_FIND_MSG_ID, payload: { cId: item.id, lId: item?.chatDetails?.messages[0]?.id } });
        setUserHandler(
            chatList.filter((chat) => chat.id === item.chatDetails.id)[0],
            activeChat.id, user.id, dispatch);
    }

    if (props.searchGlobal === "")
        return (
            <ul className="contacts-list" id="chatContactTab" data-chat-list="">
                {chatList?.map((item) => {
                    if (props.filterUsers === item.type || props.filterUsers === ALL_CHATS) {
                        if (item.type === GROUP) {
                            const { name, image } = item;
                            const chatUpdatedTime = (item.messages[0] ? item.messages[0].createdAt : item.updatedAt);
                            const myChatDetails = item.chatusers?.filter(x => x.userId === user?.id)[0];
                            if (name.toLowerCase().includes(props.searchUser.toLowerCase()) || props.searchUser === "")
                                return (
                                    <li className={`contacts-item ${(item.id === activeChat?.id) ? 'active' : ''} ${myChatDetails?.routineUnreadMessageCount + myChatDetails?.emergencyUnreadMessageCount + myChatDetails?.urgentUnreadMessageCount > 0 ? 'unread' : ''}`.trim()} key={item.id}>
                                        <div className="contacts-link" onClick={() => setUserHandler(item, activeChat.id, user.id, dispatch)}>
                                            <div className="avatar"><img src={image ? image : DEFAULT_IMAGE} alt="" /></div>
                                            <div className="contacts-content">
                                                <div className="contacts-info">
                                                    <h6 className="chat-name text-truncate username-text">{name}</h6>
                                                    <div className="chat-time">{getTimeLabel(chatUpdatedTime)}</div>
                                                </div>
                                                {!item.messages[0]?.isDeleted && <>{!item.messages[0]?.mediaType ?
                                                    <div className="contacts-texts">
                                                        {item.messages[0]?.subject ?
                                                            <>
                                                                <div className="flex-60">
                                                                    {item.messages[0]?.message &&
                                                                        <p className="fs-14 text-truncate mr-1 mb-0">{`${item.messages[0]?.sendByDetail?.name}: Subject: ${item.messages[0]?.subject}`}</p>}
                                                                    {/* <p className="text-truncate">{`${item.messages[0]?.isMessage ? 'Message:' : 'Task:'} ${item.messages[0]?.message ? item.messages[0]?.message : 'Start Conversation'}`}</p> */}
                                                                </div>
                                                                <div><NotificationBadge myChatDetails={myChatDetails} /></div>
                                                            </>
                                                            : <>
                                                                {item.messages[0]?.message ?
                                                                    <p className="fs-14 text-truncate mr-1 mb-0">{`${item.messages[0]?.sendByDetail?.name}: ${item.messages[0]?.message}`}</p> :
                                                                    <p className="fs-14 text-capitalize text-truncate mr-1 mb-0">{`Start Conversation`}</p>
                                                                }
                                                                <NotificationBadge myChatDetails={myChatDetails} />
                                                            </>
                                                        }
                                                    </div>
                                                    : <div className="contacts-texts">
                                                        <p className="fs-14 text-capitalize text-truncate mr-1 mb-0">
                                                            <>{`${item.messages[0]?.sendByDetail?.name}: `}</>
                                                            <>{getMediaSVG(item.messages[0]?.mediaType.split("/")[0])}</>
                                                            <>{`${item.messages[0]?.fileName}`}</>
                                                            {/* {`${item.messages[0]?.sendByDetail?.name}: ${item.messages[0]?.fileName}`} */}
                                                        </p>
                                                        <NotificationBadge myChatDetails={myChatDetails} />
                                                    </div>}</>}
                                                {item.messages[0]?.isDeleted && <div className="contacts-texts">
                                                    <p className="fs-14 text-capitalize text-truncate mr-1 mb-0">{`${item.messages[0]?.sendByDetail?.name}: This message was deleted`}</p>
                                                    <NotificationBadge myChatDetails={myChatDetails} />
                                                </div>}
                                            </div>
                                        </div>
                                    </li>
                                );
                        }
                        else {
                            const { name, profilePicture, profileStatus } = item.chatusers.filter(x => x.userId !== user.id)[0]?.user;
                            const chatUpdatedTime = (item.messages[0] ? item.messages[0].createdAt : item.updatedAt);
                            const myChatDetails = item.chatusers.filter(x => x.userId === user.id)[0];
                            if (name.toLowerCase().includes(props.searchUser.toLowerCase()) || props.searchUser === "")
                                return (
                                    <li className={`contacts-item ${(item.id === activeChat?.id) ? 'active' : ''} ${myChatDetails?.routineUnreadMessageCount + myChatDetails?.emergencyUnreadMessageCount + myChatDetails?.urgentUnreadMessageCount > 0 ? 'unread' : ''}`.trim()} key={item.id}>
                                        <div className="contacts-link" onClick={() => setUserHandler(item, activeChat.id, user.id, dispatch)}>
                                            <div className={`avatar ${getProfileStatus(profileStatus)}`}><img src={profilePicture ? profilePicture : DEFAULT_IMAGE} alt="" /></div>
                                            <div className="contacts-content">
                                                <div className="contacts-info">
                                                    <h6 className="chat-name text-truncate username-text">{name}</h6>
                                                    <div className="chat-time">{getTimeLabel(chatUpdatedTime)}</div>
                                                </div>
                                                {!item.messages[0]?.isDeleted && <>{!item.messages[0]?.mediaType ? <div className="contacts-texts">
                                                    {item.messages[0]?.subject ? <>
                                                        <div className="flex-60">
                                                            <p className="text-truncate">{`Subject: ${item.messages[0]?.subject}`}</p>
                                                            <p className="text-truncate">{`${item.messages[0]?.isMessage ? 'Message:' : 'Task:'} ${item.messages[0]?.message ? item.messages[0]?.message : 'Start Conversation'}`}</p>
                                                        </div>
                                                        <div><NotificationBadge myChatDetails={myChatDetails} /></div>
                                                    </>
                                                        : <><p className="text-truncate">
                                                            {item.messages[0]?.message ? `${item.messages[0]?.isMessage ? 'Message:' : 'Task:'} ${item.messages[0]?.message}` : 'Start Conversation'}
                                                        </p><NotificationBadge myChatDetails={myChatDetails} />
                                                        </>}
                                                </div>
                                                    : <div className="contacts-texts">
                                                        {getMediaSVG(item.messages[0]?.mediaType.split("/")[0])}
                                                        <p className="text-truncate svg-text mb-0">{item.messages[0]?.fileName}</p>
                                                        <NotificationBadge myChatDetails={myChatDetails} />
                                                    </div>}</>}
                                                {item.messages[0]?.isDeleted && <div className="contacts-texts">
                                                    <p className="text-truncate">{`This message was deleted`}</p>
                                                    <NotificationBadge myChatDetails={myChatDetails} />
                                                </div>}
                                            </div>
                                        </div>
                                    </li>
                                );
                        }
                    }
                    return null;
                })}
            </ul>);
    else {
        return (
            <ul className="contacts-list" id="chatContactTab" data-chat-list="">
                {chatListData?.chats?.map((item) => {
                    if (props.filterUsers === item.type || props.filterUsers === ALL_CHATS) {
                        if (item.type === GROUP) {
                            const { name, image } = item;
                            const chatUpdatedTime = (item.messages[0] ? item.messages[0].createdAt : item.updatedAt);
                            const myChatDetails = item.chatusers?.filter(x => x.userId === user?.id)[0];
                            if (name.toLowerCase().includes(props.searchUser.toLowerCase()) || props.searchUser === "")
                                return (
                                    <li className={`contacts-item ${(item.id === activeChat?.id) ? 'active' : ''} ${myChatDetails?.routineUnreadMessageCount + myChatDetails?.emergencyUnreadMessageCount + myChatDetails?.urgentUnreadMessageCount > 0 ? 'unread' : ''}`.trim()} key={item.id}>
                                        <div className="contacts-link" onClick={() => setUserHandler(item, activeChat.id, user.id, dispatch)}>
                                            <div className="avatar"><img src={image ? image : DEFAULT_IMAGE} alt="" /></div>
                                            <div className="contacts-content">
                                                <div className="contacts-info">
                                                    <h6 className="chat-name text-truncate username-text">{name}</h6>
                                                    <div className="chat-time">{getTimeLabel(chatUpdatedTime)}</div>
                                                </div>
                                                {!item.messages[0]?.isDeleted && <>{!item.messages[0]?.mediaType ?
                                                    <div className="contacts-texts">
                                                        {item.messages[0]?.subject ?
                                                            <>
                                                                <div className="flex-60">
                                                                    {item.messages[0]?.message &&
                                                                        <p className="fs-14 text-truncate mr-1 mb-0">{`${item.messages[0]?.sendByDetail?.name}: Subject: ${item.messages[0]?.subject}`}</p>}
                                                                    {/* <p className="text-truncate">{`${item.messages[0]?.isMessage ? 'Message:' : 'Task:'} ${item.messages[0]?.message ? item.messages[0]?.message : 'Start Conversation'}`}</p> */}
                                                                </div>
                                                                <div><NotificationBadge myChatDetails={myChatDetails} /></div>
                                                            </>
                                                            : <>
                                                                {item.messages[0]?.message ?
                                                                    <p className="fs-14 text-truncate mr-1 mb-0">{`${item.messages[0]?.sendByDetail?.name}: ${item.messages[0]?.message}`}</p> :
                                                                    <p className="fs-14 text-capitalize text-truncate mr-1 mb-0">{`Start Conversation`}</p>
                                                                }
                                                                <NotificationBadge myChatDetails={myChatDetails} />
                                                            </>
                                                        }
                                                    </div>
                                                    : <div className="contacts-texts">
                                                        <p className="fs-14 text-capitalize text-truncate mr-1 mb-0">
                                                            <>{`${item.messages[0]?.sendByDetail?.name}: `}</>
                                                            <>{getMediaSVG(item.messages[0]?.mediaType.split("/")[0])}</>
                                                            <>{`${item.messages[0]?.fileName}`}</>
                                                            {/* {`${item.messages[0]?.sendByDetail?.name}: ${item.messages[0]?.fileName}`} */}
                                                        </p>
                                                        <NotificationBadge myChatDetails={myChatDetails} />
                                                    </div>}</>}
                                                {item.messages[0]?.isDeleted && <div className="contacts-texts">
                                                    <p className="fs-14 text-capitalize text-truncate mr-1 mb-0">{`${item.messages[0]?.sendByDetail?.name}: This message was deleted`}</p>
                                                    <NotificationBadge myChatDetails={myChatDetails} />
                                                </div>}
                                            </div>
                                        </div>
                                    </li>
                                );
                        }
                        else {
                            const { name, profilePicture, profileStatus } = item.chatusers.filter(x => x.userId !== user.id)[0]?.user;
                            const chatUpdatedTime = (item.messages[0] ? item.messages[0].createdAt : item.updatedAt);
                            const myChatDetails = item.chatusers.filter(x => x.userId === user.id)[0];
                            if (name.toLowerCase().includes(props.searchUser.toLowerCase()) || props.searchUser === "")
                                return (
                                    <li className={`contacts-item ${(item.id === activeChat?.id) ? 'active' : ''} ${myChatDetails?.routineUnreadMessageCount + myChatDetails?.emergencyUnreadMessageCount + myChatDetails?.urgentUnreadMessageCount > 0 ? 'unread' : ''}`.trim()} key={item.id}>
                                        <div className="contacts-link" onClick={() => setUserHandler(item, activeChat.id, user.id, dispatch)}>
                                            <div className={`avatar ${getProfileStatus(profileStatus)}`}><img src={profilePicture ? profilePicture : DEFAULT_IMAGE} alt="" /></div>
                                            <div className="contacts-content">
                                                <div className="contacts-info">
                                                    <h6 className="chat-name text-truncate username-text">{name}</h6>
                                                    <div className="chat-time">{getTimeLabel(chatUpdatedTime)}</div>
                                                </div>
                                                {!item.messages[0]?.isDeleted && <>{!item.messages[0]?.mediaType ? <div className="contacts-texts">
                                                    {item.messages[0]?.subject ? <>
                                                        <div className="flex-60">
                                                            <p className="text-truncate">{`Subject: ${item.messages[0]?.subject}`}</p>
                                                            <p className="text-truncate">{`${item.messages[0]?.isMessage ? 'Message:' : 'Task:'} ${item.messages[0]?.message ? item.messages[0]?.message : 'Start Conversation'}`}</p>
                                                        </div>
                                                        <div><NotificationBadge myChatDetails={myChatDetails} /></div>
                                                    </>
                                                        : <><p className="text-truncate">
                                                            {item.messages[0]?.message ? `${item.messages[0]?.isMessage ? 'Message:' : 'Task:'} ${item.messages[0]?.message}` : 'Start Conversation'}
                                                        </p><NotificationBadge myChatDetails={myChatDetails} />
                                                        </>}
                                                </div>
                                                    : <div className="contacts-texts">
                                                        {getMediaSVG(item.messages[0]?.mediaType.split("/")[0])}
                                                        <p className="text-truncate svg-text mb-0">{item.messages[0]?.fileName}</p>
                                                        <NotificationBadge myChatDetails={myChatDetails} />
                                                    </div>}</>}
                                                {item.messages[0]?.isDeleted && <div className="contacts-texts">
                                                    <p className="text-truncate">{`This message was deleted`}</p>
                                                    <NotificationBadge myChatDetails={myChatDetails} />
                                                </div>}
                                            </div>
                                        </div>
                                    </li>
                                );
                        }
                    }
                    return null;
                })}
                {!!chatListData?.messages?.length &&
                    <div className="divider">
                        <span className="text-white-70">MESSAGES</span>
                    </div>}
                {chatListData?.messages?.map((item) => {
                    // const searchString = props.searchGlobal;
                    // console.log("result", item.message.includes(searchString))
                    if (item.chatDetails.type === GROUP) {
                        const { name } = item.chatDetails;
                        return (
                            <li className={`contacts-item`} key={item.id + '-m'}>
                                <div className="contacts-link p-1" onClick={() => { onClickMessage(item) }}>
                                    <div className="contacts-content">
                                        <div className="contacts-info">
                                            <h6 className="chat-name text-truncate username-text fs-13">{name}</h6>
                                            <small className="chat-time message mb-0 fs-12">{moment(item.createdAt).format("MM/DD/YY hh:mm A")}</small>
                                        </div>
                                        <div className="contacts-texts text-truncate">
                                            <span className="fs-13">{`${item?.sendByDetail?.name}: `}</span>
                                        </div>
                                        <div className="contacts-texts justify-content-start">
                                            {!!item.mentionusers.length &&
                                                <span className="fs-13 mr-1 text-highlight-blue text-truncate">
                                                    {item.mentionusers?.filter(item => item.type === "cc").map(item => `@${item.user.name} `)}
                                                </span>}
                                        </div>
                                        <div className="contacts-texts justify-content-start">
                                            <span className="fs-13 text-truncate">{`${item?.message}`}</span>
                                        </div>
                                    </div>
                                </div>
                            </li>);
                    }
                    else {
                        const { name } = item.chatDetails.chatusers.filter(x => x.userId !== user.id)[0]?.user;
                        return (
                            <li className={`contacts-item`} key={item.id + '-m'}>
                                <div className="contacts-link p-1" onClick={() => { onClickMessage(item) }}>
                                    <div className="contacts-content">
                                        <div className="contacts-info">
                                            <h6 className="chat-name text-truncate username-text fs-13">{name}</h6>
                                            <small className="chat-time message mb-0 fs-12">{moment(item.createdAt).format("MM/DD/YY hh:mm A")}</small>
                                        </div>
                                        <div className="contacts-texts justify-content-start">
                                            {!!item.mentionusers.length &&
                                                <span className="fs-13 mr-1 text-highlight-blue text-truncate">
                                                    {item.mentionusers?.filter(item => item.type === "cc").map(item => `@${item.user.name} `)}
                                                </span>}
                                        </div>
                                        <div className="contacts-texts justify-content-start">
                                            <span className="fs-13 text-truncate">{`${item?.message}`}</span>
                                        </div>
                                    </div>
                                </div>
                            </li>)
                    }
                })}
            </ul>);
    }
}

export const setUserHandler = (item, activeChatId, userId, dispatch) => {
    if (item.id !== activeChatId) {
        const { name, profilePicture, image } = (item.type === GROUP) ? item : item.chatusers.filter(x => x.userId !== userId)[0].user;
        const obj = {
            ...item, name, image: profilePicture ? profilePicture : image
        };
        dispatch(setActiveChat(obj));
    }
};

export const getMediaSVG = (type) => {
    switch (type) {
        case IMAGE: return <ImageIconSVG />;
        case VIDEO: return <VideoIconSVG />;
        case AUDIO: return <AudioIconSVG />;
        default: return <DocumentIconSVG />;
    }
}

export const getTimeLabel = (DateTime) => {
    if (momentTimzone(new Date()).format("MM/DD/YY") === momentTimzone(DateTime).format("MM/DD/YY"))
        return `${(momentTimzone(DateTime).format("hh:mm A"))}`;
    else return momentTimzone(DateTime).format("MM/DD/YY");
}

