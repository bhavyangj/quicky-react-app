import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getFilesData } from '../../../redux/actions/chatAction';
import { changeModel } from '../../../redux/actions/modelAction';
import { SET_DOCUMENT_FILES, SET_MEDIA_FILES, SET_MEDIA_FILE_TYPE, SET_PDF_URL } from '../../../redux/constants/chatConstants';
import useDebounce from '../../hooks/useDebounce';
import { onImageGalleryOpen } from '../Main/UserChat/message/Message';
import { MEDIA_FILES, PDF_VIEWER } from './models';
let isApiCalling = false;
export const MEDIA = "MEDIA";
export const DOCUMENT = "DOCUMENT";

export const MediaFiles = () => {
    const dispatch = useDispatch();
    const { filesType, activeChat } = useSelector((state) => state.chat);
    const { name } = useSelector((state) => state.model);

    const changeTabHandler = (type) => {
        dispatch({ type: SET_MEDIA_FILE_TYPE, payload: type });
    }

    const getFiles = async () => {
        isApiCalling = true;
        const res = await getFilesData(activeChat.id, filesType.toLowerCase(), "");
        if (res.status === 1)
            dispatch((filesType === MEDIA) ? { type: SET_MEDIA_FILES, payload: res.data.rows }
                : { type: SET_DOCUMENT_FILES, payload: res.data.rows });
        isApiCalling = false;
    }

    useEffect(() => {
        if (!isApiCalling)
            getFiles();
        //eslint-disable-next-line
    }, [filesType]);

    const onCloseModel = () => {
        dispatch(changeModel(""));
        getFiles();
    }

    return (
        <div className={`modal modal-lg-fullscreen fade ${name === MEDIA_FILES ? 'show d-block' : ''}`} data-toggle="modal" id="startConversation" tabIndex={-1} role="dialog" aria-labelledby="startConversationLabel" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-dialog-zoom">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="startConversationLabel">Chat Files</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => onCloseModel()}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body p-0 hide-scrollbar">
                        <div className="row">
                            <div className='col-12'>
                                <div className='custom-tab'>
                                    <ul className="nav nav-tabs justify-content-center mb-3" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className={`nav-link ${filesType === MEDIA ? 'active' : ''}`} data-mdb-toggle="tab" role="tab"
                                                aria-selected={filesType === MEDIA} onClick={() => changeTabHandler(MEDIA)}>Media</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className={`nav-link ${filesType === DOCUMENT ? 'active' : ''}`} data-mdb-toggle="tab" role="tab"
                                                aria-selected={filesType === DOCUMENT} onClick={() => changeTabHandler(DOCUMENT)}>Document</button>
                                        </li>
                                    </ul>
                                    <div className="tab-content">
                                        {filesType === MEDIA && <div className="tab-pane fade show active" role="tabpanel">
                                            <MediaImageFiles />
                                        </div>}
                                        {filesType === DOCUMENT && <div className="tab-pane fade show active" role="tabpanel">
                                            <DocumentFiles />
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const MediaImageFiles = () => {
    const dispatch = useDispatch();
    const { activeChat, mediaFiles, filesType } = useSelector((state) => state.chat);
    const [search, setSearch] = useState("");
    const newSearch = useDebounce(search, 500);

    const getFiles = async (newSearch) => {
        isApiCalling = true;
        const res = await getFilesData(activeChat.id, filesType.toLowerCase(), newSearch.trim());
        if (res.status === 1)
            dispatch({ type: SET_MEDIA_FILES, payload: res.data.rows });
        isApiCalling = false;
    }
    useEffect(() => {
        if (!isApiCalling)
            getFiles(newSearch);
        //eslint-disable-next-line
    }, [newSearch]);

    const onClickImage = (itemId) => {
        onImageGalleryOpen(itemId, dispatch);
    }
    return (<>
        <form className="form-inline mb-2">
            <div className="input-group">
                <input type="text"
                    className="form-control search border-right-0 transparent-bg pr-0"
                    placeholder="Search Files"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="input-group-append">
                    <div className="input-group-text transparent-bg border-left-0"
                        role="button">
                        <svg className="text-muted hw-20" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>
        </form>
        <div className="media-wrapper">
            {mediaFiles !== undefined && mediaFiles.length > 0 && mediaFiles.map((item, index) => {
                const itemType = item.mediaType.split("/").shift();
                return (<div className="media-image" key={item.id}>
                    {itemType === "image" ?
                        <div className="cursor-pointer mb-2" onClick={() => onClickImage(item.id)}>
                            <img src={mediaFiles[index]?.mediaUrl} className="img-fluid rounded border" alt="" />
                        </div>
                        : itemType === "video" ? <div className="cursor-pointer mb-2">
                            <video className="img-fluid rounded border" onClick={() => onClickImage(item.id)}>
                                <source src={item.mediaUrl} type="video/mp4" />
                                <source src={item.mediaUrl} type="video/ogg" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                            : itemType === "audio" && <>{/* <div className="cursor-pointer">
                                <img src={files[index]?.original} className="img-fluid rounded border max-height-84" alt="" /> 
                            </div>*/}</>}
                </div>);
            })}
        </div>
    </>)
}
const DocumentFiles = () => {
    const dispatch = useDispatch();
    const { activeChat, documentFiles, filesType } = useSelector((state) => state.chat);
    const [search, setSearch] = useState("");
    const newSearch = useDebounce(search, 500);
    const openPdfViewer = (item) => {
        dispatch(changeModel(PDF_VIEWER));
        dispatch({ type: SET_PDF_URL, payload: item.mediaUrl, fileName: item.fileName });
    }
    const getFiles = async (newSearch) => {
        isApiCalling = true;
        const res = await getFilesData(activeChat.id, filesType.toLowerCase(), newSearch.trim());
        if (res.status === 1)
            dispatch({ type: SET_DOCUMENT_FILES, payload: res.data.rows });
        isApiCalling = false;
    }
    useEffect(() => {
        if (!isApiCalling)
            getFiles(newSearch);
        //eslint-disable-next-line
    }, [newSearch]);

    return (<>
        <form className="form-inline mb-2">
            <div className="input-group">
                <input type="text"
                    className="form-control search border-right-0 transparent-bg pr-0"
                    placeholder="Search Files"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="input-group-append">
                    <div className="input-group-text transparent-bg border-left-0"
                        role="button">
                        <svg className="text-muted hw-20" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>
        </form>
        <div className="form-row">
            <div className='col-12'>
                <ul className="list-group list-group-flush">
                    {documentFiles !== undefined && documentFiles?.length > 0 && documentFiles.map((item, index) => {
                        return (<DocumentFile item={item} key={index} file={documentFiles[index]} openPdfViewer={openPdfViewer} />);
                    })}
                </ul>
            </div>

        </div>
    </>);
}

export const DocumentFile = (props) => {
    // const [isMenuOpen, setMenu] = useState(false);
    // const dropdownRef = useDetectClickOutside({ onTriggered: () => setMenu(false) });

    return (<li className="list-group-item">
        <div className="document">
            {props.file.mediaType.split("/").reverse()[0] === "pdf" ?
                <div onClick={() => { props.openPdfViewer(props.item) }} className="btn btn-primary btn-icon rounded-circle text-light mr-2">
                    <svg className="hw-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                </div>
                : <a href={props.file.mediaUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-icon rounded-circle text-light mr-2">
                    <svg className="hw-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                </a>}
            <div className="document-body">
                <h6 className="text-truncate">
                    <div className="text-reset" title={props.file.fileName}>{props.file.fileName}</div>
                </h6>
                <ul className="list-inline small mb-0">
                    {/* <li className="list-inline-item">
                        <span className="text-muted">79.2 KB</span>
                    </li> */}
                    <li className="list-inline-item">
                        <span className="text-muted text-uppercase">{props.file.mediaType?.split("/").reverse()[0]}</span>
                    </li>
                </ul>
            </div>
            {/* <div className="document-options ml-1">
                <div className={`dropdown ${isMenuOpen ? 'show' : ''}`} ref={dropdownRef}>
                    <button className="btn btn-secondary btn-icon btn-minimal btn-sm text-muted" type="button" aria-expanded={isMenuOpen} onClick={() => setMenu(!isMenuOpen)}>
                        <svg className="hw-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                    <div className={`dropdown-menu ${isMenuOpen ? 'show' : ''}`} style={{ transform: 'translate(-162px, -122px)' }}>
                        <div className="dropdown-item">Download</div>
                        <div className="dropdown-item">Share</div>
                        <div className="dropdown-item">Delete</div>
                    </div>
                </div>
            </div> */}
        </div>
    </li>)
}
