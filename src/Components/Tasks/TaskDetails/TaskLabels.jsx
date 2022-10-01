import React from 'react'

export const TaskLabels = ({ taskDetails, taskLabels }) => {
    return (
        <div className="col-sm-6 col-md-12">
            <div className="card mb-2">
                <div className="card-body p-2 text-center">
                    <h6>Labels</h6>
                    {taskDetails.label.length === 0 && <span>No Labels Attached</span>}
                    {taskDetails.label.map((label) => {
                        const labelObj = taskLabels?.filter((item) => item.id === Number(label)).shift();
                        if (labelObj)
                            return (<span className={`badge text-white mr-1 p-1 bg-${labelObj.color}`} key={labelObj.id}>
                                {labelObj.name}
                            </span>)
                        return null;
                    })}
                </div>
            </div>
        </div>
    );
}                        
