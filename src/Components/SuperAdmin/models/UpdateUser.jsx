import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { changeModel } from '../../../redux/actions/modelAction';
import { UPDATE_USER } from '../../Chat/Models/models';
import { ReactComponent as UserSvg } from '../../../assets/media/heroicons/solid/user.svg';
import { ReactComponent as EmailSvg } from '../../../assets/media/heroicons/solid/email.svg';
import { ReactComponent as PhoneSvg } from '../../../assets/media/heroicons/solid/phone.svg';
import { ReactComponent as LockSvg } from '../../../assets/media/heroicons/solid/lock-closed.svg';
import { ReactComponent as LocationSvg } from '../../../assets/media/heroicons/solid/location-marker.svg';
import { ReactComponent as TagSvg } from '../../../assets/media/heroicons/solid/tag.svg';
import { ReactComponent as StarSvg } from '../../../assets/media/heroicons/solid/star.svg';
import { ReactComponent as CheckSvg } from "../../../assets/media/heroicons/outline/check.svg";
import { ReqUpdateUserData } from '../../../utils/wssConnection/wssConnection';
import { useDetectClickOutside } from 'react-detect-click-outside';

export const UpdateUser = () => {
    const dispatch = useDispatch();
    const { userDesignations } = useSelector((state) => state.chat);
    const { name, userRoles, userData } = useSelector((state) => state.model);
    const [userRoleList, setRoles] = useState();
    const dropdownTaskRef = useDetectClickOutside({ onTriggered: () => setShowDesg(false) });
    const [showDesignation, setShowDesg] = useState(false);
    const [designations, setDesignations] = useState(userData.designation ? userData.designation : []);
    const [updateUserData, setUpdateUserData] = useState({
        userId: userData.id,
        designation: userData.designation ? userData.designation : []
    });

    const onCancelHandler = () => {
        dispatch(changeModel(""));
    }

    useEffect(() => {
        setRoles(userRoles);
    }, [userRoles]);

    const onSubmitHandler = () => {
        ReqUpdateUserData(updateUserData);
        onCancelHandler();
        // getUsersListData({ page: 1, name: "" });
    }
    // const onChangeDesgination = (e) => {
    //     if (updateUserData?.designation?.some((id) => id === Number(e.target.value.trim()))) {
    //         setUpdateUserData((prev) => (
    //             { ...prev, designation: prev.designation.filter(id => id !== Number(e.target.value.trim())) }
    //         ))
    //     } else {
    //         setUpdateUserData((prev) => {
    //             if (prev.designation) {
    //                 return { ...prev, designation: [...prev.designation, Number(e.target.value.trim())] }
    //             }
    //             else {
    //                 return { ...prev, designation: [Number(e.target.value.trim())] }
    //             }
    //         })
    //     }
    //     // console.log(updateUserData.designation);
    // }

    const addUserDesignation = (desgId) => {
        // console.log(userData);
        if (designations?.some((desgID) => desgID === desgId)) {
            setUpdateUserData((prev) => (
                { ...prev, designation: prev.designation.filter((desgID) => desgID !== desgId) }
            ));
            setDesignations((prev) => (prev.filter((desgID) => desgID !== desgId)));
        } else {
            setUpdateUserData((prev) => {
                if (prev.designation) return { ...prev, designation: [desgId, ...prev.designation] }
                else return { ...prev, designation: [desgId] }
            });
            setDesignations((prev) => ([desgId, ...prev]));
        }
    };

    return (<>
        <div className={`modal modal-lg-fullscreen fade ${name === UPDATE_USER ? 'show d-block' : ''}`} data-toggle="modal" id="startConversation" tabIndex={-1} role="dialog" aria-labelledby="startConversationLabel" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-dialog-zoom">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="startConversationLabel">Update User</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => dispatch(changeModel(""))}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body p-0 hide-scrollbar">
                        <form className="form-inline w-100 p-2 border-bottom">
                            <div className="input-group w-100 bg-light my-1">
                                <div className="input-group-append">
                                    <div className="input-group-text transparent-bg border-left-0">
                                        <UserSvg className="hw-20" />
                                    </div>
                                </div>
                                <input type="text" className="form-control form-control-md search border-right-0 transparent-bg pr-0" id="newUsername" placeholder="Username" title='Username'
                                    defaultValue={userData.name}
                                    onChange={(e) => setUpdateUserData((prev) => {
                                        return { ...prev, name: e.target.value.trim(), }
                                    })}
                                    required
                                />
                            </div>
                            <div className="input-group w-100 bg-light my-1">
                                <div className="input-group-append">
                                    <div className="input-group-text transparent-bg border-left-0">
                                        <EmailSvg className="hw-20" fill="currentColor" />
                                    </div>
                                </div>
                                <input type="email" className="form-control form-control-md" id="newEmail" placeholder="Email"
                                    defaultValue={userData.email}
                                    onChange={(e) => setUpdateUserData((prev) => {
                                        return { ...prev, email: e.target.value.trim(), }
                                    })}
                                    required
                                />
                            </div>
                            <div className="input-group w-100 bg-light my-1">
                                <div className="input-group-append">
                                    <div className="input-group-text transparent-bg border-left-0">
                                        <LockSvg className="hw-20" fill="currentColor" />
                                    </div>
                                </div>
                                <input type="password" className="form-control form-control-md" id="newPswd" placeholder="Password"
                                    defaultValue={userData.password}
                                    onChange={(e) => setUpdateUserData((prev) => {
                                        return { ...prev, password: e.target.value.trim(), }
                                    })}
                                    required
                                />
                            </div>

                            <div className="input-group w-100 bg-light my-1 num-input-hide">
                                <div className="input-group-append">
                                    <div className="input-group-text transparent-bg border-left-0">
                                        <PhoneSvg className="hw-20" />
                                    </div>
                                </div>
                                <input type="number" className="form-control form-control-md" id="newPhone" placeholder="Phone Number"
                                    defaultValue={userData.phone}
                                    onChange={(e) => setUpdateUserData((prev) => {
                                        return { ...prev, phone: e.target.value.trim(), }
                                    })}
                                />
                            </div>
                            <div className="input-group w-100 bg-light my-1">
                                <div className="input-group-append">
                                    <div className="input-group-text transparent-bg border-left-0">
                                        <LocationSvg className="hw-20" />
                                    </div>
                                </div>
                                <textarea className="form-control form-control-md custom-form-control font-size-sm shadow-none text-white" rows={2} id="newAddress" placeholder="Address"
                                    defaultValue={userData.address}
                                    onChange={(e) => setUpdateUserData((prev) => {
                                        return { ...prev, address: e.target.value.trim(), }
                                    })}
                                />
                            </div>
                            <div className="input-group w-100 bg-light my-1">
                                <div className="input-group-append">
                                    <div className="input-group-text transparent-bg border-left-0">
                                        <TagSvg className="hw-20" />
                                    </div>
                                </div>
                                {/* Dropdown */}
                                <select className="custom-select custom-form-control font-size-sm shadow-none text-white" id="newRole" placeholder="User Role"
                                    onChange={(e) => setUpdateUserData((prev) => {
                                        return { ...prev, role: Number(e.target.value), }
                                    })}
                                // defaultValue={userData.roleData.id}
                                >
                                    {userData?.roleData &&
                                        <option value={userData?.roleData.id}>{userData.roleData.name}</option>}
                                    {userRoleList?.map((role) => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group w-100 bg-light my-1">
                                <div className="input-group-append">
                                    <div className="input-group-text transparent-bg border-left-0">
                                        <StarSvg />
                                    </div>
                                </div>
                                {/* <select className="custom-select custom-form-control font-size-sm shadow-none text-white"
                                    id="#newDesignation"
                                    placeholder="User Designation"
                                    onChange={onChangeDesgination}
                                >
                                    {userData?.designation &&
                                        <option value={userData.designation}>
                                            {userDesignations?.filter((item) => item.id === userData.designation).shift()?.name}
                                        </option>}
                                    {userDesignations?.map((designation) => (
                                        <option key={designation.id} value={designation.id}>{designation.name}</option>
                                    ))}
                                </select> */}
                                <div className="dropdown show chat-member-dropdown" ref={dropdownTaskRef}>
                                    <button className="dropdown-toggle btn bg-dark-f text-white-70"
                                        type='button'
                                        onClick={() => setShowDesg(!showDesignation)}>
                                        <span className="fs-13">
                                            {!!designations?.length && designations.map((desg) => (
                                                <nobr key={desg}>{desg ? userDesignations?.filter((item) => item.id === desg)?.shift()?.name + ', ' : ''}</nobr>
                                            ))}
                                            {!designations?.length && <nobr>{'Add Designation'}</nobr>}
                                        </span>
                                    </button>
                                    {showDesignation && <ul className="dropdown-menu text-light show">
                                        {userDesignations
                                            .map((desg) => (
                                                <li key={desg.id} className={`dropdown-item cursor-pointer`} onClick={() => addUserDesignation(desg.id)}>
                                                    <div className="d-flex justify-content-between w-100">
                                                        <span>{desg.name}</span>
                                                        <span>
                                                            {!!designations?.filter((desgID) => desgID === desg.id).length ? (<CheckSvg className="hw-16" />) : ("")}
                                                        </span>
                                                    </div>
                                                </li>
                                            ))}
                                    </ul>}
                                </div>
                                {/* <input type="text" className="form-control form-control-md" id="newDesignation" placeholder="Designation"
                                    defaultValue={userData.designation}
                                    onChange={(e) => setUpdateUserData((prev) => {
                                        return { ...prev, designation: e.target.value.trim(), }
                                    })}
                                /> */}
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-link text-muted js-btn-step mr-auto" data-orientation="cancel" data-dismiss="modal" onClick={() => onCancelHandler()}>Cancel</button>
                        <button className="btn btn-primary js-btn-step" data-orientation="next" onClick={onSubmitHandler}>Update User</button>
                    </div>
                </div>
            </div>
        </div>
    </>);
}
