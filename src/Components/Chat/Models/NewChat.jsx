import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { CreatePrivateChat, getUsersList, loadUserChatList } from '../../../redux/actions/chatAction';
import { changeModel } from '../../../redux/actions/modelAction';
import useDebounce from '../../hooks/useDebounce';
import { ConnectInNewChat, notifyUsers } from '../../../utils/wssConnection/wssConnection';
import { NEW_CHAT } from './models';
import { setUserHandler } from '../Sidebar/ChatsContentSidebarList';
import { DEFAULT_IMAGE } from '../../Layout/HomePage/HomePage';

export const NewChat = (props) => {
    const dispatch = useDispatch();
    const [userList, setUserList] = useState([]);
    const [searchUser, setSearchUser] = useState("");
    const newUser = useDebounce(searchUser, 500);
    const { name } = useSelector((state) => state.model);
    const { user } = useSelector((state) => state.user);
    const { activeChat } = useSelector((state) => state.chat);

    useEffect(() => {
        const getData = async () => {
            const res = await getUsersList(newUser.trim());
            setUserList(res.data);
        }
        getData();
    }, [newUser]);

    const newPrivateChat = (id) => {
        const create = async () => {
            const res = await CreatePrivateChat(id, user.id);
            if (res?.status === 1) {
                dispatch(changeModel(""));
                dispatch(loadUserChatList(false));
                notifyUsers(res.data.createdBy, res.data.id, res.data.users, res.data.type);
                setUserHandler(res.data, activeChat?.id, user.id, dispatch);
                ConnectInNewChat(res.data);
            } else if (res?.status === 2) {
                dispatch(changeModel(""));
                setUserHandler(res.data, activeChat?.id, user.id, dispatch);
            }
        }
        create();
    }

    const onUserClickHandler = (item) => {
        newPrivateChat(item.id);
    }

    return (<>
        <div className={`modal modal-lg-fullscreen fade ${name === NEW_CHAT ? 'show d-block' : ''}`} data-toggle="modal" id="startConversation" tabIndex={-1} role="dialog" aria-labelledby="startConversationLabel" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-dialog-zoom">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="startConversationLabel">New Chat</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => dispatch(changeModel(""))}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body p-0 hide-scrollbar">
                        <div className="row">
                            <div className="col-12">
                                <form className="form-inline w-100 p-2 border-bottom">
                                    <div className="input-group w-100 bg-light">
                                        <input type="text" className="form-control form-control-md search border-right-0 transparent-bg pr-0" placeholder="Search" value={searchUser} onChange={(e) => setSearchUser(e.target.value)} />
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
                                    {userList.map((item) => {
                                        return (<li className="list-group-item" key={item.id} onClick={() => onUserClickHandler(item)}>
                                            <div className="media">
                                                <div className={`avatar avatar-${item.profileStatus} mr-2`}>
                                                    <img src={item?.profilePicture ? item.profilePicture : DEFAULT_IMAGE} alt="" />
                                                </div>
                                                <div className="media-body">
                                                    <h6 className="text-truncate">
                                                        <div className="text-reset username-text">{item?.name}</div>
                                                    </h6>
                                                    <p className="text-muted mb-0 text-capitalize">{item.profileStatus}</p>
                                                </div>
                                            </div>
                                        </li>);
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
}
