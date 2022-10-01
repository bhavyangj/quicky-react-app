import React from 'react'

export const EditTask = () => {
    return (<>
        <div className="modal modal-lg-fullscreen fade show" id="taskModal" tabIndex={-1} role="dialog" aria-labelledby="taskModalLabel" style={{ display: 'block' }} aria-modal="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-dialog-zoom">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="taskModalLabel">Edit task</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => { }}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="editTaskName" className="col-form-label">Task name:</label>
                                <input type="text" className="form-control" id="editTaskName" defaultValue="Dinner with friends" placeholder="Add task name here" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="editTaskDetails" className="col-form-label">Task details:</label>
                                <textarea className="form-control hide-scrollbar" id="editTaskDetails" rows={4} placeholder="Add task descriptions" defaultValue={"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Omnis temporibus vel, molestiae nobis dolor aut sapiente. Vero possimus molestias consequatur quod, quo rem autem molestiae, accusantium nemo culpa eos doloremque?\n                      "} />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light border" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-success">Finish</button>
                        <button type="button" className="btn btn-primary">Save</button>
                    </div>
                </div>
            </div>
        </div>
    </>);
}
