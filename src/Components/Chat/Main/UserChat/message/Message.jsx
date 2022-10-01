import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDateLabel } from '../UserChat';
import { changeModel } from "../../../../../redux/actions/modelAction";
import { IMAGE_GALLERY, PRIVATE } from "../../../Models/models";
import * as momentTimzone from 'moment-timezone';
import { APPLICATION, AUDIO, IMAGE, IMAGE_INDEX, TEXT, VIDEO } from "../../../../../redux/constants/chatConstants";
import { MessageContent } from "./MessageContent";
import { ImageVideoContent } from "./ImageVideoContent";
import { FileContent } from "./FileContent";
import { AudioContent } from "./AudioContent";
import { DeletedContent } from "./DeletedContent";
import { MessageOptions } from "./MessageOptions";

export const onImageGalleryOpen = (id, dispatch) => {
    dispatch(changeModel(IMAGE_GALLERY));
    dispatch({ type: IMAGE_INDEX, payload: id });
}

export const CheckNewDay = ({ item, pTime }) => {
    if (pTime && momentTimzone(item.createdAt).format("MM/DD/YY") !== momentTimzone(pTime).format("MM/DD/YY"))
        return <div className="message-divider sticky-top my-1" data-label={getDateLabel(momentTimzone(item.createdAt).format("MM/DD/YY"))}>&nbsp;</div>
    else if (!pTime) return <div className="message-divider sticky-top my-1" data-label={getDateLabel(momentTimzone(item.createdAt).format("MM/DD/YY"))}>&nbsp;</div>;
}

export const CheckUnread = ({ isUnread, unreadMessageRef }) => {
    if (isUnread)
        return (<div ref={unreadMessageRef}>
            <div className="unread-messages mb-1">
                <div className="text-white msg-box p-1 m-auto">
                    {`Unread Messages`}
                </div>
            </div>
        </div>);
}

export const Message = ({ item, prevMsg, user, disabled, pTime, isUnread, setQuote, unreadMessageRef, messageRef, ReqforQuotedMessage, moveToOrigin, setEditMessage, isAdmin, ViewTaskHandler, onCloseTaskDeatails }) => {
    const dispatch = useDispatch();
    const { activeChat } = useSelector((state) => state.chat);
    messageRef[item.id] = useRef();

    return (<>
        <div className={`message-container ${disabled ? 'disabled' : ''}`}>
            <CheckNewDay item={item} pTime={pTime} />
            <CheckUnread isUnread={isUnread} unreadMessageRef={unreadMessageRef} />
            <MessageOrigin
                item={item}
                user={user}
                dispatch={dispatch}
                prevMsg={prevMsg}
                setQuote={setQuote}
                messageRef={messageRef}
                pTime={pTime}
                activeChat={activeChat}
                moveToOrigin={moveToOrigin}
                setEditMessage={setEditMessage}
                isAdmin={isAdmin}
                ViewTaskHandler={ViewTaskHandler}
                onCloseTaskDeatails={onCloseTaskDeatails}
            />
        </div>
    </>);
}

export const MessageOrigin = ({ item, user, prevMsg, setQuote, messageRef, pTime, activeChat, setEditMessage, isAdmin, ViewTaskHandler, onCloseTaskDeatails, moveToOrigin, dispatch }) => {
    return (
        <div className={`message ${item.sendBy === user.id ? 'self' : ''}`.trim()} key={item.id} ref={messageRef[item.id]}>
            {activeChat.type !== PRIVATE &&
                <MessageOptions user={user} item={item} pTime={pTime} prevMsg={prevMsg} activeChat={activeChat} />}
            {/* Message Start */}
            <div className="message-wrapper">
                {
                    (item.isDeleted && item.isViewable === undefined) ?
                        <DeletedContent item={item} user={user} isAdmin={isAdmin} prevMsg={prevMsg} pTime={pTime} />
                        :
                        <>
                            {!item.mediaType &&
                                <MessageContent
                                    item={item}
                                    user={user}
                                    dispatch={dispatch}
                                    setQuote={setQuote}
                                    setEditMessage={setEditMessage}
                                    moveToOrigin={moveToOrigin}
                                    activeChat={activeChat}
                                    prevMsg={prevMsg}
                                    pTime={pTime} />}
                            {(item.mediaType && (item.mediaType.startsWith(IMAGE) || item.mediaType.startsWith(VIDEO))) &&
                                <ImageVideoContent
                                    item={item}
                                    user={user}
                                    prevMsg={prevMsg}
                                    pTime={pTime}
                                    dispatch={dispatch}
                                    setQuote={setQuote}
                                    setEditMessage={setEditMessage} />}
                            {(item.mediaType && (item.mediaType.startsWith(APPLICATION) || item.mediaType.startsWith(TEXT))) &&
                                <FileContent
                                    item={item}
                                    user={user}
                                    dispatch={dispatch}
                                    setQuote={setQuote}
                                    prevMsg={prevMsg}
                                    pTime={pTime}
                                    setEditMessage={setEditMessage} />}
                            {(item.mediaType && item.mediaType.startsWith(AUDIO)) &&
                                <AudioContent
                                    item={item}
                                    user={user}
                                    dispatch={dispatch}
                                    setQuote={setQuote}
                                    prevMsg={prevMsg}
                                    pTime={pTime}
                                    setEditMessage={setEditMessage} />}
                        </>
                }
            </div>
            {/* <!-- Message End --> */}
        </div>
    )
}