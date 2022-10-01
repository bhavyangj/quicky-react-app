import React from 'react'
import { getBackgroundColorClass } from '../UserChat';
// import { useState } from "react";
// import { useDetectClickOutside } from "react-detect-click-outside";
// import { getBackgroundColorClass } from "../UserChat";
// import useLongPress from '../../../../hooks/useLongPress';

// let isDueDateOpen = false;
export const TaskSendButton = (props) => {
    // const [isMenu, setIsMenu] = useState(false);
    // const defaultOptions = {
    //     shouldPreventDefault: true,
    //     delay: 400,
    // };
    // const onLongPress = () => {
    //     setIsMenu(true);
    // };

    const onClick = () => {
        props.sendTaskHandler(props.taskType, props.taskDueDate);
    }

    // const changeItemHandler = (type) => {
    //     props.setTaskType(type);
    //     props.sendTaskHandler(type, momentTimzone(dueDate).tz(CONST.TIMEZONE).toDate());
    //     setIsMenu(false);
    //     setDueDate();
    // }

    // const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);
    // const dropdownTaskRef = useDetectClickOutside({
    //     onTriggered: (e) => {
    //         if (!isDueDateOpen) setIsMenu(false)
    //     }
    // });

    return (<>
        <div
            className={`btn btn-icon send-icon rounded-circle text-light send-btn-hover task-send-button ${getBackgroundColorClass(props.taskType)}`}
            id="#taskButton"
            onClick={onClick}
            title={`${props.assignMembers && !!props.assignMembers.length ? 'Send Task' : 'Please assign members to send a task'}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        </div>
        {/* <AnimatePresence>
            {isMenu && (
                <motion.ul
                    initial={{ opacity: 0, y: "-100%" }}
                    animate={{ opacity: 1, y: "-110%" }}
                    exit={{ opacity: 0, y: "-100%", transition: { duration: "0.15" } }}
                    transition={{ type: "spring", stiffness: "100", duration: "0.05" }}
                    className="user-menu task-menu"
                >
                    <li className="task-due-date" id="due-date-tag" onClick={() => { }} >
                        <span id="duedate-span">Due Date: </span>
                        <DatePicker
                            selected={dueDate}
                            value={dueDate}
                            onFocus={() => { isDueDateOpen = true; }}
                            onClickOutside={() => isDueDateOpen = false}
                            onChange={(date) => {
                                setDueDate(date);
                                setTimeout(() => isDueDateOpen = false, 500);
                            }}
                            minDate={new Date()}
                            isClearable={true}
                            timeInputLabel="Time:"
                            dateFormat="MM/dd/yyyy h:mm aa"
                            showTimeInput
                        />
                    </li>
                    <li className="item routine-bg" onClick={() => changeItemHandler(ROUTINE)} >Routine</li>
                    <li className="item danger-bg" onClick={() => changeItemHandler(EMERGENCY)}>Emergency</li>
                    <li className="item warning-bg" onClick={() => changeItemHandler(URGENT)}>Urgent</li>
                </motion.ul>
            )}
        </AnimatePresence> */}
    </>
    )
}