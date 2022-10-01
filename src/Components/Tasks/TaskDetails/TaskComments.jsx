import React, { useRef, useState } from 'react'
import classes from "./TaskDetails.module.css";
import { ReactComponent as ListSvg } from "../../../assets/media/heroicons/outline/clipboard-list.svg";
import { ReactComponent as PlusSvg } from "../../../assets/media/heroicons/outline/plus.svg";
import { AddSubtaskComment } from '../../../redux/actions/taskAction';
import { TaskCommentDetail } from './TaskCommentDetail';
import { useDispatch } from 'react-redux';
import { ADD_NEW_TASK_COMMENT } from '../../../redux/constants/taskConstants';

export const TaskComments = ({ taskDetails }) => {
    const dispatch = useDispatch();
    const [addCommentsFlag, setAddComments] = useState();
    const textArea = useRef(null);

    const addNewComment = async () => {
        // add new comment
        if (textArea.current.value === "")
            return;
        const { data } = await AddSubtaskComment({
            text: textArea.current.value.trim(),
            taskId: taskDetails.id
        });
        dispatch({
            type: ADD_NEW_TASK_COMMENT, payload: data.data
        })
        textArea.current.value = "";
        setAddComments(!addCommentsFlag);
    }

    const searchComments = taskDetails?.comments;
    if (searchComments)
        return (
            <>
                <div className={`${classes["subtask-list"]} card-body`}>
                    <div className={`${classes["subtask-block-header"]}`}>
                        <h6 className={`${classes["subtask-title"]} card-title mb-1`}>
                            <span>
                                Comments
                                ({taskDetails?.comments.length})
                            </span>
                        </h6>
                    </div>

                    {searchComments &&
                        <div className={`${classes["subtasks-wrapper"]} card-text`}>
                            <div className="comments-wrapper task-comments-wrapper">
                                {!!searchComments.length &&
                                    searchComments
                                        .map((comment, index) => (<TaskCommentDetail key={index} comment={comment} />))}
                                {!searchComments.length && (
                                    <div className="text-light text-center">
                                        <ListSvg />
                                        <span>
                                            There are No comments added
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>}
                    {!addCommentsFlag ? (
                        <div className={`${classes["add-task-block"]} demi-bold-text`} onClick={() => setAddComments(true)}>
                            <PlusSvg width={14} />
                            Add Comment
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
                                <button className={`btn btn-primary mr-2 p-4_8`} onClick={addNewComment}>
                                    Add Comment
                                </button>
                                <button className={`btn btn-light border p-4_8`} onClick={() => setAddComments(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </>
        )
}
