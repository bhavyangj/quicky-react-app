import { getBackgroundColorClass } from "../UserChat"
import { linkify, MessageFooter, MessageHeader } from "./MessageContent"
import { MessageDropDown } from "./MessageDropDown"

export const AudioContent = ({ item, user, dispatch, setQuote, setEditMessage, moveToOrigin, prevMsg, pTime, DisableOpt = false }) => {
    return (
        <div className={`message-content position-relative ${getBackgroundColorClass(item.type)}`}>
            <MessageHeader user={user} item={item} prevMsg={prevMsg} pTime={pTime} forceView={DisableOpt} />
            {!DisableOpt &&
                <MessageDropDown user={user} item={item} dispatch={dispatch} setQuote={setQuote} setEditMessage={setEditMessage} />}
            {(item.isDeleted) &&
                <p className='deleted-message text-muted'>
                    {`This ${item.isMessage ? 'Message' : 'Task'} was Deleted`}
                </p>}
            <div className="document">
                <audio controls>
                    <source src={item.mediaUrl} type="audio/ogg" />
                    <source src={item.mediaUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </div>
            <div>
                <span className="text-truncate" title={`File: ${item?.fileName}`}>{`File: ${item?.fileName}`}</span>
            </div>
            {item.message && item.message !== "" &&
                <div className="mt-1">
                    <span>{`${(item.subject || item.patient) ? (item.isMessage ? 'Message: ' : 'Task: ') : ''}`}</span>
                    <span dangerouslySetInnerHTML={{ __html: linkify(item.message) }}></span>
                </div>}
            <MessageFooter user={user} item={item} moveToOrigin={DisableOpt && moveToOrigin} />
        </div>
    )
}