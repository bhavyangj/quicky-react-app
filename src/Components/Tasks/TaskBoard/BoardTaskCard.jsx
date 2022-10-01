import React from "react";
import classes from "../TasksPage.module.css";
import { Draggable } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";

import { ReactComponent as CommentSvg } from "../../../assets/media/heroicons/outline/chat-alt.svg";
import { ReactComponent as AttachmentSvg } from "../../../assets/media/heroicons/outline/paper-clip.svg";
import { ReactComponent as ListSvg } from "../../../assets/media/heroicons/outline/clipboard-list.svg";
import { ReactComponent as EllipsisSvg } from "../../../assets/media/heroicons/outline/dots-horizontal.svg";
import { getTaskDetails } from "../../../redux/actions/taskAction";
import { useSelector } from "react-redux";
import { getStatusColor } from "../../../redux/common";
import { DEFAULT_IMAGE } from "../../Layout/HomePage/HomePage";

export default function BoardTaskCard({ task, index, taskDeleteHandler, user }) {
	const dispatch = useDispatch();
	const { taskLabels } = useSelector((state) => state.task);
	const { chatList } = useSelector((state) => state.chat);
	const getTask = async (task) => {
		dispatch(getTaskDetails(task.id, task.chatId, chatList));
	}

	return (
		<Draggable draggableId={task.id.toString()} isDragDisabled={true} index={index} type="task">
			{(provided) => (
				<div ref={provided.innerRef}>
					<div className={`${classes["board-task-card"]}`}
						onClick={(e) => {
							if (e.target.id !== "task" && e.target.id !== "task-delete") {
								getTask(task);
							}
						}}
					>
						<div className={`${classes["task-title"]}`}>
							<div title={task.name} className={`${classes.title}`}>
								{task.name}
							</div>
							<div className="more_icon">
								<div className="dropdown tasklist-dropdown">
									<div className="z-index-1" data-bs-toggle="dropdown" aria-expanded="false" id={`task-${task.id}`} >
										<EllipsisSvg id={`task`} />
									</div>
									<ul className={`dropdown-menu dropdown-menu-right text-light m-0`} aria-labelledby={`task-${task.id}`}>
										<li className="dropdown-item" onClick={() => { getTask(task); }}>
											Edit Task
										</li>
										<li className="dropdown-item" id="task-delete" onClick={() => { taskDeleteHandler(task.chatId, task.id); }}>
											Delete Task
										</li>
									</ul>
								</div>
							</div>
						</div>
						<div className={`${classes["status-block"]}`}>
							{task.label &&
								task.label.length > 0 &&
								task.label.map((label) => {
									const labelObj = taskLabels.filter((item) => item.id === Number(label)).shift();
									if (labelObj)
										return (
											<div key={labelObj.id} title={labelObj.name} className={`${classes["task-status"]} bg-${labelObj.color}`}></div>
										);
									return null;
								})}
						</div>
						{/* {task.cover && task.cover !== "" && (
								<div className={`${classes["task-cover"]}`}>
									<img src={task.cover} alt="cover" />
								</div>
							)} */}
						<div className={`${classes["card-task-member"]}`}>
							{task &&
								task.taskmembers &&
								task.taskmembers.map((member, i) => {
									return (
										<div key={member.user.id} id={`member-${member.user.id}`} className={`${classes.member}`} title={member.user.name.charAt(0).toUpperCase() + member.user.name.slice(1)}>
											<img src={member.user.profilePicture ? member.user.profilePicture : DEFAULT_IMAGE} alt="m" />
										</div>
									);
								})}
						</div>
						<div className={`${classes["task-options"]}`}>
							{task.createdBy === user.id &&
								<div className={`task-status br-6 bg-success mr-auto`}>
									<p className="text-white fs-12 text-capitalize px-1 mb-0">
										{'creator'}
									</p>
								</div>}
							<div className={`task-status ${getStatusColor(task.status)} br-6`}>
								<p className="text-white fs-12 text-capitalize px-1 mb-0">
									{task?.status}
								</p>
							</div>
							{!!task.comments && <>
								<div className={`${classes["icon-space"]} board-task-card-svg`}>
									<CommentSvg />
								</div>
								<span className={`${classes["board-count-space"]}`}>
									{task.comments.length}
								</span></>}
							{!!task.attachments && <>
								<div className={`${classes["icon-space"]} board-task-card-svg`}>
									<AttachmentSvg />
								</div>
								<div className={`${classes["board-count-space"]}`}>
									{task.attachments.length}
								</div></>}
							<div className={`${classes["icon-space"]} board-task-card-svg`}>
								<ListSvg />
							</div>
							{!!task.subtasks &&
								<div className={`${classes["board-count-space"]} ${!!task.subtasks.length ? task.subtasks.filter((item) => item.status === "finished").length === task.subtasks.length && "text-success" : ''}`}>
									{`${task.subtasks.filter((item) => item.status === "finished").length}/${task.subtasks.length}`}
								</div>}
						</div>
					</div>
				</div>
			)}
		</Draggable>
	);
}
