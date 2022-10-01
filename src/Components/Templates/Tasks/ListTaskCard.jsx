import React from 'react'
import { Droppable } from 'react-beautiful-dnd';
import classes from "../../Tasks/TasksPage.module.css";
import { ReactComponent as ExclamationSVG } from "../../../assets/media/heroicons/outline/exclamation.svg";
import { TemplateTaskItem } from './TemplateTaskItem';

export const ListTaskCard = ({
    tasks, droppableId,
    onGetTaskDetails
}) => {

    return (<>
        <div className="table-responsive table-tasks">
            {!!tasks.length &&
                <table className={`table table-dark table-hover w-100 mt-2 mb-1 ${classes["table-task-list"]}`}>
                    <thead>
                        <tr className="list-task-table-row">
                            <th>Subject</th>
                            <th>Type</th>
                            <th>Task</th>
                        </tr>
                    </thead>
                    <Droppable droppableId={droppableId.toString()} type="task" direction="vertical">
                        {(provided, snapshot) => (
                            <tbody ref={provided.innerRef}>
                                {tasks.map((task, index) => (
                                    <TemplateTaskItem
                                        key={task.id}
                                        task={task}
                                        index={index}
                                        onGetTaskDetails={onGetTaskDetails}
                                    />
                                ))}
                                {provided.placeholder}
                            </tbody>
                        )}
                    </Droppable>
                </table>}
            {!tasks.length && (
                <div className="text-center text-muted align-items-center">
                    <ExclamationSVG />
                    <p className="mb-0">No Templates available</p>
                </div>
            )}
        </div>
    </>);
}
