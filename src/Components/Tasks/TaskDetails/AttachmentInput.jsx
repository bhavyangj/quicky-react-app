import React from 'react'
import { useDispatch } from 'react-redux';
import { ReactComponent as AttachmentSvg } from "../../../assets/media/heroicons/outline/paper-clip.svg";
import { SendAttachmentData } from '../../../redux/actions/taskAction';
import { SET_TASKS_ATTACHMENTS } from '../../../redux/constants/taskConstants';
import { getPresignedUrl, uploadToS3 } from '../../../utils/s3/s3Connection';

export const AttachmentInput = ({ taskId, isTemplate = false }) => {
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
                taskId,
            });
        };
        if (uploadedFiles.length > 0) {
            const { data } = await SendAttachmentData({
                attachment: uploadedFiles,
                isTemplate
            });
            dispatch({ type: SET_TASKS_ATTACHMENTS, payload: data });
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
