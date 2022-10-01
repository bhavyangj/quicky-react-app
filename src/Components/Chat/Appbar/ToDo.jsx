import * as momentTimzone from 'moment-timezone';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getTaskList } from '../../../redux/actions/chatAction';
import { changeTask } from '../../../redux/actions/modelAction';
import { getTaskDetails } from '../../../redux/actions/taskAction';
import { GET_MESSAGES_SUCCESS, GET_TASKS_SUCCESS, SET_COUNT, SET_OFFSET } from '../../../redux/constants/chatConstants';
import { RES_GET_TASK_DETAILS } from '../../../redux/constants/taskConstants';
import { ReqforLength } from '../../../utils/wssConnection/wssConnection';
import TaskDetails from '../../Tasks/TaskDetails/TaskDetails';
import { EMERGENCY, ROUTINE, URGENT } from '../Main/UserChat/footer/ChatFooter';
import { getMessages, isLoading, messageRef, pageScroll, ScrolltoOrigin, setNewLimitInChat, tempLimit } from '../Main/UserChat/message/ChatMessages';
import { TODO } from '../Models/models';

export const ToDo = ({ taskName, dispatch }) => {
    // const navigateTo = useNavigate();
    const { taskList, activeChat, messages, offset, totalCount, chatList } = useSelector((state) => state.chat);
    const { taskDetails } = useSelector((state) => state.task);

    const [taskType, setTaskType] = useState("All Tasks");
    const getTypeClass = (type) => {
        switch (type) {
            case EMERGENCY: return "task-type-danger"
            case URGENT: return "task-type-warning"
            case ROUTINE: return "task-type-routine"
            default: return "task-type-routine"
        }
    }
    const onFilterHandler = (taskType) => {
        setTaskType(taskType)
        dispatch(getTaskList(activeChat.id, taskType));
    }

    const getTask = async (task) => {
        dispatch(getTaskDetails(task.id, task.chatId, chatList));
    }

    const onCloseTaskDeatails = (activeTaskChatId) => {
        dispatch({ type: RES_GET_TASK_DETAILS, payload: null });
    }
    const onClickTaskHandler = (task) => {
        if (messageRef[task.messageId] !== undefined) {
            dispatch(changeTask(""));
            pageScroll(messageRef[task.messageId], { behavior: "smooth" });
            const classes = messageRef[task.messageId].current.className;
            messageRef[task.messageId].current.classList += " blink-quote-message ";
            setTimeout(() => messageRef[task.messageId].current.classList = classes, 2000);
        } else {
            const currMsgId = messages.data.rows.reverse()[0].id;
            ReqforLength(activeChat.id, task.messageId, currMsgId);
            setTimeout(async () => {
                if (tempLimit !== 0) {
                    await ReqforQuotedMessage()
                        .then(async (data) => {
                            dispatch(changeTask(""));
                            if (data.status === 1) ScrolltoOrigin({ id: task.messageId });
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
            if (res.data.count !== totalCount)
                dispatch({ type: SET_COUNT, payload: res.data.count });
            dispatch({ type: GET_MESSAGES_SUCCESS, payload: { data: { count: res.data.count, rows: [...messages.data.rows.concat(...res.data.rows)] } } });
            return res;
        }
    }
    const onCloseHandler = () => {
        dispatch(changeTask(""));
        if (taskList.data.length > 0) dispatch({ type: GET_TASKS_SUCCESS, payload: { data: [] } });
    }
    return (
        <div className={`tab-pane h-100 ${taskName === TODO ? 'active' : ''}`} id="todo" role="tabpanel" aria-labelledby="todo-tab">
            <div className="appnavbar-content-wrapper">
                <div className="appnavbar-scrollable-wrapper">
                    <div className="appnavbar-heading sticky-top">
                        <ul className="nav justify-content-between align-items-center">
                            <li className="text-center">
                                <h5 className="text-truncate mb-0">To-do List</h5>
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
                        <div className="appnavbar-body-title">
                            <div className="dropdown mr-2">
                                <button className="btn btn-outline-default dropdown-toggle text-capitalize" id="TodoDropdown" data-bs-toggle="dropdown" type="button">
                                    {taskType}
                                </button>
                                <ul className="dropdown-menu m-0" aria-labelledby="TodoDropdown">
                                    <li className="dropdown-item" onClick={() => onFilterHandler("All Tasks")}>All Tasks</li>
                                    <li className="dropdown-item" onClick={() => onFilterHandler("routine")}>Routine</li>
                                    <li className="dropdown-item" onClick={() => onFilterHandler("emergency")}>Emergency</li>
                                    <li className="dropdown-item" onClick={() => onFilterHandler("urgent")}>Urgent</li>
                                </ul>
                            </div>
                        </div>
                        <div className="todo-container">
                            {taskList.data?.map((item) => {
                                return (
                                    <div key={item.date}>
                                        <div className="todo-title pt-2">
                                            <h6 className="mb-0">{momentTimzone(item.date).format("MM/DD/YY")}</h6>
                                            <p className="text-muted">{item.tasks.length} Task remaining</p>
                                        </div>
                                        <div className="card">
                                            <div className="card-body">
                                                <ul className="todo-list">
                                                    {item?.tasks?.map((task) => {
                                                        return (<li className="todo-item todo-item-input" key={task.id}>
                                                            <div className={`task-type ${getTypeClass(task.type)} mr-2 cursor-pointer`} title="Go to Task" onClick={() => getTask(task)}>&nbsp;</div>
                                                            <div className="custom-control custom-checkbox ">
                                                                <input type="checkbox" className="custom-control-input" id={`customCheck-${task.id}`} />
                                                                <label className="custom-control-label" htmlFor={`customCheck-${task.id}`}>&nbsp;</label>
                                                            </div>
                                                            <h6 className="todo-title word-break" data-toggle="modal" data-target="#taskModal" onClick={() => onClickTaskHandler(task)}>{task.name}</h6>
                                                            <h6 className="todo-title px-2 text-muted" onClick={() => onClickTaskHandler(task)}>{momentTimzone(task.createdAt).format("hh:mm A")}</h6>
                                                        </li>)
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>)
                            })
                            }
                        </div>
                    </div>
                    {/* <div className="appnavbar-footer">
                        <div className="btn btn-primary btn-block" role="button" data-toggle="modal" data-target="#addTaskModal">Add new task</div>
                    </div> */}
                </div>
            </div>
            {taskDetails && (<>
                <div className="backdrop backdrop-visible task-bakdrop" />
                <TaskDetails onClose={() => onCloseTaskDeatails(activeChat.id)} task={taskDetails} />
            </>)}
        </div>);
}