import { PRIVATE } from "../../../Models/models"
import { getBackgroundColorClass } from "../UserChat"
import { MessageDropDown } from "./MessageDropDown"
import { ReactComponent as StarSvg } from '../../../../../assets/images/star.svg';
import { ReactComponent as EyeSvg } from '../../../../../assets/media/heroicons/solid/eye.svg';
import { ReactComponent as CheckSvg } from "../../../../../assets/media/heroicons/outline/check.svg";
import * as momentTimzone from 'moment-timezone';
import { QuotedMessage } from "./QuotedMessage";
import { getUserColor } from "../../../../../redux/common";
import { useDispatch } from "react-redux";
import { getTaskDetailsByMsgId } from "../../../../../redux/actions/taskAction";
import { useSelector } from "react-redux";

export const MessageContent = ({ item, user, dispatch, setQuote, setEditMessage, moveToOrigin, activeChat, prevMsg, pTime, DisableOpt = false }) => {
    return (<>
        <div className={`message-content position-relative ${!item?.isMessage ? 'task-msg-border' : ''} ${getBackgroundColorClass(item.type)}`}>
            {activeChat.type !== PRIVATE &&
                <MessageHeader user={user} item={item} prevMsg={prevMsg} pTime={pTime} forceView={DisableOpt} />}
            {!DisableOpt &&
                <MessageDropDown user={user} item={item} dispatch={dispatch} setQuote={setQuote} setEditMessage={setEditMessage} />}
            {(item.isDeleted) &&
                <p className='font-weight-normal deleted-message text-muted'>
                    {`This ${item.isMessage ? 'Message' : 'Task'} was Deleted`}
                </p>}
            {/* quote message start */}
            {!DisableOpt &&
                <QuotedMessage item={item} moveToOrigin={moveToOrigin} />}
            {/* quote message end */}
            {item.subject &&
                <div>
                    <span className='font-weight-medium message-subject'>{`Subject: ${item.subject}`}</span>
                </div>}
            {item.patient &&
                <div>
                    <span className='font-weight-medium message-patient'>{`Patient: ${item.patient}`}</span>
                </div>}
            {item.mentionusers && !!item.mentionusers.length &&
                <div className='font-weight-medium message-patient text-blue-highlight'>
                    <span className="mr-1">CC:</span>
                    <span className="text-highlight-blue">
                        {item.mentionusers.filter(item => item.type === "cc").map(item => `@${item.user.name} `)}
                    </span>
                </div>}
            <div>
                {(item.subject || item.patient) &&
                    <span>{`${item.isMessage ? 'Message: ' : 'Task: '}`}</span>}
                <span dangerouslySetInnerHTML={{ __html: linkify(item.message) }}></span>
            </div>
            <MessageFooter user={user} item={item} moveToOrigin={DisableOpt && moveToOrigin} />
        </div>
    </>)
}

export const MessageHeader = ({ user, item, prevMsg, pTime, forceView = false }) => {
    // item.sendBy !== user.id && 
    if ((prevMsg?.sendBy !== item.sendBy || forceView ||
        (Math.abs(new Date(pTime).getMinutes() - new Date(item.createdAt).getMinutes()) > 10) ||
        (pTime && momentTimzone(item.createdAt).format("MM/DD/YY") !== momentTimzone(pTime).format("MM/DD/YY")))) {
        return (
            <div className='message-header-user'>
                <span className={`text-capitalize text-truncate font-weight-bolder ${item.sendBy !== user.id ? getUserColor(item.sendBy) : 'text-highlight-blue'}`}>
                    {item.sendBy !== user.id ? item?.sendByDetail?.name : 'You'}
                </span>
            </div>
        )
    }
}

export const MessageFooter = ({ user, item, moveToOrigin = false }) => {
    const { chatList } = useSelector((state) => state.chat);
    let readAll = false;
    const dispatch = useDispatch();
    const getTask = async (item) => {
        dispatch(getTaskDetailsByMsgId(item.id, item.chatId, chatList));
    }

    if (item.recipents && item.sendBy === user.id) {
        let recipents = item.recipents;
        const readArr = recipents.map((item) => item.isRead);
        const isReadAll = readArr.some((isRead) => { return isRead === false });
        if (!isReadAll && !!recipents.length)
            readAll = true
    }

    return (
        <div className='message-footer d-flex align-items-center justify-content-end line-height-1'>
            <span className="message-date text-capitalize message-info">
                {!item.isDeleted && <>
                    {!item.isMessage &&
                        <span className="line-height-1 cursor-pointer" onClick={() => getTask(item)}>
                            <EyeSvg height={14} />
                        </span>}
                    {moveToOrigin &&
                        <span className="message-date text-capitalize mx-1" role="button" onClick={() => moveToOrigin(item)}>
                            <svg height={16} width={16} fill='currentColor'><path d="M7.375 14.375 3 10 7.375 5.625 8.438 6.688 5.875 9.25H14.5V7H16V10.75H5.875L8.438 13.312Z" /></svg>
                        </span>}
                    {item?.importantMessage &&
                        <span className="message-star-icon mx-1"><StarSvg /></span>}
                    {item?.isEdited &&
                        <span className="message-status fs-12 mr-1 font-italic text-white-70">Edited</span>}
                </>
                }
                {momentTimzone(item.createdAt).format("hh:mm A")}
                {item.sendBy === user.id && <>
                    {readAll ? <CheckSvg height={16} color="#34b7f1" /> : <CheckSvg height={16} />}</>}
            </span>
        </div>
    )
}

export const linkify = (inputText) => {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;
    //URLs starting with http://, https://, or ftp://
    //eslint-disable-next-line
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    //eslint-disable-next-line
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
    //Change email addresses to mailto:: links.
    //eslint-disable-next-line
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
    return replacedText;
}
