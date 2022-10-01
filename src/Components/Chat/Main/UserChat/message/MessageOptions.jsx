import { DEFAULT_IMAGE } from '../../../../Layout/HomePage/HomePage';

export const MessageOptions = ({ item, pTime, prevMsg, activeChat, user }) => {
    return (<>
        {/* <!-- Message Options --> && item.sendBy !== user.id */}
        {(prevMsg?.sendBy !== item.sendBy) &&
            <div className="message-options position-relative z-index-1">
                <div className="avatar avatar-sm sm-transition">
                    <img alt="" src={item.sendByDetail.profilePicture ? item.sendByDetail.profilePicture : DEFAULT_IMAGE} />
                </div>
            </div>}
    </>
    )
}