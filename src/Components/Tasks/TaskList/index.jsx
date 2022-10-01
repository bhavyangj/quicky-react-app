import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { TaskCard } from "./TaskCard";

export default function TaskList({
	activeTaskChat,
	taskCards,
	activeTaskList,
	addNewTaskHandler,
	taskDeleteHandler,
	user
}) {
	return (<>
		<div className="flex-1 p-2">
			<DragDropContext>
				<Droppable droppableId="card" type="card" direction="vertical">
					{(provided) => (
						<div className="accordion" id="TaskListViewAccordion" ref={provided.innerRef}>
							{taskCards.map((card, index) => (
								<TaskCard
									key={card.id}
									card={card}
									user={user}
									index={index}
									activeTaskChat={activeTaskChat}
									activeTaskList={activeTaskList}
									addNewTaskHandler={addNewTaskHandler}
									taskDeleteHandler={taskDeleteHandler}
								/>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</div>
	</>);
}
