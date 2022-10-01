import React from 'react'
import { useDispatch } from 'react-redux';
import { changeModel } from '../../../redux/actions/modelAction';
import { ADD_USER_ADMIN, UPDATE_USER, USER_DETAILS } from '../../Chat/Models/models';
import { AddUser } from '../models/AddUser';
import { UpdateUser } from '../models/UpdateUser';
import { UserDetails } from '../models/UserDetails';
import { UsersList } from '../UsersList';

export const UsersTable = ({ setSearchUser, usersList, name, superAdminpage, userDesignations }) => {
    const dispatch = useDispatch();

    return (<>
        <div className="form-inline">
            <div className="input-group admin-search m-0">
                <input type="text" className="form-control search border-0 transparent-bg p-4_8"
                    placeholder="Search User"
                    onChange={(e) => setSearchUser(e.target.value.trim())} />
                <div className="input-group-append">
                    <div className="input-group-text transparent-bg border-left-0" role="button">
                        <svg className="text-muted hw-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>
            <button
                className='btn btn-primary p-4_8 ml-auto'
                type="button"
                onClick={() => { dispatch(changeModel(ADD_USER_ADMIN)) }}
            >
                Add User
            </button>
        </div>
        {usersList.users &&
            <UsersList
                card={"users"}
                usersData={usersList}
                page={superAdminpage}
                userDesignations={userDesignations}
                dispatch={dispatch}
            />}
        <div
            className={`backdrop ${name !== "" ? "backdrop-visible" : ""}`.trim()}
            onClick={() => {
                if (name !== "") dispatch(changeModel(""));
            }}
        ></div>
        {modelElement(name)}
    </>);
}
const modelElement = (model) => {
    // All Models
    switch (model) {
        // Modal 1 :: Add User
        case ADD_USER_ADMIN:
            return <AddUser />;
        // Modal 1 :: Update user
        case UPDATE_USER:
            return <UpdateUser />;
        // Modal 1 :: Update user
        case USER_DETAILS:
            return <UserDetails />;
        default:
            return null;
    }
};