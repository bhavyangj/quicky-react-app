import React, { useState } from 'react'
import { getBackgroundColorClass, getDateLabel } from '../Main/UserChat/UserChat';
import { getMediaSVG } from '../Sidebar/ChatsContentSidebarList';
import * as momentTimzone from 'moment-timezone';
import { onImageGalleryOpen } from '../Main/UserChat/message/Message';
import { useDispatch } from 'react-redux';
import { changeModel, changeTask } from '../../../redux/actions/modelAction';
import { PDF_VIEWER } from '../Models/models';
import { SET_PDF_URL } from '../../../redux/constants/chatConstants';
import { getResponseofThread, setThreadMessage } from '../../../redux/actions/chatAction';
import { messageRef, pageScroll } from '../Main/UserChat/message/ChatMessages';

export const Thread = ({ user, item, level }) => {
    const dispatch = useDispatch();
    const [show, toggleShow] = useState(false);
    const [resMessages, setResMessages] = useState([]);

    const onClickToggle = (show) => {
        toggleShow(show);
        if (show) {
            const getData = async () => {
                const res = await getResponseofThread(item.id);
                if (res.status === 1) setResMessages(res.data.rows);
            }
            getData();
        }
    }

    const onClickTaskHandler = (task) => {
        if (messageRef[task.id] !== undefined) {
            dispatch(changeTask(""));
            dispatch(setThreadMessage({ id: -1 }));
            pageScroll(messageRef[task.id], { behavior: "smooth" });
            const classes = messageRef[task.id].current.className;
            messageRef[task.id].current.classList += " blink-quote-message ";
            setTimeout(() => {
                messageRef[task.id].current.classList = classes;
            }, 2000);
        } else {
            // console.error(task, " is not in the scope");
        }
    }

    return (<>
        <div key={item.id} data-bs-toggle="collapse" data-bs-target={`collapseExample-${item.id}`} aria-expanded="false" aria-controls="collapseExample"
            style={(level % 2 === 0) ? { backgroundColor: '#323333' } : { backgroundColor: '#383f44' }}>
            <div className={`message mb-0 pt-2 ${item.sendBy === user.id ? 'self self-thread-m1' : 'thread-m1'}`} key={item.id}>
                {/* Message Start */}
                <div className="message-wrapper">
                    {!item.mediaType &&
                        <div className={`message-content thread-main-message ${!item?.isMessage ? 'border-white' : ''} ${getBackgroundColorClass(item.type)}`}>
                            {/* quote message start */}
                            {(item.quotedMessageId && item?.quotedMessageDetail) && <div className="cursor-pointer">
                                {!item.quotedMessageDetail.mediaType ? <div className={`message-content quoted-message text-truncate ${getBackgroundColorClass("q-" + item.quotedMessageDetail.type)}`}>
                                    <h6 className='font-weight-bold message-subject text-truncate'>{`Subject: ${item.quotedMessageDetail.subject !== null ? item.quotedMessageDetail.subject : "-"}`}</h6>
                                    <h6 className='font-weight-medium message-patient text-truncate'>{`Patient: ${item.quotedMessageDetail.patient !== null ? item.quotedMessageDetail.patient : "-"}`}</h6>
                                    <p className='font-weight-lighter text-truncate'>{`${item.isMessage ? 'Message:' : 'Task:'} ${item.quotedMessageDetail.message}`}</p>
                                </div> : <>
                                    <div className="contacts-texts row">
                                        {getMediaSVG(item.quotedMessageDetail.mediaType.split("/")[0])}
                                        <p className="text-truncate">{item.quotedMessageDetail.fileName}</p>
                                    </div>
                                </>}
                                <div>{`${item.quotedMessageDetail.sendByDetail.name}, ${getDateLabel(momentTimzone(item.createdAt).format("MM/DD/YY")) + ' at ' + momentTimzone(item.quotedMessageDetail.createdAt).format("hh:mm A")}`}</div>
                                <hr style={{ backgroundColor: 'white', margin: '.5rem 0' }} />
                            </div>}
                            {/* quote message end */}
                            <h6 className='font-weight-bold message-subject'>{`Subject: ${item.subject !== null ? item.subject : "-"}`}</h6>
                            <h6 className='font-weight-medium message-patient'>{`Patient: ${item.patient !== null ? item.patient : "-"}`}</h6>
                            <span className='font-weight-lighter'>{`${item.isMessage ? 'Message:' : 'Task:'} ${item.message}`}</span>
                        </div>}
                    {(item.mediaType && (item.mediaType.split("/")[0] === "image" || item.mediaType.split("/")[0] === "video")) && <div className={`message-content h-200 ${getBackgroundColorClass(item.type)}`}>
                        <div className="form-row">
                            <div className="col">
                                <div className="popup-media">
                                    {item.mediaType.split("/")[0] === "image" &&
                                        <img className="img-fluid rounded hw-200" src={item.mediaUrl} alt="" onClick={() => onImageGalleryOpen(item.id, dispatch)} />}
                                    {item.mediaType.split("/")[0] === "video" &&
                                        <video width="320" height="240" controls>
                                            <source src={item.mediaUrl} type="video/mp4" />
                                            <source src={item.mediaUrl} type="video/ogg" />
                                            Your browser does not support the video tag.
                                        </video>}
                                </div>
                            </div>
                        </div>
                    </div>}
                    {(item.mediaType && (item.mediaType.split("/")[0] === "application" || item.mediaType.split("/")[0] === "text")) && <div className={`message-content ${getBackgroundColorClass(item.type)}`}>
                        <div className="document">
                            {item.mediaType.split("/").reverse()[0] === "pdf" ?
                                <div onClick={() => {
                                    dispatch(changeModel(PDF_VIEWER));
                                    dispatch({ type: SET_PDF_URL, payload: item.mediaUrl, fileName: item.fileName });
                                }} className="btn btn-primary btn-icon rounded-circle text-light mr-2">
                                    <svg className="hw-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                : <a href={item.mediaUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-icon rounded-circle text-light mr-2">
                                    <svg className="hw-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                    </svg>
                                </a>}
                            <div className="document-body">
                                <h6>
                                    <div className="text-reset" title="global-warming-data-2020.xlxs">{item.fileName}</div>
                                </h6>
                                <ul className="list-inline small mb-0">
                                    <li className="list-inline-item">
                                        <span className="text-muted text-uppercase">{item?.fileName?.split(".").reverse()[0]}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>}
                    {item.mediaType && item.mediaType.split("/")[0] === "audio" && <div className={`message-content ${getBackgroundColorClass(item.type)}`}>
                        <div className="document">
                            <audio controls>
                                <source src={item.mediaUrl} type="audio/ogg" />
                                <source src={item.mediaUrl} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    </div>}
                </div>
                {/* <!-- Message Options --> */}
                <div className="message-options">
                    {/* <div className="avatar avatar-sm">
                        <img alt="" src={item?.sendByDetail?.profilePicture} style={{ transform: 'scale(0.68)' }} />
                    </div> */}
                    <span className="message-date text-capitalize">{`${item.sendByDetail.name} ${momentTimzone(item.createdAt).format("hh:mm A")}`}</span>
                    {item.quotedMessageDetailData.length > 0 && <span className="message-date">{`${item.quotedMessageDetailData.length} Reply`}</span>}
                    {!show && item.quotedMessageDetailData.length > 0 && <span className="message-date text-capitalize" role="button" onClick={() => onClickToggle(true)}><svg height="20" width="20" fill='currentColor'><path d="M10 13.354Q11.583 13.354 12.688 12.25Q13.792 11.146 13.792 9.562Q13.792 7.979 12.688 6.875Q11.583 5.771 10 5.771Q8.417 5.771 7.312 6.875Q6.208 7.979 6.208 9.562Q6.208 11.146 7.312 12.25Q8.417 13.354 10 13.354ZM10 11.812Q9.062 11.812 8.406 11.156Q7.75 10.5 7.75 9.562Q7.75 8.625 8.406 7.969Q9.062 7.312 10 7.312Q10.938 7.312 11.594 7.969Q12.25 8.625 12.25 9.562Q12.25 10.5 11.594 11.156Q10.938 11.812 10 11.812ZM10 15.833Q6.938 15.833 4.448 14.125Q1.958 12.417 0.833 9.562Q1.958 6.708 4.458 5.021Q6.958 3.333 10 3.333Q13.042 3.333 15.542 5.021Q18.042 6.708 19.167 9.562Q18.042 12.417 15.552 14.125Q13.062 15.833 10 15.833ZM10 9.562Q10 9.562 10 9.562Q10 9.562 10 9.562Q10 9.562 10 9.562Q10 9.562 10 9.562Q10 9.562 10 9.562Q10 9.562 10 9.562Q10 9.562 10 9.562Q10 9.562 10 9.562ZM10 14.083Q12.333 14.083 14.281 12.865Q16.229 11.646 17.25 9.562Q16.229 7.479 14.281 6.281Q12.333 5.083 10 5.083Q7.667 5.083 5.708 6.281Q3.75 7.479 2.729 9.562Q3.75 11.646 5.708 12.865Q7.667 14.083 10 14.083Z" /></svg></span>}
                    {show && <span className="message-date text-capitalize" role="button" onClick={() => onClickToggle(false)}><svg height="20" width="20" fill='currentColor'><path d="M13.521 11.021 12.25 9.75Q12.333 8.75 11.604 7.979Q10.875 7.208 9.812 7.312L8.542 6.042Q8.896 5.896 9.26 5.833Q9.625 5.771 10 5.771Q11.583 5.771 12.688 6.875Q13.792 7.979 13.792 9.562Q13.792 9.979 13.719 10.354Q13.646 10.729 13.521 11.021ZM16.167 13.646 14.917 12.417Q15.667 11.833 16.25 11.146Q16.833 10.458 17.25 9.562Q16.229 7.479 14.292 6.281Q12.354 5.083 10 5.083Q9.396 5.083 8.885 5.156Q8.375 5.229 7.875 5.375L6.5 4Q7.354 3.646 8.208 3.49Q9.062 3.333 10 3.333Q13.146 3.333 15.615 5.052Q18.083 6.771 19.167 9.562Q18.688 10.792 17.917 11.823Q17.146 12.854 16.167 13.646ZM16.396 18.854 12.938 15.396Q12.208 15.625 11.479 15.729Q10.75 15.833 10 15.833Q6.833 15.833 4.375 14.094Q1.917 12.354 0.833 9.562Q1.25 8.479 1.917 7.552Q2.583 6.625 3.417 5.875L1.125 3.562L2.375 2.354L17.625 17.625ZM4.604 7.062Q4.021 7.604 3.542 8.219Q3.062 8.833 2.729 9.562Q3.75 11.646 5.688 12.865Q7.625 14.083 10 14.083Q10.354 14.083 10.74 14.052Q11.125 14.021 11.479 13.938L10.812 13.271Q10.625 13.312 10.417 13.333Q10.208 13.354 10 13.354Q8.417 13.354 7.312 12.25Q6.208 11.146 6.208 9.562Q6.208 9.354 6.24 9.167Q6.271 8.979 6.312 8.771ZM11.375 8.875Q11.375 8.875 11.375 8.875Q11.375 8.875 11.375 8.875Q11.375 8.875 11.375 8.875Q11.375 8.875 11.375 8.875Q11.375 8.875 11.375 8.875Q11.375 8.875 11.375 8.875ZM8.042 10.5Q8.042 10.5 8.042 10.5Q8.042 10.5 8.042 10.5Q8.042 10.5 8.042 10.5Q8.042 10.5 8.042 10.5Q8.042 10.5 8.042 10.5Q8.042 10.5 8.042 10.5Z" /></svg></span>}
                    <span className="message-date text-capitalize" role="button" onClick={() => onClickTaskHandler(item)}>
                        <svg height="20" width="20" fill='currentColor'><path d="M7.375 14.375 3 10 7.375 5.625 8.438 6.688 5.875 9.25H14.5V7H16V10.75H5.875L8.438 13.312Z" /></svg>
                    </span>
                </div>
                {/* <!-- Message End --> */}
            </div>
            {show && <div className="collapse show mx-0" id={`collapseExample-${item.id}`}>
                <div className="card card-body todo-container thread-container vertical-scrollable border-radius-14-wh">
                    {resMessages.map((item) => {
                        return (<Thread key={item.id} user={user} item={item} level={level + 1} />)
                    })}
                </div>
            </div>}
        </div></>
    )
}
