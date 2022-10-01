import React from 'react'

export const AddTask = () => {
    return (<>
        <div className="modal modal-lg-fullscreen fade show" id="addTaskModal" tabIndex={-1} role="dialog" aria-labelledby="addTaskModalLabel" aria-modal="true" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-dialog-zoom">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="addTaskModalLabel">Add new task</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { }}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="addTaskName" className="col-form-label">Task name:</label>
                                <input type="text" className="form-control" id="addTaskName" defaultValue placeholder="Add task name here" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="addTaskDetails" className="col-form-label">Task details:</label>
                                <textarea className="form-control hide-scrollbar" id="addTaskDetails" rows={4} placeholder="Add task descriptions" defaultValue={""} />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light border" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Add task</button>
                    </div>
                </div>
            </div>
        </div>
    </>);
}
