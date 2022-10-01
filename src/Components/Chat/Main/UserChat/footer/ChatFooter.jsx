import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { EditedChatMessage, sendMessage } from "../../../../../utils/wssConnection/wssConnection";
import { AttachmentFile } from './AttachmentFile';
import { AudioFooter } from "./AudioFooter";
import { MessageSendButton } from './SendButton';
import { TaskSendButton } from "./TaskSendButton";
import { GROUP } from "../../../Models/models";
import { MentionsInput, Mention } from 'react-mentions';
import { CancelEditButton } from "./CancelEditButton";
import { EmojiArea } from "./EmojiArea";
import { menuStyle } from './css/defaultStyle';
import './css/mention-style.css';
import { QuoteMessage } from "./QuoteMessage";
import { TypesButton } from "./TypesButton";
import ReactDatePicker from "react-datepicker";
import { useDetectClickOutside } from "react-detect-click-outside";
import { compareName } from "../info/group-chat-info/GroupChatInfo";
import { ReactComponent as CheckSvg } from "../../../../../assets/media/heroicons/outline/check.svg";

export const ChatFooter = (props) => {
    const { activeChat, messages, userDesignations } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.user);
    const [messageText, setMessageText] = useState({
        subject: null,
        patient: null,
        message: "",
        cc: null,
        ccMentions: [],
        bccMentions: [],
        bcc: null
    });
    const [messageType, setMessageType] = useState(ROUTINE);
    const [isRecording, setRecorder] = useState(false);
    const [usersData, setUsersData] = useState(false);
    const textRef = useRef(null);
    const inputRef = useRef(null);
    const ccRef = useRef(null);
    const [taskDueDate, setTaskDueDate] = useState();
    const [showMembers, setShowMembers] = useState(false);
    const dropdownTaskRef = useDetectClickOutside({ onTriggered: () => setShowMembers(false) });
    const [assignMembers, setAssignMem] = useState([]);

    useEffect(() => {
        setMessageText({
            subject: null,
            patient: null,
            message: "",
            cc: null,
            ccMentions: [],
            bccMentions: [],
            bcc: null
        });
        textRef?.current?.focus();
        const usersData = activeChat.chatusers
            .filter(item => item.userId !== user.id)
            .map((item) => ({ id: item.userId, display: `${item.user.name}` }));
        const designations = userDesignations?.map((item) => ({ id: 'd-' + item.id, display: `${item.name}` }))
        if (designations && !!designations.length)
            setUsersData([...usersData, ...designations]);
        else
            setUsersData(usersData);
    }, [activeChat.id, activeChat.chatusers, user.id, userDesignations]);
    useEffect(() => {
        if (props.editMessage) {
            inputRef?.current?.focus();
            setMessageType(props.editMessage.type);
            setMessageText((prev) => {
                return {
                    ...prev,
                    subject: props.editMessage.subject,
                    patient: props.editMessage.patient,
                    message: props.editMessage.message,
                    cc: props.editMessage.mentionusers?.filter(item => item.type === 'cc').map(item => `<@${item.userId}>(${item.user.name})`).join(''),
                    bcc: props.editMessage.bccText,
                }
            });
        } else {
            setMessageText({
                subject: null,
                patient: null,
                message: "",
                cc: null,
                ccMentions: [],
                bccMentions: [],
                bcc: null
            });
        }
    }, [props.editMessage]);
    const inputEvent = (e) => {
        const { name, value } = e.target;
        setMessageText((prev) => {
            return { ...prev, [name]: value }
        });
    };
    const onCloseQuoteHandler = () => props.setQuote();
    const getSendToUsers = () => {
        let array = activeChat.chatusers;
        if (activeChat.type === GROUP) {
            return array.filter(x => x.userId !== user.id).map((item) => item.userId);
        }
        return (array.filter(x => x.userId !== user.id)[0].userId);
    }
    const sendTaskHandler = (taskType, duedate = null) => {
        if (messageText && messageText.message.trim() !== "" && !!assignMembers.length) {
            const msgObject = {
                chatType: activeChat.type,
                chatId: activeChat.id,
                message: messageText.message,
                mediaType: null,
                mediaUrl: null,
                type: taskType,
                sendTo: getSendToUsers(),
                sendBy: user.id,
                quotedMessageId: props.quoteMessage ? props.quoteMessage.id : null,
                patient: messageText.patient,
                subject: messageText.subject,
                dueDate: duedate,
                fileName: null,
                isMessage: false,
                ccText: messageText.cc,
                ccMentions: messageText.ccMentions,
                bccText: messageText.bcc,
                bccMentions: messageText.bccMentions,
                assignedUsers: assignMembers.map((mem) => mem.user.id)
            }
            sendMessage(msgObject);
            setMessageText({
                subject: null,
                patient: null,
                message: "",
                cc: null,
                ccMentions: [],
                bccMentions: [],
                bcc: null
            });
            setAssignMem([]);
            inputRef?.current?.focus();
            if (props.quoteMessage) {
                props.setQuote();
            }
        }
    }
    const sendMessageHandler = (msgType, e = undefined) => {
        e?.preventDefault();
        if (messageText && messageText.message.trim() !== "") {
            const msgObject = {
                chatType: activeChat.type,
                chatId: activeChat.id,
                message: messageText.message,
                mediaType: null,
                mediaUrl: null,
                type: msgType,
                sendTo: getSendToUsers(),
                sendBy: user.id,
                quotedMessageId: props.quoteMessage ? props.quoteMessage.id : null,
                patient: messageText.patient,
                subject: messageText.subject,
                fileName: null,
                isMessage: true,
                ccText: messageText.cc,
                ccMentions: messageText.ccMentions,
                bccText: messageText.bcc,
                bccMentions: messageText.bccMentions,
            }
            sendMessage(msgObject);
            setMessageText({
                subject: null,
                patient: null,
                message: "",
                cc: null,
                ccMentions: [],
                bccMentions: [],
                bcc: null
            });
            setAssignMem([]);
            textRef?.current?.focus();
            if (props.quoteMessage) {
                props.setQuote();
            }
        }
    }
    const sendEditMessage = (messageType, e = undefined) => {
        e?.preventDefault();
        const index = messages.data.rows.findIndex(item => item.id === props.editMessage.id);
        const mentionusers = messages.data.rows[index]?.mentionusers;
        const ccMentionArr = messageText.ccMentions?.map(item => Number(item.id));
        const oldMentionUsersArr = mentionusers?.map(item => item.userId);
        EditedChatMessage(props.editMessage.chatId, props.editMessage.id, {
            ...messageText,
            ccMentionArr,
            oldMentionUsers: mentionusers,
            oldMentionUsersArr,
            newCCUsers: ccMentionArr?.filter((item => !oldMentionUsersArr.includes(item))),
            deletedCCUsers: oldMentionUsersArr?.filter((item => !ccMentionArr.includes(item))),
            type: messageType
        });
        props.setEditMessage();
        setMessageText({
            subject: null,
            patient: null,
            message: "",
            cc: null,
            ccMentions: [],
            bccMentions: [],
            bcc: null
        });
        textRef?.current?.focus();
    }
    useEffect(() => {
        if (props.quoteMessage) {
            setMessageText((prev) => {
                return {
                    ...prev,
                    subject: props.quoteMessage.subject,
                    patient: props.quoteMessage.patient,
                }
            });
        } else {
            setMessageText((prev) => {
                return {
                    ...prev,
                    subject: null,
                    patient: null,
                }
            });
        }
    }, [props.quoteMessage]);
    const ccChangehandler = (event, newValue, newPlainTextValue, mentions) => {
        // console.log("event", event);
        // console.log("newValue", newValue);
        // console.log("newPlainTextValue", newPlainTextValue);
        // console.log("mentions", mentions);
        let newMentionValue = newValue.split('<@');
        if (!!newMentionValue.length && !event.target.value.endsWith('@') && event.target.value !== '') {
            const element = newMentionValue.at(-1);
            const [eleId] = element.split('>');
            if (eleId.startsWith('d-')) {
                let tempnewValue = newValue;
                let newString = '';
                activeChat.chatusers.map((user) => {
                    if (user?.user?.designation) {
                        const temp = Number(eleId.split('-')[1]);
                        if (user?.user?.designation.includes(temp)) {
                            newString = newString + `<@${user?.user.id}>(${user?.user.name})`
                        }
                    }
                    return null;
                });
                const newUpdated = tempnewValue.replace(`<@${element}`, newString);
                newValue = newUpdated;
                // -------------- step 2  ---------------------
                let newArr = [];
                let elements = newUpdated.split('<@');
                let arr = elements.filter(e => e);
                arr.map((ele, ind) => {
                    if (ele && ele !== undefined) {
                        const [id, name] = ele.split('>');
                        const prevEle = newArr[ind - 1];
                        let result = name.lastIndexOf(")");
                        let newName = name.substring(0, result) + name.substring(result + 1);
                        newArr.push({
                            id: Number(id),
                            display: `@${newName.substring(1)} `,
                            childIndex: 0,
                            index: ind !== 0 ? (prevEle?.index + `<@${prevEle?.id}>(${prevEle?.display}) `.length) : 0,
                            plainTextIndex: ind !== 0 ? (prevEle?.plainTextIndex + prevEle?.display?.length) : 0,
                        })
                    }
                    return null;
                });
                // console.log("============> new Value will be ", newUpdated);
                // console.log("============> new Mentions will be ", newArr);
                mentions = newArr
            } else {
                // console.log("no, it won't change")
            }
        }
        setMessageText((prev) => {
            return {
                ...prev,
                cc: newValue,
                ccMentions: mentions,
            }
        });
        ccRef.current.selectionStart = ccRef.current.selectionStart + ccRef.current.size;
        // console.log(ccRef);
    }
    // const bccChangehandler = (event, newValue, newPlainTextValue, mentions) => {
    //     setMessageText((prev) => {
    //         return {
    //             ...prev,
    //             bcc: newValue,
    //             bccMentions: mentions
    //         }
    //     });
    // }
    const onCancelEdit = () => {
        props.setEditMessage();
    }
    const checkKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey)
            SubmitHandler();
    }
    const SubmitHandler = () => {
        if (!props.editMessage)
            sendMessageHandler(messageType)
        else sendEditMessage(messageType);
    }

    if (isRecording) {
        return <AudioFooter setRecorder={setRecorder} />;
    }

    const addMemberHandler = (member) => {
        if (assignMembers.some((mem) => mem.user.id === member.user.id)) {
            setAssignMem((prev) => (prev.filter((mem) => mem.user.id !== member.user.id)));
        } else {
            setAssignMem((prev) => ([member, ...prev]));
        }
    };

    return (
        <div onFocus={() => { if (!props.messageStatus) props.setMessageStatus(true) }}>
            {props.quoteMessage && !props.editMessage &&
                <QuoteMessage
                    quoteMessage={props.quoteMessage}
                    onCloseQuoteHandler={onCloseQuoteHandler}
                />}
            {props.messageStatus && <><div className="pre-chatfooter row m-0">
                <div className='form-control emojionearea-form-control w-50 d-flex align-items-center rounded-0'>
                    <span>Subject:</span>
                    <input
                        ref={textRef}
                        autoComplete="off"
                        type="text"
                        name='subject'
                        className='emojionearea-form-control inputField mx-1 flex-100'
                        value={messageText.subject === null ? "" : messageText.subject}
                        onChange={inputEvent}
                        placeholder="Enter Subject"
                    />
                </div>
                <div className='form-control emojionearea-form-control w-50 d-flex align-items-center rounded-0'>
                    <span>Patient:</span>
                    <input
                        type="text"
                        autoComplete="off"
                        name='patient'
                        className='emojionearea-form-control inputField mx-1 flex-100'
                        value={messageText.patient === null ? "" : messageText.patient}
                        onChange={inputEvent}
                        placeholder="Enter Patient"
                    />
                </div>
            </div>
                {
                    // activeChat.type === GROUP && 
                    <div className="pre-chatfooter row m-0">
                        <div className='form-control emojionearea-form-control w-50 d-flex align-items-center rounded-0 mentions-input' id="ccInput">
                            <span>CC:</span>
                            <MentionsInput
                                id="ccInput"
                                name="cc"
                                autoComplete="off"
                                placeholder="@"
                                type="text"
                                style={menuStyle}
                                value={messageText.cc === null ? "" : messageText.cc}
                                onChange={ccChangehandler}
                                className='emojionearea-form-control inputField mx-1 flex-100'
                                singleLine
                                inputRef={ccRef}
                            >
                                <Mention
                                    type="user"
                                    trigger="@"
                                    markup="<@__id__>(__display__)"
                                    data={usersData}
                                    style={{ color: "#8ab4f8" }}
                                    displayTransform={(id, display) => { return `@${display} ` }}
                                    className="mentions__mention"
                                />
                            </MentionsInput>
                        </div>
                        {!props.editMessage &&
                            <div className='form-control emojionearea-form-control w-50 d-flex align-items-center rounded-0 mentions-input justify-content-between'>
                                <div className="d-flex px-0 flex-nowrap">
                                    <div className="text-left">
                                        <div className="dropdown show chat-member-dropdown" ref={dropdownTaskRef}>
                                            <button className="dropdown-toggle btn btn-sm bg-dark-f text-white-70 p-4_8"
                                                title={`${!!assignMembers.length ? `Assigned to: ${assignMembers.map((item) => item.user.name).join(", ")}` : 'Click to assign members'}`}
                                                onClick={() => setShowMembers(!showMembers)}>
                                                <span className="fs-13">{`Members (${assignMembers?.length})`}</span>

                                            </button>
                                            {showMembers && <ul className="dropdown-menu text-light show">
                                                {activeChat?.chatusers.sort(compareName)
                                                    .map((member) => (
                                                        <li key={member.user.id} className={`dropdown-item cursor-pointer`} onClick={() => addMemberHandler(member)}>
                                                            {/* <div id={`member-${member.user.id}`} className={`chatbox-member-btn`}>
                                                                <img src={member.user.profilePicture ? member.user.profilePicture : DEFAULT_IMAGE} alt="m" />
                                                            </div> */}
                                                            <div className="d-flex justify-content-between w-100">
                                                                <span>{member.user.name}</span>
                                                                <span>
                                                                    {!!assignMembers.filter((mem) => mem.user.id === member.user.id).length ? (<CheckSvg className="hw-16" />) : ("")}
                                                                </span>
                                                            </div>
                                                        </li>
                                                    ))}
                                            </ul>}
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex px-1 flex-nowrap w-100">
                                    <ReactDatePicker
                                        id="dueDate"
                                        placeholderText="Due Date"
                                        className="form-control text-white bg-dark-f p-4_8"
                                        selected={taskDueDate ? new Date(taskDueDate) : null}
                                        value={taskDueDate ? new Date(taskDueDate) : null}
                                        onChange={(date) => setTaskDueDate(date)}
                                        isClearable={true}
                                        autoComplete='off'
                                        minDate={new Date()}
                                    />
                                </div>
                            </div>}
                    </div>}
            </>}
            <form className="chat-footer">
                {!props.editMessage ? <AttachmentFile setRecorder={setRecorder} /> :
                    <CancelEditButton onCancelEdit={onCancelEdit} />}
                {/* <input
                    type="text"
                    name="message"
                    autoComplete="off"
                    className="form-control emojionearea-form-control message-input"
                    id="messageInput"
                    placeholder="Type your message/task here..."
                    value={messageText.message}
                    onChange={inputEvent}
                    ref={inputRef}
                    autoFocus
                /> */}
                <textarea
                    name="message"
                    autoComplete="off"
                    className={`form-control emojionearea-form-control message-input ${props.editMessage ? 'edit-msg' : ''}`}
                    id="messageInput"
                    placeholder="Type your message/task here..."
                    value={messageText.message}
                    onChange={inputEvent}
                    onKeyPress={(e) => checkKey(e)}
                    ref={inputRef}
                    autoFocus
                />
                {/* {innerWidth > 767 && <EmojiArea setMessageText={setMessageText} />} */}
                {<EmojiArea setMessageText={setMessageText} isEditing={props.editMessage} />}
                {!props.editMessage && <>
                    <TypesButton messageType={messageType} setMessageType={setMessageType} isEditing={false} />
                    <TaskSendButton assignMembers={assignMembers} sendTaskHandler={sendTaskHandler} taskDueDate={taskDueDate} taskType={messageType} />
                    <MessageSendButton sendMessageHandler={sendMessageHandler} messageType={messageType} setMessageType={setMessageType} isEditing={false} />
                </>}
                {props.editMessage && <>
                    <TypesButton messageType={messageType} setMessageType={setMessageType} isEditing={true} />
                    <MessageSendButton sendMessageHandler={sendMessageHandler} messageType={messageType} setMessageType={setMessageType} sendEditMessage={sendEditMessage} isEditing={true} />
                </>}
            </form>
        </div>
    );
}
export const ROUTINE = "routine"
export const EMERGENCY = "emergency"
export const URGENT = "urgent"