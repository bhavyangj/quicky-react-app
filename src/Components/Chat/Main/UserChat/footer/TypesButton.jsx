import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react'
import { useDetectClickOutside } from 'react-detect-click-outside';
import useLongPress from '../../../../hooks/useLongPress';
import { getBackgroundColorClass } from '../UserChat';
import { EMERGENCY, ROUTINE, URGENT } from './ChatFooter';

export const TypesButton = (props) => {
    const [isMenu, setIsMenu] = useState(false);

    const defaultOptions = {
        shouldPreventDefault: true,
        delay: 400,
    };
    const changeItemHandler = (type) => {
        props.setMessageType(type);
        setIsMenu(false);
    }
    const onLongPress = () => {
        setIsMenu(true);
    };

    const onClick = () => {
        setIsMenu(true);
    }

    const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);
    const dropdownTaskRef = useDetectClickOutside({
        onTriggered: (e) => { setIsMenu(false) }
    });
    return (<>
        <div
            {...longPressEvent}
            className={`btn btn-icon send-icon rounded-circle text-light send-btn-hover  ${props.isEditing ? 'task-send-button' : 'types-button'} ${getBackgroundColorClass(props.messageType)}`}
            id="#taskButton"
            ref={dropdownTaskRef}
        >
            {props.messageType === ROUTINE && <span>R</span>}
            {props.messageType === EMERGENCY && <span>E</span>}
            {props.messageType === URGENT && <span>U</span>}
        </div>
        <AnimatePresence>
            {isMenu && (
                <motion.ul
                    initial={{ opacity: 0, y: "-100%" }}
                    animate={{ opacity: 1, y: "-144%" }}
                    exit={{ opacity: 0, y: "-100%", transition: { duration: "0.15" } }}
                    transition={{ type: "spring", stiffness: "100", duration: "0.05" }}
                    className="user-menu task-menu"
                >
                    <li className="item routine-bg" onClick={() => changeItemHandler(ROUTINE)} >Routine</li>
                    <li className="item danger-bg" onClick={() => changeItemHandler(EMERGENCY)}>Emergency</li>
                    <li className="item warning-bg" onClick={() => changeItemHandler(URGENT)}>Urgent</li>
                </motion.ul>
            )}
        </AnimatePresence>
    </>
    )
}
