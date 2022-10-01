import { getBackgroundColorClass } from "../UserChat";

export const MessageSendButton = (props) => {
    // const [isMenu, setIsMenu] = useState(false);

    // const defaultOptions = {
    //     shouldPreventDefault: true,
    //     delay: 500,
    // };
    // const onLongPress = () => {
    //     setIsMenu(true);
    // };
    const onClick = () => {
        if (props.isEditing) props.sendEditMessage(props.messageType);
        else props.sendMessageHandler(props.messageType);
    }
    // const changeItemHandler = (type) => {
    //     props.setMessageType(type);
    //     if (!props.isEditing)
    //         props.sendMessageHandler(type);
    //     else
    //         props.sendEditMessage(type);
    //     setIsMenu(false);
    // }
    // const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);
    // const dropdownTaskRef = useDetectClickOutside({ onTriggered: () => setIsMenu(false) });

    return (<>
        <div
            // {...longPressEvent}
            className={`btn btn-icon send-icon rounded-circle text-light send-btn-hover ${getBackgroundColorClass(props.messageType)}`}
            // ref={dropdownTaskRef}
            onClick={onClick}
        >
            {!props.isEditing && <svg className="hw-18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>}
            {props.isEditing && <svg className="hw-18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>}
        </div>
        {/* {<AnimatePresence>
            {isMenu && (
                <motion.ul
                    initial={{ opacity: 0, y: "-100%" }}
                    animate={{ opacity: 1, y: "-150%" }}
                    exit={{ opacity: 0, y: "-100%", transition: { duration: "0.15" } }}
                    transition={{ type: "spring", stiffness: "100", duration: "0.05" }}
                    className="user-menu"
                >
                    <li className="item routine-bg" onClick={() => changeItemHandler(ROUTINE)} >Routine</li>
                    <li className="item danger-bg" onClick={() => changeItemHandler(EMERGENCY)}>Emergency</li>
                    <li className="item warning-bg" onClick={() => changeItemHandler(URGENT)}>Urgent</li>
                </motion.ul>
            )}
        </AnimatePresence>} */}
    </>)
}