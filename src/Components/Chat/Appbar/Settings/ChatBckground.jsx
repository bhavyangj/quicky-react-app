import React from 'react'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ReactComponent as PhotographSvg } from "../../../../assets/media/heroicons/outline/photograph.svg";
import { ReactComponent as CancelSvg } from "../../../../assets/media/heroicons/outline/x.svg";
import { UPDATE_CHAT_BACKGROUND } from '../../../../redux/constants/chatConstants';
import { ReqUpdateBackground } from '../../../../utils/wssConnection/wssConnection';

export const ChatBckground = ({ user }) => {
    const dispatch = useDispatch();
    const changeBackground = (item) => {
        ReqUpdateBackground({
            colorCode: item.colorCode
        });
    }
    const setDefault = (item) => {
        ReqUpdateBackground({
            colorCode: '323331'
        });
    }
    const setNone = (item) => {
        ReqUpdateBackground({
            colorCode: 'none'
        });
    }

    useEffect(() => {
        dispatch({ type: UPDATE_CHAT_BACKGROUND, payload: { colorCode: user.chatWallpaper } });
        //eslint-disable-next-line
    }, []);

    return (
        <div className="chat-background-setting p-2">
            <div className="todo-title">
                <h6 className="">Chat Wallpaper</h6>
            </div>
            <div className='col p-0'>
                <button className="btn btn-outline text-white align-items-center font-weight-lighter text-left p-4_8" onClick={setNone}>
                    <CancelSvg />
                    <span className='ml-2'>Reset Default</span>
                </button>
                <button className="btn btn-outline text-white w-100 align-items-center font-weight-lighter text-left p-4_8" onClick={setDefault}>
                    <PhotographSvg />
                    <span className='ml-2'>Set Default Wallpaper</span>
                </button>
                <div className='solid-colors text-white'>
                    <span className='fs-14'>Solid Colors</span>
                    <div className="container">
                        {chatBackgrounds.map((item) => {
                            return (
                                <div key={item.id} className={`col-4 bg-color-demo w-${item.class}`} onClick={() => {
                                    changeBackground(item);
                                }}></div>
                            )
                        })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export const chatBackgrounds = [
    {
        id: 2,
        color: 'light',
        class: 'chat-light',
        colorCode: 'c6c9c4'
    },
    {
        id: 3,
        color: 'dark',
        class: 'chat-dark',
        colorCode: '323331'
    },
    {
        id: 4,
        color: 'purple',
        class: 'chat-purple',
        colorCode: '46475f'
    },
    {
        id: 5,
        color: 'green',
        class: 'chat-green',
        colorCode: '37483c'
    },
    {
        id: 6,
        color: 'brown',
        class: 'chat-brown',
        colorCode: '585341'
    },
    {
        id: 7,
        color: 'pink',
        class: 'chat-pink',
        colorCode: '584155'
    },
]