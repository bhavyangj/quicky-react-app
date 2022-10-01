import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from '../../../../../utils/axios';
import { GET_MESSAGES_SUCCESS, SET_COUNT, SET_OFFSET } from "../../../../../redux/constants/chatConstants";
import { readAllMessages, ReqforLength } from "../../../../../utils/wssConnection/wssConnection";
import { Message } from './Message'
import InfiniteScroll from "react-infinite-scroll-component";
import TaskDetails from "../../../../Tasks/TaskDetails/TaskDetails";
import { RES_GET_TASK_DETAILS } from "../../../../../redux/constants/taskConstants";
import { ReactComponent as ChevronDownSvg } from '../../../../../assets/media/heroicons/outline/chevron-down.svg';

export let isLoading = false;
export let isNewMsgReceived = false;
export let messageRef = [];
export let tempLimit = 0;
let isUnreadAvailable = false;
let isRendered = false;

export const ChatMessages = (props) => {
    const dispatch = useDispatch();
    const ContainerRef = useRef(null);
    const { user } = useSelector((state) => state.user);
    const { activeChat, offset, totalCount, cId, lId } = useSelector((state) => state.chat);
    const messagesEndRef = useRef();
    const unreadMessageRef = useRef();
    const chatContentRef = useRef();
    const innerRef = useRef();
    const [disabled, setDisabled] = useState(false);
    const [chatBodyHeight, setChatBodyHeight] = useState(0);
    const userIndex = activeChat.chatusers.findIndex(item => item.userId === user.id);
    const { taskDetails } = useSelector((state) => state.task);
    const { isAdmin } = activeChat.chatusers[userIndex];
    //eslint-disable-next-line
    const [hideScrollBtn, setHideBtn] = useState(false);

    useLayoutEffect(() => {
        window.addEventListener("resize", () => setChatBodyHeight(chatContentRef.current?.clientHeight));
        setChatBodyHeight(chatContentRef.current?.clientHeight);
    }, [props.messageStatus, props.quoteMessage]);

    useLayoutEffect(() => {
        if (props.messagesList.length === totalCount)
            setDisabled(true);
        else if (props.messagesList.length < totalCount && disabled)
            setDisabled(false);
        //eslint-disable-next-line
    }, [props.messagesList, totalCount]);

    const fetch = async (offset, prevMsgList) => {
        const unread = activeChat.chatusers.filter((item) => item.userId === user.id)[0];
        const unreadCount = unread.emergencyUnreadMessageCount + unread.routineUnreadMessageCount + unread.urgentUnreadMessageCount;
        if (unreadCount > 10) {
            const res = (!isLoading) ? await getMessages(activeChat, "", "", offset, unreadCount) : { status: -1 };
            if (res.status === 1) {
                dispatch({ type: SET_OFFSET, payload: unreadCount - 10 });
                if (res.data.count !== totalCount)
                    dispatch({ type: SET_COUNT, payload: res.data.count });
                setTimeout(() => {
                    dispatch({ type: GET_MESSAGES_SUCCESS, payload: { data: { count: res.data.count, rows: [...prevMsgList.concat(...res.data.rows)] } } });
                }, 10);
            }
        } else {
            const res =
                (props.isSearchOpen.isOpen) ? await getMessages(activeChat, props.isSearchOpen?.search, props.isSearchOpen?.type, offset)
                    : (!isLoading) ? await getMessages(activeChat, "", "", offset)
                        : { status: -1 };
            if (res?.status === 1) {
                dispatch({ type: SET_OFFSET, payload: offset });
                if (res.data.count !== totalCount)
                    dispatch({ type: SET_COUNT, payload: res.data.count });
                setTimeout(() => {
                    dispatch({ type: GET_MESSAGES_SUCCESS, payload: { data: { count: res.data.count, rows: [...prevMsgList.concat(...res.data.rows)] } } });
                }, 1000);
            }
        }
    }

    useLayoutEffect(() => {
        const setNewData = async () => {
            isUnreadAvailable = false;
            isRendered = false;
            dispatch({ type: SET_OFFSET, payload: 0 });
            messageRef = [];
            dispatch({ type: GET_MESSAGES_SUCCESS, payload: { data: { count: 0, rows: [] } } });
            await fetch(0, []);
            dispatch(readAllMessages(activeChat.id, user.id));
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
        setNewData();
        // eslint-disable-next-line
    }, [activeChat.id, dispatch]);

    // SCROLL TO END OR UNREAD MESSAGE
    useEffect(() => {
        if (isUnreadAvailable === true && isRendered === false) {
            unreadMessageRef?.current?.scrollIntoView();
            isRendered = true;
            isUnreadAvailable = false;
        } else if (isNewMsgReceived) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            isNewMsgReceived = false;
        }
        //eslint-disable-next-line
    }, [props.messagesList]);

    useEffect(() => {
        const getData = async () => {
            if (props.isSearchOpen.isOpen) {
                dispatch({ type: SET_OFFSET, payload: 0 });
                messageRef = [];
                await fetch(0, []);
            }
        }
        getData();
        // eslint-disable-next-line
    }, [props.isSearchOpen]);

    const checkIsUnread = (prevMsg, Msg) => {
        if (Msg !== undefined)
            if (Msg.messagerecipient && Msg.messagerecipient !== null)
                if (Msg.messagerecipient.isRead === false)
                    if (prevMsg === undefined) {
                        isUnreadAvailable = true;
                        return true;
                    }
                    else if (prevMsg.messagerecipient !== undefined)
                        if (prevMsg.messagerecipient === null || prevMsg.messagerecipient.isRead === true) {
                            isUnreadAvailable = true;
                            return true;
                        }
        return false;
    }

    const ReqforQuotedMessage = async () => {
        const res =
            (props.isSearchOpen.isOpen) ? await getMessages(activeChat, props.isSearchOpen?.search, props.isSearchOpen?.type, offset + 10, tempLimit)
                : (!isLoading) ? await getMessages(activeChat, "", "", offset + 10, tempLimit)
                    : { status: -1 };
        if (res.status === 1) {
            dispatch({ type: SET_OFFSET, payload: offset + tempLimit });
            if (res.data.count !== totalCount)
                dispatch({ type: SET_COUNT, payload: res.data.count });
            dispatch({ type: GET_MESSAGES_SUCCESS, payload: { data: { count: res.data.count, rows: [...props.messagesList.concat(...res.data.rows)] } } });
            return res;
        }
    }

    const onCloseTaskDeatails = (activeTaskChatId) => {
        dispatch({ type: RES_GET_TASK_DETAILS, payload: null });
    }

    const OnClickScrollDown = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    // const onScroll = () => {
    //     console.log(innerRef.current?.scrollHeight);
    //     if (innerRef.current?.scrollHeight - chatBodyHeight > 500)
    //         setHideBtn(false);
    //     else
    //         setHideBtn(true);
    // }

    const moveToOrigin = async (qMessage, messageId) => {
        if (messageRef[qMessage.id] !== undefined) {
            pageScroll(messageRef[qMessage.id], { behavior: "smooth" });
            const classes = messageRef[qMessage.id].current.className;
            messageRef[qMessage.id].current.classList += " blink-quote-message ";
            setTimeout(() => {
                if (messageRef[qMessage.id])
                    messageRef[qMessage.id].current.classList = classes;
            }, 2000);
        } else {
            ReqforLength(activeChat.id, qMessage.id, messageId);
            setTimeout(async () => {
                if (tempLimit !== 0) {
                    await ReqforQuotedMessage()
                        .then(async (data) => {
                            if (data?.status === 1)
                                ScrolltoOrigin(qMessage);
                        });
                    setNewLimitInChat(0);
                }
            }, 700);
        }
    }

    useEffect(() => {
        if (cId && lId && cId !== undefined) {
            // console.log("moving...");
            moveToOrigin({ id: cId }, lId);
        }
        //eslint-disable-next-line
    }, [cId]);


    return (
        <div className={`chat-content px-md-2 bg-${user.chatWallpaper}`} id="messageBody" ref={chatContentRef} onClick={() => { if (props.messageStatus) props.setMessageStatus(false) }}>
            <div className="container" ref={ContainerRef}>
                <div
                    id="scrollableDiv"
                    style={{
                        height: chatBodyHeight,
                        overflow: "auto",
                        display: "flex",
                        flexDirection: "column-reverse"
                    }}
                    ref={innerRef}
                >
                    <div className="message-day"
                        id="messageDay">
                        <InfiniteScroll
                            dataLength={props.messagesList.length}
                            next={() => fetch(offset + 10, props.messagesList)}
                            style={{ display: "flex", flexDirection: "column-reverse" }}
                            inverse={true}
                            hasMore={true && !disabled}
                            loader={<img src={'./svg/messageLoader.svg'} style={{ height: '80px' }} alt="" />}
                            scrollableTarget="scrollableDiv"
                        >
                            {props.messagesList.map((item, index) => {
                                return (
                                    <Message
                                        key={index}
                                        item={item}
                                        user={user}
                                        disabled={disabled}
                                        pTime={props.messagesList[index + 1]?.createdAt}
                                        isUnread={checkIsUnread(props.messagesList[index + 1], props.messagesList[index])}
                                        prevMsg={props.messagesList[index + 1]}
                                        setQuote={props.setQuoteMessage}
                                        setEditMessage={props.setEditMessage}
                                        unreadMessageRef={unreadMessageRef}
                                        messageRef={messageRef}
                                        moveToOrigin={moveToOrigin}
                                        ReqforQuotedMessage={ReqforQuotedMessage}
                                        isAdmin={isAdmin}
                                    />
                                )
                            })}
                        </InfiniteScroll>
                        <div ref={messagesEndRef}></div>
                    </div>
                </div>
                {!hideScrollBtn &&
                    <button className="btn bg-dark border-0 scroll-bottom" onClick={OnClickScrollDown}>
                        <ChevronDownSvg height={18} className="text-white-70" />
                    </button>}
            </div>
            {taskDetails && (<>
                <div className="backdrop backdrop-visible task-bakdrop" />
                <TaskDetails onClose={() => onCloseTaskDeatails(activeChat.id)} task={taskDetails} />
            </>)}
        </div>);
}

export const getMessages = async (activeChat, search = "", type = "", offset = 0, limit = 10) => {
    try {
        isLoading = true;
        const config = {
            params: { limit, offset }
        };
        const body = { search, type, users: activeChat.users }
        const { data } = await axios.post(`/message/${activeChat.id}`, body, config);
        isLoading = false;
        return data;
    } catch (error) { }
}

export const pageScroll = (Ref, behavior = {}) => {
    Ref?.current?.scrollIntoView(behavior);
};
export const setIsReceived = () => {
    isNewMsgReceived = true;
}
export const setNewLimitInChat = (limit) => {
    tempLimit = limit;
}

export const ScrolltoOrigin = (qMessage) => {
    if (messageRef[qMessage.id] !== undefined) {
        pageScroll(messageRef[qMessage.id], { behavior: "smooth" });
        const classes = messageRef[qMessage.id].current.className;
        messageRef[qMessage.id].current.classList += " blink-quote-message ";
        setTimeout(() => {
            messageRef[qMessage.id].current.classList = classes;
        }, 3000);
    } else {
        setTimeout(() => {
            ScrolltoOrigin(qMessage);
        }, 100);
    }
}