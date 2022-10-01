import React from 'react'
import { useState } from 'react';
import { onUploadImage, uploadToS3 } from '../../../../utils/s3/s3Connection';
import { ReqCreateNewIssueRequest } from '../../../../utils/wssConnection/wssConnection';
import classes from '../../Issues.module.css'
import { MyCkEditor } from '../../MyCkEditor';
import { PreviewFile } from './NewRequest';

export const GenerateRequest = ({
    categories,
    setNewRequest,
    activeCard,
}) => {
    const [reqData, setReqData] = useState({
        subject: null,
        description: null,
        categoryId: activeCard.id
    });
    const [attachments, setAttachments] = useState([]);
    const [isUploadingMedia, setMediaUpload] = useState(false);
    const [error, setError] = useState();
    const onChangeDesc = (data) => {
        setReqData((prev) => ({
            ...prev,
            description: data
        }))
    }

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
    const OnClose = (item) => {
        setAttachments((prev) => [...prev.filter(file => file.id !== item.id)]);
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
    const OnSubmit = async (e) => {
        e.preventDefault();
        if (!reqData.subject) {
            setError("Please enter subject of request!");
            return;
        }
        if (!!attachments.length) {
            setMediaUpload(true);
            const uploadedFiles = await startUpload();
            reqData.attachments = uploadedFiles
            setMediaUpload(false);
        }
        ReqCreateNewIssueRequest(reqData);
        setNewRequest(false);
    }

    return (<>
        <div className='col m-2 p-0 d-inline'>
            <h4>{`Generate a new request (${activeCard.name})`}</h4>
            <div className={`${classes['new-issue-request']} bg-dark p-2`}>
                <form className="request-form" onSubmit={OnSubmit}>
                    <div className="form-group">
                        <label htmlFor="subjectInput">Subject</label>
                        <input
                            type="text"
                            className="form-control form-control-md text-white"
                            id="subjectInput"
                            placeholder="Enter Subject of the Request"
                            autoComplete='off'
                            onChange={(e) => setReqData(prev => ({
                                ...prev, subject: e.target.value
                            }))}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="subjectInput">Description</label>
                        <MyCkEditor
                            name={"description"}
                            value={reqData.description}
                            onChange={onChangeDesc}
                            placeHolder={"Enter description of the request"} />
                    </div>
                    <div className="input-group">
                        <div className="form-group">
                            <div className="custom-file">
                                <input
                                    type="file"
                                    className="custom-file-input"
                                    id="profilePictureInput"
                                    onChange={onChangeHandler}
                                    multiple="multiple"
                                />
                                <label className="custom-file-label" htmlFor="profilePictureInput">
                                    Click to add attachments
                                </label>
                            </div>
                        </div>
                    </div>
                    {attachments && !!attachments.length &&
                        <div className="preview-attachments">
                            <div><p className='mb-1'>Attachments: </p></div>
                            <div className="files d-flex flex-wrap">
                                {attachments.map((item, index) =>
                                    <PreviewFile key={index} item={item} OnClose={OnClose} />
                                )}
                            </div>
                        </div>}

                    <div className="form-btn mt-1">
                        <button type='button' className='btn btn-secondary text-white mr-2' onClick={() => setNewRequest(false)}>
                            Cancel
                        </button>
                        {!isUploadingMedia &&
                            <button type="submit" className='btn btn-primary'>
                                Submit
                            </button>}
                        {isUploadingMedia &&
                            <button className='btn btn-primary' disabled>
                                Processing Files...
                            </button>}
                    </div>
                </form>
            </div>
        </div>
    </>);
}
