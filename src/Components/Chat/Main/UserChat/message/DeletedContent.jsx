import React from 'react'
import { SUPER_ADMIN } from '../../../../../redux/constants/userContants'
import { showDeletedMessage } from '../../../../../utils/wssConnection/wssConnection'
import { getBackgroundColorClass } from '../UserChat'
import { MessageFooter, MessageHeader } from './MessageContent'

export const DeletedContent = ({ item, user, isAdmin, prevMsg, pTime }) => {
    return (
        <div className={`message-content ${!item?.isMessage ? 'task-msg-border' : ''} ${getBackgroundColorClass(item.type)}`}>
            <MessageHeader user={user} item={item} prevMsg={prevMsg} pTime={pTime} />
            <span className='deleted-message text-white-70'>
                {`This ${item.isMessage ? 'Message' : 'Task'} was Deleted`}
            </span>
            {(user.roleData.name === SUPER_ADMIN) &&
                <span className='show-deleted-message ml-1 cursor-pointer font-weight-semibold' onClick={() => showDeletedMessage(item.chatId, item.id)}>show</span>}
            <MessageFooter user={user} item={item} />
        </div>
    )
}
