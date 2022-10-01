import React from 'react'
import { useDispatch } from 'react-redux';
import { changeModel } from '../../../redux/actions/modelAction';

export const InviteOthers = () => {
    const dispatch = useDispatch();
    return (<>
        <div className="modal modal-lg-fullscreen fade show" id="inviteOthers" tabIndex={-1} role="dialog" aria-labelledby="inviteOthersLabel" aria-modal="true" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-dialog-zoom">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="inviteOthersLabel">Invite Others</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => dispatch(changeModel(""))}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body hide-scrollbar">
                        <form>
                            <div className="row">
                                <div className="col-12">
                                    <div className="form-group">
                                        <label htmlFor="inviteEmailAddress">Email address</label>
                                        <input type="email" className="form-control form-control-md" id="inviteEmailAddress" placeholder="Type email address here" defaultValue />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                        <label htmlFor="inviteMessage">Invitation message</label>
                                        <textarea className="form-control form-control-md no-resize hide-scrollbar" id="inviteMessage" placeholder="Write your message here" rows={3} defaultValue={""} />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-link text-muted" data-dismiss="modal" onClick={() => dispatch(changeModel(""))}>Close</button>
                        <button type="button" className="btn btn-primary">Send Invitation</button>
                    </div>
                </div>
            </div>
        </div>
    </>);
}
