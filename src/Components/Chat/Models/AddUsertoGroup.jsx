import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { changeModel } from '../../../redux/actions/modelAction';
import useDebounce from '../../hooks/useDebounce';
import { ADD_USER_TO_GROUP } from './models';
import { getUsersList } from '../../../redux/actions/chatAction';
import { AddUserGroup } from '../../../utils/wssConnection/wssConnection';

export const AddUsertoGroup = () => {
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const newUser = useDebounce(search, 500);
    const { activeChat } = useSelector((state) => state.chat);
    const { name } = useSelector((state) => state.model);
    const [checked, setChecked] = useState([]);
    const AllUsersId = [...activeChat?.chatusers?.map((item) => item.userId)];

    useEffect(() => {
        const getData = async () => {
            const res = await getUsersList(newUser.trim());
            setUsers(res.data);
        }
        getData();
    }, [newUser]);

    const onAddUserClickHandler = () => {
        AddUserGroup(activeChat.id, checked);
        dispatch(changeModel(""));
    }

    // Add/Remove checked item from list
    const handleCheck = (event) => {
        let updatedList = [...checked];
        if (event.target.checked)
            updatedList = [...checked, Number(event.target.value)];
        else {
            const index = updatedList.findIndex((itemId) => itemId === Number(event.target.value));
            updatedList.splice(index, 1);
        }
        setChecked(updatedList);
    };

    return (<>
        <div className={`modal modal-lg-fullscreen fade ${name === ADD_USER_TO_GROUP ? 'show d-block' : ''}`} data-toggle="modal" id="startConversation" tabIndex={-1} role="dialog" aria-labelledby="startConversationLabel" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-dialog-zoom">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="startConversationLabel">Add User to Group</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => dispatch(changeModel(""))}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body p-0 hide-scrollbar">
                        <div className="row pt-2" data-title="Add Group Members">
                            <div className="col-12">
                                <form className="form-inline w-100 px-2 pb-2 border-bottom">
                                    <div className="input-group w-100 bg-light">
                                        <input type="text"
                                            className="form-control form-control-md search border-right-0 transparent-bg pr-0"
                                            placeholder="Search"
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                        <div className="input-group-append">
                                            <div className="input-group-text transparent-bg border-left-0" role="button">
                                                <svg className="hw-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="col-12">
                                <ul className="list-group list-group-flush">
                                    {users.filter(item => !AllUsersId.includes(item.id)).map((item, index) => {
                                        return (<li className="list-group-item" key={item.id}>
                                            <div className="media">
                                                <div className={`avatar avatar-${item.profileStatus} mr-2`}>
                                                    <img src={item.profilePicture} alt="" />
                                                </div>
                                                <div className="media-body">
                                                    <h6 className="text-truncate">
                                                        <div className="text-reset text-capitalize">{item.name}</div>
                                                    </h6>
                                                    <p className="text-muted mb-0 text-capitalize">{item.profileStatus}</p>
                                                </div>
                                                <div className="media-options">
                                                    <div className="custom-control custom-checkbox">
                                                        <input
                                                            className="custom-control-input"
                                                            id={`chx-user-${item.id}`}
                                                            name={`chx-users`}
                                                            type="checkbox"
                                                            value={item.id}
                                                            checked={checked.includes(item.id)}
                                                            onChange={handleCheck}
                                                        />
                                                        <label className="custom-control-label" htmlFor={`chx-user-${item.id}`} />
                                                    </div>
                                                </div>
                                            </div>
                                            <label className="media-label" htmlFor={`chx-user-${item.id}`} />
                                        </li>)
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary js-btn-step"
                            disabled={!checked.length > 0}
                            onClick={() => onAddUserClickHandler()}>Add User
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>);
}