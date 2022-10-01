import React, { useRef, useState } from "react";
import classes from "./TaskDetails.module.css";

import { ReactComponent as TrashSvg } from "../../../assets/media/heroicons/solid/trash.svg";
import { ReactComponent as CheckSvg } from "../../../assets/media/heroicons/solid/check-circle.svg";
import { ReactComponent as CommentSvg } from "../../../assets/media/heroicons/outline/chat-alt.svg";
import { ReactComponent as PlusSvg } from "../../../assets/media/heroicons/outline/plus.svg";
import * as momentTimzone from 'moment-timezone';
import { useEffect } from "react";
import { AddSubtaskComment } from "../../../redux/actions/taskAction";
import { useSelector } from "react-redux";
import { ADD_NEW_SUBTASK_COMMENT } from "../../../redux/constants/taskConstants";
import { useDispatch } from "react-redux";

export default function SubtaskDetails({
	index,
	subtask: subtaskData,
	subtaskStatusToggleHandler,
	subtaskDeleteHander,
	isTemplate = false
}) {
	const dispatch = useDispatch();
	const { taskDetails } = useSelector((state) => state.task);
	const [subtask, setSubtask] = useState(subtaskData);
	const [viewComment, setViewComment] = useState(false);
	const [addCommentFlag, setAddCommentFlag] = useState(false);

	const textArea = useRef(null);

	useEffect(() => {
		setSubtask(subtaskData);
	}, [subtaskData]);

	const addNewComment = async () => {
		if (textArea.current.value === "") {
			return;
		}
		const { data } = await AddSubtaskComment({
			text: textArea.current.value.trim(),
			subTaskId: subtask.id,
			taskId: taskDetails.id
		});
		dispatch({
			type: ADD_NEW_SUBTASK_COMMENT, payload: {
				subTaskId: subtask.id,
				taskId: taskDetails.id,
				newComment: data.data
			}
		})
		textArea.current.value = "";
		setAddCommentFlag(!addCommentFlag)
	};

	const closeAddingComment = () => {
		if (textArea.current.value.trim() === "") {
			setAddCommentFlag(!addCommentFlag);
		}
	};

	const onClickComment = async () => {
		// if (!viewComment) {
		// 	const { data } = await getSubtasksComments({
		// 		subTaskId: subtask.id,
		// 		taskId: taskDetails.id
		// 	});
		// 	dispatch({
		// 		type: ADD_SUBTASK_COMMENTS, payload: {
		// 			subTaskId: subtask.id,
		// 			taskId: taskDetails.id,
		// 			comments: data.data
		// 		}
		// 	})
		// }
		setViewComment(!viewComment);
	}

	return (
		<div className="card mb-2 subtask-details">
			<div className="card-body">
				<div className={subtask.status === "finished" ? "task-completed" : ""}>{subtask.title}</div>
				<div className={`${classes["subtask-options"]} justify-content-end`}>
					{!isTemplate &&
						<span onClick={onClickComment} className={`${classes["fs-12"]}`}>
							{subtask.totalComments} comments
						</span>}
					<div className="subtask-badges">
						<span className={`badge bg-primary text-light mx-1 ${classes["p-50"]}`}>
							{`#${subtask.id}`}
						</span>
						{!isTemplate &&
							<><span onClick={onClickComment} style={{ color: 'var(--theme-color)' }}>
								<CommentSvg />
							</span>
								<span className={subtask.status === "finished" ? "text-success" : ""} onClick={() => subtaskStatusToggleHandler(subtask.id, subtask.status)}>
									<CheckSvg />
								</span></>}
						<span className="text-danger" onClick={() => subtaskDeleteHander(subtask.id)}>
							<TrashSvg />
						</span>
					</div>
				</div>
				{viewComment && !isTemplate && (subtask.comments && subtask.comments !== undefined) && (
					<div className="comments-wrapper mt-1">
						{!!subtask.comments.length &&
							subtask.comments.map((comment) => (
								<div className={`${classes["comment-media"]} card m-1 d-flex flex-row border-0 mt-2`} key={comment.id}>
									<div className={`${classes.member} mx-2`}>
										<img src={comment.user.profilePicture} alt="people" />
									</div>
									<div className={`w-100`}>
										<div className="d-flex">
											<h6 className="mb-0 mr-2 text-capitalize">
												{comment.user.name}
											</h6>
											<small>
												{momentTimzone(comment.createdAt).format("MM/DD/YY hh:mm A")}
											</small>
										</div>
										<div className={`${classes["comment-box"]} card text-muted`}>
											{comment.text}
										</div>
									</div>
								</div>
							))}
						{!subtask.comments.length && (
							<>
								<h5 className="text-center m-1">
									No comments added yet.
								</h5>
							</>
						)}

						{!addCommentFlag ? (
							<div className={`${classes["add-task-block"]} demi-bold-text`} onClick={() => setAddCommentFlag(true)}>
								<PlusSvg width={14} />
								Add a new Comment
							</div>
						) : (
							<div className={classes["add-card-input-block"]}>
								<textarea
									ref={textArea}
									autoFocus
									className={classes["add-card-input"]}
									name="taskTitle"
									rows="2"
									onBlur={closeAddingComment}
									onKeyPress={(event) => {
										if (event.key === "Enter") {
											if (!event.shiftKey) {
												event.preventDefault();
												addNewComment();
											}
										}
									}}
								></textarea>
								<div className={`${classes.action} mt-2`}>
									<button className={`btn btn-primary btn-sm mr-2`} onClick={addNewComment}>
										Add Comment
									</button>
									<button className={`btn btn-light btn-sm border`} onClick={() => setAddCommentFlag(false)}>
										Cancel
									</button>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
