import React from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { changeModel } from '../../../redux/actions/modelAction';
import { USER_DETAILS } from '../../Chat/Models/models';

export const UserDetails = () => {
    const dispatch = useDispatch();
    const { name } = useSelector((state) => state.model);
    return (<>
        <div className={`modal modal-lg-fullscreen fade ${name === USER_DETAILS ? 'show d-block' : ''}`} data-toggle="modal" id="startConversation" tabIndex={-1} role="dialog" aria-labelledby="startConversationLabel" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-dialog-zoom">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="startConversationLabel">User Details</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => dispatch(changeModel(""))}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body p-0 hide-scrollbar employee-performance m-1">
                        <div className="task-performance">
                            <p className='text-light'>Task Performance</p>
                            <div className="row m-0 d-flex flex-wrap justify-content-center">
                                <div className="text-center custom-box-task m-1 pending">
                                    <p className='mb-0'>Pending: {1}</p>
                                </div>
                                <div className="text-center custom-box-task m-1 started">
                                    <p className='mb-0'>Started: {2}</p>
                                </div>
                                <div className="text-center custom-box-task m-1 paused">
                                    <p className='mb-0'>Paused: {3}</p>
                                </div>
                                <div className="text-center custom-box-task m-1 finished">
                                    <p className='mb-0'>Finished: {4}</p>
                                </div>
                            </div>
                        </div>
                        <div className="pending-message">
                            <p className='text-light'>Unread Messages</p>
                            <div className="row m-0 d-flex flex-wrap justify-content-center">
                                <div className="text-center custom-box-task m-1 urgent">
                                    <p className='mb-0'>Urgent: {1}</p>
                                </div>
                                <div className="text-center custom-box-task m-1 emergency">
                                    <p className='mb-0'>Emergency: {2}</p>
                                </div>
                                <div className="text-center custom-box-task m-1 routine">
                                    <p className='mb-0'>Routine: {3}</p>
                                </div>
                                <div className="text-center custom-box-task m-1 mentioned">
                                    <p className='mb-0'>Mentioned: {4}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary" onClick={() => { }}>Example</button>
                    </div>
                </div>
            </div>
        </div>
    </>);
}
