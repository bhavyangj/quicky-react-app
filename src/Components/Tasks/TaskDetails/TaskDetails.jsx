import React, { useRef, useState, useEffect } from "react";

import { ReactComponent as InfoSvg } from "../../../assets/media/heroicons/outline/information-circle.svg";
import { ReactComponent as TagSvg } from "../../../assets/media/heroicons/solid/tag.svg";
import { ReactComponent as EyeSvg } from "../../../assets/media/heroicons/outline/eye.svg";
import { ReactComponent as PlusSvg } from "../../../assets/media/heroicons/outline/plus.svg";
import { ReactComponent as ListSvg } from "../../../assets/media/heroicons/outline/clipboard-list.svg";
import { ReactComponent as CheckSvg } from "../../../assets/media/heroicons/outline/check.svg";

import classes from "./TaskDetails.module.css";
import * as momentTimzone from 'moment-timezone';
import DatePicker from "react-datepicker";
import { useSelector, useDispatch } from "react-redux";
import ReactImageVideoLightbox from "react-image-video-lightbox";
import { useDetectClickOutside } from "react-detect-click-outside";
import { TASK_STATUS } from "../config";

import { changeSubtaskStatus, CreateNewSubTask, DeleteAttachment, deleteSubtask } from "../../../redux/actions/taskAction";
import { ADD_NEW_SUBTASK, CHANGE_SUBTASK_STATUS, DELETE_SUBTASK } from "../../../redux/constants/taskConstants";
import { IMAGE_INDEX } from "../../../redux/constants/chatConstants";
import { AttachmentInput } from "./AttachmentInput";
import { TaskMembers } from "./TaskMembers";
import { TaskLabels } from "./TaskLabels";
import { TaskAttachment } from "./TaskAttachment";
import SubtaskDetails from "./SubtaskDetails";
import { changeProfileStatus, reqTaskLogs, sendNewTaskLog } from "../../../utils/wssConnection/wssConnection";
import { TimeTracker } from "./TimeTracker";
import { BUSY, FREE, SUPER_ADMIN } from "../../../redux/constants/userContants";
import { SaveNewTaskData } from "../../../utils/wssConnection/Listeners/Tasklistener";
import { CONST } from "../../../utils/constants";
import { TaskWorkingLogs } from "./TaskWorkingLogs";
import { TaskComments } from "./TaskComments";

const STATUS_ARR = TASK_STATUS.filter((status) => status.id !== 0);

export default function TaskDetails({ onClose, task, isTemplate = false }) {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.user);
	const { imageId } = useSelector((state) => state.chat);
	const { taskDetails: taskDetail, taskLabels } = useSelector((state) => state.task);
	const [showCompletedSubtasks, setShowCompletedSubtask] = useState(true);
	const [searchInput, setSearchInput] = useState("");
	const [taskDetails, setTaskDetails] = useState(taskDetail);
	const [isImageShow, setImageShow] = useState(false);
	const [addSubtaskFlag, setAddSubtaskFlag] = useState(false);
	const [labelMenu, setLabelMenu] = useState(false);
	const [showDesc, setShowDesc] = useState(false);
	const [isDisable, setDisableBtn] = useState(false);
	const [isTrackerRunning, setTracker] = useState(false);
	const textArea = useRef(null);
	const labelRef = useDetectClickOutside({ onTriggered: () => setLabelMenu(false) });

	useEffect(() => {
		if (!labelMenu && taskDetails)
			onTaskDetailsChanged(taskDetails.id, { label: taskDetails.label });
		//eslint-disable-next-line
	}, [labelMenu]);

	useEffect(() => {
		if (taskDetail) setTaskDetails(taskDetail);
	}, [taskDetail]);

	useEffect(() => {
		if (taskDetails.id)
			reqTaskLogs({ taskId: taskDetails.id });
	}, [taskDetails.id]);

	const addNewSubtask = async () => {
		if (textArea.current.value.trim() !== "") {
			const { data } = await CreateNewSubTask({
				title: textArea.current.value.trim(),
				taskId: taskDetail.id,
				chatId: taskDetail.chatId
			});
			if (taskDetails)
				dispatch({ type: ADD_NEW_SUBTASK, payload: data.data });
			textArea.current.value = "";
			textArea.current.focus();
		}
	};

	const closeAddingSubtask = () => {
		if (textArea.current.value.trim() === "")
			setAddSubtaskFlag(!addSubtaskFlag);
	};

	const subtaskStatusToggleHandler = async (id, currStatus) => {
		const newStatus = (currStatus === "pending") ? "finished" : "pending";
		const { data } = await changeSubtaskStatus({
			status: newStatus,
			subTaskId: id
		});
		if (taskDetails)
			dispatch({ type: CHANGE_SUBTASK_STATUS, payload: data.data });
	};

	const subtaskDeleteHander = async (id) => {
		const { data } = await deleteSubtask({ subTaskId: id });
		dispatch({ type: DELETE_SUBTASK, payload: data.data });
	};

	const statusChangeHandler = (stat) => {
		// setStatus(stat);
		if (stat.value !== taskDetail.status) {
			setTaskDetails((prev) => ({
				...prev,
				status: stat.value,
			}));
			const taskMembers = taskDetails?.taskmembers?.map((user) => user.userId);
			onTaskDetailsChanged(taskDetails.id, { status: stat.value, users: taskMembers });
		}
	};

	const attchmentDeleteHandler = async (id) => {
		try {
			await DeleteAttachment({ attachmentId: id });
			setTaskDetails((prev) => ({
				...prev,
				attachments: prev.attachments.filter((att) => att.id !== id),
			}));
		} catch (error) { }
	};

	const labelSelectHandler = (label) => {
		if (!taskDetails.label.filter((lab) => label.id === Number(lab)).length)
			setTaskDetails((prev) => ({ ...prev, label: [label.id, ...prev.label], }));
		else
			setTaskDetails((prev) => ({ ...prev, label: prev.label.filter((lab) => Number(lab) !== label.id), }));
	};

	const onCloseImageHandler = () => {
		setImageShow(false);
		dispatch({ type: IMAGE_INDEX, payload: 0 });
	}

	// save updated data
	const onTaskDetailsChanged = async (taskId, body) => {
		dispatch(SaveNewTaskData({
			taskId,
			chatId: taskDetails.chatId,
			messageId: taskDetails.messageId,
			...body
		}));
	}

	const onTaskToggler = (taskDetails) => {
		setTracker(!isTrackerRunning);
		if (!isTrackerRunning)
			reqTaskClockIn(taskDetails);
		else
			reqTaskClockOut(taskDetails);
	}

	const reqTaskClockIn = (taskDetails) => {
		sendNewTaskLog({ clockin: true, taskId: taskDetails.id, });
		changeProfileStatus(BUSY);
		setDisableBtn(true);
		setTimeout(() => { setDisableBtn(false); }, 2000);
	}

	const reqTaskClockOut = (taskDetails) => {
		sendNewTaskLog({ clockout: true, taskId: taskDetails.id, });
		changeProfileStatus(FREE);
		setDisableBtn(true);
		setTimeout(() => { setDisableBtn(false); }, 2000);
	}

	if (isImageShow)
		return (<div className="modal modal-lg-fullscreen fade show d-block task-image-gallery" id="imageGallery" tabIndex={-1} role="dialog" aria-labelledby="dropZoneLabel" aria-modal="true">
			<ReactImageVideoLightbox
				data={taskDetails.attachments
					.filter((item) => ["image", "video"].includes(item.mediaType.split("/").shift()))
					.map((item) => {
						const itemType = item.mediaType.split("/").shift();
						if (itemType === "video")
							return {
								...item,
								url: item.mediaUrl,
								type: "video",
								title: 'video title'
							}
						return {
							...item,
							url: item.mediaUrl,
							type: "photo",
							altTag: 'Alt Photo'
						}
					})}
				startIndex={taskDetails?.attachments
					.filter((item) => ["image", "video"].includes(item.mediaType.split("/").shift()))
					.findIndex((item) => item.id === imageId)}
				showResourceCount={true}
				onCloseCallback={onCloseImageHandler}
			/>
		</div>)
	if (taskDetails && taskDetails.subtasks) {
		const searchFilterTasks = taskDetails.subtasks
			.filter((st) => st.title.toLowerCase().includes(searchInput.toLowerCase()))
			.filter((subtask) => !showCompletedSubtasks ? subtask.status === "pending" : true);
		const AllowTracker = taskDetails.taskmembers.map((item) => item.userId).includes(user.id);
		return (
			<div
				className={`modal modal-lg-fullscreen fade show d-block ${classes["task-details-modal"]}`}
				data-toggle="modal"
				id="taskDetasils"
				tabIndex={-1}
				role="dialog"
				aria-labelledby="taskDetasilsLabel"
				aria-modal="true"
			>
				<div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable modal-dialog-zoom">
					<div className="modal-content modal-content-task-details">
						<div className="modal-header">
							<h5 className="modal-title" id="taskDetasilsLabel">
								{taskDetails?.name}
							</h5>
							<div className={`${classes.icons} d-flex align-items-center`}>
								<div className={classes.icon}>
									<AttachmentInput taskId={task.id} />
								</div>
								<div className={classes.icon}>
									<div title="Add Tags" className="dropdown m-0 show" ref={labelRef}>
										<div className="cursor-pointer" onClick={() => setLabelMenu(!labelMenu)}>
											<TagSvg />
										</div>
										{labelMenu && <ul className="dropdown-menu dropdown-menu-right text-light m-1 show">
											{taskLabels.map((label) => (
												<li key={label.id} className={`dropdown-item text-${label.color}`} onClick={() => { labelSelectHandler(label); }}>
													{label.name}
													{!!taskDetails.label.filter((lab) => label.id === Number(lab)).length ? (<CheckSvg />) : ("")}
												</li>
											))}
										</ul>}
									</div>
								</div>
								<div title="Task Description" onClick={() => setShowDesc(!showDesc)} className={`${classes.icon} ${showDesc ? "text-success" : ""}`}>
									<InfoSvg />
								</div>
								<button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onClose}>
									<span aria-hidden="true">×</span>
								</button>
							</div>
						</div>
						<div className="modal-body hide-scrollbar fs-14 p-2">
							<nav className='task-nav mb-2'>
								<div className="nav nav-tabs" id="nav-tab" role="tablist">
									<button className="nav-link active" id="nav-task-info-tab" data-bs-toggle="tab" data-bs-target="#nav-task-info" type="button" role="tab" aria-controls="nav-task-info" aria-selected="true">Task Info</button>
									{(user.roleData.name === SUPER_ADMIN || AllowTracker) &&
										<button className="nav-link" id="nav-task-logs-tab" data-bs-toggle="tab" data-bs-target="#nav-task-logs" type="button" role="tab" aria-controls="nav-task-logs" aria-selected="false">Task Logs</button>}
								</div>
							</nav>
							<div className="tab-content" id="nav-tabContent">
								<div className="tab-pane fade show active" id="nav-task-info" role="tabpanel" aria-labelledby="nav-task-info-tab">
									{showDesc && (
										<div className="row">
											<div className="col-12">
												<textarea
													className={classes["add-card-input"] + " w-100 p-1"}
													style={{ outline: 'none' }}
													name="description"
													value={taskDetails?.description}
													rows="2"
													onChange={(e) =>
														setTaskDetails((prev) => ({
															...prev,
															description: e.target.value,
														}))
													}
													onBlur={() => {
														if (taskDetail.description !== taskDetails.description) {
															setTaskDetails((prev) => ({
																...prev,
																description: taskDetails.description,
															}));
															onTaskDetailsChanged(taskDetails.id, { description: taskDetails.description });
														}
													}}
												></textarea>
											</div>
										</div>
									)}
									{/* {AllowTracker &&
										<TimeTracker
											taskDetails={taskDetails}
											onTaskToggler={onTaskToggler}
											isDisable={isDisable}
											isTrackerRunning={isTrackerRunning}
											setTracker={setTracker}
										/>} */}
									<div className="row justify-content-between m-auto">
										<div className="d-flex align-items-center due-date-input mr-1 mb-1">
											<label htmlFor="dueDate" className="pointer-cursor m-0 mr-1" title="Due Date">
												<nobr className="text-light">Due Date:</nobr>
											</label>
											<DatePicker
												id="dueDate"
												className={`${classes["form-control"]} form-control flex-grow-1 max-width-max-content min-width-min-content`}
												selected={taskDetails.dueDate ? new Date(taskDetails.dueDate) : null}
												value={new Date(taskDetails?.dueDate)}
												autoComplete="off"
												onChange={(date) => {
													onTaskDetailsChanged(taskDetails.id, {
														dueDate: momentTimzone(date).tz(CONST.TIMEZONE).toDate()
													});
													setTaskDetails((prev) => ({
														...prev,
														dueDate: Date.parse(date),
													}));
												}}
												minDate={momentTimzone().tz(CONST.TIMEZONE).toDate()}
												timeInputLabel="Time:"
												dateFormat="MM/dd/yyyy h:mm aa"
												showTimeInput
											/>
										</div>
										<div className="fs-16 bold-text d-flex align-items-center mb-1">
											<div className="mr-2 text-light">Status: </div>
											<div className="dropdown">
												<button className="btn btn-primary dropdown-toggle text-capitalize status-btn" id="labels" type="button" data-bs-toggle="dropdown" aria-expanded="false">
													{taskDetails?.status}
												</button>
												<ul className={`dropdown-menu dropdown-menu-right text-light m-0`} aria-labelledby={`labels`}>
													{STATUS_ARR.map((stat) => (
														<li key={stat.id} className="dropdown-item cursor-pointer text-capitalize" onClick={() => statusChangeHandler(stat)}>
															{stat.value}
														</li>
													))}
												</ul>
											</div>
										</div>
									</div>
									{/* {taskDetails?.subject &&
										<div className="row mb-1">
											<div className="col-12">
												<>
													<span className="text-light">Subject : </span>
													<span>
														{taskDetails.subject}
													</span>
												</>
											</div>
										</div>} */}
									{taskDetails?.patient &&
										<div className="row mb-1">
											<div className="col-12">
												<>
													<span className="text-light">Patient: </span>
													<span>
														{taskDetails.patient}
													</span>
												</>
											</div>
										</div>}
									{taskDetails?.subject &&
										<div className="row mb-1">
											<div className="col-12">
												<>
													<span className="text-light">Subject: </span>
													<span className="text-white-70">
														{taskDetails.subject}
													</span>
												</>
											</div>
										</div>}
									<div className="row mt-2">
										<div className="col-12 col-md-8">
											<div className="card mb-2">
												<div className={`${classes["subtask-list"]} card-body`}>
													<div className={`${classes["subtask-block-header"]}  mb-2`}>
														<h6 className={`${classes["subtask-title"]} card-title mb-0`}>
															<span>
																Sub Tasks
																({searchFilterTasks.length})
															</span>
														</h6>
														<div className="d-flex align-items-center">
															<input type="text" name="search" id="search" placeholder="Search sub task..." onChange={(e) => setSearchInput(e.target.value)} className={`${classes["form-control"]} form-control mr-2 p-4_8`} />
															<div
																className={`cursor-pointer ${showCompletedSubtasks ? "text-success" : ""}`}
																title={showCompletedSubtasks ? "Hide Completed Sub Tasks" : "Show All Sub Tasks"}
																onClick={() => setShowCompletedSubtask(!showCompletedSubtasks)}
															>
																<EyeSvg />
															</div>
														</div>
													</div>

													{searchFilterTasks && <div className={`${classes["subtasks-wrapper"]} card-text`}>
														{!!searchFilterTasks.length &&
															searchFilterTasks
																.map((subtask, index) => (
																	<SubtaskDetails
																		key={subtask.id}
																		index={index + 1}
																		subtask={subtask}
																		subtaskStatusToggleHandler={subtaskStatusToggleHandler}
																		subtaskDeleteHander={subtaskDeleteHander}
																	/>
																))}
														{!!taskDetails.subtasks.length &&
															!searchFilterTasks.length && (
																<h6 className="mt-3 text-light text-center">
																	No match found.
																</h6>
															)}
														{!taskDetails.subtasks.length && (
															<div className="mt-3 text-light text-center">
																<ListSvg />
																<span>There are No subtasks attached</span>
															</div>
														)}
														{!addSubtaskFlag ? (
															<div className={`${classes["add-task-block"]} demi-bold-text`} onClick={() => setAddSubtaskFlag(true)}>
																<PlusSvg width={14} />
																Add a new Subtask
															</div>
														) : (
															<div className={classes["add-card-input-block"]}>
																<textarea
																	ref={textArea}
																	autoFocus
																	className={
																		classes["add-card-input"]
																	}
																	name="taskTitle"
																	rows="2"
																	onBlur={closeAddingSubtask}
																	onKeyPress={(event) => {
																		if (event.key === "Enter") {
																			if (!event.shiftKey) {
																				event.preventDefault();
																				addNewSubtask();
																			}
																		}
																	}}
																></textarea>
																<div className={`${classes.action} mt-2`}>
																	<button className={`btn btn-primary mr-2 p-4_8`} onClick={addNewSubtask}>
																		Add Subtask
																	</button>
																	<button className={`btn btn-light border p-4_8`} onClick={() => setAddSubtaskFlag(false)}>
																		Cancel
																	</button>
																</div>
															</div>
														)}
													</div>}
												</div>
												<TaskComments taskDetails={taskDetails} />
											</div>
										</div>
										<div className="col-12 col-md-4 text-center">
											<div className="row">
												{/* {taskDetail.chatDetails.type === GROUP && } */}
												<TaskMembers user={user} taskDetails={taskDetails} setTaskDetails={setTaskDetails} dispatch={dispatch} />
												<TaskLabels taskLabels={taskLabels} taskDetails={taskDetails} />
												<TaskAttachment taskDetails={taskDetails} setImageShow={setImageShow} dispatch={dispatch} attchmentDeleteHandler={attchmentDeleteHandler} />
											</div>
										</div>
									</div>
								</div>
								{(user.roleData.name === SUPER_ADMIN || AllowTracker) &&
									<div className="tab-pane fade" id="nav-task-logs" role="tabpanel" aria-labelledby="nav-task-logs-tab">
										{AllowTracker &&
											<TimeTracker
												taskDetails={taskDetails}
												onTaskToggler={onTaskToggler}
												isDisable={isDisable}
												isTrackerRunning={isTrackerRunning}
												setTracker={setTracker}
											/>}
										{user.roleData.name === SUPER_ADMIN &&
											<TaskWorkingLogs taskDetails={taskDetails} user={user} />}
									</div>}
							</div>
						</div>
					</div>
				</div>
			</div>);
	}
}
