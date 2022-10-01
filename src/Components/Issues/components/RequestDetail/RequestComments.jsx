import React from 'react'
import classes from "../../Issues.module.css";

export const RequestComments = () => {
    return (
        <div className={`${classes['new-issue-request']} bg-dark p-2 mt-2`}>
            <div className=''>
                <h6 className='mb-1'>
                    <span className='mr-1'>Comments:</span>
                </h6>
                <div><span className='text-white-70 fs-14'>Comments will be appear here</span></div>
            </div>
        </div>
    )
}
