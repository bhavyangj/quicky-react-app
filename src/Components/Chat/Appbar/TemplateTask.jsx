import React, { useState } from 'react'
import { useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import { useDetectClickOutside } from 'react-detect-click-outside';
import { useSelector } from 'react-redux';
import { changeTask } from '../../../redux/actions/modelAction';
import { getTemplateTasks, sendTemplateMessage } from '../../../utils/wssConnection/wssConnection';
import useDebounce from '../../hooks/useDebounce';
import { EMERGENCY, ROUTINE, URGENT } from '../Main/UserChat/footer/ChatFooter';
import { compareName } from '../Main/UserChat/info/group-chat-info/GroupChatInfo';
import { getBackgroundColorClass } from '../Main/UserChat/UserChat';
import { GROUP, TEMPLATE_TASKS } from '../Models/models';
import { ReactComponent as CheckSvg } from "../../../assets/media/heroicons/outline/check.svg";

export const TemplateTask = ({ taskName, dispatch }) => {
    const { user } = useSelector((state) => state.user);
    const { activeChat } = useSelector((state) => state.chat);
    const { templateTaskList, taskLabels } = useSelector((state) => state.task);
    const [filters, setFilters] = useState({
        type: null,
        search: ""
    });
    const [taskDueDate, setTaskDueDate] = useState();
    const dropdownTaskRef = useDetectClickOutside({ onTriggered: () => setShowMembers(false) });
    const [showMembers, setShowMembers] = useState(false);
    const [assignMembers, setAssignMem] = useState([]);
    const newFilter = useDebounce(filters, 500);

    useEffect(() => {
        if (taskName === TEMPLATE_TASKS)
            getTemplateTasks(newFilter);
    }, [newFilter, taskName]);

    const onCloseHandler = () => {
        dispatch(changeTask(""));
    }
    const getSendToUsers = () => {
        let array = activeChat.chatusers;
        if (activeChat.type === GROUP) {
            return array.filter(x => x.userId !== user.id).map((item) => item.userId);
        }
        return (array.filter(x => x.userId !== user.id)[0].userId);
    }
    const sendTaskToChat = (task) => {
        if (!assignMembers.length)
            return;
        const msgObject = {
            chatType: activeChat.type,
            chatId: activeChat.id,
            sendTo: getSendToUsers(),
            sendBy: user.id,
            templateId: task.id,
            isMessage: false,
            patient: task.patient,
            subject: task.subject,
            message: task.title,
            type: task.type,
            mediaType: null,
            mediaUrl: null,
            quotedMessageId: null,
            fileName: null,
            ccText: null,
            ccMentions: null,
            bccText: null,
            bccMentions: null,
            dueDate: taskDueDate,
            assignedUsers: assignMembers?.map((mem) => mem.user.id),
        }
        sendTemplateMessage(msgObject);
        onCloseHandler();
    }
    const addMemberHandler = (member) => {
        if (assignMembers.some((mem) => mem.user.id === member.user.id)) {
            setAssignMem((prev) => (prev.filter((mem) => mem.user.id !== member.user.id)));
        } else {
            setAssignMem((prev) => ([member, ...prev]));
        }
    };
    return (<div className={`tab-pane h-100 ${taskName === TEMPLATE_TASKS ? 'active' : ''}`} id="template-task" role="tabpanel" aria-labelledby="template-task-tab">
        <div className="appnavbar-content-wrapper">
            <div className="appnavbar-scrollable-wrapper">
                <div className="appnavbar-heading sticky-top">
                    <ul className="nav justify-content-between align-items-center">
                        <li className="text-center">
                            <h5 className="text-truncate mb-0">Template Tasks</h5>
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
                <div className="appnavbar-body-title flex-grow-0">
                    <div className="dropdown mr-2">
                        <button className="btn btn-outline-default dropdown-toggle text-capitalize p-4_8" id="TodoDropdown" data-bs-toggle="dropdown" type="button">
                            {filters.type ? filters.type : 'All Tasks'}
                        </button>
                        <ul className="dropdown-menu m-0" aria-labelledby="TodoDropdown">
                            <li className="dropdown-item" onClick={() => setFilters((prev) => ({ ...prev, type: null }))}>All Tasks</li>
                            <li className="dropdown-item" onClick={() => setFilters((prev) => ({ ...prev, type: ROUTINE }))}>Routine</li>
                            <li className="dropdown-item" onClick={() => setFilters((prev) => ({ ...prev, type: EMERGENCY }))}>Emergency</li>
                            <li className="dropdown-item" onClick={() => setFilters((prev) => ({ ...prev, type: URGENT }))}>Urgent</li>
                        </ul>
                    </div>
                    <form className="form-inline">
                        <div className="input-group">
                            <input type="text" className="form-control search transparent-bg p-4_8" placeholder="Search Task" onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))} />
                        </div>
                    </form>
                </div>
                <div className="appnavbar-body-title d-flex flex-grow-0">
                    <div className="text-left">
                        <div className="dropdown show chat-member-dropdown position-relative" ref={dropdownTaskRef}>
                            <button className="dropdown-toggle btn btn-sm bg-dark-f text-white-70 p-4_8"
                                title={`${!!assignMembers.length ? `Assigned to: ${assignMembers.map((item) => item.user.name).join(", ")}` : 'Click to assign members'}`}
                                onClick={() => setShowMembers(!showMembers)}>
                                <span className="fs-13">{`Members (${assignMembers?.length})`}</span>

                            </button>
                            {showMembers && <ul className="dropdown-menu text-light show cstm-mention-menu">
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
                    <div className="ml-1 w-100 position-relative cstm-datepicker">
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
                </div>
                <div className="appnavbar-body">
                    <div className="note-container">
                        {
                            templateTaskList?.map((item) => {
                                return (<div className="note" key={item.id}>
                                    <div className="note-body">
                                        {/* <div className="note-added-on">-</div> */}
                                        <h5 className="note-title m-0">{item.subject}</h5>
                                        <p className="note-description">{item.title}</p>
                                    </div>
                                    <div className="note-footer p-1 d-flex">
                                        <div className="note-tools badge text-capitalize text-white flex-60 flex-wrap">
                                            {item.label.map((label) => {
                                                const labelObj = taskLabels?.filter((item) => item.id === Number(label)).shift();
                                                if (labelObj)
                                                    return (<span className={`badge text-white mr-1 mb-1 p-1 bg-${labelObj.color}`} key={labelObj.id}>
                                                        {labelObj.name}
                                                    </span>)
                                                return null;
                                            })}
                                        </div>
                                        <div>
                                            <button className={`btn p-4_8 line-height-1 ${getBackgroundColorClass(item.type)} text-white`} onClick={() => sendTaskToChat(item)}>Send</button>
                                        </div>
                                    </div>
                                </div>)
                            })}
                    </div>
                </div>
            </div>
        </div>
    </div>);
}
