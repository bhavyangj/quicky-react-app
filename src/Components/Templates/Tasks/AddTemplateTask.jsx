import React, { useState } from 'react'
import { ReqNewTemplateTask } from '../../../utils/wssConnection/wssConnection';
import { EMERGENCY, ROUTINE, URGENT } from '../../Chat/Main/UserChat/footer/ChatFooter';

export const AddTemplateTask = ({ onClose }) => {
    const [error, setError] = useState();
    const [cardInput, setCardInput] = useState({
        title: "",
        subject: "",
        type: "routine"
    });
    const addNewTask = (e) => {
        e.preventDefault();
        if (cardInput.title !== "") {
            if (error) setError();
            ReqNewTemplateTask(cardInput);
            setCardInput({
                title: "",
                subject: "",
                type: "routine"
            });
            onClose();
        } else {
            setError("Task Description is Required");
        }
    }
    return (<>
        <div className={`modal modal-lg-fullscreen fade show d-block`} id="addNoteModal" tabIndex={-1} role="dialog" aria-labelledby="addNoteModalLabel" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-dialog-zoom">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="addNoteModalLabel">New Template Task</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onClose}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={addNewTask}>
                            <div className="form-group">
                                <label htmlFor="addTaskSubject" className="col-form-label">Subject:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="addTaskSubject"
                                    value={cardInput.subject}
                                    onChange={(e) => setCardInput((prev) => ({
                                        ...prev,
                                        subject: e.target.value
                                    }))}
                                    placeholder="Add task subject" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="addTaskDetail" className="col-form-label">Task description:</label>
                                {error && <p className='fs-12 text-danger mb-0'>{error}</p>}
                                <textarea
                                    className="form-control hide-scrollbar"
                                    id="addTaskDetail"
                                    rows={4}
                                    value={cardInput.title}
                                    onChange={(e) => setCardInput((prev) => ({
                                        ...prev,
                                        title: e.target.value
                                    }))}
                                    placeholder="Add task description" />
                            </div>
                            <div className="form-group d-flex m-0">
                                <label className="col-form-label">Task type:</label>
                                <div className="dropdown ml-2">
                                    <button className="btn btn-outline-default dropdown-toggle text-capitalize" id="TasktypeDropdown" data-bs-toggle="dropdown" type="button">
                                        {cardInput.type}
                                    </button>
                                    <ul className="dropdown-menu m-0" aria-labelledby="TasktypeDropdown">
                                        <li className="dropdown-item" onClick={() => setCardInput((prev) => ({
                                            ...prev,
                                            type: ROUTINE
                                        }))}>
                                            Routine
                                        </li>
                                        <li className="dropdown-item" onClick={() => setCardInput((prev) => ({
                                            ...prev,
                                            type: EMERGENCY
                                        }))}>
                                            Emergency
                                        </li>
                                        <li className="dropdown-item" onClick={() => setCardInput((prev) => ({
                                            ...prev,
                                            type: URGENT
                                        }))}>
                                            Urgent
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light border" data-dismiss="modal" onClick={onClose}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={addNewTask}>Add Template</button>
                    </div>
                </div>
            </div>
        </div>
    </>);
}
