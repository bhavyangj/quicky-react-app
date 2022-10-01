import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import classes from "../TasksPage.module.css";
import BoardCard from "./BoardCard";

export default function TaskBoard({
	activeTaskChat,
	taskCards,
	activeTaskList,
	addNewTaskHandler,
	taskDeleteHandler,
	user
}) {
	return (<>
		<div className="flex-1">
			{activeTaskChat &&
				<DragDropContext>
					<Droppable droppableId="card" type="card" direction="horizontal" isDragging={true}>
						{(provided) => (
							<div className={`${classes.scrumboard}`} ref={provided.innerRef}>
								{taskCards.map((card, index) => (
									<React.Fragment key={card.id}>
										<BoardCard
											title={card.title}
											tasks={activeTaskList.filter((item) => item.type === card.id)}
											activeTaskChat={activeTaskChat}
											droppableId={card.id}
											index={index}
											addNewTaskHandler={addNewTaskHandler}
											taskDeleteHandler={taskDeleteHandler}
											card={card}
											user={user}
										/>
									</React.Fragment>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>}
		</div>
	</>);
}