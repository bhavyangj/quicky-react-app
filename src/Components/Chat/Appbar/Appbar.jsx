import { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDetectClickOutside } from 'react-detect-click-outside';
import { getImportantMessageList, getNoteList, getTaskList, setThreadMessage } from '../../../redux/actions/chatAction';
import { changeTask } from '../../../redux/actions/modelAction';
import { Notes } from './Notes';
import { ToDo } from './ToDo';
import { ThreadMessage } from './ThreadMessage';
import { Settings } from './Settings';
import { ImportantMessage } from './ImportantMessage';
import { GET_IMPORTANT_MESSAGE_SUCCESS, GET_NOTES_SUCCESS, GET_TASKS_SUCCESS } from '../../../redux/constants/chatConstants';
import { ReactComponent as BackArrowSVG } from '../../../assets/media/heroicons/back-arrow.svg';
import { ReactComponent as NotesIconSVG } from '../../../assets/media/heroicons/notes-icon.svg';
import { ReactComponent as TodoIconSVG } from '../../../assets/media/heroicons/todo-icon.svg';
import { ReactComponent as ThreadIconSVG } from '../../../assets/media/heroicons/thread-icon.svg';
import { ReactComponent as SettingsIconSVG } from '../../../assets/media/heroicons/settings-icon.svg';
import { ReactComponent as StarIconSVG } from '../../../assets/media/heroicons/star-icon.svg';
import { ReactComponent as ArchiveSvg } from "../../../assets/media/heroicons/outline/archive.svg";
import { IMPORTANT_ITEM, NOTES, SETTINGS, TEMPLATE_TASKS, THREAD_ITEM, TODO } from '../Models/models';
import { TemplateTask } from './TemplateTask';
import { ListenTemplateTasks } from '../../../utils/wssConnection/Listeners/TemplateListeners';
import { SUPER_ADMIN } from '../../../redux/constants/userContants';
import { MessageInfo } from './MessageInfo';

export const Appbar = ({ dispatch, user }) => {
    const { activeChat, threadMessage, taskList, notesList, importantMessageList } = useSelector((state) => state.chat);
    const { taskName } = useSelector((state) => state.model);
    const [innerWidth, setInnerWidth] = useState(0);
    const sidebarRef = useDetectClickOutside({
        onTriggered: () => {
            if (taskName !== "" && taskName !== THREAD_ITEM) dispatch(changeTask(""));
        }
    });
    useLayoutEffect(() => {
        window.addEventListener("resize", () => setInnerWidth(window.innerWidth));
        setInnerWidth(window.innerWidth);
    }, []);

    const onClosehandler = () => {
        dispatch(changeTask(""));
        if (threadMessage.id !== -1)
            dispatch(setThreadMessage({ id: -1 }));
        if (taskList.data.length > 0)
            dispatch({ type: GET_TASKS_SUCCESS, payload: { data: [] } });
        if (notesList?.data?.rows?.length > 0)
            dispatch({ type: GET_NOTES_SUCCESS, payload: { data: [] } });
        if (importantMessageList.rows.length > 0)
            dispatch({ type: GET_IMPORTANT_MESSAGE_SUCCESS, payload: [] });
    }

    return (<div className={`appbar ${(taskName === "") ? 'appbar-hidden' : 'z-index-1025'}`} ref={sidebarRef}>
        {(taskName !== THREAD_ITEM || innerWidth > 1199) && <div className="appbar-wrapper hide-scrollbar">
            <div className="d-flex justify-content-center border-bottom w-100">
                <button className="btn btn-secondary btn-icon m-0 btn-minimal btn-sm text-muted d-xl-none" onClick={() => onClosehandler()}>
                    <BackArrowSVG />
                </button>
            </div>

            <ul className="nav nav-minimal appbar-nav" id="appNavTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <div className={`nav-link ${taskName === NOTES ? 'active' : ''}`} id="notes-tab" data-toggle="tab" role="tab" aria-controls="notes" aria-selected="false"
                        onClick={() => { dispatch(changeTask(NOTES)); dispatch(getNoteList(activeChat.id)); }}>
                        <NotesIconSVG />
                    </div>
                </li>
                <li className="nav-item" role="presentation">
                    <div className={`nav-link ${taskName === TODO ? 'active' : ''}`} id="todo-tab" data-toggle="tab" role="tab" aria-controls="todo" aria-selected="false"
                        onClick={() => { dispatch(changeTask(TODO)); dispatch(getTaskList(activeChat.id)); }}>
                        <TodoIconSVG />
                    </div>
                </li>
                {taskName === THREAD_ITEM && <li className="nav-item" role="presentation">
                    <div className={`nav-link ${taskName === THREAD_ITEM ? 'active' : ''}`} id="todo-tab" data-toggle="tab" role="tab" aria-controls="todo" aria-selected="false">
                        <ThreadIconSVG />
                    </div>
                </li>}
                <li className="nav-item" role="presentation">
                    <div className={`nav-link ${taskName === SETTINGS ? 'active' : ''}`} id="settings-tab" data-toggle="tab" role="tab" aria-controls="settings" aria-selected="false"
                        onClick={() => { dispatch(changeTask(SETTINGS)); }}>
                        <SettingsIconSVG />
                    </div>
                </li>
                <li className="nav-item" role="presentation">
                    <div className={`nav-link ${taskName === IMPORTANT_ITEM ? 'active' : ''}`} id="important-message-tab" data-toggle="tab" role="tab" aria-controls="important-message" aria-selected="false"
                        onClick={() => { dispatch(changeTask(IMPORTANT_ITEM)); dispatch(getImportantMessageList(activeChat.id)); }}>
                        <StarIconSVG />
                    </div>
                </li>
                {user.roleData?.name === SUPER_ADMIN &&
                    <li className="nav-item" role="presentation">
                        <div className={`nav-link ${taskName === TEMPLATE_TASKS ? 'active' : ''}`} id="template-task-tab" data-toggle="tab" role="tab" aria-controls="template-task-tab" aria-selected="false"
                            onClick={() => {
                                dispatch(changeTask(TEMPLATE_TASKS));
                                dispatch(ListenTemplateTasks());
                            }}>
                            <ArchiveSvg />
                        </div>
                    </li>}
            </ul>
        </div>}
        <div className={`tab-content appnavbar-content ${taskName ? 'appnavbar-content-visible' : ''}`.trim()}>
            <Notes taskName={taskName} dispatch={dispatch} />
            <ToDo taskName={taskName} dispatch={dispatch} />
            <ThreadMessage taskName={taskName} dispatch={dispatch} />
            <Settings taskName={taskName} dispatch={dispatch} />
            <ImportantMessage taskName={taskName} dispatch={dispatch} />
            <TemplateTask taskName={taskName} dispatch={dispatch} />
            <MessageInfo taskName={taskName} dispatch={dispatch} />
        </div>
    </div>);
}