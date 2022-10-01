import React, { useEffect, useLayoutEffect, useState } from 'react'
import * as momentTimzone from 'moment-timezone';
import { useDispatch, useSelector } from 'react-redux';
import { ChatHeader } from './header/ChatHeader';
import { SearchBar } from './message/SearchBar';
import { ChatMessages } from './message/ChatMessages';
import { ChatFooter, EMERGENCY, ROUTINE, URGENT } from './footer/ChatFooter';
import { DROP_ZONE, GROUP, PRIVATE } from '../../Models/models';
import './footer/css/TaskMenu.css';
import { GroupChatInfo } from './info/group-chat-info/GroupChatInfo';
import { PrivateChatInfo } from './info/private-chat-info/PrivateChatInfo';
import { changeModel, onSetPasteFiles } from '../../../../redux/actions/modelAction';

export const UserChat = () => {
    const dispatch = useDispatch();
    const { activeChat, messages } = useSelector((state) => state.chat);
    const [chatInfoVisible, setChatInfoVisible] = useState(false);
    const [isSearchOpen, setSearch] = useState({
        isOpen: false
    });
    const [messagesList, setMessagesList] = useState([]);
    const [quoteMessage, setQuoteMessage] = useState();
    const [editMessage, setEditMessage] = useState();
    const [messageStatus, setMessageStatus] = useState(false);

    useEffect(() => {
        setMessagesList(messages.data.rows);
    }, [messages]);

    // useEffect(() => {
    //     receiveMessage(activeChat && activeChat.id, dispatch, user && user.id, chatList, navigate);
    // }, [activeChat, activeChat.id, chatList, user, dispatch, navigate]);

    useLayoutEffect(() => {
        if (isSearchOpen.isOpen)
            setSearch({ isOpen: false });
        setMessagesList([]);
        setChatInfoVisible(false);
        setQuoteMessage();
        setEditMessage();
        //eslint-disable-next-line
    }, [activeChat.id, dispatch]);

    // history was here (back button)

    const OnPasteEvent = e => {
        if (e.clipboardData.files.length) {
            dispatch(onSetPasteFiles(e.clipboardData.files));
            dispatch(changeModel(DROP_ZONE));
        } else {
            console.log('No image data was found in your clipboard. Copy an image first or take a screenshot.');
        }
    }

    return (<div className="chats">
        <div className="chat-body position-relative" onPaste={OnPasteEvent}>
            <ChatHeader isSearchOpen={isSearchOpen} setSearch={setSearch} setChatInfoVisible={setChatInfoVisible} />
            <SearchBar isSearchOpen={isSearchOpen} setSearch={setSearch} />
            <ChatMessages messagesList={messagesList} isSearchOpen={isSearchOpen} setMessagesList={setMessagesList} quoteMessage={quoteMessage} setQuoteMessage={setQuoteMessage} messageStatus={messageStatus} setMessageStatus={setMessageStatus} setEditMessage={setEditMessage} />
            <ChatFooter setQuote={setQuoteMessage} quoteMessage={quoteMessage} setMessageStatus={setMessageStatus} messageStatus={messageStatus} editMessage={editMessage} setEditMessage={setEditMessage} />
        </div>
        {activeChat.type === GROUP ?
            <GroupChatInfo chatInfoVisible={chatInfoVisible} setChatInfoVisible={setChatInfoVisible} /> :
            activeChat.type === PRIVATE ? <PrivateChatInfo chatInfoVisible={chatInfoVisible} setChatInfoVisible={setChatInfoVisible} /> : <></>
        }
    </div>);
}

export const getDateLabel = (date) => {
    if (momentTimzone(new Date()).format("MM/DD/YY") === date)
        return `Today`;
    if (momentTimzone(new Date(Date.now() - 24 * 60 * 60 * 1000)).format("MM/DD/YY") === date)
        return `Yesterday`;
    else return date;
}

export const getBackgroundColorClass = (item) => {
    switch (item) {
        case ROUTINE: return 'bg-routine';
        case EMERGENCY: return 'bg-emergency';
        case URGENT: return 'bg-urgent';
        case "q-" + ROUTINE: return 'bg-q-routine';
        case "q-" + EMERGENCY: return 'bg-q-emergency';
        case "q-" + URGENT: return 'bg-q-urgent';
        default: return 'bg-routine';
    }
}

