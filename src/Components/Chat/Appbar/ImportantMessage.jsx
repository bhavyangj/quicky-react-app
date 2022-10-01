import React from 'react'
import { useSelector } from 'react-redux';
import { changeTask } from '../../../redux/actions/modelAction';
import { IMPORTANT_ITEM } from '../Models/models';
import { APPLICATION, AUDIO, GET_IMPORTANT_MESSAGE_SUCCESS, GET_MESSAGES_SUCCESS, IMAGE, SET_COUNT, SET_OFFSET, TEXT, VIDEO } from '../../../redux/constants/chatConstants';
import { getMessages, messageRef, pageScroll, ScrolltoOrigin, setNewLimitInChat, tempLimit } from '../Main/UserChat/message/ChatMessages';
import { ReqforLength } from '../../../utils/wssConnection/wssConnection';
import { MessageContent } from '../Main/UserChat/message/MessageContent';
import { ImageVideoContent } from '../Main/UserChat/message/ImageVideoContent';
import { AudioContent } from '../Main/UserChat/message/AudioContent';
import { FileContent } from '../Main/UserChat/message/FileContent';
let isLoading = false;

export const ImportantMessage = ({ taskName, dispatch }) => {
    const { importantMessageList, messages, activeChat, offset, totalCount } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.user);

    const onCloseHandler = () => {
        dispatch(changeTask(""));
        if (importantMessageList.rows.length > 0) dispatch({ type: GET_IMPORTANT_MESSAGE_SUCCESS, payload: [] });
    }

    const onClickTaskHandler = (task) => {
        if (messageRef[task.id] !== undefined) {
            dispatch(changeTask(""));
            pageScroll(messageRef[task.id], { behavior: "smooth" });
            const classes = messageRef[task.id].current.className;
            messageRef[task.id].current.classList += " blink-quote-message ";
            setTimeout(() => messageRef[task.id].current.classList = classes, 2000);
        } else {
            const currMsgId = messages.data.rows.reverse()[0].id;
            ReqforLength(activeChat.id, task.id, currMsgId);
            setTimeout(async () => {
                if (tempLimit !== 0) {
                    await ReqforQuotedMessage()
                        .then(async (data) => {
                            dispatch(changeTask(""));
                            if (data.status === 1)
                                ScrolltoOrigin({ id: task.id });
                        });
                    setNewLimitInChat(0);
                }
            }, 700);
        }
    }
    const ReqforQuotedMessage = async () => {
        const res = (!isLoading) ? await getMessages(activeChat, "", "", offset + 10, tempLimit) : { status: -1 };
        if (res.status === 1) {
            dispatch({ type: SET_OFFSET, payload: offset + tempLimit });
            if (res.data.count !== totalCount) dispatch({ type: SET_COUNT, payload: res.data.count });
            dispatch({ type: GET_MESSAGES_SUCCESS, payload: { data: { count: res.data.count, rows: [...messages.data.rows.concat(...res.data.rows)] } } });
            return res;
        }
    }

    return (<div className={`tab-pane h-100 ${taskName === IMPORTANT_ITEM ? 'active' : ''}`} id="important-message" role="tabpanel" aria-labelledby="important-message-tab">
        <div className="appnavbar-content-wrapper">
            <div className="appnavbar-scrollable-wrapper">
                <div className="appnavbar-heading sticky-top">
                    <ul className="nav justify-content-between align-items-center">
                        <li className="text-center">
                            <h5 className="text-truncate mb-0">Important Message</h5>
                        </li>
                        <li className="nav-item list-inline-item close-btn" onClick={() => onCloseHandler()}>
                            <div data-appcontent-close="">
                                <svg className="hw-22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="appnavbar-body">
                    <div className="note-container">
                        {importantMessageList?.rows.map(({ message: item }, index) => {
                            return (
                                <div key={item.id} data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded={true} aria-controls="collapseExample"
                                    style={{ backgroundColor: '#323333' }}>
                                    <div className={`message mb-0 pt-2 ${item.sendBy === user.id ? 'self self-thread-m1' : 'thread-m1'}`} key={item.id}>
                                        <div className="message-wrapper">
                                            {!item.mediaType &&
                                                <MessageContent
                                                    DisableOpt={true}
                                                    item={item}
                                                    user={user}
                                                    dispatch={dispatch}
                                                    moveToOrigin={onClickTaskHandler}
                                                    activeChat={activeChat} />}
                                            {(item.mediaType && (item.mediaType.startsWith(IMAGE) || item.mediaType.startsWith(VIDEO))) &&
                                                <ImageVideoContent
                                                    DisableOpt={true}
                                                    item={item}
                                                    moveToOrigin={onClickTaskHandler}
                                                    user={user}
                                                    dispatch={dispatch} />}
                                            {(item.mediaType && (item.mediaType.startsWith(APPLICATION) || item.mediaType.startsWith(TEXT))) &&
                                                <FileContent
                                                    DisableOpt={true}
                                                    item={item}
                                                    moveToOrigin={onClickTaskHandler}
                                                    user={user}
                                                    dispatch={dispatch} />}
                                            {item.mediaType && item.mediaType.startsWith(AUDIO) &&
                                                <AudioContent
                                                    DisableOpt={true}
                                                    item={item}
                                                    moveToOrigin={onClickTaskHandler}
                                                    user={user}
                                                    dispatch={dispatch} />}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    </div>);
}