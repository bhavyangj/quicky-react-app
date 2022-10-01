import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { changeModel } from '../../../redux/actions/modelAction';
import { ADD_USER_ADMIN } from '../../Chat/Models/models';
import { ReactComponent as UserSvg } from '../../../assets/media/heroicons/solid/user.svg';
import { ReactComponent as EmailSvg } from '../../../assets/media/heroicons/solid/email.svg';
import { ReactComponent as PhoneSvg } from '../../../assets/media/heroicons/solid/phone.svg';
import { ReactComponent as LockSvg } from '../../../assets/media/heroicons/solid/lock-closed.svg';
import { ReactComponent as LocationSvg } from '../../../assets/media/heroicons/solid/location-marker.svg';
import { ReactComponent as TagSvg } from '../../../assets/media/heroicons/solid/tag.svg';
import { ReactComponent as StarSvg } from '../../../assets/media/heroicons/solid/star.svg';
import { ReactComponent as CheckSvg } from "../../../assets/media/heroicons/outline/check.svg";
import { getUsersListData, ReqCreateNewUser } from '../../../utils/wssConnection/wssConnection';
import { useDetectClickOutside } from 'react-detect-click-outside';

const userInitData = {
    name: "",
    email: "",
    password: "",
    cPassword: "",
    phone: "",
    address: "",
    designation: [],
    role: ""
}

export const AddUser = () => {
    const dispatch = useDispatch();
    const { userDesignations } = useSelector((state) => state.chat);
    const { name, userRoles } = useSelector((state) => state.model);
    const [newUserData, setUserData] = useState(userInitData);
    const [userRoleList, setRoles] = useState();
    const [error, setError] = useState();
    const [showDesignation, setShowDesg] = useState(false);
    const dropdownTaskRef = useDetectClickOutside({ onTriggered: () => setShowDesg(false) });
    const [designations, setDesignations] = useState(userInitData.designation);

    const onCancelHandler = () => {
        dispatch(changeModel(""));
    }

    useEffect(() => {
        if (error) setError();
        //eslint-disable-next-line
    }, [newUserData]);

    useEffect(() => {
        setRoles(userRoles);
        setUserData((prev) => {
            return {
                ...prev,
                role: userRoles[0].id,
            }
        })
    }, [userRoles]);

    const onSubmitHandler = (e) => {
        e.preventDefault();
        if (newUserData.password.length < 8) {
            setError("Password must be 8 characters long!");
            return;
        }
        if (newUserData.password !== newUserData.cPassword) {
            setError("Confirm Password doesn't match!");
            return;
        }
        ReqCreateNewUser(newUserData);
        onCancelHandler();
        getUsersListData({ page: 1, name: "" });
    }

    const addUserDesignation = (desgId) => {
        if (designations.some((desgID) => desgID === desgId)) {
            setUserData((prev) => (
                { ...prev, designation: prev.designation.filter((desgID) => desgID !== desgId) }
            ));
            setDesignations((prev) => (prev.filter((desgID) => desgID !== desgId)));
        } else {
            setUserData((prev) => {
                if (prev.designation) return { ...prev, designation: [desgId, ...prev.designation] }
                else return { ...prev, designation: [desgId] }
            });
            setDesignations((prev) => ([desgId, ...prev]));
        }
    };

    return (<>
        <div className={`modal modal-lg-fullscreen fade ${name === ADD_USER_ADMIN ? 'show d-block' : ''}`} data-toggle="modal" id="startConversation" tabIndex={-1} role="dialog" aria-labelledby="startConversationLabel" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-dialog-zoom">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="startConversationLabel">Create New User</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => dispatch(changeModel(""))}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body p-0 hide-scrollbar">
                        <form className="form-inline p-2 border-bottom overflow-scroll" onSubmit={onSubmitHandler}>
                            {error && <p className='text-danger mb-1'>{error}</p>}
                            <div className="input-group w-100 bg-light my-1">
                                <div className="input-group-append">
                                    <div className="input-group-text transparent-bg border-left-0">
                                        <UserSvg />
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    className="form-control form-control-md search border-right-0 transparent-bg pr-0"
                                    id="newUserName-sdlkn"
                                    placeholder="Username"
                                    title='Username'
                                    autoComplete='off'
                                    value={newUserData.name}
                                    onChange={(e) => setUserData((prev) => {
                                        return {
                                            ...prev,
                                            name: e.target.value,
                                        }
                                    })}
                                    required
                                />
                            </div>
                            <div className="input-group w-100 bg-light my-1">
                                <div className="input-group-append">
                                    <div className="input-group-text transparent-bg border-left-0">
                                        <EmailSvg fill="currentColor" />
                                    </div>
                                </div>
                                <input
                                    type="email"
                                    className="form-control form-control-md"
                                    id="newEmail"
                                    placeholder="Email"
                                    value={newUserData.email}
                                    onChange={(e) => setUserData((prev) => {
                                        return {
                                            ...prev,
                                            email: e.target.value,
                                        }
                                    })}
                                    required
                                />
                            </div>
                            <div className="input-group w-100 bg-light my-1">
                                <div className="input-group-append">
                                    <div className="input-group-text transparent-bg border-left-0">
                                        <LockSvg />
                                    </div>
                                </div>
                                <input
                                    type="password"
                                    className="form-control form-control-md"
                                    id="newPswd"
                                    placeholder="Password (min. 8 characters required)"
                                    autoComplete='off'
                                    value={newUserData.password}
                                    onChange={(e) => setUserData((prev) => {
                                        return {
                                            ...prev,
                                            password: e.target.value,
                                        }
                                    })}
                                    required
                                />
                            </div>
                            <div className="input-group w-100 bg-light my-1">
                                <div className="input-group-append">
                                    <div className="input-group-text transparent-bg border-left-0">
                                        <LockSvg />
                                    </div>
                                </div>
                                <input
                                    type="password"
                                    className="form-control form-control-md"
                                    id="confirmPswd"
                                    placeholder="Confirm Password"
                                    autoComplete='off'
                                    value={newUserData.cPassword}
                                    onChange={(e) => setUserData((prev) => {
                                        return {
                                            ...prev,
                                            cPassword: e.target.value,
                                        }
                                    })}
                                    required
                                />
                            </div>
                            <div className="input-group w-100 bg-light my-1 num-input-hide">
                                <div className="input-group-append">
                                    <div className="input-group-text transparent-bg border-left-0">
                                        <PhoneSvg />
                                    </div>
                                </div>
                                <input
                                    type="number"
                                    className="form-control form-control-md"
                                    id="newPhone"
                                    placeholder="Phone Number"
                                    value={newUserData.phone}
                                    onChange={(e) => setUserData((prev) => {
                                        return {
                                            ...prev,
                                            phone: e.target.value,
                                        }
                                    })}
                                />
                            </div>
                            <div className="input-group w-100 bg-light my-1">
                                <div className="input-group-append">
                                    <div className="input-group-text transparent-bg border-left-0">
                                        <LocationSvg />
                                    </div>
                                </div>
                                <textarea
                                    className="form-control form-control-md custom-form-control font-size-sm shadow-none text-white"
                                    rows={2}
                                    id="newAddress"
                                    placeholder="Address"
                                    value={newUserData.address}
                                    onChange={(e) => setUserData((prev) => {
                                        return {
                                            ...prev,
                                            address: e.target.value,
                                        }
                                    })}
                                />
                            </div>
                            <div className="input-group w-100 bg-light my-1">
                                <div className="input-group-append">
                                    <div className="input-group-text transparent-bg border-left-0">
                                        <TagSvg />
                                    </div>
                                </div>
                                {/* Dropdown */}
                                <select
                                    className="custom-select custom-form-control font-size-sm shadow-none text-white"
                                    id="newRole"
                                    placeholder="User Role"
                                    onChange={(e) => setUserData((prev) => {
                                        return {
                                            ...prev,
                                            role: Number(e.target.value),
                                        }
                                    })}
                                >
                                    {userRoleList?.map((role) => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group w-100 bg-light my-1">
                                <div className="input-group-append">
                                    <div className="input-group-text transparent-bg border-left-0" role="button">
                                        <StarSvg />
                                    </div>
                                </div>
                                <div className="dropdown show chat-member-dropdown" ref={dropdownTaskRef}>
                                    <button className="dropdown-toggle btn bg-dark-f text-white-70"
                                        type='button'
                                        onClick={() => setShowDesg(!showDesignation)}>
                                        <span className="fs-13">
                                            {!!designations.length && designations.map((desg) => (
                                                <nobr key={desg}>{desg ? userDesignations?.filter((item) => item.id === desg)?.shift()?.name + ', ' : ''}</nobr>
                                            ))}
                                            {!designations.length && <nobr>{'Add Designation'}</nobr>}
                                        </span>
                                    </button>
                                    {showDesignation && <ul className="dropdown-menu text-light show">
                                        {userDesignations
                                            .map((desg) => (
                                                <li key={desg.id} className={`dropdown-item cursor-pointer`} onClick={() => addUserDesignation(desg.id)}>
                                                    <div className="d-flex justify-content-between w-100">
                                                        <span>{desg.name}</span>
                                                        <span>
                                                            {!!designations.filter((desgID) => desgID === desg.id).length ? (<CheckSvg className="hw-16" />) : ("")}
                                                        </span>
                                                    </div>
                                                </li>
                                            ))}
                                    </ul>}
                                </div>
                                {/* <input
                                    type="text"
                                    className="form-control form-control-md"
                                    id="newDesignation"
                                    placeholder="Designation"
                                    value={newUserData.designation}
                                    onChange={(e) => setUserData((prev) => {
                                        return {
                                            ...prev,
                                            designation: e.target.value.trim(),
                                        }
                                    })}
                                /> */}
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-link text-muted js-btn-step mr-auto"
                                    data-orientation="cancel"
                                    data-dismiss="modal"
                                    onClick={() => onCancelHandler()}>Cancel</button>
                                <button
                                    className="btn btn-primary js-btn-step"
                                    data-orientation="next"
                                    type="submit"
                                >
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    </>);
}
