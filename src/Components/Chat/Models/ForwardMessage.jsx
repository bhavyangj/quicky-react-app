import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { changeModel } from '../../../redux/actions/modelAction';
import useDebounce from '../../hooks/useDebounce';
import { FORWARD_MSG, GROUP, PRIVATE } from './models';
import { DEFAULT_IMAGE } from '../../Layout/HomePage/HomePage';
import { SET_FORWARD_MSG } from '../../../redux/constants/chatConstants';
// import { ReactComponent as SendSvg } from '../../../assets/media/heroicons/solid/arrow-narrow-right.svg';
import { ForwardMessageToChats } from '../../../utils/wssConnection/wssConnection';

export const ForwardMessage = (props) => {
    const dispatch = useDispatch();
    const { name } = useSelector((state) => state.model);
    const { user } = useSelector((state) => state.user);
    const { activeChat, chatList } = useSelector((state) => state.chat);
    const [chatsList, setChatsList] = useState(chatList);
    const [searchUser, setSearchUser] = useState("");
    const newUser = useDebounce(searchUser, 500);

    const [checked, setChecked] = useState([]);


    useEffect(() => {
        setChatsList(chatList);
    }, [newUser, chatList]);

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

    const getSendToUsers = (chat) => {
        let array = chat.chatusers;
        if (chat.type === GROUP) {
            return array.filter(x => x.userId !== user.id).map((item) => item.userId);
        }
        return (array.filter(x => x.userId !== user.id)[0].userId);
    }

    const onSendForward = () => {
        // console.log("checked", checked);
        const chats = [];
        for (let index = 0; index < checked.length; index++) {
            const chatIndex = chatList.findIndex((item) => item.id === checked[index]);
            if (chatIndex !== -1) {
                const chatData = chatList[chatIndex];
                chats.push({
                    chatId: chatData.id,
                    type: chatData.type,
                    sendTo: getSendToUsers(chatData)
                })
            }
        }
        ForwardMessageToChats({
            messageData: activeChat.forwardMsg,
            chats
        });
        onCloseHandler();
    }

    const onCloseHandler = () => {
        dispatch(changeModel(""));
        dispatch({ type: SET_FORWARD_MSG, payload: null });
    }
    if (activeChat.forwardMsg)
        return (<>
            <div className={`modal modal-lg-fullscreen fade ${name === FORWARD_MSG ? 'show d-block' : ''}`} data-toggle="modal" id="startConversation" tabIndex={-1} role="dialog" aria-labelledby="startConversationLabel" aria-modal="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-dialog-zoom">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="startConversationLabel">Forward To...</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onCloseHandler}>
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
                                        {chatsList.map((item) => {
                                            if (item.type === GROUP) {
                                                const { name, image } = item;
                                                return (
                                                    <li className="list-group-item" key={item.id} onClick={() => { }}>
                                                        <div className="media">
                                                            <div className={`avatar avatar-${item.profileStatus} mr-2`}>
                                                                <img src={image ? image : DEFAULT_IMAGE} alt="" />
                                                            </div>
                                                            <div className="media-body">
                                                                <h6 className="text-truncate">
                                                                    <div className="text-reset username-text">{name}</div>
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
                                                    </li>);
                                            } else if (item.type === PRIVATE) {
                                                const { name, profilePicture } = item.chatusers.filter(x => x.userId !== user.id)[0]?.user;
                                                return (
                                                    <li className="list-group-item" key={item.id} onClick={() => { }}>
                                                        <div className="media">
                                                            <div className={`avatar mr-2`}>
                                                                <img src={profilePicture ? profilePicture : DEFAULT_IMAGE} alt="" />
                                                            </div>
                                                            <div className="media-body">
                                                                <h6 className="text-truncate">
                                                                    <div className="text-reset username-text">{name}</div>
                                                                </h6>
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
                                                    </li>);
                                            }
                                            return null;
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {!!checked.length &&
                            <div className="modal-footer text-right">
                                <button className="btn btn-primary send-icon text-light p-4_8" onClick={onSendForward}>
                                    Send
                                </button>
                            </div>}
                    </div>
                </div>
            </div>
        </>);
}
