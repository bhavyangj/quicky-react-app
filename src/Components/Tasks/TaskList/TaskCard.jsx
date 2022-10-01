import React, { useState } from 'react'
import { Draggable } from "react-beautiful-dnd";
import { ReactComponent as PlusSvg } from "../../../assets/media/heroicons/outline/plus.svg";
import { ReactComponent as TaskStarted } from "../../../assets/media/heroicons/task-started.svg";
import { ReactComponent as TaskPaused } from "../../../assets/media/heroicons/task-paused.svg";
import { ReactComponent as TaskPending } from "../../../assets/media/heroicons/task-pending.svg";
import { ReactComponent as TaskCompleted } from "../../../assets/media/heroicons/task-completed.svg";
import classes from "../TasksPage.module.css";

import ListCard from "./ListCard";

export const TaskCard = ({
    card,
    user,
    index,
    activeTaskList,
    activeTaskChat,
    addNewTaskHandler,
    taskDeleteHandler,
}) => {
    const [addCardFlag, setAddCardFlag] = useState(false);
    const tasks = activeTaskList.filter((item) => item.type === card.id);
    const tasksArr = {
        pending: tasks?.filter(task => task.status === "pending"),
        started: tasks?.filter(task => task.status === "started"),
        paused: tasks?.filter(task => task.status === "paused"),
        completed: tasks?.filter(task => task.status === "finished"),
    }

    return (
        <Draggable draggableId={card.id.toString()} index={index} type="card" isDragDisabled={true}>
            {(provided) => (
                <div className='accordion' ref={provided.innerRef}>
                    <div className={`${classes["accordion-item"]} accordion-item`}>
                        <div className="d-flex">
                            <div
                                className="accordion-button collapsed cursor-pointer d-flex"
                                data-bs-toggle="collapse"
                                data-bs-target={`#panelsStayOpen-collapse-${card.id}`}
                                aria-expanded="false"
                                aria-controls={`panelsStayOpen-collapse-${card.id}`}
                            >
                                <div className={`${classes.title}`}>{card.title}</div>
                                <div className={`d-flex ${classes["column-title"]} py-0`}>
                                    <div className={`${classes["task-options"]} w-100`}>
                                        {!!tasksArr.pending &&
                                            <div className="d-flex align-items-center task-card-svg"
                                                title='Pending tasks'>
                                                <div className="svg-wrap">
                                                    <TaskPending />
                                                </div>
                                                <p className="mb-0">
                                                    {tasksArr.pending.length}
                                                </p>
                                            </div>}
                                        {!!tasksArr.started &&
                                            <div className="d-flex align-items-center task-card-svg"
                                                title='Started tasks'>
                                                <div className="svg-wrap">
                                                    <TaskStarted />
                                                </div>
                                                <p className="mb-0">
                                                    {tasksArr.started.length}
                                                </p>
                                            </div>}
                                        {!!tasksArr.paused &&
                                            <div className="d-flex align-items-center task-card-svg"
                                                title='Paused tasks'>
                                                <div className="svg-wrap">
                                                    <TaskPaused />
                                                </div>
                                                <p className="mb-0">
                                                    {tasksArr.paused.length}
                                                </p>
                                            </div>}
                                        {!!tasksArr.completed &&
                                            <div className="d-flex align-items-center task-card-svg"
                                                title='Finished tasks'>
                                                <div className="svg-wrap">
                                                    <TaskCompleted />
                                                </div>
                                                <p className="mb-0">
                                                    {tasksArr.completed.length}
                                                </p>
                                            </div>}
                                    </div>
                                </div>
                            </div>
                            {activeTaskChat && activeTaskChat.id !== 0 && <div className={`btn text-white fs-14 ${classes["add-task-block"]} ${classes["demi-bold-text"]} p-0 ml-auto mr-2`} onClick={() => setAddCardFlag(!addCardFlag)}>
                                <PlusSvg width={14} />
                                <span>Add a new Task</span>
                            </div>}
                        </div>
                        <div id={`panelsStayOpen-collapse-${card.id}`} className={`accordion-collapse collapse show`} aria-labelledby={`card-${card.id}`}>
                            <div className="accordion-body">
                                <ListCard
                                    title={card.title}
                                    card={card}
                                    tasks={tasks}
                                    droppableId={card.id}
                                    addNewTaskHandler={addNewTaskHandler}
                                    taskDeleteHandler={taskDeleteHandler}
                                    activeTaskChat={activeTaskChat}
                                    addCardFlag={addCardFlag}
                                    setAddCardFlag={setAddCardFlag}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    )
}
