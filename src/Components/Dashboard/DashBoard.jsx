import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { BoardList } from './BoardList';
import ScrumboardWrapper from './scrumboard.style';
import { NEW_CHAT_SELECTED, SET_NEW_TASK_LIST } from "../../redux/constants/taskConstants";
import { useNavigate } from 'react-router-dom';
import { setUserHandler } from '../Chat/Sidebar/ChatsContentSidebarList';
import { DashboardHeader } from './components/DashboardHeader';
import { AttendanceLogs } from './AttendanceLogs';
import moment from 'moment-timezone';
import { UsersInfo } from './components/UsersInfo';

export default function DashBoard() {
    const dispatch = useDispatch();
    const navigateTo = useNavigate();
    const { user } = useSelector((state) => state.user);
    const { chatList, userDesignations } = useSelector((state) => state.chat);
    const [logDate, setLogDate] = useState(moment().toDate());

    const gotoBoard = (board) => {
        dispatch({ type: NEW_CHAT_SELECTED, payload: board });
        dispatch({ type: SET_NEW_TASK_LIST, payload: [] });
        navigateTo("/tasks");
    }
    const gotoChat = (chat) => {
        navigateTo("/chats");
        setUserHandler(chat, -2, user.id, dispatch);
    }

    return (
        <ScrumboardWrapper layoutTheme={{ textColor: 'white', headingColor: 'white', themeName: 'theme2', backgroundColor: '#fff' }}>
            <div className='vh-100 limit-scroll overflow-auto'>
                <DashboardHeader user={user} logDate={logDate} />
                <div className="col-12 my-2">
                    <nav className='dashboard-nav'>
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                            <button className="nav-link active" id="nav-chat-tab" data-bs-toggle="tab" data-bs-target="#nav-chats" type="button" role="tab" aria-controls="nav-chat" aria-selected="true">Chats</button>
                            <button className="nav-link" id="nav-attendance-tab" data-bs-toggle="tab" data-bs-target="#nav-attendance" type="button" role="tab" aria-controls="nav-attendance" aria-selected="false">Attendance Logs</button>
                            <button className="nav-link" id="nav-user-tab" data-bs-toggle="tab" data-bs-target="#nav-user" type="button" role="tab" aria-controls="nav-user" aria-selected="false">Users</button>
                        </div>
                    </nav>
                    <div className="tab-content" id="nav-tabContent">
                        <div className="tab-pane fade show active" id="nav-chats" role="tabpanel" aria-labelledby="nav-chat-tab">
                            <BoardList
                                user={user}
                                dispatch={dispatch}
                                chatList={chatList}
                                gotoBoard={gotoBoard}
                                gotoChat={gotoChat} />
                        </div>
                        <div className="tab-pane fade" id="nav-attendance" role="tabpanel" aria-labelledby="nav-attendance-tab">
                            <AttendanceLogs user={user} logDate={logDate} setLogDate={setLogDate} />
                        </div>
                        <div className="tab-pane fade" id="nav-user" role="tabpanel" aria-labelledby="nav-user-tab">
                            <UsersInfo userDesignations={userDesignations} />
                        </div>
                    </div>
                </div>
            </div>
        </ScrumboardWrapper>
    );
}

