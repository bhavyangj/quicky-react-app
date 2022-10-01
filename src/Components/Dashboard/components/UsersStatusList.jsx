import React from 'react'
import classes from "../../Tasks/TasksPage.module.css";
import { CHANGE_ADMIN_TABLE_PAGE } from '../../../redux/constants/modelConstants';
import { ReactComponent as ExclamationSVG } from "../../../assets/media/heroicons/outline/exclamation.svg";
import { ReactComponent as ChatSVG } from "../../../assets/media/heroicons/solid/chat-alt.svg";

export const UsersStatusList = ({ usersData, page, dispatch, OpenChatWithUser, user, userDesignations }) => {
    const totalPages = Math.ceil(usersData?.count / 10);
    const onClickPage = (pageno) => {
        if (page !== pageno) setPage(pageno);
    }
    const setPage = (pageno) => dispatch({ type: CHANGE_ADMIN_TABLE_PAGE, payload: pageno })
    return (
        <div className="table-responsive table-users">
            {<>
                {!!usersData.users.length &&
                    <table className={`table table-dark table-hover w-100 mt-2 mb-1 ${classes["table-task-list"]}`}>
                        <thead>
                            <tr className="list-task-table-row">
                                <th>Username</th>
                                <th>Designation</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersData.users.map((puser, index) => (
                                <UserItem
                                    key={puser.id}
                                    OpenChatWithUser={OpenChatWithUser}
                                    userDesignations={userDesignations}
                                    privateUser={puser}
                                    page={page}
                                    user={user}
                                    index={index}
                                />
                            ))}
                        </tbody>
                    </table>}
                {!usersData.users.length &&
                    <div className="text-center text-muted align-items-center">
                        <ExclamationSVG />
                        <p className="mb-0">No user available</p>
                    </div>}
                {<nav aria-label="Page navigation">
                    <ul className="pagination justify-content-end">
                        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" tabIndex="-1" onClick={() => setPage(page - 1)}>Previous</button>
                        </li>
                        {[...new Array(totalPages).keys()].map((pageno) => (
                            <li key={pageno} className={`page-item ${pageno + 1 === page ? 'active' : ''}`}>
                                <div
                                    className="page-link cursor-pointer"
                                    onClick={() => onClickPage(pageno + 1)}
                                >
                                    {pageno + 1}
                                </div>
                            </li>
                        ))}

                        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" tabIndex="-1" onClick={() => setPage(page + 1)}>Next</button>
                        </li>
                    </ul>
                </nav>}
            </>}
        </div>
    )
}

export const UserItem = ({ privateUser, page, OpenChatWithUser, user, userDesignations }) => {

    return (
        <tr className="list-task-table-row">
            <td className='text-capitalize'>
                <nobr>{privateUser.name}</nobr>
            </td>
            <td className="text-capitalize">
                {privateUser?.designation?.map((desg) => (
                    <nobr key={desg} className="desg-tag mr-1 px-1">{desg ? userDesignations?.filter((item) => item.id === desg)?.shift()?.name : 'N/A'}</nobr>
                ))}
            </td>
            <td className="text-capitalize" title={`${privateUser.name} is ${privateUser.profileStatus}`}>
                <nobr>{privateUser.profileStatus}</nobr>
            </td>
            <td>
                <nobr>
                    {user.id !== privateUser.id &&
                        <button
                            className="btn btn-outline p-0"
                            title={`Click to move in ${privateUser.name}`}
                            onClick={() => OpenChatWithUser(privateUser)}>
                            <ChatSVG color='#665dfe' />
                        </button>}
                </nobr>
            </td>
        </tr>
    )
}
