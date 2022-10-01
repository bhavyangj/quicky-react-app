import React from 'react'
import { ReactComponent as CloseSvg } from '../../../../../assets/media/heroicons/outline/x.svg';

export const CancelEditButton = (props) => {
    return (
        <div className="btn btn-icon send-icon rounded-circle text-light mb-1 user-menu-container cancel-edit-button"
            onClick={() => props.onCancelEdit()}
        >
            <CloseSvg className='hw-18' />
        </div>);
}
