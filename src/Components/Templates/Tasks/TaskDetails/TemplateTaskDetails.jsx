import React, { useRef } from 'react'
import { useState } from 'react';
import { useDetectClickOutside } from 'react-detect-click-outside';
import { AttachmentInput } from '../../../Tasks/TaskDetails/AttachmentInput';
import ReactImageVideoLightbox from "react-image-video-lightbox";
import classes from "../../../Tasks/TaskDetails/TaskDetails.module.css";

import { ReactComponent as InfoSvg } from "../../../../assets/media/heroicons/outline/information-circle.svg";
import { ReactComponent as TagSvg } from "../../../../assets/media/heroicons/solid/tag.svg";
import { ReactComponent as PlusSvg } from "../../../../assets/media/heroicons/outline/plus.svg";
import { ReactComponent as ListSvg } from "../../../../assets/media/heroicons/outline/clipboard-list.svg";
import { ReactComponent as CheckSvg } from "../../../../assets/media/heroicons/outline/check.svg";

import { useDispatch } from 'react-redux';
import SubtaskDetails from '../../../Tasks/TaskDetails/SubtaskDetails';
import { CreateNewSubTask, deleteSubtask, DeleteTemplateAttachment } from '../../../../redux/actions/taskAction';
import { ADD_NEW_SUBTASK, DELETE_SUBTASK } from '../../../../redux/constants/taskConstants';
import { TaskLabels } from '../../../Tasks/TaskDetails/TaskLabels';
import { TaskAttachment } from '../../../Tasks/TaskDetails/TaskAttachment';
import { IMAGE_INDEX } from '../../../../redux/constants/chatConstants';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { ReqUpdateTemplateTask } from '../../../../utils/wssConnection/wssConnection';
import { ListenUpdateTemplateTasks } from '../../../../utils/wssConnection/Listeners/TemplateListeners';

export const TemplateTaskDetails = ({ task, onClose }) => {
    const dispatch = useDispatch();
    const { imageId } = useSelector((state) => state.chat);
    const { templateTaskDetail, taskLabels } = useSelector((state) => state.task);
    const [taskDetails, setTaskDetails] = useState(templateTaskDetail);
    const [searchInput, setSearchInput] = useState("");
    const [isImageShow, setImageShow] = useState(false);
    const [showDesc, setShowDesc] = useState(false);
    const [addSubtaskFlag, setAddSubtaskFlag] = useState(false);
    const [labelMenu, setLabelMenu] = useState(false);
    const textArea = useRef(null);
    const labelRef = useDetectClickOutside({ onTriggered: () => setLabelMenu(false) });

    useEffect(() => {
        if (!labelMenu && taskDetails)
            onTaskDetailsChanged(taskDetails.id, { label: taskDetails.label });
        //eslint-disable-next-line
    }, [labelMenu]);

    useEffect(() => {
        setTaskDetails(templateTaskDetail);
        dispatch(ListenUpdateTemplateTasks());
    }, [templateTaskDetail, dispatch]);

    const addNewSubtask = async () => {
        if (textArea.current.value.trim() !== "") {
            const { data } = await CreateNewSubTask({
                title: textArea.current.value.trim(),
                taskId: taskDetails.id,
                isTemplate: true
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

    const labelSelectHandler = (label) => {
        if (!taskDetails.label.filter((lab) => label.id === Number(lab)).length)
            setTaskDetails((prev) => ({ ...prev, label: [label.id, ...prev.label], }));
        else
            setTaskDetails((prev) => ({ ...prev, label: prev.label.filter((lab) => Number(lab) !== label.id), }));
    };
    // save updated data
    const onTaskDetailsChanged = async (taskId, body) => {
        ReqUpdateTemplateTask(taskDetails);
    }
    const attchmentDeleteHandler = async (id) => {
        try {
            await DeleteTemplateAttachment({ attachmentId: id, isTemplate: true });
            setTaskDetails((prev) => ({
                ...prev,
                templateAttachments: prev.templateAttachments.filter((att) => att.id !== id),
            }));
        } catch (error) { }
    };

    const subtaskDeleteHander = async (id) => {
        const { data } = await deleteSubtask({ subTemplateId: id, isTemplate: true });
        dispatch({ type: DELETE_SUBTASK, payload: data.data });
    };

    const onCloseImageHandler = () => {
        setImageShow(false);
        dispatch({ type: IMAGE_INDEX, payload: 0 });
    }

    if (isImageShow)
        return (<div className="modal modal-lg-fullscreen fade show d-block task-image-gallery" id="imageGallery" tabIndex={-1} role="dialog" aria-labelledby="dropZoneLabel" aria-modal="true">
            <ReactImageVideoLightbox
                data={taskDetails.templateAttachments
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
                startIndex={taskDetails?.templateAttachments
                    .filter((item) => ["image", "video"].includes(item.mediaType.split("/").shift()))
                    .findIndex((item) => item.id === imageId)}
                showResourceCount={true}
                onCloseCallback={onCloseImageHandler}
            />
        </div>)
    if (taskDetails && taskDetails.subTemplates) {
        const searchFilterTasks = taskDetails.subTemplates
            .filter((st) => st.title.toLowerCase().includes(searchInput.toLowerCase()))
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
                                {taskDetails?.title}
                            </h5>
                            <div className={`${classes.icons} d-flex align-items-center`}>
                                <div className={classes.icon}>
                                    <AttachmentInput isTemplate={true} taskId={task.id} />
                                </div>
                                <div className={classes.icon}>
                                    <div title="Add Tags" className="dropdown m-0 show" ref={labelRef}>
                                        <div className="cursor-pointer" onClick={() => setLabelMenu(!labelMenu)}>
                                            <TagSvg />
                                        </div>
                                        {labelMenu && <ul className="dropdown-menu dropdown-menu-right text-light m-1 show">
                                            {taskLabels.map((label) => (
                                                <li key={label.id} className={`dropdown-item text-${label.color} justify-content-between`} onClick={() => { labelSelectHandler(label); }}>
                                                    <span>{label.name}</span>
                                                    {!!taskDetails.label.filter((lab) => lab === Number(label.id)).length ? (<CheckSvg className='hw-18' />) : ("")}
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
                        <div className="modal-body hide-scrollbar fs-14">
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
                                                if (taskDetails.description !== task.description) {
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
                            {/* <div className="row justify-content-between m-auto">
								<div className="d-flex align-items-center due-date-input mr-1 mb-1">
									<label htmlFor="dueDate" className="pointer-cursor m-0 mr-1" title="Due Date">
										<nobr className="text-light">Due Date :</nobr>
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
									<div className="mr-2 text-light">Status : </div>
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
							</div> */}
                            {taskDetails?.subject &&
                                <div className="row mb-1">
                                    <div className="col-12">
                                        <>
                                            <span className="text-light">Subject : </span>
                                            <span>
                                                {taskDetails.subject}
                                            </span>
                                        </>
                                    </div>
                                </div>}
                            {taskDetails?.patient &&
                                <div className="row mb-1">
                                    <div className="col-12">
                                        <>
                                            <span className="text-light">Patient : </span>
                                            <span>
                                                {taskDetails.patient}
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
                                                    {/* <div
														className={`cursor-pointer ${showCompletedSubtasks ? "text-success" : ""}`}
														title={showCompletedSubtasks ? "Hide Completed Sub Tasks" : "Show All Sub Tasks"}
														onClick={() => setShowCompletedSubtask(!showCompletedSubtasks)}
													>
														<EyeSvg />
													</div> */}
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
                                                                isTemplate={true}
                                                                // subtaskStatusToggleHandler={subtaskStatusToggleHandler}
                                                                subtaskDeleteHander={subtaskDeleteHander}
                                                            />
                                                        ))}
                                                {!!taskDetails.subTemplates.length &&
                                                    !searchFilterTasks.length && (
                                                        <h6 className="mt-3 text-light text-center">
                                                            No match found.
                                                        </h6>
                                                    )}
                                                {!taskDetails.subTemplates.length && (
                                                    <div className="mt-3 text-light text-center">
                                                        <p><ListSvg /></p>
                                                        There are No subtasks attached
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
                                    </div>
                                </div>
                                <div className="col-12 col-md-4 text-center">
                                    <div className="row">
                                        {/* {taskDetail.chatDetails.type === GROUP && <TaskMembers user={user} taskDetails={taskDetails} setTaskDetails={setTaskDetails} dispatch={dispatch} />} */}
                                        <TaskLabels taskDetails={taskDetails} taskLabels={taskLabels} />
                                        <TaskAttachment isTemplate={true} taskDetails={taskDetails} setImageShow={setImageShow} dispatch={dispatch} attchmentDeleteHandler={attchmentDeleteHandler} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>);
    }
}
