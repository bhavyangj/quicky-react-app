import { changeModel } from "../../../../../redux/actions/modelAction";
import { SET_PDF_URL } from "../../../../../redux/constants/chatConstants";
import { PDF_VIEWER } from "../../../Models/models";
import { getBackgroundColorClass } from "../UserChat";
import { linkify, MessageFooter, MessageHeader } from "./MessageContent";
import { MessageDropDown } from "./MessageDropDown";

export const FileContent = ({ item, user, dispatch, setQuote, setEditMessage, moveToOrigin, prevMsg, pTime, DisableOpt = false }) => {
    return (
        <div className={`message-content position-relative ${getBackgroundColorClass(item.type)}`}>
            <MessageHeader user={user} item={item} prevMsg={prevMsg} pTime={pTime} forceView={DisableOpt} />
            {!DisableOpt &&
                <MessageDropDown user={user} item={item} dispatch={dispatch} setQuote={setQuote} setEditMessage={setEditMessage} />}
            {(item.isDeleted) && <p className='font-weight-lighter deleted-message text-muted'>{`This ${item.isMessage ? 'Message' : 'Task'} was Deleted`}</p>}
            <div className="document">
                {item.mediaType.endsWith("pdf") ?
                    <div onClick={() => {
                        dispatch(changeModel(PDF_VIEWER));
                        dispatch({ type: SET_PDF_URL, payload: item.mediaUrl, fileName: item.fileName });
                    }} className="btn btn-primary btn-icon rounded-circle text-light mr-2">
                        <svg className="hw-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    : <a href={item.mediaUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-icon rounded-circle text-light mr-2">
                        <svg className="hw-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                    </a>}
                <div className="document-body">
                    <h6 className="text-truncate" title={`File: ${item?.fileName}`}>{item?.fileName}</h6>
                    <ul className="list-inline small mb-0">
                        <li className="list-inline-item">
                            <span className="text-muted text-uppercase">{item?.mediaType?.split("/").reverse()[0]}</span>
                        </li>
                    </ul>
                </div>
            </div>
            {item.message && item.message !== "" &&
                <div>
                    <span dangerouslySetInnerHTML={{ __html: linkify(item.message) }}></span>
                </div>}
            <MessageFooter user={user} item={item} moveToOrigin={DisableOpt && moveToOrigin} />
        </div>
    )
}