import React, { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ListenCreateDesignation, ListenCreateTaskLabel, ListenDeleteDesignation, ListenDeleteTaskLabel, ListenUpdateDesignation, ListenUpdateTaskLabel } from '../../utils/wssConnection/Listeners/TemplateListeners';
import { getUsersListData, ReqRoleList } from '../../utils/wssConnection/wssConnection';
import useDebounce from '../hooks/useDebounce';
import { AdminDashboardHeader } from './components/AdminDashboardHeader';
import { TaskLabelsData } from './components/TaskLabelsData';
import { UserDesignation } from './components/UserDesignation/UserDesignation';
import { UsersAttendanceLogs } from './components/UsersAttendanceLogs';
import { UsersTable } from './components/UsersTable';
import { UserTaskLogs } from './components/UserTaskLogs';

export const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { usersList, userDesignations } = useSelector((state) => state.chat);
    const { name, superAdminpage } = useSelector((state) => state.model);
    // const [page, setPage] = useState(1);
    const [searchUser, setSearchUser] = useState("");
    const newUser = useDebounce(searchUser, 500);
    const [userData, setUserData] = useState(user);
    const [groupData, setGroupData] = useState();

    useEffect(() => {
        // const getData = async () => {
        //     const res = await getUsersList("");
        //     dispatch({ type: SET_USERS_LIST, payload: res.data })
        // }
        dispatch(ListenUpdateTaskLabel());
        dispatch(ListenDeleteTaskLabel());
        dispatch(ListenCreateTaskLabel());
        dispatch(ListenCreateDesignation());
        dispatch(ListenUpdateDesignation());
        dispatch(ListenDeleteDesignation());
        ReqRoleList();
    }, [dispatch]);

    useEffect(() => {
        getUsersListData({
            page: superAdminpage,
            name: newUser
        });
    }, [superAdminpage, newUser]);

    return (
        <div className="super-admin super-admin-list p-2 col vh-100 overflow-auto">
            <AdminDashboardHeader />
            <nav className='dashboard-nav my-2'>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <button className="nav-link active" id="nav-user-tab" data-bs-toggle="tab" data-bs-target="#nav-users" type="button" role="tab" aria-controls="nav-chat" aria-selected="true">Users</button>
                    <button className="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Attendance Logs</button>
                    <button className="nav-link" id="nav-tasklog-tab" data-bs-toggle="tab" data-bs-target="#nav-tasklog" type="button" role="tab" aria-controls="nav-tasklog" aria-selected="false">Task Logs</button>
                    <button className="nav-link" id="nav-tasklabel-tab" data-bs-toggle="tab" data-bs-target="#nav-tasklabel" type="button" role="tab" aria-controls="nav-tasklabel" aria-selected="false">Categories</button>
                    <button className="nav-link" id="nav-user-desg-tab" data-bs-toggle="tab" data-bs-target="#nav-user-desg" type="button" role="tab" aria-controls="nav-user-desg" aria-selected="false">User Designation</button>
                </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
                <div className="tab-pane fade show active" id="nav-users" role="tabpanel" aria-labelledby="nav-user-tab">
                    <UsersTable
                        userDesignations={userDesignations}
                        usersList={usersList}
                        setSearchUser={setSearchUser}
                        name={name}
                        superAdminpage={superAdminpage} />
                </div>
                <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
                    {/* <AttendanceLogs user={user} logDate={logDate} setLogDate={setLogDate} /> */}
                    <UsersAttendanceLogs user={user} userData={userData} setUserData={setUserData} />
                </div>
                <div className="tab-pane fade" id="nav-tasklog" role="tabpanel" aria-labelledby="nav-tasklog-tab">
                    <UserTaskLogs userData={userData} setUserData={setUserData} groupData={groupData} setGroupData={setGroupData} />
                </div>
                <div className="tab-pane fade" id="nav-tasklabel" role="tabpanel" aria-labelledby="nav-tasklabel-tab">
                    <TaskLabelsData />
                </div>
                <div className="tab-pane fade" id="nav-user-desg" role="tabpanel" aria-labelledby="nav-user-desg-tab">
                    <UserDesignation
                        userDesignations={userDesignations} />
                </div>
            </div>
        </div>
    )
}