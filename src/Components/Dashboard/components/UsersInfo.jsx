import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CreatePrivateChat, loadUserChatList } from '../../../redux/actions/chatAction';
import { ConnectInNewChat, getUsersListData, notifyUsers } from '../../../utils/wssConnection/wssConnection';
import { setUserHandler } from '../../Chat/Sidebar/ChatsContentSidebarList';
import useDebounce from '../../hooks/useDebounce';
import { UsersStatusList } from './UsersStatusList';

export const UsersInfo = ({ userDesignations }) => {
    const dispatch = useDispatch();
    const navigateTo = useNavigate();
    const { user } = useSelector((state) => state.user);
    const { usersList, activeChat } = useSelector((state) => state.chat);
    const { superAdminpage } = useSelector((state) => state.model);
    const [searchUser, setSearchUser] = useState("");
    const newUser = useDebounce(searchUser, 500);

    const gotoChat = async (chat) => {
        const create = async () => {
            const res = await CreatePrivateChat(chat.id, user.id);
            if (res?.status === 1) {
                dispatch(loadUserChatList(false));
                notifyUsers(res.data.createdBy, res.data.id, res.data.users, res.data.type);
                setUserHandler(res.data, activeChat?.id, user.id, dispatch);
                ConnectInNewChat(res.data);
                setUserHandler(res.data, -3, user.id, dispatch);
                navigateTo("/chats");
            } else if (res?.status === 2) {
                dispatch(loadUserChatList(false));
                setUserHandler(res.data, activeChat?.id, user.id, dispatch);
                navigateTo("/chats");
            }
        }
        create();
    }

    useEffect(() => {
        getUsersListData({
            page: superAdminpage,
            name: newUser
        });
    }, [superAdminpage, newUser]);

    const OpenChatWithUser = (privateuser) => {
        gotoChat(privateuser);
    }

    return (<>
        <div className="form-inline mt-2">
            <div className="input-group admin-search m-0">
                <input type="text" className="form-control text-white border-0 transparent-bg p-4_8"
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
        </div>
        {usersList.users &&
            <UsersStatusList
                card={"users"}
                user={user}
                OpenChatWithUser={OpenChatWithUser}
                userDesignations={userDesignations}
                usersData={usersList}
                page={superAdminpage}
                dispatch={dispatch}
            />}
    </>)
}
