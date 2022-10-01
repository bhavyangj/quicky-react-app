import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { changeModel, changeTask } from '../../../redux/actions/modelAction'
import { getBackgroundColorClass } from '../Main/UserChat/UserChat';
import { PDF_VIEWER, THREAD_ITEM } from '../Models/models';
import { SET_PDF_URL } from '../../../redux/constants/chatConstants';
import { onImageGalleryOpen } from '../Main/UserChat/message/Message';
import { getResponseofThread, setThreadMessage } from '../../../redux/actions/chatAction';
import { Thread } from './Thread';

export const ThreadMessage = ({ taskName, dispatch }) => {
    const { threadMessage } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.user);
    const [resMessages, setResMessages] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const res = await getResponseofThread(threadMessage.id);
            if (res.status === 1) setResMessages(res.data.rows);
        }
        if (threadMessage.id !== -1) getData();
    }, [threadMessage]);

    return (
        <div className={`tab-pane h-100 w-100 ${taskName === THREAD_ITEM ? 'active' : ''}`} id="thradmessage" role="tabpanel" aria-labelledby="thread-tab">
            <div className="appnavbar-content-wrapper">
                <div className="appnavbar-scrollable-wrapper vertical-scrollable">
                    <div className="appnavbar-heading sticky-top">
                        <ul className="nav justify-content-between align-items-center">
                            <li className="text-center">
                                <h5 className="text-truncate mb-0">Message Threads</h5>
                            </li>
                            <li className="cursor-pointer close-btn" onClick={() => { dispatch(changeTask("")); dispatch(setThreadMessage({ id: -1 })); setResMessages([]) }}>
                                <div>
                                    <svg className="hw-22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </div>
                            </li>
                        </ul>
                    </div>
                    {threadMessage.id !== -1 &&
                        <div className="appnavbar-body" style={{ fontSize: '14px' }}>
                            <div className="appnavbar-body-title row">
                                <div className={`message m-auto ${threadMessage.sendBy === user.id ? 'self' : ''}`.trim()}>
                                    <div className="message-wrapper">
                                        {!threadMessage?.mediaType &&
                                            <>
                                                {/* <MessageContent
                                                    DisableOpt={true}
                                                    item={threadMessage}
                                                    user={user}
                                                    dispatch={dispatch} /> */}
                                                <div className={`message-content thread-main-message ${!threadMessage?.isMessage ? 'border-white' : ''} ${getBackgroundColorClass(threadMessage.type)}`}>
                                                    <h6 className='font-weight-bold message-subject'>{`Subject: ${threadMessage.subject !== null ? threadMessage.subject : "-"}`}</h6>
                                                    <h6 className='font-weight-medium message-patient'>{`Patient: ${threadMessage.patient !== null ? threadMessage.patient : "-"}`}</h6>
                                                    <span className='font-weight-lighter'>{`${threadMessage.isMessage ? 'Message:' : 'Task:'} ${threadMessage.message}`}</span>
                                                </div>
                                            </>}
                                        {(threadMessage.mediaType && (threadMessage.mediaType.split("/")[0] === "image" || threadMessage.mediaType.split("/")[0] === "video")) && <div className={`message-content h-200 ${getBackgroundColorClass(threadMessage.type)}`}>
                                            <div className="form-row">
                                                <div className="col">
                                                    <div className="popup-media">
                                                        {threadMessage.mediaType.split("/")[0] === "image" &&
                                                            <img className="img-fluid rounded hw-200" src={threadMessage.mediaUrl} alt="" onClick={() => onImageGalleryOpen(threadMessage.id, dispatch)} />}
                                                        {threadMessage.mediaType.split("/")[0] === "video" &&
                                                            <video className='hw-video' controls>
                                                                <source src={threadMessage.mediaUrl} type="video/mp4" />
                                                                <source src={threadMessage.mediaUrl} type="video/ogg" />
                                                                Your browser does not support the video tag.
                                                            </video>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>}
                                        {(threadMessage.mediaType && (threadMessage.mediaType.split("/")[0] === "application" || threadMessage.mediaType.split("/")[0] === "text")) && <div className={`message-content ${getBackgroundColorClass(threadMessage.type)}`}>
                                            <div className="document">
                                                {threadMessage.mediaType.split("/").reverse()[0] === "pdf" ?
                                                    <div onClick={() => {
                                                        dispatch(changeModel(PDF_VIEWER));
                                                        dispatch({ type: SET_PDF_URL, payload: threadMessage.mediaUrl, fileName: threadMessage.fileName });
                                                    }} className="btn btn-primary btn-icon rounded-circle text-light mr-2">
                                                        <svg className="hw-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                                        </svg>
                                                    </div>
                                                    : <a href={threadMessage.mediaUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-icon rounded-circle text-light mr-2">
                                                        <svg className="hw-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                                        </svg>
                                                    </a>}
                                                <div className="document-body">
                                                    <h6>
                                                        <div className="text-reset" title="global-warming-data-2020.xlxs">{threadMessage.fileName}</div>
                                                    </h6>
                                                    <ul className="list-inline small mb-0">
                                                        <li className="list-inline-threadMessage">
                                                            <span className="text-muted text-uppercase">{threadMessage?.fileName?.split(".").reverse()[0]}</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>}
                                        {threadMessage.mediaType && threadMessage.mediaType.split("/")[0] === "audio" && <div className={`message-content ${getBackgroundColorClass(threadMessage.type)}`}>
                                            <div className="document">
                                                <audio controls>
                                                    <source src={threadMessage.mediaUrl} type="audio/ogg" />
                                                    <source src={threadMessage.mediaUrl} type="audio/mpeg" />
                                                    Your browser does not support the audio element.
                                                </audio>
                                            </div>
                                        </div>}
                                    </div>
                                </div>
                            </div>
                            <div className="mr-auto text-white p-1">{`Total Messages: ${resMessages.length}`}</div>
                            <div className="todo-container thread-container vertical-scrollable">
                                {resMessages.map((item) => {
                                    return (<Thread key={item.id} user={user} item={item} level={0} />)
                                })}
                            </div>
                        </div>}
                </div>
            </div>
        </div>
    )
}
