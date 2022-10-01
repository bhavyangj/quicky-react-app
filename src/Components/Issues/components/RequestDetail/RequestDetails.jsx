import moment from 'moment-timezone';
import React, { useState } from 'react'
import ReactImageVideoLightbox from "react-image-video-lightbox";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { IMAGE_INDEX } from '../../../../redux/constants/chatConstants';
import AttachmentCard from '../../../Tasks/TaskDetails/AttachmentCard';
import classes from "../../Issues.module.css";
import { ReactComponent as AttachmentSvg } from "../../../../assets/media/heroicons/outline/paper-clip.svg";
import { getPresignedUrl, uploadToS3 } from '../../../../utils/s3/s3Connection';
import { DeleteIssuesAttachment, SendAttachmentIssuesData } from '../../../../redux/actions/IssuesAction';
import { DELETE_ISSUE_ATTACHMENT, SET_ISSUES_ATTACHMENTS } from '../../../../redux/constants/issuesConstants';
import { RequestComments } from './RequestComments';
import { RequestSolution } from './RequestSolution';

export const RequestDetails = ({ onClose, requestData, setRequestDetail }) => {
    const dispatch = useDispatch();
    const [isImageShow, setImageShow] = useState(false);
    const { imageId } = useSelector((state) => state.chat);
    const onCloseImageHandler = () => {
        setImageShow(false);
        dispatch({ type: IMAGE_INDEX, payload: 0 });
    }
    const attchmentDeleteHandler = async (id) => {
        try {
            await DeleteIssuesAttachment({ attachmentId: id });
            setRequestDetail((prev) => ({
                ...prev,
                issuesAttachments: prev.issuesAttachments.filter((att) => att.id !== id),
            }));
            dispatch({
                type: DELETE_ISSUE_ATTACHMENT, payload: {
                    id: requestData.id,
                    attachmentId: id
                }
            })
        } catch (error) { }
    };
    if (isImageShow)
        return (<div className="modal modal-lg-fullscreen fade show d-block task-image-gallery" id="imageGallery" tabIndex={-1} role="dialog" aria-labelledby="dropZoneLabel" aria-modal="true">
            <ReactImageVideoLightbox
                data={requestData.issuesAttachments
                    .filter((item) => ["image", "video"].includes(item.mediaType.split("/").shift()))
                    .map((item) => {
                        const itemType = item.mediaType.split("/").shift();
                        if (itemType === "video")
                            return {
                                ...item,
                                url: item.mediaUrl,
                                type: "video",
                                title: 'video title'
                            }
                        return {
                            ...item,
                            url: item.mediaUrl,
                            type: "photo",
                            altTag: 'Alt Photo'
                        }
                    })}
                startIndex={requestData.issuesAttachments
                    .filter((item) => ["image", "video"].includes(item.mediaType.split("/").shift()))
                    .findIndex((item) => item.id === imageId)}
                showResourceCount={true}
                onCloseCallback={onCloseImageHandler}
            />
        </div>)

    if (requestData) {
        return (<>
            <div className="issue-request-details">
                <div className="request-subject">
                    <div className={`${classes['new-issue-request']} bg-dark p-2`}>
                        <div className='d-flex'>
                            <h5 className='mb-1'>
                                <span className='mr-1'>Subject:</span>
                                <span className='fs-16'>{requestData.subject}</span>
                            </h5>
                        </div>
                        <div className="d-flex justify-content-between">
                            <div>
                                <span className='mr-2 fs-13'>
                                    Created
                                    <span className='text-white-70 ml-1'>{moment(requestData.createdAt).fromNow()}</span>
                                </span>
                                <span className='mx-2 fs-13'>
                                    Last Activity
                                    <span className='text-white-70 ml-1'>{moment(requestData.updatedAt).fromNow()}</span>
                                </span>
                            </div>
                            <div className='mx-1'>
                                <button className="btn btn-sm btn-info mr-1">
                                    Edit
                                </button>
                                {/* <button className="btn btn-sm btn-danger" onClick={DeleteRequestHandler}>
                                    Delete
                                </button> */}
                            </div>
                        </div>
                        <hr className='issue-break-line my-1' />
                        <div className='mt-1'>
                            <p className='my-1 font-weight-semibold'>Description:</p>
                            <div dangerouslySetInnerHTML={{ __html: requestData.description }}>
                            </div>
                        </div>
                        {requestData.issuesAttachments && !!requestData.issuesAttachments.length && <>
                            <hr className='issue-break-line mb-1' />
                            {/* <div className='mt-1'>
                                <p className='my-1 font-weight-semibold'>Attachments:</p>
                            </div> */}
                            <IssueAttachments
                                dispatch={dispatch}
                                attchmentDeleteHandler={attchmentDeleteHandler}
                                setImageShow={setImageShow}
                                requestData={requestData} />
                        </>}
                    </div>
                    <RequestSolution requestData={requestData} />
                    <RequestComments requestData={requestData} />
                </div>
            </div>
        </>);
    }
}


export const IssueAttachments = ({ requestData, setImageShow, dispatch, attchmentDeleteHandler }) => {
    const attachments = requestData.issuesAttachments ? requestData.issuesAttachments : [];
    return (
        // <div className="col-sm-6 col-md-12">
        <div className="">
            {(
                <div className="mb-1">
                    <div className="card-body task-attachment-body">
                        <h6>
                            Attachments ({attachments?.length})
                        </h6>
                        {!!attachments?.length &&
                            <div className='d-flex flex-row flex-wrap'>
                                {attachments?.map((att) => (
                                    <AttachmentCard
                                        key={att.id}
                                        dispatch={dispatch}
                                        att={att}
                                        requestData={requestData}
                                        setImageShow={setImageShow}
                                        attchmentDeleteHandler={attchmentDeleteHandler}
                                    />)
                                )}
                            </div>}
                        {!attachments.length && <div className='p-2'>
                            <span className='text-white-70'>No Attachment added</span>
                        </div>}
                    </div>
                </div>
            )}
        </div>
    )
}

export const AttachmentInput = ({ requestData }) => {
    const dispatch = useDispatch();
    const onChangeHandler = async (e) => {
        const files = e.target.files;
        let uploadedFiles = [];
        for (const file of files) {
            const presignedUrl = await onUploadImage(file);
            const FileUrl = await uploadToS3(presignedUrl, file);
            uploadedFiles.push({
                mediaUrl: FileUrl,
                mediaType: `${file.type.split("/").shift()}/${file.name.split(".").pop()}`,
                fileName: file.name,
            });
        };
        if (uploadedFiles.length > 0) {
            const { data } = await SendAttachmentIssuesData({
                attachments: uploadedFiles,
                issueId: requestData.id
            });
            dispatch({ type: SET_ISSUES_ATTACHMENTS, payload: data });
        }
    }
    const onUploadImage = async (file) => {
        if (file) {
            const res = await getPresignedUrl({
                fileName: file.name,
                fileType: file.type
            });
            return res.data.url;
        }
    }
    return (<>
        <label htmlFor="fileUpload" className="cursor-pointer m-0" title="Add Attchment">
            <AttachmentSvg />
        </label>
        <input hidden accept="image/*" id="fileUpload" type="file" onChange={(e) => onChangeHandler(e)} multiple="multiple" />
    </>)
}
