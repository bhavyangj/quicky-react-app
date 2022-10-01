import React from 'react'
import * as momentTimzone from 'moment-timezone';
import { DEFAULT_IMAGE } from '../../../Layout/HomePage/HomePage'

export const MessageReader = ({ item }) => {
    return (
        <li className="list-group-item">
            <div className="media align-items-center">
                <div className="avatar mr-2">
                    <img src={item.user.profilePicture ? item.user.profilePicture : DEFAULT_IMAGE} alt="" />
                </div>
                <div className="media-body">
                    <h6 className="text-truncate">
                        <div className="text-reset text-capitalize">{item.user.name}</div>
                    </h6>
                    <p className="text-muted mb-0">{momentTimzone(item.updatedAt).format("MMMM DD, hh:mm A")}</p>
                </div>
            </div>
        </li>
    )
}
