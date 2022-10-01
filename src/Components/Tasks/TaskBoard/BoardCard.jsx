import React, { useState } from "react";
import classes from "../TasksPage.module.css";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { ReactComponent as ExclamationSVG } from "../../../assets/media/heroicons/outline/exclamation.svg";
import { ReactComponent as PlusSvg } from "../../../assets/media/heroicons/outline/plus.svg";
import { ReactComponent as TaskStarted } from "../../../assets/media/heroicons/task-started.svg";
import { ReactComponent as TaskPaused } from "../../../assets/media/heroicons/task-paused.svg";
import { ReactComponent as TaskPending } from "../../../assets/media/heroicons/task-pending.svg";
import { ReactComponent as TaskCompleted } from "../../../assets/media/heroicons/task-completed.svg";
import { ReactComponent as CheckSvg } from "../../../assets/media/heroicons/outline/check.svg";

import BoardTaskCard from "./BoardTaskCard";
import ReactDatePicker from "react-datepicker";
import { compareName } from "../../Chat/Main/UserChat/info/group-chat-info/GroupChatInfo";
import { useDetectClickOutside } from "react-detect-click-outside";

export default function BoardCard({
	tasks,
	title,
	droppableId,
	index,
	card,
	addNewTaskHandler,
	taskDeleteHandler,
	activeTaskChat,
	user
}) {
	const [addCardFlag, setAddCardFlag] = useState(false);
	const [cardInput, setCardInput] = useState({
		title: "",
		patient: "",
		subject: "",
	});
	const [taskDueDate, setTaskDueDate] = useState();
	const dropdownTaskRef = useDetectClickOutside({ onTriggered: () => setShowMembers(false) });
	const [showMembers, setShowMembers] = useState(false);
	const [assignMembers, setAssignMem] = useState([]);

	const addNewTask = (e) => {
		e.preventDefault();
		if (cardInput.title === "" || !assignMembers.length)
			return;
		const data = {
			chatId: activeTaskChat.id,
			name: cardInput.title,
			subject: cardInput.subject,
			patient: cardInput.patient,
			dueDate: taskDueDate,
			description: "",
			assignMembers: assignMembers?.map((mem) => mem.user.id),
			type: card.id,
		}
		addNewTaskHandler(data, () => {
			setCardInput({
				title: "",
				patient: "",
				subject: "",

			});
			setTaskDueDate();
			setAssignMem([]);
		});
		setAddCardFlag(false);
	};
	const addMemberHandler = (member) => {
		if (assignMembers.some((mem) => mem.user.id === member.user.id)) {
			setAssignMem((prev) => (prev.filter((mem) => mem.user.id !== member.user.id)));
		} else {
			setAssignMem((prev) => ([member, ...prev]));
		}
	};
	const tasksArr = {
		pending: tasks?.filter(task => task.status === "pending"),
		started: tasks?.filter(task => task.status === "started"),
		paused: tasks?.filter(task => task.status === "paused"),
		completed: tasks?.filter(task => task.status === "finished"),
	}
	return (
		<Draggable draggableId={droppableId.toString()} index={index} type="card" isDragDisabled={true}>
			{(provided) => (
				<div ref={provided.innerRef} className={`${classes["board-card"]} ${classes["roe-box-shadow"]} pb-2`}>
					<div className="">
						<div className={`d-flex ${classes["column-title"]}`}>
							<div className={`${classes.title}`}>{title}</div>
							{activeTaskChat && activeTaskChat.id !== 0 && <div className={`btn text-white fs-14 ${classes["add-task-block"]} ${classes["add-board-task"]} ${classes["demi-bold-text"]} p-0 ml-auto`} onClick={() => setAddCardFlag(true)}>
								<PlusSvg width={14} />
							</div>}
						</div>
						<div className={`d-flex ${classes["column-title"]} pt-0`}>
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
					<Droppable droppableId={`${droppableId}-${card.id}`} type="task" direction="vertical">
						{(provided) => (
							<div ref={provided.innerRef} className={`${classes["board-card-scroll"]} ${addCardFlag ? classes["board-card-height"] : ""}`}>
								{!!tasks.length &&
									tasks.map((task, index) => (
										<BoardTaskCard
											key={task.id}
											task={task}
											index={index}
											user={user}
											taskDeleteHandler={taskDeleteHandler}
										/>
									))}
								{!tasks.length && (<div className="text-center">
									<ExclamationSVG />
									<p className="mb-0">
										No task available
									</p>
								</div>
								)}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
					{addCardFlag && (
						<div className={`${classes["add-card-input-block"]}`}>
							<form onSubmit={addNewTask}>
								<div>
									<div className="d-flex align-items-center mb-1">
										<label htmlFor="subject" className="mb-0 mr-1 fs-14">
											Subject:
										</label>
										<input
											type="text"
											id="subject"
											value={cardInput.subject}
											onChange={(e) => {
												setCardInput((prev) => ({
													...prev,
													subject: e.target.value,
												}));
											}}
											className={`${classes["form-control"]} form-control p-4_8 fs-14 w-100`}
										/>
									</div>
									<div className="d-flex align-items-center mb-1">
										<label htmlFor="patient" className="mb-0 mr-1 fs-14">
											Patient:
										</label>
										<input
											type="text"
											id="patient"
											value={cardInput.patient}
											onChange={(e) => {
												setCardInput((prev) => ({
													...prev,
													patient: e.target.value,
												}));
											}}
											className={`${classes["form-control"]} form-control p-4_8 fs-14 w-100`}
										/>
									</div>
									<div className="d-flex align-items-center mb-1">
										<label htmlFor="title" className="mb-0 mr-1 fs-14">
											Title:
										</label>
										<input
											type="text"
											id="title"
											autoFocus
											value={cardInput.title}
											onChange={(e) => {
												setCardInput((prev) => ({
													...prev,
													title: e.target.value,
												}));
											}}
											className={`${classes["form-control"]} form-control p-4_8 fs-14 w-100`}
										/>
									</div>
									<div className="d-flex align-items-center mb-1">
										<div className="text-left">
											<div className="dropdown show chat-member-dropdown" ref={dropdownTaskRef}>
												<button className="dropdown-toggle btn btn-sm bg-dark-f text-white-70 p-4_8"
													title={`${!!assignMembers.length ? `Assigned to: ${assignMembers.map((item) => item.user.name).join(", ")}` : 'Click to assign members'}`}
													onClick={() => setShowMembers(!showMembers)}>
													<span className="fs-13">{`Members (${assignMembers?.length})`}</span>

												</button>
												{showMembers && <ul className="dropdown-menu text-light show">
													{activeTaskChat?.chatusers.sort(compareName)
														.map((member) => (
															<li key={member.user.id} className={`dropdown-item cursor-pointer`} onClick={() => addMemberHandler(member)}>
																{/* <div id={`member-${member.user.id}`} className={`chatbox-member-btn`}>
                                                                <img src={member.user.profilePicture ? member.user.profilePicture : DEFAULT_IMAGE} alt="m" />
                                                            </div> */}
																<div className="d-flex justify-content-between w-100">
																	<span>{member.user.name}</span>
																	<span>
																		{!!assignMembers.filter((mem) => mem.user.id === member.user.id).length ? (<CheckSvg className="hw-16" />) : ("")}
																	</span>
																</div>
															</li>
														))}
												</ul>}
											</div>
										</div>
										<div className="ml-1 flex-nowrap">
											<ReactDatePicker
												id="dueDate"
												placeholderText="Due Date"
												className="form-control text-white bg-dark-f p-4_8"
												selected={taskDueDate ? new Date(taskDueDate) : null}
												value={taskDueDate ? new Date(taskDueDate) : null}
												onChange={(date) => setTaskDueDate(date)}
												isClearable={true}
												autoComplete='off'
												minDate={new Date()}
											/>
										</div>
									</div>
								</div>
								<div className={`${classes.action}`}>
									<button className={`btn btn-primary mr-2 p-4_8`} type="submit" title={`${!assignMembers?.length ? 'Please Assign members' : 'Add task'}`}>
										Add Task
									</button>
									<button className={`btn btn-light border p-4_8`} onClick={() => setAddCardFlag(false)}>
										Cancel
									</button>
								</div>
							</form>
						</div>
					)}
				</div>
			)}
		</Draggable>
	);
}