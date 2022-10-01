import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { changeModel } from '../../../redux/actions/modelAction';
import { getPresignedUrl, uploadToS3 } from '../../../utils/s3/s3Connection';
import { ReqUpdateGroupDetails } from '../../../utils/wssConnection/wssConnection';
import { DEFAULT_IMAGE } from '../../Layout/HomePage/HomePage';

export const GroupUpdate = () => {
    const dispatch = useDispatch();
    const { activeChat } = useSelector(state => state.chat);
    const inputRef = useRef();
    const [error, setError] = useState();
    const [uploading, setuploading] = useState();
    const [groupName, setGroupName] = useState();
    const [groupDesc, setGroupDesc] = useState();
    const [profileImage, setProfileImage] = useState();

    // useEffect(() => {
    //     inputRef?.current.click();
    // }, []);

    const onCancel = () => dispatch(changeModel(""));
    const OnSave = async () => {
        const obj = {
            chatId: activeChat.id
        };
        setuploading(true);
        if (groupName)
            obj.name = groupName;
        if (groupDesc)
            obj.description = groupDesc;
        if (profileImage) {
            const presignedUrl = await onUploadImage(profileImage);
            const uploadedImageUrl = await uploadToS3(presignedUrl, profileImage);
            obj.profilePicture = uploadedImageUrl;
        }
        ReqUpdateGroupDetails(obj);
        setuploading(false);
        onCancel();
    }
    const OnProfileImageChangeHandler = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setProfileImage(e.target.files[0]);
            if (e.target.files[0].size > 500000)
                setError("File size must be less than 5 MB");
            else if (error && e.target.files[0].size <= 500000)
                setError();
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
        <div className="modal modal-lg-fullscreen fade show" id="taskModal" tabIndex={-1} role="dialog" aria-labelledby="taskModalLabel" style={{ display: 'block' }} aria-modal="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-dialog-zoom">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="taskModalLabel">Group Info</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onCancel}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className='text-center'>
                            <div className="prev-img my-1">
                                {profileImage ?
                                    <img className='avatar update-image' src={URL.createObjectURL(profileImage)} alt="" />
                                    : <img className='avatar update-image' src={activeChat.image ? activeChat.image : DEFAULT_IMAGE} alt="" />
                                }
                            </div>
                            {error &&
                                <div className='d-flex'>
                                    <span className="text-left text-danger fs-12">{error}</span>
                                </div>}
                            <div className="form-group">
                                <div className="custom-file">
                                    <input
                                        type="file"
                                        ref={inputRef}
                                        className="custom-file-input cursor-pointer"
                                        id="profilePictureInput"
                                        accept="image/jpeg, image/jpg, image/png"
                                        onChange={OnProfileImageChangeHandler}
                                    />
                                    <label className="custom-file-label text-truncate" htmlFor="profilePictureInput">
                                        {profileImage ? profileImage.name : "Choose File"}
                                    </label>
                                </div>
                            </div>
                            <div className="d-flex text-left line-height-1">
                                <span className='text-white'>Group Name:</span>
                            </div>
                            <div className="input-group my-1">
                                <input type="text"
                                    className="form-control"
                                    placeholder="Group name"
                                    defaultValue={activeChat.name}
                                    onChange={(e) => { setGroupName(e.target.value) }} />
                            </div>
                            <div className="d-flex text-left line-height-1 mt-2">
                                <span className='text-white'>Group Description:</span>
                            </div>
                            <div className="input-group my-1">
                                <input type="text"
                                    className="form-control"
                                    placeholder="Group description"
                                    defaultValue={activeChat.description}
                                    onChange={(e) => { setGroupDesc(e.target.value) }} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light border" data-dismiss="modal" onClick={onCancel}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={OnSave} disabled={error}>
                            {uploading ? 'Uploading...' : 'Update'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
