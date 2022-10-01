import React, { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { ReqAllUsersList } from '../../utils/wssConnection/wssConnection';

export const UsersDropdown = ({ user, setUserData }) => {
    const { usersList, AllUsers } = useSelector((state) => state.chat);
    const [userListData, setUserList] = useState(usersList.users);

    useEffect(() => {
        ReqAllUsersList();
    }, []);
    useEffect(() => {
        if (AllUsers)
            setUserList(AllUsers);
    }, [AllUsers]);

    return (
        <div className="dropdown mx-2">
            <button className="btn btn-outline-default btn-sm dropdown-toggle text-capitalize p-4_8" id="chatFilterDropdown" data-bs-toggle="dropdown">
                {user?.name}
            </button>
            <ul className="dropdown-menu m-0 users-dropdown" aria-labelledby="chatFilterDropdown">
                {userListData?.map((user) => (
                    <li key={user.id} className="dropdown-item" onClick={() => setUserData(user)}>{user.name}</li>
                ))}
            </ul>
        </div>
    )
}
