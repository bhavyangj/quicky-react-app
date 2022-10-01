import moment from "moment-timezone";
import React from "react";
import { Draggable } from "react-beautiful-dnd";

import classes from "../TasksPage.module.css";

import { ReactComponent as EllipsisSvg } from "../../../assets/media/heroicons/outline/dots-horizontal.svg";
import { getTaskDetails } from "../../../redux/actions/taskAction";
import { useDispatch } from "react-redux";
import { GROUP } from "../../Chat/Models/models";
import { useSelector } from "react-redux";

export default function ListTaskItem({ task, index, taskDeleteHandler, activeTaskChat }) {
	const dispatch = useDispatch();
	const { taskLabels } = useSelector((state) => state.task);
	const { chatList } = useSelector((state) => state.chat);
	const getTask = async (task, e) => {
		if (e.target.id !== "task" && e.target.id !== "task-delete")
			dispatch(getTaskDetails(task.id, task.chatId, chatList));
	}
	return (
		<Draggable
			key={task.id}
			draggableId={task.id.toString()}
			index={index}
			isDragDisabled={true}
			type="task"
		>
			{(provided) => (
				<tr className="list-task-table-row" ref={provided.innerRef} onClick={(e) => { getTask(task, e); }}>
					<td>{task.name}</td>
					<td>
						<nobr>
							<div className={`${classes["more_icon"]}`}>
								<div className="dropdown tasklist-dropdown cursor-pointer">
									<div className="z-index-1" data-bs-toggle="dropdown" id={`task-${task.id}`}>
										<EllipsisSvg id={`task`} />
									</div>
									<ul className="dropdown-menu dropdown-menu-right text-light m-0" aria-labelledby={`task-${task.id}`}>
										<li className="dropdown-item">
											Edit Task
										</li>
										<li className="dropdown-item" id="task-delete" onClick={() => { taskDeleteHandler(task.chatId, task.id); }}>
											Delete Task
										</li>
									</ul>
								</div>
							</div>
						</nobr>
					</td>
					<td>
						<nobr className="text-capitalize">
							{task.status}
						</nobr>
					</td>
					<td className="text-center">
						<nobr>{task.subtasks.length > 0 ? `${task.subtasks.filter((item) => item.status === "finished").length}/${task.subtasks.length}` : '-'}</nobr>
					</td>
					<td className="text-center">
						{task.dueDate ? <nobr>{moment(task.dueDate).format("MM/DD/YY")}</nobr> : <nobr>-</nobr>}
					</td>
					<td className="text-center">
						<div className={`${classes["status-block"]}`}>
							{task.label &&
								task.label.length > 0 &&
								task.label.map((label, i) => {
									const labelObj = taskLabels.filter((item) => item.id === Number(label)).shift();
									if (labelObj)
										return (
											<div key={labelObj.id} title={labelObj.name} className={`${classes["task-status"]} bg-${labelObj.color}`}></div>
										);
									return null;
								})}
						</div>
					</td>
					{activeTaskChat.type === GROUP && <td className="text-center">
						<nobr>{task.taskmembers.length}</nobr>
					</td>}
					<td className="text-center">
						<nobr>{task.comments.length}</nobr>
					</td>
					<td className="text-center">
						<nobr>{task.attachments.length}</nobr>
					</td>
				</tr>
			)}
		</Draggable>
	);
}
