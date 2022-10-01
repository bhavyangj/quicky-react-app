import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { changeModel } from '../../../redux/actions/modelAction';
import { NEW_CHAT } from '../Models/models';
import { UserChat } from './UserChat/UserChat';
import { DEFAULT_IMAGE } from '../../Layout/HomePage/HomePage';

export const ChatsContent = () => {
    const { activeChat } = useSelector((state) => state.chat);
    return ((activeChat && activeChat.id !== -1) ? <UserChat /> : <WelcomeChat />);
}

export const WelcomeChat = () => {
    const dispatch = useDispatch();
    // const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    // const { chatList } = useSelector((state) => state.chat);
    // receiveMessage(-1, dispatch, user && user.id, chatList, navigate);
    return (<div className="chats">
        <div className="d-flex flex-column justify-content-center text-center h-100 w-100">
            <div className="container">
                <div className="avatar avatar-lg mb-2">
                    <img className="avatar-img" src={user?.profilePicture ? user.profilePicture : DEFAULT_IMAGE} alt="" />
                </div>
                <h5 className='username-text'>Welcome, {user?.name}!</h5>
                <p className="text-muted">Please select a chat to Start messaging.</p>
                <button className="btn btn-outline-primary no-box-shadow" onClick={() => dispatch(changeModel(NEW_CHAT))}>
                    Start a conversation
                </button>
            </div>
        </div>
    </div>);
}
