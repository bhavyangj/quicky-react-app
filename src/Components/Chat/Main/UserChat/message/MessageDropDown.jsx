import { addImportantMessage, createTask, removeImportantMessage, setInfoMessage, setThreadMessage } from "../../../../../redux/actions/chatAction";
import { changeModel, changeTask } from "../../../../../redux/actions/modelAction";
import { DeleteChatMessage } from "../../../../../utils/wssConnection/wssConnection";
import { ReactComponent as DotsSvg } from '../../../../../assets/media/heroicons/solid/dots-vertical.svg';
import { ReactComponent as InfoCircle } from '../../../../../assets/media/heroicons/outline/information-circle.svg';
import { ReactComponent as DownloadSvg } from '../../../../../assets/media/heroicons/outline/download.svg';
import { ReactComponent as PlusCircleSvg } from '../../../../../assets/media/heroicons/outline/plus-circle.svg';
import { ReactComponent as PencilSvg } from '../../../../../assets/media/heroicons/outline/pencil.svg';
import { ReactComponent as ReplySvg } from '../../../../../assets/media/heroicons/outline/reply.svg';
import { ReactComponent as ForwardSvg } from '../../../../../assets/media/heroicons/solid/reply.svg';
import { ReactComponent as StarSvg } from '../../../../../assets/media/heroicons/outline/star.svg';
import { ReactComponent as TagSvg } from '../../../../../assets/media/heroicons/outline/tag.svg';
import { ReactComponent as TrashSvg } from '../../../../../assets/media/heroicons/outline/trash.svg';
import { FORWARD_MSG, MESSAGE_INFO, THREAD_ITEM } from "../../../Models/models";
import axios from "axios";
import fileDownload from 'js-file-download'
import { SET_FORWARD_MSG } from "../../../../../redux/constants/chatConstants";

export const MessageDropDown = ({ item, user, dispatch, setQuote, setEditMessage }) => {
    const AddToTaskHandler = () => {
        const body = {
            name: item.message,
            description: item.message,
            type: item.type,
            chatId: item.chatId,
            messageId: item.id,
        };
        dispatch(createTask(body));
    }
    const QuoteMessageHandler = () => setQuote(item);
    const AddImportantMessageHandler = () => {
        dispatch(addImportantMessage(item, "add"));
    }
    const RemoveImportantMessageHandler = () => {
        dispatch(removeImportantMessage(item, "remove"));
    }

    const ShowThreadView = (item) => {
        dispatch(setThreadMessage(item));
        dispatch(changeTask(THREAD_ITEM));
    }
    const onClickDeleteMsg = () => {
        DeleteChatMessage(item.chatId, item.id)
    }
    const onEditMessageHandler = () => {
        setEditMessage(item);
    }
    const onClickInfo = () => {
        dispatch(setInfoMessage(item));
        dispatch(changeTask(MESSAGE_INFO));
    }
    const ForwardMessage = () => {
        dispatch({ type: SET_FORWARD_MSG, payload: item });
        dispatch(changeModel(FORWARD_MSG));
    }

    return (<>
        {!item.isDeleted && <>
            <div className="dropdown message-dropdown">
                <button className="btn text-muted p-0" id={`message-dropdown-${item.id}`} data-bs-toggle="dropdown">
                    <DotsSvg className="hw-16" />
                </button>
                <ul className="dropdown-menu m-0" aria-labelledby={`message-dropdown-${item.id}`}>
                    {!item.mediaType && item.isMessage &&
                        <li className="dropdown-item d-flex align-items-center" onClick={() => AddToTaskHandler()}>
                            <PlusCircleSvg className="hw-18 mr-2" />
                            <span>Add to Task</span>
                        </li>}
                    {!item.mediaType && item.sendBy === user.id &&
                        <li className="dropdown-item d-flex align-items-center" onClick={() => onEditMessageHandler()}>
                            <PencilSvg className="hw-18 mr-2" />
                            <span>Edit</span>
                        </li>}
                    <li className="dropdown-item d-flex align-items-center" onClick={() => ForwardMessage()}>
                        <ForwardSvg className="hw-18 mr-2 rotate-right" />
                        <span>Forward</span>
                    </li>
                    <li className="dropdown-item d-flex align-items-center" onClick={() => QuoteMessageHandler()}>
                        <ReplySvg className="hw-18 mr-2" />
                        <span>Reply</span>
                    </li>
                    {item.importantMessage ?
                        <li className="dropdown-item d-flex align-items-center" onClick={() => RemoveImportantMessageHandler()}>
                            <StarSvg className="hw-18 mr-2" />
                            <span>Remove Important</span></li>
                        : <li className="dropdown-item d-flex align-items-center" onClick={() => AddImportantMessageHandler()}>
                            <StarSvg className="hw-18 mr-2" />
                            <span>Add Important</span>
                        </li>}
                    <li className="dropdown-item d-flex align-items-center" onClick={() => ShowThreadView(item)}>
                        <TagSvg className="hw-18 mr-2" />
                        <span>View Threads</span>
                    </li>
                    {item.sendBy === user.id &&
                        <li className="dropdown-item d-flex align-items-center" onClick={() => onClickInfo()}>
                            <InfoCircle className="hw-18 mr-2" />
                            <span>Info</span>
                        </li>}
                    {item.mediaType &&
                        <li className='dropdown-item d-flex align-items-center text-info download' onClick={() => handleDownload(item.mediaUrl, item.fileName)}>
                            <DownloadSvg className="hw-18 mr-2" />
                            <span>Download</span>
                        </li>}
                    {item.sendBy === user.id && <li className="dropdown-item d-flex align-items-center text-danger" onClick={() => onClickDeleteMsg()}>
                        <TrashSvg className="hw-18 mr-2" />
                        <span>Delete</span>
                    </li>}
                </ul>
            </div>
        </>}
    </>)
}

export const handleDownload = (url, filename) => {
    try {
        axios.get(url, { responseType: 'blob' })
            .then((res) => { fileDownload(res.data, filename) })
    } catch (error) {
        console.log(error);
    }
}