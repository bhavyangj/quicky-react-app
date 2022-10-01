import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ReqAllGroupsList } from '../../utils/wssConnection/wssConnection';
// import { DEFAULT_IMAGE } from '../Layout/HomePage/HomePage';
// import classes from "../Tasks/TasksPage.module.css";

export const ChatsDropdown = ({ groupData, setGroupData }) => {
    const { AllGroups } = useSelector((state) => state.chat);
    const [groups, setAllGroups] = useState([]);

    useEffect(() => {
        ReqAllGroupsList();
    }, []);
    useEffect(() => {
        if (AllGroups) {
            setAllGroups(AllGroups);
        }
    }, [AllGroups]);
    return (<>
        <div className="dropdown mx-2">
            <button className="btn btn-outline-default btn-sm dropdown-toggle text-capitalize p-4_8" id="groupsDropdown" data-bs-toggle="dropdown">
                {groupData ? groupData.name : 'Select Group'}
            </button>
            <ul className="dropdown-menu m-0 all-groups-dropdown" aria-labelledby="groupsDropdown">
                {groups?.map((chat) => (
                    <li key={chat.id} className="dropdown-item" onClick={() => setGroupData(chat)}>{chat.name}</li>
                ))}
            </ul>
        </div>
        {/* <div className="dropdown flex-100">
            <div className="dropdown-toggle text-truncate d-flex align-items-center cursor-pointer" id="memberDropdown" data-bs-toggle="dropdown">
                <div id={`chat-${activeTaskChat?.id}`} className={`${classes.member}`} title={name}>
                    <img src={image ? image : DEFAULT_IMAGE} alt="m" />
                </div>
                <span className="text-capitalize ml-1 text-truncate width-limit-8">{name}</span>
            </div>
            <ul className="dropdown-menu m-0 position-absolute" aria-labelledby="memberDropdown">
                <li key={0} className="dropdown-item cursor-pointer pl-2 py-2" onClick={() => NewChatSelected("All Chats")}>
                    <div>All Chats</div>
                </li>
                {chatList.map((chat) => {
                    if (chat.type === GROUP) {
                        const { name, image } = chat;
                        return (
                            <li key={chat.id} className="dropdown-item cursor-pointer p-4_8" onClick={() => NewChatSelected(chat)}>
                                <div id={`chat-${chat.id}`} className={`${classes.member}`}>
                                    <img src={image ? image : DEFAULT_IMAGE} alt="m" />
                                </div>
                                <div className="text-capitalize ml-1 text-truncate width-limit-8">{name}</div>
                            </li>
                        )
                    }
                    else if (chat.type === PRIVATE) {
                        const { name, profilePicture } = chat.chatusers.filter(x => x.userId !== user.id)[0]?.user;
                        return (
                            <li key={chat.id} className="dropdown-item cursor-pointer p-4_8" onClick={() => NewChatSelected(chat)}>
                                <div id={`chat-${chat.id}`} className={`${classes.member}`}>
                                    <img src={profilePicture ? profilePicture : DEFAULT_IMAGE} alt="m" />
                                </div>
                                <div className="text-capitalize ml-1 text-truncate width-limit-8">{name}</div>
                            </li>)
                    }
                    return null;
                })}
            </ul>
        </div> */}
    </>);
}
