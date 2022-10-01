import React from 'react'
import { ReactComponent as ExclamationSVG } from "../../assets/media/heroicons/outline/exclamation.svg";
import { ListUserItem } from './ListUserItem';
import classes from "../Tasks/TasksPage.module.css";
import { CHANGE_ADMIN_TABLE_PAGE } from '../../redux/constants/modelConstants';

export const UsersList = ({ usersData, page, dispatch, userDesignations }) => {
    const totalPages = Math.ceil(usersData.count / 10);
    const onClickPage = (pageno) => {
        if (page !== pageno) setPage(pageno);
    }
    const setPage = (pageno) => dispatch({ type: CHANGE_ADMIN_TABLE_PAGE, payload: pageno })
    return (
        <div className="table-responsive table-users">
            {/* {!!usersData.users.length && <> */}
            {<>
                <table className={`table table-dark table-hover w-100 mt-2 mb-1 ${classes["table-task-list"]}`}>
                    <thead>
                        <tr className="list-task-table-row">
                            <th>Username</th>
                            <th className="">Designation</th>
                            <th className="text-center">Account Status</th>
                            <th className="">User Role</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersData.users.map((user, index) => (
                            <ListUserItem
                                key={user.id}
                                user={user}
                                userDesignations={userDesignations}
                                page={page}
                                index={index}
                            />
                        ))}
                    </tbody>
                </table>
                {usersData.users.length === 0 &&
                    <div className="text-center text-muted align-items-center">
                        <ExclamationSVG />
                        <p className="mb-0">No user available</p>
                    </div>}
                {
                    <nav aria-label="Page navigation">
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
            {/* {!usersData.users.length && (
                <div className="text-center text-muted align-items-center">
                    <ExclamationSVG />
                    <p className="mb-0">No users available</p>
                </div>
            )} */}
        </div>
    )
}
