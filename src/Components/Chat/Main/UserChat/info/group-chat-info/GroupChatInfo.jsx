import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getFilesData } from '../../../../../../redux/actions/chatAction';
import { changeModel } from '../../../../../../redux/actions/modelAction';
import { SET_DOCUMENT_FILES, SET_MEDIA_FILES, SET_MEDIA_FILE_TYPE, SET_PDF_URL } from '../../../../../../redux/constants/chatConstants';
import { RemoveUserGroup, setChatNotifyTimer } from '../../../../../../utils/wssConnection/wssConnection';
import { DEFAULT_IMAGE } from '../../../../../Layout/HomePage/HomePage';
import { DOCUMENT, DocumentFile, MEDIA } from '../../../../Models/MediaFiles';
import { ADD_USER_TO_GROUP, MEDIA_FILES, PDF_VIEWER, UPDATE_GROUP_DEATILS } from '../../../../Models/models';
import { onImageGalleryOpen } from '../../message/Message';
import { ChatMember } from './ChatMember';
import { UnreadUsers } from './UnreadUsers';
import { ReactComponent as PencilSvg } from "../../../../../../assets/media/heroicons/solid/pencil.svg";
import { ReactComponent as UserRemoveSvg } from "../../../../../../assets/media/heroicons/outline/external-link.svg";

export const GroupChatInfo = (props) => {
    const dispatch = useDispatch();
    const { activeChat, mediaFiles, documentFiles } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.user);
    const [isUsersCollapsed, setUserCollapsed] = useState(false);
    const [isMediaCollapsed, setIsMediaCollapsed] = useState(false);
    const [isDocCollapsed, setIsDocCollapsed] = useState(false);
    const [unraedReadTime, setTimeCollapsed] = useState(false);
    const isUserAdmin = activeChat.chatusers.filter(item => item.user.id === user.id)[0]?.isAdmin;
    const [timer, setTimer] = useState({
        routineHour: Number(activeChat.routineHour),
        emergencyHour: Number(activeChat.emergencyHour),
        urgentHour: Number(activeChat.urgentHour),
        routineMinute: Number(activeChat.routineMinute),
        emergencyMinute: Number(activeChat.emergencyMinute),
        urgentMinute: Number(activeChat.urgentMinute),
    });
    const [isRequesting, setRequesting] = useState(false);

    const openMediaDocsHandler = async (type) => {
        dispatch(changeModel(MEDIA_FILES));
        dispatch({ type: SET_MEDIA_FILE_TYPE, payload: type });
    }
    const openPdfViewer = (item) => {
        dispatch(changeModel(PDF_VIEWER));
        dispatch({ type: SET_PDF_URL, payload: item.mediaUrl, fileName: item.fileName });
    }
    const getMediaFiles = async () => {
        const res = await getFilesData(activeChat.id, MEDIA.toLowerCase(), "");
        dispatch({ type: SET_MEDIA_FILES, payload: res.data.rows });
    }
    const getDocFiles = async () => {
        const res = await getFilesData(activeChat.id, DOCUMENT.toLowerCase(), "");
        dispatch({ type: SET_DOCUMENT_FILES, payload: res.data.rows });
    }

    useEffect(() => {
        dispatch({ type: SET_MEDIA_FILES, payload: [] });
        dispatch({ type: SET_DOCUMENT_FILES, payload: [] });
        getMediaFiles();
        getDocFiles();
        //eslint-disable-next-line
    }, [activeChat.id, props.chatInfoVisible, dispatch]);

    useEffect(() => {
        setTimer({
            routineHour: Number(activeChat.routineHour),
            emergencyHour: Number(activeChat.emergencyHour),
            urgentHour: Number(activeChat.urgentHour),
            routineMinute: Number(activeChat.routineMinute),
            emergencyMinute: Number(activeChat.emergencyMinute),
            urgentMinute: Number(activeChat.urgentMinute),
        });
    }, [activeChat.routineHour, activeChat.emergencyHour, activeChat.urgentHour, activeChat.routineMinute, activeChat.emergencyMinute, activeChat.urgentMinute]);

    const onClickAddUser = () => {
        dispatch(changeModel(ADD_USER_TO_GROUP));
    }
    const onSubmithandler = () => {
        setRequesting(true);
        setChatNotifyTimer(activeChat.id, user.id, {
            routineHour: timer.routineHour,
            emergencyHour: timer.emergencyHour,
            urgentHour: timer.urgentHour,
            routineMinute: timer.routineMinute,
            emergencyMinute: timer.emergencyMinute,
            urgentMinute: timer.urgentMinute,
        });
        setRequesting(false);
    }

    const onClickgroupInfo = () => {
        dispatch(changeModel(UPDATE_GROUP_DEATILS));
    }
    const onClickLeaveGroup = () => RemoveUserGroup(activeChat.id, user.id)

    return (
        <div className={`chat-info ${props.chatInfoVisible ? 'chat-info-visible' : ''}`}>
            <div className="d-flex h-100 flex-column">
                <div className="chat-info-header px-2">
                    <div className="container-fluid">
                        <ul className="nav justify-content-between align-items-center">
                            <li className="text-center">
                                <h5 className="text-truncate mb-0">Group Details</h5>
                            </li>
                            <li className="nav-item list-inline-item">
                                <div className="nav-link text-muted px-0" onClick={() => props.setChatInfoVisible(false)}>
                                    <svg className="hw-22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="hide-scrollbar flex-fill">
                    <div className="border-bottom text-center p-3">
                        <div className="avatar bg-success text-light avatar-xl mx-5 mb-3 position-relative">
                            <img className="avatar-img" src={activeChat.image ? activeChat.image : DEFAULT_IMAGE} alt="" />
                        </div>
                        <h5 className="mb-1">{activeChat.name}</h5>
                        <p className="text-muted d-flex align-items-center justify-content-center">
                            <svg className="mr-1 hw-18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{`${activeChat.chatusers.length} Participants`}</span>
                        </p>
                        {<>
                            <div className="d-flex align-items-center justify-content-center">
                                {isUserAdmin && <>
                                    <div className="btn btn-outline-default btn-icon rounded-circle mx-1" onClick={() => onClickAddUser()}>
                                        <svg className="hw-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                    </div>
                                    <div className="btn btn-outline-default btn-icon rounded-circle mx-1" onClick={onClickgroupInfo}>
                                        <PencilSvg />
                                    </div>
                                </>}
                                <div
                                    className="btn btn-outline-default btn-icon rounded-circle mx-1 text-danger"
                                    onClick={onClickLeaveGroup}
                                    title="Leave from group"
                                >
                                    <UserRemoveSvg className='hw-20' />
                                </div>
                            </div>
                        </>}
                        <div className="chat-description text-left mt-1">
                            <span className='text-white fs-14'>
                                {activeChat?.description}
                            </span>
                        </div>
                    </div>
                    <div className="chat-info-group">
                        <div className={`chat-info-group-header ${isUsersCollapsed ? 'collapsed' : ''}`} data-toggle="collapse" role="button" aria-expanded={!isUsersCollapsed} aria-controls="participants-list" onClick={() => setUserCollapsed(prev => !prev)}>
                            <h6 className="mb-0">Group Participants</h6>
                            <svg className="hw-20 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div className={`chat-info-group-body collapse ${!isUsersCollapsed ? 'show' : ''}`} id="participants-list">
                            <div className="chat-info-group-content list-item-has-padding">
                                <ul className="list-group list-group-flush">
                                    {activeChat.chatusers.sort(compareName).map((item) => {
                                        return (<ChatMember item={item} key={item.userId} isUserAdmin={isUserAdmin} />);
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="chat-info-group">
                        <div className={`chat-info-group-header ${isMediaCollapsed ? 'collapsed' : ''}`} data-toggle="collapse" role="button" aria-expanded={!isMediaCollapsed} aria-controls="shared-media" onClick={() => setIsMediaCollapsed(prev => !prev)}>
                            <h6 className="mb-0">Last Media</h6>
                            <svg className="hw-20 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className={`chat-info-group-body collapse ${!isMediaCollapsed ? 'show' : ''}`} id="shared-media">
                            <div className="chat-info-group-content">
                                {mediaFiles.length > 0 &&
                                    <div className="media-wrapper">
                                        {mediaFiles[0] && <div className="media-image">
                                            <div className="cursor-pointer" onClick={() => onImageGalleryOpen(mediaFiles[0].id, dispatch)}>
                                                {mediaFiles[0].mediaType.split("/").shift() === "image" ?
                                                    <img src={mediaFiles[0]?.mediaUrl} className="img-fluid rounded border" alt="" />
                                                    : <video className="img-fluid rounded border">
                                                        <source src={mediaFiles[0].mediaUrl} type="video/mp4" />
                                                        <source src={mediaFiles[0].mediaUrl} type="video/ogg" />
                                                        Your browser does not support the video tag.
                                                    </video>}
                                            </div>
                                        </div>}
                                        {mediaFiles[1] && <div className="media-image">
                                            <div className="cursor-pointer" onClick={() => onImageGalleryOpen(mediaFiles[1].id, dispatch)}>
                                                {mediaFiles[1].mediaType.split("/").shift() === "image" ?
                                                    <img src={mediaFiles[1]?.mediaUrl} className="img-fluid rounded border" alt="" />
                                                    : <video className="img-fluid rounded border">
                                                        <source src={mediaFiles[1].mediaUrl} type="video/mp4" />
                                                        <source src={mediaFiles[1].mediaUrl} type="video/ogg" />
                                                        Your browser does not support the video tag.
                                                    </video>}
                                            </div>
                                        </div>}
                                        {mediaFiles.length > 2 && <div className="media-image">
                                            <div className="cursor-pointer" onClick={() => openMediaDocsHandler(MEDIA)}>
                                                <img src="./svg/arrow-right.svg" className="img-fluid rounded border" style={{ padding: '22px', height: '84px' }} alt="" />
                                            </div>
                                        </div>}
                                    </div>}
                            </div>
                        </div>
                    </div>
                    <div className="chat-info-group">
                        <div className={`chat-info-group-header ${isDocCollapsed ? 'collapsed' : ''}`} data-toggle="collapse" role="button" aria-expanded={!isDocCollapsed} aria-controls="shared-files" onClick={() => setIsDocCollapsed(prev => !prev)}>
                            <h6 className="mb-0">Documents</h6>
                            <svg className="hw-20 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className={`chat-info-group-body collapse ${!isDocCollapsed ? 'show' : ''}`} id="shared-files">
                            <div className="chat-info-group-content list-item-has-padding">
                                <ul className="list-group list-group-flush">
                                    {documentFiles[0] && <DocumentFile item={documentFiles[0]} key={0} file={documentFiles[0]} openPdfViewer={openPdfViewer} />}
                                    {documentFiles[1] && <DocumentFile item={documentFiles[1]} key={1} file={documentFiles[1]} openPdfViewer={openPdfViewer} />}
                                    {documentFiles[2] && <DocumentFile item={documentFiles[2]} key={2} file={documentFiles[2]} openPdfViewer={openPdfViewer} />}
                                    {documentFiles.length > 3 && <li className="list-group-item">
                                        <div className="document" onClick={() => openMediaDocsHandler(DOCUMENT)}>
                                            <div className="btn btn-primary btn-icon rounded-circle text-light mr-2">
                                                <img src="./svg/arrow-right.svg" className="img-fluid rounded border max-height-84" alt="" />
                                            </div>
                                            <div className="document-body">
                                                <p>View More</p>
                                            </div>
                                        </div>
                                    </li>}
                                </ul>
                            </div>
                        </div>
                    </div>
                    {isUserAdmin && <div className="chat-info-group">
                        <div className={`chat-info-group-header ${unraedReadTime ? 'collapsed' : ''}`} data-toggle="collapse" role="button" aria-expanded={!unraedReadTime} aria-controls="shared-files" onClick={() => setTimeCollapsed(prev => !prev)}>
                            <h6 className="mb-0">Set Timer</h6>
                            <svg className="hw-20 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className={`chat-info-group-body collapse ${!unraedReadTime ? 'show' : ''}`} id="unread-msgusers">
                            <div className="chat-info-group-content list-item-has-padding">
                                <ul className="list-group list-group-flush time-filters px-2">
                                    <div className="timer routine mb-2">
                                        <div className='row gutter-sm' >
                                            <div className='col-3'>
                                                <span className='item'>Routine</span>
                                            </div>
                                            <div className='col-9'>
                                                <div className='d-flex'>
                                                    <div className='input-group'>
                                                        <input type="number" className="form-control input-time" value={timer.routineHour} onChange={(e) => {
                                                            setTimer((prev) => { return { ...prev, routineHour: Number(e.target.value) } });
                                                        }} />
                                                        <span className="input-group-text text-white">Hr</span>
                                                    </div>
                                                    <div className='input-group'>
                                                        <input type="number" className="form-control input-time" value={timer.routineMinute} onChange={(e) => {
                                                            setTimer((prev) => { return { ...prev, routineMinute: Number(e.target.value) } });
                                                        }} />
                                                        <span className="input-group-text text-white">Min</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="timer emergency mb-2">
                                        <div className='row gutter-sm'>
                                            <div className='col-3'>
                                                <span className='item'>Emergency</span>
                                            </div>
                                            <div className='col-9'>
                                                <div className='d-flex'>
                                                    <div className='input-group'>
                                                        <input type="number" className="form-control input-time" value={timer.emergencyHour} onChange={(e) => {
                                                            setTimer((prev) => { return { ...prev, emergencyHour: Number(e.target.value) } })
                                                        }} />
                                                        <span className="input-group-text text-white">Hr</span>
                                                    </div>
                                                    <div className='input-group'>
                                                        <input type="number" className="form-control input-time" value={timer.emergencyMinute} onChange={(e) => {
                                                            setTimer((prev) => { return { ...prev, emergencyMinute: Number(e.target.value) } });
                                                        }} />
                                                        <span className="input-group-text text-white">Min</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="timer urgent mb-2">
                                        <div className='row gutter-sm'>
                                            <div className='col-3'>
                                                <span className='item'>Urgent</span>
                                            </div>
                                            <div className='col-9'>
                                                <div className='d-flex'>
                                                    <div className='input-group'>
                                                        <input type="number" className="form-control input-time" value={timer.urgentHour} onChange={(e) => {
                                                            setTimer((prev) => { return { ...prev, urgentHour: Number(e.target.value) } })
                                                        }} />
                                                        <span className="input-group-text text-white">Hr</span>
                                                    </div>
                                                    <div className='input-group'>
                                                        <input type="number" className="form-control input-time" value={timer.urgentMinute} onChange={(e) => {
                                                            setTimer((prev) => { return { ...prev, urgentMinute: Number(e.target.value) } });
                                                        }} />
                                                        <span className="input-group-text text-white">Min</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ul>
                                <div className="appnavbar-footer ml-2">
                                    {!isRequesting ? <div className="btn btn-primary submitbtn p-1" role="button" onClick={() => onSubmithandler()}>Save Timer</div>
                                        : <div className="btn btn-primary submitbtn p-1" style={{ opacity: '0.5' }}>Saving...</div>}
                                </div>
                                <div className="result-title mb-2">Users</div>
                                <ul className="list-group list-group-flush">
                                    {activeChat?.unreadUsersArr?.sort(compareUnreadUserName).map((item, index) => {
                                        return (<UnreadUsers item={item} key={index} />);
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </div >
    );
}

export const compareUnreadUserName = (a, b) => {
    if (a && b) {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
    }
    return 0;
};
export const compareName = (a, b) => {
    if (a && b) {
        if (a.user.name > b.user.name) return 1;
        if (a.user.name < b.user.name) return -1;
    }
    return 0;
};
