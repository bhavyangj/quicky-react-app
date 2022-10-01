import React from 'react'
import { getUserColor } from '../../../../../redux/common';
import { getMediaSVG } from '../../../Sidebar/ChatsContentSidebarList'
import { getBackgroundColorClass } from '../UserChat'

export const QuotedMessage = ({ item, moveToOrigin }) => {
    const { quotedMessageDetail: Qmessage } = item;
    if (item.quotedMessageId && item?.quotedMessageDetail)
        return (<>
            <div className="cursor-pointer" onClick={() => moveToOrigin(Qmessage, item.id)}>
                {!Qmessage.mediaType ?
                    <div className={`message-content quoted-message text-truncate ${!Qmessage?.isMessage ? 'task-msg-border' : ''} ${getBackgroundColorClass("q-" + Qmessage.type)}`}>
                        <div className='d-flex align-items-center justify-content-between mb-1_5 line-height-1'>
                            <span className={`text-capitalize text-truncate fs-12 font-weight-medium ${getUserColor(Qmessage.sendBy)}`}>
                                {Qmessage?.sendByDetail?.name}
                            </span>
                        </div>
                        {Qmessage.subject &&
                            <h6 className='font-weight-bold message-subject text-truncate fs-13'>
                                {`Subject: ${Qmessage.subject}`}
                            </h6>}
                        {Qmessage.patient &&
                            <h6 className='font-weight-medium message-patient text-truncate fs-13'>
                                {`Patient: ${Qmessage.patient}`}
                            </h6>}
                        <span className='font-weight-lighter text-truncate fs-13'>
                            {`${(Qmessage.subject || Qmessage.patient) ? (Qmessage.isMessage ? 'Message:' : 'Task:') : ''} ${Qmessage.message}`}
                        </span>
                    </div> :
                    <div className="contacts-texts row m-0">
                        {getMediaSVG(Qmessage.mediaType.split("/")[0])}
                        <p className="text-truncate fs-13">{Qmessage.fileName}</p>
                    </div>
                }
                {/* <div><span className="fs-12">{`${Qmessage.sendByDetail.name}, ${getDateLabel(momentTimzone(item.createdAt).format("MM/DD/YY")) + ' at ' + momentTimzone(item.quotedMessageDetail.createdAt).format("hh:mm A")}`}</span></div> */}
            </div>
            {/* <hr style={{ backgroundColor: 'white', margin: '.5rem 0' }} /> */}
        </>);
}
