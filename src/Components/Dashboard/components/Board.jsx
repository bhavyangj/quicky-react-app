import React from 'react'
import { useSelector } from 'react-redux';
import classes from "../../Tasks/TasksPage.module.css";
import { ReactComponent as TaskStarted } from "../../../assets/media/heroicons/task-started.svg";
import { ReactComponent as TaskPaused } from "../../../assets/media/heroicons/task-paused.svg";
import { ReactComponent as TaskPending } from "../../../assets/media/heroicons/task-pending.svg";
import { ReactComponent as TaskCompleted } from "../../../assets/media/heroicons/task-completed.svg";
import { ReactComponent as EllipsisSvg } from "../../../assets/media/heroicons/outline/dots-horizontal.svg";
import { GROUP, PRIVATE } from "../../Chat/Models/models";
import { getProfileStatus, NotificationBadge } from "../../Chat/Sidebar/ChatsContentSidebar";
import { DEFAULT_IMAGE } from "../../Layout/HomePage/HomePage";
import { useDispatch } from 'react-redux';
import { SET_TASK_FILTER_DATA } from '../../../redux/constants/taskConstants';
import { TASK_STATUS } from '../../Tasks/config';

export const Board = ({
    board,
    gotoBoard,
    gotoChat,
    unique,
    chatType,
    filterTaskData,
    editBoardHandler,
    deleteBoardHandler,
    toggleFavBoardHandler }) => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const ClickMenuHandler = e => {
        e.stopPropagation();
    }

    const onClickTask = (id) => {
        dispatch({ type: SET_TASK_FILTER_DATA, payload: { status: TASK_STATUS[id].value } });
        gotoBoard(board);
    }

    let chat = {};
    let myProfile;
    let profileStatus = null;
    if (chatType === GROUP) {
        chat.name = board.name;
        chat.profilePicture = board.image;
        myProfile = board.chatusers.filter(x => x.userId === user.id)[0];
    } else if (chatType === PRIVATE) {
        const { name: username, profilePicture: userPic, profileStatus: pStatus } = board.chatusers.filter(x => x.userId !== user.id)[0]?.user;
        myProfile = board.chatusers.filter(x => x.userId === user.id)[0];
        chat.name = username;
        chat.profilePicture = userPic;
        profileStatus = pStatus;
    }

    // const filteredTask = board?.tasks?.filter((item) => {
    //     if (filterTaskData.dateFrom && filterTaskData.dateTo) {
    //         return (
    //             (moment(filterTaskData.dateFrom).toDate().getTime() <= moment(item.createdAt).toDate().getTime() &&
    //                 moment(item.createdAt).toDate().getTime() <= moment(filterTaskData.dateTo).toDate().getTime()));
    //     }
    //     return true;
    // })
    const tasksArr = {
        pending: board.filteredTask?.filter(task => task.status === "pending"),
        started: board.filteredTask?.filter(task => task.status === "started"),
        paused: board.filteredTask?.filter(task => task.status === "paused"),
        completed: board.filteredTask?.filter(task => task.status === "finished"),
    }
    // const totalMessageCount = myProfile?.atTheRateMentionMessageCount +
    //     myProfile?.hasMentionMessageCount +
    //     myProfile?.urgentUnreadMessageCount +
    //     myProfile?.emergencyUnreadMessageCount +
    //     myProfile?.routineUnreadMessageCount;

    if (board.totalMessageCount > 0 || !!board.filteredTask.length)
        return (
            <div className="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12 my-1">
                <div className="whitelight cursor-pointer with-transition roe-box-shadow pos-relative board-grid">
                    <div className="board">
                        <div className="dropdown more_icon board-more-option ml-auto">
                            <button className="btn-outline-default text-capitalize transparent-button" id={`board-${unique}-${board.id}`} data-bs-toggle="dropdown" onClick={ClickMenuHandler}>
                                <EllipsisSvg id="task" />
                            </button>
                            <ul className="dropdown-menu m-0" aria-labelledby="chatFilterDropdown">
                                <li className="dropdown-item" onClick={(e) => { e.stopPropagation(); }}>Edit</li>
                                <li className="dropdown-item" onClick={(e) => { e.stopPropagation(); }}>Delete</li>
                            </ul>
                        </div>
                        <div className="text-center" onClick={() => gotoChat(board)} title={`Click to view ${chat.name}'s chat`}>
                            <div className={`avatar ${profileStatus && getProfileStatus(profileStatus)}`}>
                                <img src={chat.profilePicture ? chat.profilePicture : DEFAULT_IMAGE} alt="" />
                            </div>
                            <p className="fs-14 font-weight-bold text-capitalize word-break text-truncate">
                                {chat.name}
                            </p>
                        </div>
                        <div className="notification-section mb-1">
                            <div className={`${classes["task-options"]}`}>
                                <div className={`d-flex align-items-center task-card-svg`}>
                                    <p className="mb-0">Tasks:</p>
                                </div>
                                {!!tasksArr.pending &&
                                    <div className="d-flex align-items-center task-card-svg"
                                        title='Click to view pending tasks'
                                        onClick={() => onClickTask(1)}>
                                        <div className="svg-wrap">
                                            <TaskPending />
                                        </div>
                                        <p className="mb-0">
                                            {tasksArr.pending.length}
                                        </p>
                                    </div>}
                                {!!tasksArr.started &&
                                    <div className="d-flex align-items-center task-card-svg"
                                        title='Click to view started tasks'
                                        onClick={() => onClickTask(2)}>
                                        <div className="svg-wrap">
                                            <TaskStarted />
                                        </div>
                                        <p className="mb-0">
                                            {tasksArr.started.length}
                                        </p>
                                    </div>}
                                {!!tasksArr.paused &&
                                    <div className="d-flex align-items-center task-card-svg"
                                        title='Click to view paused tasks'
                                        onClick={() => onClickTask(3)}>
                                        <div className="svg-wrap">
                                            <TaskPaused />
                                        </div>
                                        <p className="mb-0">
                                            {tasksArr.paused.length}
                                        </p>
                                    </div>}
                                {!!tasksArr.completed &&
                                    <div className="d-flex align-items-center task-card-svg"
                                        title='Click to view finished tasks'
                                        onClick={() => onClickTask(4)}>
                                        <div className="svg-wrap">
                                            <TaskCompleted />
                                        </div>
                                        <p className="mb-0">
                                            {tasksArr.completed.length}
                                        </p>
                                    </div>}
                            </div>
                        </div>
                        <div className="notification-section" onClick={() => gotoChat(board)} title={`Click to view ${chat.name}'s chat`}>
                            <div className={`${classes["task-options"]}`}>
                                <div className={`d-flex align-items-center task-card-svg`}>
                                    <p className="mb-0 mr-1">
                                        Messages:
                                    </p>
                                    {board.totalMessageCount > 0 ? <NotificationBadge myChatDetails={myProfile} /> : <div className="line-height-18">-</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
}