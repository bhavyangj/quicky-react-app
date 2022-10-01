import React from 'react'
import { useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import { ALL_CHATS, GROUP, PRIVATE } from '../Chat/Models/models'
import { Board } from './components/Board'
import { ReactComponent as SearchSvg } from "../../assets/media/heroicons/solid/search.svg";
import moment from 'moment-timezone'
import { useSelector } from 'react-redux'
import { SET_TASK_FILTER_DATA } from '../../redux/constants/taskConstants'
import { useEffect } from 'react'
import { getDateXDaysAgo } from './ListofDateLogs'

export const BoardList = ({ dispatch, gotoBoard, gotoChat, chatList, user }) => {
    const { filterTaskData } = useSelector((state) => state.task);
    const [filters, setFilters] = useState({
        search: "",
        chatType: ALL_CHATS
    });

    useEffect(() => {
        dispatch({
            type: SET_TASK_FILTER_DATA, payload: {
                dateFrom: getDateXDaysAgo(1),
                dateTo: getDateXDaysAgo(0),
            }
        });
    }, [dispatch]);

    const onFilterUsersHandler = (type) => setFilters((prev) => ({
        ...prev,
        chatType: type
    }));

    const onChangeDate = (data) => {
        dispatch({ type: SET_TASK_FILTER_DATA, payload: { ...data } });
    }

    if (chatList) {
        const filterChatList = chatList.filter((chat) => filters.chatType === chat.type || filters.chatType === ALL_CHATS);
        const newFilterList = filterChatList
            .filter((chat) => {
                const filteredTask = chat?.tasks
                    .filter((item) => {
                        if (filterTaskData.dateFrom && filterTaskData.dateTo) {
                            return ((
                                moment(filterTaskData.dateFrom).startOf('day') <= moment(item.createdAt).endOf('day') &&
                                moment(item.createdAt).startOf('day') <= moment(filterTaskData.dateTo).endOf('day')));
                        }
                        return true;
                    })
                    .filter((item) => {
                        return (item.createdBy === user.id || [...item.taskmembers.map((item) => item.userId)].includes(user.id))
                    });
                let myProfile = chat.chatusers.filter(x => x.userId === user.id)[0];
                const totalMessageCount = myProfile?.atTheRateMentionMessageCount +
                    myProfile?.hasMentionMessageCount +
                    myProfile?.urgentUnreadMessageCount +
                    myProfile?.emergencyUnreadMessageCount +
                    myProfile?.routineUnreadMessageCount;
                chat.filteredTask = filteredTask;
                chat.totalMessageCount = totalMessageCount;
                return (!!filteredTask.length || totalMessageCount > 0)
            })

        const groupChats = newFilterList
            .filter((chat) => (chat.type === GROUP && (chat.name.toLowerCase().includes(filters.search.toLowerCase()) || filters.search === "")))
        const personalChats = newFilterList
            .filter((chat) => {
                const { name } = chat.chatusers.filter(x => x.userId !== user.id)[0]?.user;
                return (chat.type === PRIVATE && (name.toLowerCase().includes(filters.search.toLowerCase()) || filters.search === ""));
            })

        return (<>
            <div className="sidebar-sub-header mt-2 bg-grey p-1 flex-wrap">
                <div className="chat-filter d-flex align-items-center">
                    <div className="dropdown mr-2">
                        <button className="btn btn-outline-default dropdown-toggle text-capitalize theme-border" id="chatFilterDropdown" data-bs-toggle="dropdown">
                            {filters.chatType}
                        </button>
                        <ul className="dropdown-menu m-0" aria-labelledby="chatFilterDropdown">
                            <li className="dropdown-item" onClick={() => onFilterUsersHandler(ALL_CHATS)}>All Chats</li>
                            <li className="dropdown-item" onClick={() => onFilterUsersHandler(PRIVATE)}>Private</li>
                            <li className="dropdown-item" onClick={() => onFilterUsersHandler(GROUP)}>Groups</li>
                        </ul>
                    </div>
                    <form className="form-inline">
                        <div className="input-group theme-border">
                            <input type="text" className="form-control search border-right-0 transparent-bg pr-0"
                                placeholder="Search User/Group"
                                title="Search User/Group"
                                onChange={(e) => setFilters((prev) => ({
                                    ...prev,
                                    search: e.target.value
                                }))} />
                            <div className="input-group-append">
                                <div className="input-group-text transparent-bg border-left-0" role="button">
                                    <SearchSvg className="text-muted hw-20" />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="date-task-filter d-flex align-items-center">
                    <div className="input-group d-flex px-0 flex-nowrap m-1" title="Date from">
                        <ReactDatePicker
                            id="logDateFrom"
                            placeholderText="Date from"
                            className="form-control search transparent-bg text-white"
                            selected={filterTaskData.dateFrom ? new Date(filterTaskData.dateFrom) : null}
                            value={filterTaskData.dateFrom ? new Date(filterTaskData.dateFrom) : null}
                            onChange={(date) => onChangeDate({ dateFrom: date })}
                            isClearable={true}
                            maxDate={filterTaskData.dateTo ? new Date(filterTaskData.dateTo) : new Date()}
                        />
                    </div>
                    <div className="input-group d-flex px-0 flex-nowrap m-1" title="Date to">
                        <ReactDatePicker
                            id="logDateTo"
                            placeholderText="Date to"
                            className="form-control search transparent-bg text-white"
                            selected={filterTaskData.dateTo ? new Date(filterTaskData.dateTo) : null}
                            value={filterTaskData.dateTo ? new Date(filterTaskData.dateTo) : null}
                            onChange={(date) => onChangeDate({ dateTo: date })}
                            isClearable={true}
                            minDate={filterTaskData.dateFrom ? new Date(filterTaskData.dateFrom) : null}
                            maxDate={new Date()}
                        />
                    </div>
                </div>
            </div>
            {groupChats &&
                <div className='dashboard_chat'>
                    <div className="fs-20 bold-text board-type-head">
                        {/* <h5 className='col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12 m-0'> */}
                        <h5 className='col m-0'>
                            Group Chats
                            {!!groupChats.length ?
                                <span className='mx-1'>{`(${groupChats.length})`}</span> :
                                <span className='mx-1 text-white-70 fs-14'>{'(No new message/task)'}</span>}
                        </h5>
                    </div>
                    <div className="row m-0">
                        {groupChats.map((board, i) => (
                            <Board key={i} chatType={GROUP} unique={GROUP} gotoBoard={gotoBoard} gotoChat={gotoChat} board={board} filterTaskData={filterTaskData} />
                        ))}
                    </div>
                </div>}
            {personalChats &&
                <div className='dashboard_chat'>
                    <div className="fs-20 bold-text board-type-head">
                        {/* <h5 className='col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12 m-0'> */}
                        <h5 className='col m-0'>
                            Personal Chats
                            {!!personalChats.length ?
                                <span className='mx-1'>{`(${personalChats.length})`}</span> :
                                <span className='mx-1 text-white-70 fs-14'>{'(No new message/task)'}</span>}
                        </h5>
                    </div>
                    <div className="row m-0">
                        {personalChats.map((board, i) => (
                            <Board key={i} chatType={PRIVATE} unique={PRIVATE} gotoBoard={gotoBoard} gotoChat={gotoChat} board={board} filterTaskData={filterTaskData} />
                        ))}
                    </div>
                </div>}
        </>);
    }
}
