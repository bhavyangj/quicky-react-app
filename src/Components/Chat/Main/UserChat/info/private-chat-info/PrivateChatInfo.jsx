import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getFilesData } from '../../../../../../redux/actions/chatAction';
import { changeModel } from '../../../../../../redux/actions/modelAction';
import { SET_DOCUMENT_FILES, SET_MEDIA_FILES, SET_MEDIA_FILE_TYPE, SET_PDF_URL } from '../../../../../../redux/constants/chatConstants';
import { DEFAULT_IMAGE } from '../../../../../Layout/HomePage/HomePage';
import { DOCUMENT, DocumentFile, MEDIA } from '../../../../Models/MediaFiles';
import { MEDIA_FILES, PDF_VIEWER } from '../../../../Models/models';
import { onImageGalleryOpen } from '../../message/Message';

export const PrivateChatInfo = (props) => {
    const dispatch = useDispatch();
    const { activeChat, mediaFiles, documentFiles } = useSelector((state) => state.chat);
    const [isMediaCollapsed, setIsMediaCollapsed] = useState(false);
    const [isDocCollapsed, setIsDocCollapsed] = useState(false);
    const mediaRef = useRef();
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

    return (<div className={`chat-info ${props.chatInfoVisible ? 'chat-info-visible' : ''}`}>
        <div className="d-flex h-100 flex-column">
            <div className="chat-info-header px-2">
                <div className="container-fluid">
                    <ul className="nav justify-content-between align-items-center">
                        <li className="text-center">
                            <h5 className="text-truncate mb-0">Profile Details</h5>
                        </li>
                        <li className="nav-item list-inline-item">
                            <div className="nav-link text-muted px-0" data-chat-info-close="" onClick={() => props.setChatInfoVisible(false)}>
                                <svg className="hw-22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="hide-scrollbar flex-fill">
                <div className="text-center p-3">
                    <div className="avatar avatar-xl mx-5 mb-3">
                        <img className="avatar-img" src={activeChat.image ? activeChat.image : DEFAULT_IMAGE} alt="" />
                    </div>
                    <h5 className="mb-1">{activeChat.name}</h5>
                    <p className="text-muted d-flex align-items-center justify-content-center">
                        <svg className="hw-18 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>San Fransisco, CA</span>
                    </p>
                    <div className="d-flex align-items-center justify-content-center">
                        <div className="btn btn-outline-default btn-icon rounded-circle mx-1">
                            <svg className="hw-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <div className="btn btn-primary btn-icon rounded-circle text-light mx-1">
                            <svg className="hw-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <div className="btn btn-danger btn-icon rounded-circle text-light mx-1">
                            <svg className="hw-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="chat-info-group">
                    <a className="chat-info-group-header" data-toggle="collapse" href="#profile-info"
                        role="button" aria-expanded="true" aria-controls="profile-info">
                        <h6 className="mb-0">User Information</h6>
                        <svg className="hw-20 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </a>
                    <div className="chat-info-group-body collapse show" id="profile-info">
                        <div className="chat-info-group-content list-item-has-padding">
                            <ul className="list-group list-group-flush ">
                                <li className="list-group-item border-0">
                                    <p className="small text-muted mb-0">Phone</p>
                                    <p className="mb-0">+01-222-364522</p>
                                </li>
                                <li className="list-group-item border-0">
                                    <p className="small text-muted mb-0">Email</p>
                                    <p className="mb-0">catherine.richardson@gmail.com</p>
                                </li>
                                <li className="list-group-item border-0">
                                    <p className="small text-muted mb-0">Address</p>
                                    <p className="mb-0">1134 Ridder Park Road, San Fransisco, CA 94851</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="chat-info-group">
                    <div className={`chat-info-group-header ${isMediaCollapsed ? 'collapsed' : ''}`} data-toggle="collapse" href="#shared-media" role="button" aria-expanded={!isMediaCollapsed} aria-controls="shared-media" onClick={() => {
                        setIsMediaCollapsed(prev => !prev);
                    }}>
                        <h6 className="mb-0">Last Media</h6>
                        <svg className="hw-20 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div ref={mediaRef} className={`chat-info-group-body collapse ${!isMediaCollapsed ? 'show' : ''}`} id="shared-media">
                        <div className="chat-info-group-content">
                            {mediaFiles.length > 0 && <div className="media-wrapper">
                                {mediaFiles[0] && <div className="media-image">
                                    <div className="cursor-pointer"
                                        onClick={() => onImageGalleryOpen(mediaFiles[0].id, dispatch)}
                                    >
                                        <img src={mediaFiles[0]?.mediaUrl} className="img-fluid rounded border" alt="" />
                                    </div>
                                </div>}
                                {mediaFiles[1] && <div className="media-image">
                                    <div className="cursor-pointer"
                                        onClick={() => onImageGalleryOpen(mediaFiles[1].id, dispatch)}
                                    >
                                        <img src={mediaFiles[1]?.mediaUrl} className="img-fluid rounded border" alt="" />
                                    </div>
                                </div>}
                                {mediaFiles.length >= 3 && <div className="media-image">
                                    <div className="cursor-pointer" onClick={() => openMediaDocsHandler(MEDIA)}>
                                        <img src="./svg/arrow-right.svg" className="img-fluid rounded border" style={{ padding: '22px', height: '84px' }} alt="" />
                                    </div>
                                </div>}
                            </div>}
                        </div>
                    </div>
                </div>
                <div className="chat-info-group">
                    <div className={`chat-info-group-header ${isDocCollapsed ? 'collapsed' : ''}`} data-toggle="collapse" href="#shared-files" role="button" aria-expanded={!isDocCollapsed} aria-controls="shared-files" onClick={() => setIsDocCollapsed(prev => !prev)}>
                        <h6 className="mb-0">Documents</h6>
                        <svg className="hw-20 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
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
            </div>
        </div>
    </div>);
}
