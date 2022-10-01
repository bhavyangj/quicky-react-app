import moment from 'moment-timezone';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ReactComponent as ExclamationSVG } from "../../../assets/media/heroicons/outline/exclamation.svg";
import { getTaskDetails } from '../../../redux/actions/taskAction';
import { RES_GET_TASK_DETAILS } from '../../../redux/constants/taskConstants';
import TaskDetails from '../../Tasks/TaskDetails/TaskDetails';
export const TasklogsTable = ({ TaskLogsforSadmin }) => {
    const dispatch = useDispatch();
    const { chatList } = useSelector((state) => state.chat);
    const { taskDetails } = useSelector((state) => state.task);
    const [userTasks, setuserTasks] = useState(TaskLogsforSadmin);

    useEffect(() => {
        setuserTasks(TaskLogsforSadmin);
    }, [TaskLogsforSadmin]);

    const onClickTask = async (task) => {
        getTask(task);
    }
    const getTask = async (item) => {
        dispatch(getTaskDetails(item.id, item.chatId, chatList));
    }
    const onCloseTaskDeatails = () => {
        dispatch({ type: RES_GET_TASK_DETAILS, payload: null });
    }
    if (userTasks)
        return (<>
            <div className="row m-0">
                <div>
                    <h6 className='mb-0 ml-2'>{`Total Records: ${userTasks?.length}`}</h6>
                </div>
                <div className="table-responsive table-userlogs m-1">
                    {<>
                        <table className="table table-dark table-hover w-100">
                            <thead>
                                <tr className='list-task-table-row'>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Type</th>
                                    <th className='text-center'>Created on</th>
                                    <th className='text-center'>Due Date</th>
                                </tr>
                            </thead>
                            <tbody className='table-body-logs overflow-auto'>
                                {!!userTasks.length ?
                                    userTasks.map((item, index) => {
                                        // const grossHours = item.grossHours.split(":");
                                        // const arrival = item.arrivalLog;
                                        // const lastLog = item.recentLog;
                                        return (
                                            <tr className="list-task-table-row" key={index} onClick={() => onClickTask(item)}>
                                                <td>
                                                    <nobr>
                                                        {item.name}
                                                    </nobr>
                                                </td>
                                                <td className='text-capitalize'>
                                                    {item.status}
                                                </td>
                                                <td className='text-capitalize'>
                                                    {item.type}
                                                </td>
                                                <td className='text-center'>
                                                    {moment(item.createdAt).format("MM/DD/YY")}
                                                </td>
                                                <td className='text-center'>
                                                    {item.dueDate ? moment(item.dueDate).format("MM/DD/YY") : '-'}
                                                </td>
                                            </tr>
                                        );
                                    })
                                    :
                                    (<tr className="text-center text-muted align-items-center my-3">
                                        <td colSpan={5}>
                                            <ExclamationSVG />
                                            <p className="mb-0">No userTasks available</p>
                                        </td>
                                    </tr>)
                                }
                            </tbody>
                        </table>
                        {/* <h6>{`Total Hours: ${LogsList?.totalHours.split(":")[0]}h ${LogsList?.totalHours.split(":")[1]}m`}</h6> */}
                    </>}
                </div>
                {taskDetails && (<>
                    <div className="backdrop backdrop-visible task-bakdrop" />
                    <TaskDetails onClose={() => onCloseTaskDeatails()} task={taskDetails} />
                </>)}
            </div>
        </>);
}
