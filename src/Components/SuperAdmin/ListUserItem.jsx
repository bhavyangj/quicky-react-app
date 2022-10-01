import React from 'react'
import { ReactComponent as EditSvg } from "../../assets/media/heroicons/solid/pencil.svg";
import { ReactComponent as DeleteSvg } from "../../assets/media/heroicons/solid/trash.svg";
// import { ReactComponent as EyeSvg } from "../../assets/media/heroicons/solid/eye.svg";
import { SUPER_ADMIN } from '../../redux/constants/userContants';
import { createUserSuperAdmin, deactivateAccount, deleteAccount } from '../../utils/wssConnection/wssConnection';
import { changeModel, updateUserData } from '../../redux/actions/modelAction';
import { UPDATE_USER } from '../Chat/Models/models';
import { useDispatch } from 'react-redux';

export const ListUserItem = ({ user, page, userDesignations }) => {

    const dispatch = useDispatch();
    const OnChangeAccActive = () => {
        deactivateAccount({ userId: user.id, status: !user.isActive });
    }
    const OnChangeUserRole = () => {
        createUserSuperAdmin({ userId: user.id, role: (user.roleData?.name === SUPER_ADMIN ? false : true) });
    }

    const OnClickUpdateUser = () => {
        dispatch(changeModel(UPDATE_USER));
        dispatch(updateUserData(user));
    }
    return (
        <tr className="list-task-table-row">
            <td className='text-capitalize'>
                <nobr>{user.name}</nobr>
            </td>
            <td className="text-truncate">
                {user?.designation?.map((desg) => (
                    <nobr key={desg} className="desg-tag mr-1 px-1">
                        {desg ? userDesignations?.filter((item) => item.id === desg)?.shift()?.name : 'N/A'}</nobr>
                ))}
            </td>
            <td className="text-center">
                <nobr>
                    <div className="custom-control custom-switch ml-2">
                        <input type="checkbox" className="custom-control-input" id={`quickActiveSwitch-${user.id}`} checked={user.isActive} onChange={OnChangeAccActive} />
                        <label className="custom-control-label" htmlFor={`quickActiveSwitch-${user.id}`}>&nbsp;</label>
                    </div>
                </nobr>
                {/* {user.isActive ?
                    <nobr>{'Activate'}</nobr> :
                    <nobr className="text-muted">{'Deactivate'}</nobr>} */}
            </td>
            <td className="">
                {/* <nobr>{user.roleData?.name === SUPER_ADMIN ? 'Super Admin' : 'User'}</nobr> */}
                <nobr>
                    <div className="custom-control custom-switch ml-2">
                        <input type="checkbox" className="custom-control-input" id={`quickSettingSwitch-${user.id}`} checked={user.roleData?.name === SUPER_ADMIN} onChange={OnChangeUserRole} />
                        <label className="custom-control-label" htmlFor={`quickSettingSwitch-${user.id}`}>
                            {user.roleData?.name === SUPER_ADMIN ? 'Super Admin' : 'User'}
                        </label>
                    </div>
                </nobr>
            </td>
            <td>
                <nobr className="d-flex more_items">
                    {/* <div className="item p-4_8 mx-1 cursor-pointer"
                    // onClick={() => { dispatch(changeModel(USER_DETAILS)) }}
                    >
                        <EyeSvg color='#aaa' />
                    </div> */}
                    <div className="item p-4_8 mx-1 cursor-pointer" onClick={() => OnClickUpdateUser()}>
                        <EditSvg color='#665dfe' />
                    </div>
                    <div className="item p-4_8 text-danger mx-1 cursor-pointer" onClick={() => deleteAccount({ userId: user.id, page })}>
                        <DeleteSvg />
                    </div>
                </nobr>
            </td>
        </tr>
    )
}
