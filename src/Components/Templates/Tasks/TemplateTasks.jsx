import React, { useState } from 'react'
import { useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { GET_TEMPLATE_TASK_DETAIL } from '../../../redux/constants/taskConstants';
import { ListenNewTemplateTasks, ListenTemplateTasks } from '../../../utils/wssConnection/Listeners/TemplateListeners';
import { getTemplateTasks } from '../../../utils/wssConnection/wssConnection';
import classes from "../../Tasks/TasksPage.module.css";
import { FilterTasks } from './FilterTasks';
import { TaskCard } from './TaskCard';
import { TemplateTaskDetails } from './TaskDetails/TemplateTaskDetails';

export const TemplateTasks = () => {
    const dispatch = useDispatch();
    const { templateTasksCards, templateTaskDetail } = useSelector((state) => state.task);
    const [filters, setFilters] = useState({
        type: "All Tasks",
        search: ""
    });

    useEffect(() => {
        dispatch(ListenNewTemplateTasks());
        dispatch(ListenTemplateTasks());
        getTemplateTasks({});
    }, [dispatch]);

    const onGetTaskDetails = (task) => {
        dispatch({ type: GET_TEMPLATE_TASK_DETAIL, payload: task });
    }
    const onCloseTaskDeatails = () => {
        dispatch({ type: GET_TEMPLATE_TASK_DETAIL, payload: null });
    }
    return (<>
        <div className={`text-light w-100 ${classes["page-layout"]}`}>
            <FilterTasks filters={filters} setFilters={setFilters} />
            <div className="flex-1 p-2">
                <DragDropContext>
                    <Droppable droppableId="card" type="card" direction="vertical">
                        {(provided) => (
                            <div className="accordion" id="TaskListViewAccordion" ref={provided.innerRef}>
                                {templateTasksCards.map((card, index) => (
                                    <TaskCard
                                        key={card.id}
                                        card={card}
                                        index={index}
                                        filters={filters}
                                        onGetTaskDetails={onGetTaskDetails}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
        {templateTaskDetail && (<>
            <div className="backdrop backdrop-visible task-backdrop" />
            <TemplateTaskDetails onClose={() => onCloseTaskDeatails()} task={templateTaskDetail} />
        </>
        )}
    </>);
}
