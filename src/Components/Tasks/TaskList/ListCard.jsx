import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import ListTaskItem from "./ListTaskItem";

import classes from "../TasksPage.module.css";
import { GROUP } from "../../Chat/Models/models";
import { ReactComponent as ExclamationSVG } from "../../../assets/media/heroicons/outline/exclamation.svg";
import { ReactComponent as CheckSvg } from "../../../assets/media/heroicons/outline/check.svg";
import ReactDatePicker from "react-datepicker";
import { useDetectClickOutside } from "react-detect-click-outside";
import { compareName } from "../../Chat/Main/UserChat/info/group-chat-info/GroupChatInfo";

export default function ListCard({
	tasks,
	droppableId,
	card,
	addNewTaskHandler,
	taskDeleteHandler,
	activeTaskChat,
	setShowDetails,
	addCardFlag,
	setAddCardFlag,
	user
}) {
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
	if (activeTaskChat)
		return (<>
			<div className="table-responsive table-tasks">
				{!!tasks.length &&
					<table className={`table table-dark table-hover w-100 mt-2 mb-1 ${classes["table-task-list"]}`}>
						<thead>
							<tr className="list-task-table-row">
								<th>Title</th>
								<th></th>
								<th>Status</th>
								<th className="text-center">Subtasks</th>
								<th className="text-center">Due Date</th>
								<th className="text-center">Labels</th>
								{activeTaskChat.type === GROUP && <th className="text-center">Members</th>}
								<th className="text-center">Comments</th>
								<th className="text-center">Attachments</th>
							</tr>
						</thead>
						<Droppable droppableId={droppableId.toString()} type="task" direction="vertical">
							{(provided, snapshot) => (
								<tbody ref={provided.innerRef}>
									{tasks.map((task, index) => (
										<ListTaskItem
											key={task.id}
											task={task}
											index={index}
											taskDeleteHandler={taskDeleteHandler}
											setShowDetails={setShowDetails}
											activeTaskChat={activeTaskChat}
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
						<p className="mb-0">No task available</p>
					</div>
				)}
			</div>
			{addCardFlag && (
				<div className={`p-1 d-flex justify-content-center`}>
					<form onSubmit={addNewTask}>
						<div className={`d-flex align-items-center ${classes["gap-2"]}`}>
							<div className="form-group ">
								<label htmlFor="subject" className="mb-1">
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
							<div className="form-group">
								<label htmlFor="patient" className="mb-1">
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
							<div className="form-group">
								<label htmlFor="title" className="mb-1">
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
							<div className="form-group">
								<label htmlFor="subject" className="mb-1">
									Assign to:
								</label>
								<div className="d-flex align-items-center">

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
						</div>
						<div className={`text-center ${classes.action}`}>
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
		</>);
}
