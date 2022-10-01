import React from 'react'
import classes from "../../Issues.module.css";

export const RequestSolution = () => {
    return (
        <div className={`${classes['new-issue-request']} bg-dark p-2 mt-2`}>
            <div className=''>
                <h6 className='mb-1'>
                    <span className='mr-1'>Solution:</span>
                </h6>
                <div><span className='text-white-70 fs-14'>Solution will be appear here</span></div>
            </div>
        </div>
    )
}
