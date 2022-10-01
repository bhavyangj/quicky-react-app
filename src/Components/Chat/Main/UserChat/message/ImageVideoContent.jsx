import { IMAGE, VIDEO } from "../../../../../redux/constants/chatConstants"
import { getBackgroundColorClass } from "../UserChat"
import { onImageGalleryOpen } from "./Message"
import { linkify, MessageFooter, MessageHeader } from "./MessageContent"
import { MessageDropDown } from "./MessageDropDown"

export const ImageVideoContent = ({ item, user, dispatch, setQuote, setEditMessage, moveToOrigin, pTime, prevMsg, DisableOpt = false }) => {
    return (
        <div className={`message-content position-relative h-200 ${getBackgroundColorClass(item.type)}`}>
            <MessageHeader user={user} item={item} prevMsg={prevMsg} pTime={pTime} forceView={DisableOpt} />
            {!DisableOpt &&
                <MessageDropDown user={user} item={item} dispatch={dispatch} setQuote={setQuote} setEditMessage={setEditMessage} />}
            {(item.isDeleted) &&
                <p className='deleted-message text-muted'>{`This ${item.isMessage ? 'Message' : 'Task'} was Deleted`}</p>}
            <div className="form-row">
                <div className="col">
                    <div className="popup-media">
                        {item.mediaType.startsWith(IMAGE) &&
                            <img className="img-fluid rounded hw-200" src={item.mediaUrl} alt="" onClick={() => onImageGalleryOpen(item.id, dispatch)} />}
                        {item.mediaType.startsWith(VIDEO) &&
                            <video width="320" height="240" controls>
                                <source src={item.mediaUrl} type="video/mp4" />
                                <source src={item.mediaUrl} type="video/ogg" />
                                Your browser does not support the video tag.
                            </video>}
                        <div>
                            <span className="text-truncate" title={`File: ${item?.fileName}`}>{`File: ${item?.fileName}`}</span>
                        </div>
                        {item.message && item.message !== "" &&
                            <div className="mt-1">
                                <span dangerouslySetInnerHTML={{ __html: linkify(item.message) }}></span>
                            </div>}
                    </div>
                </div>
            </div>
            <MessageFooter user={user} item={item} moveToOrigin={DisableOpt && moveToOrigin} />
        </div>
    )
}