import React, { useEffect, useState } from 'react'
import { useDetectClickOutside } from 'react-detect-click-outside';
import { useSelector } from 'react-redux';
import { ReactComponent as CheckSvg } from "../../../assets/media/heroicons/outline/check.svg";
import { ListenUpdateAssignMember } from '../../../utils/wssConnection/Listeners/Tasklistener';
import { ReqUpdateAssignMembers } from '../../../utils/wssConnection/wssConnection';
import { compareName } from '../../Chat/Main/UserChat/info/group-chat-info/GroupChatInfo';
import { DEFAULT_IMAGE } from '../../Layout/HomePage/HomePage';
import classes from "./TaskDetails.module.css";

export const TaskMembers = ({ taskDetails, setTaskDetails, dispatch }) => {
    const [showMembers, setShowMembers] = useState(false);
    const { taskDetails: taskInfo } = useSelector((state) => state.task);
    const dropdownTaskRef = useDetectClickOutside({ onTriggered: () => setShowMembers(false) });

    useEffect(() => {
        const updateMembers = async () => {
            const latestMembers = taskDetails.taskmembers.map((item) => item.user.id);
            const taskmembers = taskInfo.taskmembers.map((item) => item.user.id);
            ReqUpdateAssignMembers({
                taskId: taskDetails.id,
                chatId: taskDetails.chatDetails.id,
                addedMember: latestMembers?.filter(item => !taskmembers.includes(item)),
                removedMember: taskmembers?.filter(item => !latestMembers.includes(item))
            });
            dispatch(ListenUpdateAssignMember(taskInfo));
        }
        if (!showMembers && taskDetails)
            updateMembers()
        //eslint-disable-next-line
    }, [showMembers]);

    const addMemberHandler = (member) => {
        if (taskDetails.taskmembers.some((mem) => mem.user.id === member.user.id)) {
            setTaskDetails((prev) => ({
                ...prev,
                taskmembers: prev.taskmembers.filter((mem) => mem.user.id !== member.user.id),
            }));
        } else {
            setTaskDetails((prev) => ({
                ...prev,
                taskmembers: [member, ...prev.taskmembers],
            }));
        }
    };

    return (
        <div className="col-sm-6 col-md-12">
            <div className="card mb-2">
                <div className="card-body">
                    <div className={classes["card-task-member"]}>
                        {taskDetails &&
                            taskDetails.taskmembers &&
                            taskDetails.taskmembers
                                .sort(compareName)
                                .map((member, i) => {
                                    return (
                                        <div key={member.user.id} id={`member-${member.user.id}`} className={`${classes.member}`} title={member.user.name}>
                                            <img src={member.user.profilePicture ? member.user.profilePicture : DEFAULT_IMAGE} alt="m" width={30} height={30} />
                                        </div>
                                    );
                                })}
                    </div>
                    <div className="text-center">
                        <div className="dropdown show" ref={dropdownTaskRef}>
                            <button className="dropdown-toggle btn btn-sm btn-dark fs-12" onClick={() => setShowMembers(!showMembers)}>
                                Add Members
                            </button>
                            {showMembers && <ul className="dropdown-menu text-light show">
                                {taskInfo?.chatDetails?.chatusers
                                    .sort(compareName)
                                    .map((member) => (
                                        <li key={member.user.id} className={`dropdown-item cursor-pointer`} onClick={() => addMemberHandler(member)}>
                                            <div id={`member-${member.user.id}`} className={`${classes.member} mr-2`}>
                                                <img src={member.user.profilePicture ? member.user.profilePicture : DEFAULT_IMAGE} alt="m" />
                                            </div>
                                            <div>
                                                {member.user.name}
                                                {!!taskDetails.taskmembers.filter((mem) => mem.user.id === member.user.id).length ? (<CheckSvg />) : ("")}
                                            </div>
                                        </li>
                                    ))}
                            </ul>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
