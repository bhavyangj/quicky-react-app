import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import classes from "./TasksPage.module.css";
import { ListenNewAssign } from "../../utils/wssConnection/Listeners/Tasklistener";
import { getFilterTasksData, listenTaskActivities, reqDeleteTask, sendMessage } from "../../utils/wssConnection/wssConnection";
import { RES_GET_TASK_DETAILS } from "../../redux/constants/taskConstants";
import { GROUP, NEW_CHAT } from "../Chat/Models/models";
import TaskBoard from "./TaskBoard";
import TaskList from "./TaskList";
import { DEFAULT_IMAGE } from "../Layout/HomePage/HomePage";
import { changeModel } from "../../redux/actions/modelAction";
import TaskDetails from "./TaskDetails/TaskDetails";
import FilterTasks from "./FilterTasks";

export default function TaskPage() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { activeTaskChat, activeTaskList, taskCards, taskDetails, filterTaskData } = useSelector((state) => state.task);
    const { chatList } = useSelector((state) => state.chat);
    const [listView, setListView] = useState(false);
    const [isCreatorFilter, setCreatorFilter] = useState(false);
    const [filterObj, setFilterObj] = useState({
        chatId: (activeTaskChat && activeTaskChat.id !== 0) ? [activeTaskChat.id] : chatList.map((chat) => chat.id),
        search: "",
        status: filterTaskData.status,
        dateFrom: filterTaskData.dateFrom,
        dateTo: filterTaskData.dateTo,
        chatType: activeTaskChat?.type ? activeTaskChat.type : null
    });

    useEffect(() => {
        if (activeTaskChat && activeTaskChat.id !== 0) {
            dispatch(ListenNewAssign(filterObj, chatList, activeTaskChat.id));
        }
    }, [filterObj, activeTaskChat, dispatch, chatList])

    useEffect(() => {
        if (activeTaskChat && activeTaskChat.id !== 0) {
            getChatTaskList(activeTaskChat.id, chatList, filterObj);
            listenTaskActivities(activeTaskChat.id, dispatch);
        } else if (activeTaskChat && activeTaskChat.id === 0) {
            listenTaskActivities(0, dispatch);
        }
        //eslint-disable-next-line
    }, [activeTaskChat, dispatch]);

    useEffect(() => {
        setFilterObj(prev => ({
            ...prev,
            ...filterTaskData
        }))
    }, [filterTaskData]);

    const onCloseTaskDeatails = () => {
        getChatTaskList(activeTaskChat.id, chatList, filterObj);
        dispatch({ type: RES_GET_TASK_DETAILS, payload: null });
    }

    const getSendToUsers = () => {
        let array = activeTaskChat.chatusers;
        if (activeTaskChat.type === GROUP)
            return array.filter(x => x.userId !== user.id).map((item) => item.userId);
        return (array.filter(x => x.userId !== user.id)[0].userId);
    }

    const addNewTaskHandler = (data, cb) => {
        const msgObject = {
            chatType: activeTaskChat.type,
            chatId: activeTaskChat.id,
            message: data.name,
            mediaType: null,
            mediaUrl: null,
            type: data.type,
            sendTo: getSendToUsers(),
            sendBy: user.id,
            quotedMessageId: null,
            patient: data.patient,
            subject: data.subject,
            fileName: null,
            isMessage: false,
            ccText: null,
            ccMentions: [],
            bccText: null,
            bccMentions: [],
            dueDate: data.dueDate,
            assignedUsers: data.assignMembers
        }
        // console.log(msgObject);
        sendMessage(msgObject);
        cb();
    };

    const taskDeleteHandler = (chatId, id) => {
        reqDeleteTask(chatId, id);
    };

    if (chatList)
        return (<>
            {chatList.length > 0 ?
                <div className={`text-light w-100 ${classes["page-layout"]}`}>
                    <FilterTasks
                        filterObj={filterObj}
                        setFilterObj={setFilterObj}
                        listView={listView}
                        isCreatorFilter={isCreatorFilter}
                        setCreatorFilter={setCreatorFilter}
                        setListView={setListView} />
                    {!listView ?
                        <TaskBoard
                            activeTaskChat={activeTaskChat}
                            taskCards={taskCards}
                            activeTaskList={
                                isCreatorFilter ?
                                    activeTaskList.filter((task) => task.createdBy === user.id) :
                                    activeTaskList
                            }
                            addNewTaskHandler={addNewTaskHandler}
                            taskDeleteHandler={taskDeleteHandler}
                            user={user}
                        /> :
                        <TaskList
                            activeTaskChat={activeTaskChat}
                            taskCards={taskCards}
                            activeTaskList={
                                isCreatorFilter ?
                                    activeTaskList.filter((task) => task.createdBy === user.id) :
                                    activeTaskList
                            }
                            addNewTaskHandler={addNewTaskHandler}
                            taskDeleteHandler={taskDeleteHandler}
                            user={user}
                        />}
                </div>
                : <div className="chats">
                    <div className="d-flex flex-column justify-content-center text-center vh-100 w-100 m-auto">
                        <div className="container">
                            <div className="avatar avatar-lg mb-2">
                                <img className="avatar-img" src={user?.profilePicture ? user.profilePicture : DEFAULT_IMAGE} alt="" />
                            </div>
                            <h5 className='username-text'>Welcome, {user?.name}!</h5>
                            <p className="text-muted">Please create chat to Start creating task.</p>
                            <Link to="/chats">
                                <button className="btn btn-outline-primary no-box-shadow" onClick={() => { dispatch(changeModel(NEW_CHAT)) }}>
                                    Start a conversation
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>}
            {taskDetails && taskDetails.chatDetails && activeTaskChat && (<>
                <div className="backdrop backdrop-visible task-bakdrop" />
                <TaskDetails onClose={() => onCloseTaskDeatails(activeTaskChat.id)} task={taskDetails} />
            </>
            )}
        </>);
}

export const getChatTaskList = (activeTaskChatId, chatList, filterObj) => {
    getFilterTasksData({
        chatId: (activeTaskChatId === 0) ? chatList.map((chat) => chat.id) : [activeTaskChatId],
        search: filterObj.search,
        status: filterObj.status,
        dateFrom: filterObj.dateFrom,
        dateTo: filterObj.dateTo,
        chatType: filterObj.chatType
    });
}