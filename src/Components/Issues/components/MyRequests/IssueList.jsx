import React from 'react'
import classes from "../../../Tasks/TasksPage.module.css";
import { ReactComponent as ExclamationSVG } from "../../../../assets/media/heroicons/outline/exclamation.svg";
import { ListIssueItem } from './ListIssueItem';

export const IssueList = ({ issues, setReqData }) => {
    return (
        <div className="table-responsive table-users">
            {<>
                <table className={`table table-dark table-hover w-100 mt-2 mb-1 ${classes["table-task-list"]}`}>
                    <thead>
                        <tr className="list-task-table-row">
                            <th>Subject</th>
                            <th className="">Id</th>
                            <th className="text-center">Created On</th>
                            <th className="text-center">last activity</th>
                            <th className='text-center dropdown-toggle'>Status</th>
                            <th className='text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!!issues.length && issues.map((issue, index) => (
                            <ListIssueItem
                                key={issue.id}
                                issue={issue}
                                setReqData={setReqData}
                                index={index}
                            />
                        ))}
                        {!issues.length &&
                            <tr className="text-center text-muted align-items-center">
                                <td colSpan={5}>
                                    <ExclamationSVG />
                                    <p className="mb-0">No Request available</p>
                                </td>
                            </tr>}
                    </tbody>
                </table>
            </>}
        </div>
    )
}
