import React from 'react'
import { useState } from 'react';
import { changeModel } from '../../../../redux/actions/modelAction';
import { ReactComponent as SubjectSvg } from '../../../../assets/media/heroicons/solid/pencil-alt.svg';
import { ReactComponent as CloseSvg } from "../../../../assets/media/heroicons/outline/x.svg";
import { ReqCreateNewIssueRequest } from '../../../../utils/wssConnection/wssConnection';
import { onUploadImage, uploadToS3 } from '../../../../utils/s3/s3Connection';

export const NewRequest = ({ card, categories, dispatch }) => {
    const [error, setError] = useState();
    const [requestData, setReqData] = useState({
        categoryId: card.id
    });
    const [isUploadingMedia, setMediaUpload] = useState(false);
    const [attachments, setAttachments] = useState([]);

    const onChangeHandler = async (e) => {
        const files = e.target.files;
        let selectedFiles = [];
        let index = 1;
        for (const file of files) {
            selectedFiles.push({ file, id: index + file.lastModified });
            index++;
        };
        if (!!selectedFiles.length) {
            if (!!attachments.length) setAttachments((prev) => ([...prev, ...selectedFiles]));
            else setAttachments(selectedFiles);
        }
    }
    const startUpload = async () => {
        let uploadedFiles = [];
        for (const item of attachments) {
            const file = item.file;
            const presignedUrl = await onUploadImage(file);
            const FileUrl = await uploadToS3(presignedUrl, file);
            uploadedFiles.push({
                mediaUrl: FileUrl,
                mediaType: `${file.type.split("/").shift()}/${file.name.split(".").pop()}`,
                fileName: file.name,
            });
        };
        return uploadedFiles;
    }
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!requestData.subject) {
            setError("Please enter subject of request!");
            return;
        }
        if (!!attachments.length) {
            setMediaUpload(true);
            const uploadedFiles = await startUpload();
            requestData.attachments = uploadedFiles
            setMediaUpload(false);
        }
        ReqCreateNewIssueRequest(requestData);
        onCancelHandler();
    }
    const onCancelHandler = () => {
        dispatch(changeModel(""));
    }
    const OnClose = (item) => {
        setAttachments((prev) => [...prev.filter(file => file.id !== item.id)]);
    }

    return (<>
        <div className={`modal modal-lg-fullscreen fade show d-block`} data-toggle="modal" id="startConversation" tabIndex={-1} role="dialog" aria-labelledby="startConversationLabel" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-dialog-zoom">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="startConversationLabel">New Request</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => dispatch(changeModel(""))}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body p-0 hide-scrollbar">
                        <form className="form-inline p-2 border-bottom overflow-scroll" id='#requestIssue' onSubmit={onSubmitHandler}>
                            {error && <p className='text-danger mb-1'>{error}</p>}
                            <div className="input-group w-100 bg-light my-1">
                                <div className="input-group-append">
                                    <div className="input-group-text transparent-bg border-left-0">
                                        <SubjectSvg />
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    className="form-control form-control-md"
                                    id="newSubject"
                                    placeholder="Subject"
                                    title='subject'
                                    autoComplete='off'
                                    value={requestData.subject ? requestData.subject : ''}
                                    onChange={(e) => setReqData((prev) => ({
                                        ...prev,
                                        subject: e.target.value,
                                    }))}
                                    required
                                />
                            </div>
                            <div className="w-100 my-1">
                                <span className='mr-1 fs-14'>Request Description: </span>
                                <div className="input-group bg-full-dark d-inline ckeditor-parent text-black">
                                    {/* <CKEditor
                                        editor={ClassicEditor}
                                        data="<p>Hello from CKEditor 5!</p>"
                                        onReady={editor => {
                                            // You can store the "editor" and use when it is needed.
                                            // console.log('Editor is ready to use!', editor);
                                        }}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            // console.log({ event, editor, data });
                                            setReqData((prev) => ({
                                                ...prev,
                                                description: data
                                            }))
                                        }}
                                        onBlur={(event, editor) => {
                                            // console.log('Blur.', editor);
                                        }}
                                        onFocus={(event, editor) => {
                                            // console.log('Focus.', editor);
                                        }}
                                    /> */}
                                </div>
                                {/* <div className="input-group-append">
                                    <div className="input-group-text transparent-bg border-left-0">
                                        <SubjectSvg />
                                    </div>
                                </div>
                                <textarea
                                    rows={3}
                                    className="form-control form-control-md resize-none bg-full-dark theme-border"
                                    id="newDesc"
                                    placeholder="Description of request"
                                    value={requestData.email}
                                    onChange={(e) => setReqData((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))}
                                /> */}

                            </div>
                            <div className="input-group w-100 my-2">
                                <div className="form-group w-100">
                                    <div className="custom-file">
                                        <input
                                            type="file"
                                            className="custom-file-input"
                                            id="profilePictureInput"
                                            onChange={onChangeHandler}
                                            multiple="multiple"
                                        />
                                        <label className="custom-file-label" htmlFor="profilePictureInput">
                                            Add Attachments
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {attachments && !!attachments.length &&
                                <div className="preview-attachments">
                                    <div><p>Attachments: </p></div>
                                    <div className="files d-flex flex-wrap">
                                        {attachments.map((item, index) =>
                                            <PreviewFile key={index} item={item} OnClose={OnClose} />
                                        )}
                                    </div>
                                </div>}
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button
                            className="btn btn-link text-muted js-btn-step mr-auto"
                            data-orientation="cancel"
                            data-dismiss="modal"
                            onClick={onCancelHandler}
                        >Cancel</button>
                        <button
                            className="btn btn-primary js-btn-step"
                            data-orientation="next"
                            type="submit"
                            form='#requestIssue'
                            disabled={isUploadingMedia}
                        >
                            {!isUploadingMedia ? 'Generate Request' : 'Generating...'}
                        </button>
                    </div>
                </div>
            </div>
        </div >
    </>);
}

export const PreviewFile = ({ item, OnClose }) => {
    return (
        <div className="media-image m-2">
            <button className='close-btn' onClick={() => OnClose(item)}>
                <CloseSvg height={16} />
            </button>
            <div className="cursor-pointer" onClick={() => { }}>
                {item.file.type.startsWith("image") ?
                    <img className="img-fluid rounded border" src={URL.createObjectURL(item.file)} alt="" />
                    : <video className="img-fluid rounded border">
                        <source src={URL.createObjectURL(item.file)} type="video/mp4" />
                        <source src={URL.createObjectURL(item.file)} type="video/ogg" />
                        Your browser does not support the video tag.
                    </video>}
            </div>
        </div>
    )
}
