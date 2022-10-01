import React from 'react'
import { Draggable } from 'react-beautiful-dnd';
// import classes from "../../Tasks/TasksPage.module.css";

export const TemplateTaskItem = ({
    task, index, onGetTaskDetails
}) => {
    return (
        <Draggable
            key={task.id}
            draggableId={task.id.toString()}
            index={index}
            isDragDisabled={true}
            type="task"
        >
            {(provided) => (
                <tr className="template-task-table-row" ref={provided.innerRef} onClick={() => { onGetTaskDetails(task) }}>
                    <td className='subject-col'>{task.subject ? task.subject : '-'}</td>
                    <td className='type-col'>
                        <nobr className="text-capitalize">
                            {task?.type}
                        </nobr>
                    </td>
                    <td className="task-col">
                        <nobr>{task?.title}</nobr>
                    </td>
                </tr>
            )}
        </Draggable>
    );
}
