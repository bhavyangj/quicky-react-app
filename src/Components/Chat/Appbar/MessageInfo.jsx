import React from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { changeModel, changeTask } from '../../../redux/actions/modelAction';
import { SET_PDF_URL } from '../../../redux/constants/chatConstants';
import { onImageGalleryOpen } from '../Main/UserChat/message/Message';
import { getBackgroundColorClass } from '../Main/UserChat/UserChat';
import { MESSAGE_INFO, PDF_VIEWER } from '../Models/models'
import { MessageReader } from './MessageInfo/MessageReader';

export const MessageInfo = ({ taskName, dispatch }) => {
    const { user } = useSelector((state) => state.user);
    const { infoMessage } = useSelector((state) => state.chat);
    const [isReadByCollapsed, setReadCollapse] = useState(false);
    const [isUnreadByCollapsed, setUnreadCollapse] = useState(false);
    const onCloseHandler = () => {
        dispatch(changeTask(""));
    }
    const readByArr = infoMessage?.recipents?.filter(item => item.isRead === true);
    const unreadByArr = infoMessage?.recipents?.filter(item => item.isRead === false);
    return (
        <div className={`tab-pane h-100 ${taskName === MESSAGE_INFO ? 'active' : ''}`} id="notes" role="tabpanel" aria-labelledby="notes-tab">
            <div className="appnavbar-content-wrapper">
                <div className="appnavbar-scrollable-wrapper">
                    <div className="appnavbar-heading sticky-top">
                        <ul className="nav justify-content-between align-items-center">
                            <li className="text-center">
                                <h5 className="text-truncate mb-0">Message info</h5>
                            </li>
                            <li className="nav-item list-inline-item close-btn" onClick={() => onCloseHandler()}>
                                <div data-appcontent-close="">
                                    <svg className="hw-22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </div>
                            </li>
                        </ul>
                    </div>
                    {infoMessage.id !== -1 &&
                        <div className="appnavbar-body">
                            <div className="appnavbar-body-title row">
                                <div className={`message m-auto ${infoMessage.sendBy === user.id ? 'self' : ''}`.trim()}>
                                    <div className="message-wrapper">
                                        {!infoMessage?.mediaType &&
                                            <>
                                                {/* <MessageContent
                                                    DisableOpt={true}
                                                    item={infoMessage}
                                                    user={user}
                                                    dispatch={dispatch} /> */}
                                                <div className={`message-content thread-main-message ${!infoMessage?.isMessage ? 'border-white' : ''} ${getBackgroundColorClass(infoMessage.type)}`}>
                                                    <h6 className='font-weight-bold message-subject'>{`Subject: ${infoMessage.subject !== null ? infoMessage.subject : "-"}`}</h6>
                                                    <h6 className='font-weight-medium message-patient'>{`Patient: ${infoMessage.patient !== null ? infoMessage.patient : "-"}`}</h6>
                                                    <span className='font-weight-lighter'>{`${infoMessage.isMessage ? 'Message:' : 'Task:'} ${infoMessage.message}`}</span>
                                                </div>
                                            </>}
                                        {(infoMessage.mediaType && (infoMessage.mediaType.split("/")[0] === "image" || infoMessage.mediaType.split("/")[0] === "video")) && <div className={`message-content h-200 ${getBackgroundColorClass(infoMessage.type)}`}>
                                            <div className="form-row">
                                                <div className="col">
                                                    <div className="popup-media">
                                                        {infoMessage.mediaType.split("/")[0] === "image" &&
                                                            <img className="img-fluid rounded hw-200" src={infoMessage.mediaUrl} alt="" onClick={() => onImageGalleryOpen(infoMessage.id, dispatch)} />}
                                                        {infoMessage.mediaType.split("/")[0] === "video" &&
                                                            <video className='hw-video' controls>
                                                                <source src={infoMessage.mediaUrl} type="video/mp4" />
                                                                <source src={infoMessage.mediaUrl} type="video/ogg" />
                                                                Your browser does not support the video tag.
                                                            </video>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>}
                                        {(infoMessage.mediaType && (infoMessage.mediaType.split("/")[0] === "application" || infoMessage.mediaType.split("/")[0] === "text")) && <div className={`message-content ${getBackgroundColorClass(infoMessage.type)}`}>
                                            <div className="document">
                                                {infoMessage.mediaType.split("/").reverse()[0] === "pdf" ?
                                                    <div onClick={() => {
                                                        dispatch(changeModel(PDF_VIEWER));
                                                        dispatch({ type: SET_PDF_URL, payload: infoMessage.mediaUrl, fileName: infoMessage.fileName });
                                                    }} className="btn btn-primary btn-icon rounded-circle text-light mr-2">
                                                        <svg className="hw-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                                        </svg>
                                                    </div>
                                                    : <a href={infoMessage.mediaUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-icon rounded-circle text-light mr-2">
                                                        <svg className="hw-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                                        </svg>
                                                    </a>}
                                                <div className="document-body">
                                                    <h6>
                                                        <div className="text-reset" title="global-warming-data-2020.xlxs">{infoMessage.fileName}</div>
                                                    </h6>
                                                    <ul className="list-inline small mb-0">
                                                        <li className="list-inline-infoMessage">
                                                            <span className="text-muted text-uppercase">{infoMessage?.fileName?.split(".").reverse()[0]}</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>}
                                        {infoMessage.mediaType && infoMessage.mediaType.split("/")[0] === "audio" && <div className={`message-content ${getBackgroundColorClass(infoMessage.type)}`}>
                                            <div className="document">
                                                <audio controls>
                                                    <source src={infoMessage.mediaUrl} type="audio/ogg" />
                                                    <source src={infoMessage.mediaUrl} type="audio/mpeg" />
                                                    Your browser does not support the audio element.
                                                </audio>
                                            </div>
                                        </div>}
                                    </div>
                                </div>
                            </div>

                            <div className="hide-scrollbar flex-fill">
                                {!!readByArr.length && <div className="chat-info-group">
                                    <div className={`chat-info-group-header ${isReadByCollapsed ? 'collapsed' : ''}`} data-toggle="collapse" role="button" aria-expanded={!isReadByCollapsed} aria-controls="participants-list" onClick={() => setReadCollapse(prev => !prev)}>
                                        <h6 className="m-2">Read By</h6>
                                    </div>
                                    <div className={`chat-info-group-body collapse ${!isReadByCollapsed ? 'show' : ''}`} id="participants-list">
                                        <div className="chat-info-group-content list-item-has-padding">
                                            <ul className="list-group list-group-flush">
                                                {readByArr.map((item) => {
                                                    return (<MessageReader item={item} key={item.id} />);
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </div>}
                                {!!unreadByArr.length && <div className="chat-info-group">
                                    <div className={`chat-info-group-header ${isUnreadByCollapsed ? 'collapsed' : ''}`} data-toggle="collapse" role="button" aria-expanded={!isUnreadByCollapsed} aria-controls="participants-list" onClick={() => setUnreadCollapse(prev => !prev)}>
                                        <h6 className="m-2">Not seen yet</h6>
                                    </div>
                                    <div className={`chat-info-group-body collapse ${!isUnreadByCollapsed ? 'show' : ''}`} id="participants-list">
                                        <div className="chat-info-group-content list-item-has-padding">
                                            <ul className="list-group list-group-flush">
                                                {unreadByArr.map((item) => {
                                                    return (<MessageReader item={item} key={item.id} />);
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </div>}
                            </div>
                        </div>}
                    {/* <div className="appnavbar-footer">
                        <div
                            className="btn btn-primary btn-block"
                            role="button"
                            data-toggle="modal"
                            data-target="#addNoteModal"
                            onClick={() => {
                                dispatch(changeTask(""))
                            }}
                        >Add new note</div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}
