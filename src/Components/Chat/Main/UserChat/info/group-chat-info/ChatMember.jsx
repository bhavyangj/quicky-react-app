import { makeGroupAdmin, removeGroupAdmin, RemoveUserGroup } from '../../../../../../utils/wssConnection/wssConnection';
import { DEFAULT_IMAGE } from '../../../../../Layout/HomePage/HomePage';

export const ChatMember = (props) => {
    const onClickRemoveUser = () => RemoveUserGroup(props.item.chatId, props.item.userId);
    const makeUserAdmin = () => makeGroupAdmin(props.item.chatId, props.item.userId);
    const removeUserAdmin = () => removeGroupAdmin(props.item.chatId, props.item.userId);

    return (<li className="list-group-item">
        <div className="media align-items-center">
            <div className="avatar mr-2">
                <img src={props.item.user.profilePicture ? props.item.user.profilePicture : DEFAULT_IMAGE} alt="" />
            </div>
            <div className="media-body">
                <h6 className="text-truncate">
                    <div className="text-reset text-capitalize">{props.item.user.name}</div>
                </h6>
                <p className="text-muted mb-0">{props.item?.isAdmin ? 'Admin' : ''}</p>
            </div>
            {props.isUserAdmin && <div className="media-options ml-1">
                <div className="dropdown mr-2">
                    <button className="btn btn-secondary btn-icon btn-minimal btn-sm text-muted" id={`group-member-${props.item.userId}`} data-bs-toggle="dropdown">
                        <svg className="hw-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                    <ul className="dropdown-menu m-0" aria-labelledby={`group-member-${props.item.userId}`}>
                        {!props.item?.isAdmin ? <li className="dropdown-item" onClick={() => makeUserAdmin()}>Make admin</li>
                            : <li className="dropdown-item" onClick={() => removeUserAdmin()}>Remove as admin</li>}
                        <li className="dropdown-item" onClick={() => onClickRemoveUser()}>Remove from group</li>
                    </ul>
                </div>
            </div>}
        </div>
    </li>);
}