import React, { useState } from 'react'
import classes from "../../Tasks/TasksPage.module.css";
import { ReactComponent as PlusSvg } from "../../../assets/media/heroicons/outline/plus.svg";
import { ListTaskCard } from './ListTaskCard';
import { useSelector } from 'react-redux';
import { AddTemplateTask } from './AddTemplateTask';

export const TaskCard = ({ card, addNewTaskHandler, onGetTaskDetails, filters }) => {
    const { templateTaskList } = useSelector((state) => state.task);
    const [addCardFlag, setAddCardFlag] = useState(false);
    return (<>
        <div className='accordion'>
            <div className={`${classes["accordion-item"]} accordion-item`}>
                <div className="d-flex">
                    <div
                        className="accordion-button collapsed cursor-pointer"
                        data-bs-toggle="collapse"
                        data-bs-target={`#panelsStayOpen-collapse-1`}
                        aria-expanded="false"
                        aria-controls={`panelsStayOpen-collapse-1`}
                    >
                        <div className={`${classes.title}`}>{`Template Tasks`}</div>
                    </div>
                    {<div className={`btn text-white fs-14 ${classes["add-task-block"]} ${classes["demi-bold-text"]} p-0 ml-auto mr-2`} onClick={() => { setAddCardFlag(true) }}>
                        <PlusSvg width={14} />
                        <span>Add a new Task</span>
                    </div>}
                </div>
                <div id={`panelsStayOpen-collapse-1`} className={`accordion-collapse collapse show`} aria-labelledby={`card-1`}>
                    <div className="accordion-body">
                        <ListTaskCard
                            title={card.title}
                            card={card}
                            tasks={
                                templateTaskList.filter((item) => ((filters.type === "All Tasks" || filters.type === item.type)))
                                    .filter((item) => (item.title.toLowerCase().includes(filters.search.toLowerCase()) || item.subject.toLowerCase().includes(filters.search.toLowerCase()) || filters.search === ""))
                            }
                            droppableId={card.id}
                            addNewTaskHandler={addNewTaskHandler}
                            onGetTaskDetails={onGetTaskDetails}
                            addCardFlag={addCardFlag}
                            setAddCardFlag={setAddCardFlag}
                        />
                    </div>
                </div>
            </div>
        </div>
        {addCardFlag && (<>
            <div className="backdrop backdrop-visible task-backdrop" />
            <AddTemplateTask onClose={() => setAddCardFlag(false)} />
        </>
        )}
    </>);
}