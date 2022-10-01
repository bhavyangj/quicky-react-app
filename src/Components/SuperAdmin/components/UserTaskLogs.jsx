import moment from 'moment-timezone'
import React, { useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { TASK_CARDS } from '../../../redux/reducers/taskReducer'
import { ListenGroupTasks, ListenUserTaskLogs } from '../../../utils/wssConnection/Listeners/Tasklistener'
import { ReqGroupTasks, ReqUserTaskLogs } from '../../../utils/wssConnection/wssConnection'
import { TASK_STATUS } from '../../Tasks/config'
import { ChatsDropdown } from '../ChatsDropdown'
import { UsersDropdown } from '../UsersDropdown'
import { TasklogsTable } from './TasklogsTable'

export const UserTaskLogs = ({ userData, setUserData, groupData, setGroupData }) => {
    const dispatch = useDispatch();
    const [selectChats, setSelectOpt] = useState(false);
    const { TaskLogsforSadmin } = useSelector((state) => state.task);
    const [filters, setFilters] = useState({
        created: null,
        dueDate: null,
        status: null,
        type: null
    });
    const getUserTaskLogs = () => {
        dispatch(ListenUserTaskLogs({ userId: userData.id }));
        ReqUserTaskLogs({ userId: userData.id, ...filters });
    }
    const getGroupTasks = () => {
        dispatch(ListenGroupTasks({ chatId: groupData.id }));
        ReqGroupTasks({ chatId: groupData.id, ...filters });
    }
    const onChangeDate = (data) => {
        setFilters((prev) => ({ ...prev, ...data }));
    }
    return (
        <div className='dashboard-date-logs'>
            <div className="row m-2 d-flex flex-wrap align-items-center justify-content-between">
                <div className="dropdown-select-options text-white">
                    <div className='p-4_8'>Filter by: </div>
                    <div className='options'>
                        <div className={`option p-4_8 ${!selectChats ? 'active' : ''}`} onClick={() => setSelectOpt(false)}>Users</div>
                        <div className={`option p-4_8 ${selectChats ? 'active' : ''}`} onClick={() => setSelectOpt(true)}>Chats</div>
                    </div>
                </div>
                {selectChats ?
                    <ChatsDropdown groupData={groupData} setGroupData={setGroupData} />
                    : <UsersDropdown user={userData} setUserData={setUserData} />}

                <div className="dropdown mr-1">
                    <button
                        className="btn btn-outline-default btn-sm dropdown-toggle text-capitalize p-4_8"
                        id="statusDropdown"
                        data-bs-toggle="dropdown"
                    >
                        <span>Status: {filters.status ? filters.status : "All"}</span>
                    </button>
                    <ul className="dropdown-menu m-0" style={{ overflow: "unset" }} aria-labelledby="statusDropdown">
                        {TASK_STATUS.map((status) => (
                            <li
                                key={status.id}
                                className="dropdown-item cursor-pointer text-capitalize"
                                onClick={() => {
                                    setFilters((prev) => ({ ...prev, status: status.value !== 'All' ? status.value : null }))
                                }}
                            >
                                {status.value}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="dropdown mr-1">
                    <button
                        className="btn btn-outline-default btn-sm dropdown-toggle text-capitalize p-4_8"
                        id="typeDropdown"
                        data-bs-toggle="dropdown"
                    >
                        <span>Type: {filters.type ? filters.type : "All"}</span>
                    </button>
                    <ul className="dropdown-menu m-0" style={{ overflow: "unset" }} aria-labelledby="typeDropdown">
                        <li
                            className="dropdown-item cursor-pointer text-capitalize"
                            onClick={() => {
                                setFilters((prev) => ({ ...prev, type: null }))
                            }}
                        >
                            {'All'}
                        </li>
                        {TASK_CARDS.map((type) => (
                            <li
                                key={type.id}
                                className="dropdown-item cursor-pointer text-capitalize"
                                onClick={() => {
                                    setFilters((prev) => ({ ...prev, type: type.type, }))
                                }}
                            >
                                {type.title}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <div className="d-inline-block input-group py-1 w-auto date-label mr-1">
                        <span className='mr-1 text-white-70 fs-14'>Created On:</span>
                        <ReactDatePicker
                            id="createdOnDate"
                            placeholderText="Select Created On"
                            title="Created On"
                            className="form-control search transparent-bg text-white p-4_8"
                            selected={filters.created ? new Date(filters.created) : null}
                            value={filters.created ? new Date(filters.created) : null}
                            onChange={(date) => { onChangeDate({ created: date ? moment(date).format() : date }); }}
                            isClearable={true}
                        />
                    </div>
                    <div className="d-inline-block input-group py-1 w-auto date-label">
                        <span className='mr-1 text-white-70 fs-14'>Due Date:</span>
                        <ReactDatePicker
                            id="dueDate"
                            placeholderText="Select due date"
                            title='due date'
                            className="form-control search transparent-bg text-white p-4_8"
                            selected={filters.dueDate ? new Date(filters.dueDate) : null}
                            value={filters.dueDate ? new Date(filters.dueDate) : null}
                            onChange={(date) => onChangeDate({ dueDate: date })}
                            isClearable={true}
                        />
                    </div>
                </div>
                <button className='btn btn-primary ml-auto' onClick={!selectChats ? getUserTaskLogs : getGroupTasks}>Search</button>
            </div>
            <TasklogsTable TaskLogsforSadmin={TaskLogsforSadmin} />
        </div>
    )
}
