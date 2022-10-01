import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { changeModel } from '../../../redux/actions/modelAction';
import { CreateGroupChat, getUsersList, loadUserChatList } from '../../../redux/actions/chatAction';
import { getPresignedUrl, uploadToS3 } from '../../../utils/s3/s3Connection';
import { ConnectInNewChat, notifyUsers } from '../../../utils/wssConnection/wssConnection';
import useDebounce from '../../hooks/useDebounce';
import { setUserHandler } from '../Sidebar/ChatsContentSidebarList';

export const CreateGroup = (props) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { activeChat } = useSelector((state) => state.chat);
    const [currStep, setStep] = useState(1);
    const [groupName, setGroupName] = useState("");
    const [usersList, setUsersList] = useState([]);
    const [searchUser, setSearchUser] = useState("");
    const [checked, setChecked] = useState([]);
    const newUser = useDebounce(searchUser, 500);
    const [isGroupCreating, setCreatingStatus] = useState(false);
    const [profileImage, setProfileImage] = useState({ name: "Choose File" });

    const onCancelHandler = () => {
        setStep(1);
        dispatch(changeModel(""));
    }
    const onFinishHandler = () => onCancelHandler();

    useEffect(() => {
        // Get User List on Search
        const getData = async () => {
            const res = await getUsersList(newUser.trim());
            setUsersList(res.data);
        }
        getData();
    }, [newUser]);

    // Add/Remove checked item from list
    const handleCheck = (event) => {
        let updatedList = [...checked];
        if (event.target.checked)
            updatedList = [...checked, Number(event.target.value)];
        else {
            const index = updatedList.findIndex((itemId) => itemId === Number(event.target.value));
            updatedList.splice(index, 1);
        }
        setChecked(updatedList);
    };

    const onUploadImage = async () => {
        if (profileImage && profileImage.name !== "Choose File") {
            const res = await getPresignedUrl({
                fileName: profileImage.name,
                fileType: profileImage.type
            });
            return res.data.url;
        } return null;
    }

    const onCreateGroupHandler = async () => {
        const presignedUrl = await onUploadImage();
        const uploadedImageUrl = await uploadToS3(presignedUrl, profileImage);
        const res = await CreateGroupChat(checked, user.id, groupName, uploadedImageUrl);
        if (res.status === 1) {
            setStep(currStep + 1);
            dispatch(loadUserChatList(false));
            notifyUsers(res.data.createdBy, res.data.id, res.data.users, res.data.type);
            setCreatingStatus(false);
            setUserHandler(res.data, activeChat.id, user.id, dispatch);
            ConnectInNewChat(res.data);
        }
    }

    const OnProfileImageChangeHandler = (e) => {
        if (e.target.files && e.target.files.length > 0)
            setProfileImage(e.target.files[0]);
    }

    return (<>
        <div className="modal modal-lg-fullscreen fade show" id="createGroup" tabIndex={-1} role="dialog" aria-labelledby="createGroupLabel" aria-modal="true" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-dialog-zoom">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title js-title-step" id="createGroupLabel">&nbsp;<span className="label label-success">1</span> Create a New Group</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => dispatch(changeModel(""))}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body py-0 hide-scrollbar">
                        {/* Step: 1 - Create a new group  */}
                        <div className={`row pt-2 ${currStep !== 1 ? 'hide' : ''}`} data-step={1} data-title="Create a New Group">
                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="groupName">Group name</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-md"
                                        id="groupName"
                                        placeholder="Type group name here"
                                        autoComplete='off'
                                        onChange={(e) => setGroupName(e.target.value.trim())}
                                        maxLength={25}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="form-group">
                                    <label>Choose profile picture</label>
                                    <div className="custom-file">
                                        <input
                                            type="file"
                                            className="custom-file-input"
                                            id="profilePictureInput"
                                            accept="image/jpeg, image/jpg, image/png"
                                            onChange={OnProfileImageChangeHandler}
                                        />
                                        <label className="custom-file-label" htmlFor="profilePictureInput">
                                            {profileImage?.name}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Step: 2 - Add group members  */}
                        <div className={`row pt-2 ${currStep !== 2 ? 'hide' : ''}`} data-step={2} data-title="Add Group Members">
                            <div className="col-12 px-0">
                                {/* Search Start */}
                                <form className="form-inline w-100 px-2 pb-2 border-bottom">
                                    <div className="input-group w-100 bg-light">
                                        <input type="text"
                                            className="form-control form-control-md search border-right-0 transparent-bg pr-0"
                                            placeholder="Search"
                                            onChange={(e) => setSearchUser(e.target.value.trim())}
                                        />
                                        <div className="input-group-append">
                                            <div className="input-group-text transparent-bg border-left-0" role="button">
                                                <svg className="hw-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="col-12 px-0">
                                <ul className="list-group list-group-flush">
                                    {usersList.map((item, index) => {
                                        return (<li className="list-group-item" key={item.id}>
                                            <div className="media">
                                                <div className={`avatar avatar-${item.profileStatus} mr-2`}>
                                                    <img src={item.profilePicture} alt="" />
                                                </div>
                                                <div className="media-body">
                                                    <h6 className="text-truncate">
                                                        <div className="text-reset text-capitalize">{item.name}</div>
                                                    </h6>
                                                    <p className="text-muted mb-0 text-capitalize">{item.profileStatus}</p>
                                                </div>
                                                <div className="media-options">
                                                    <div className="custom-control custom-checkbox">
                                                        <input
                                                            className="custom-control-input"
                                                            id={`chx-user-${item.id}`}
                                                            name={`chx-users`}
                                                            type="checkbox"
                                                            value={item.id}
                                                            checked={checked.includes(item.id)}
                                                            onChange={handleCheck}
                                                        />
                                                        <label className="custom-control-label" htmlFor={`chx-user-${item.id}`} />
                                                    </div>
                                                </div>
                                            </div>
                                            <label className="media-label" htmlFor={`chx-user-${item.id}`} />
                                        </li>)
                                    })}
                                </ul>
                            </div>
                        </div>
                        {/* Step: 3 - Finished  */}
                        <div className={`row pt-2 h-100 ${currStep !== 3 ? 'hide' : ''}`} data-step={3} data-title="Finished">
                            <div className="col-12">
                                <div className="d-flex justify-content-center align-items-center flex-column h-100">
                                    <div className="btn btn-success btn-icon rounded-circle text-light mb-3">
                                        <svg className="hw-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h6>Group Created Successfully</h6>
                                    <p className="text-muted text-center">Lorem ipsum dolor sit amet consectetur adipisicing
                                        elit. Dolores cumque laborum fugiat vero pariatur provident!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        {currStep !== 3 && <>
                            <button
                                className="btn btn-link text-muted js-btn-step mr-auto"
                                data-orientation="cancel"
                                data-dismiss="modal"
                                onClick={() => onCancelHandler()}>Cancel</button>
                            <button
                                className="btn btn-secondary  js-btn-step"
                                data-orientation="previous"
                                data-step={currStep}
                                disabled={currStep === 1}
                                onClick={() => setStep(currStep - 1)}>Previous</button></>}
                        {!isGroupCreating ? <button
                            className="btn btn-primary js-btn-step"
                            data-orientation="next"
                            data-step={(currStep === 3) ? 'complete' : currStep}
                            onClick={() => {
                                if (currStep < 3 && groupName !== "") {
                                    if (currStep === 2) {
                                        setCreatingStatus(true);
                                        onCreateGroupHandler();
                                    } else {
                                        setStep(currStep + 1);
                                    }
                                }
                                else if (currStep === 3) onFinishHandler();
                            }}
                            disabled={groupName === "" || groupName.length < 3}
                        >
                            {currStep === 3 ? 'Finish' : 'Next'}
                        </button> :
                            <button
                                className="btn btn-primary js-btn-step"
                                data-orientation="next"
                                data-step={2}
                                disabled
                            >
                                {`Creating Group...`}
                            </button>
                        }
                    </div>
                </div>
            </div>
            <input type="hidden" id="actual-step" defaultValue={currStep} /></div>
    </>);
}
