import React from 'react'
import AttachmentCard from './AttachmentCard'

export const TaskAttachment = ({ taskDetails, dispatch, setImageShow, attchmentDeleteHandler, isTemplate = false }) => {
    const attachments = isTemplate ? taskDetails.templateAttachments : taskDetails.attachments;
    return (
        <div className="col-sm-6 col-md-12">
            {!!attachments?.length && (
                <div className="card mb-2">
                    <div className="card-body task-attachment-body">
                        <h6>
                            Attachments ({attachments?.length})
                        </h6>
                        {attachments?.map((att) => (
                            <AttachmentCard
                                key={att.id}
                                dispatch={dispatch}
                                att={att}
                                setImageShow={setImageShow}
                                attchmentDeleteHandler={attchmentDeleteHandler}
                            />)
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
