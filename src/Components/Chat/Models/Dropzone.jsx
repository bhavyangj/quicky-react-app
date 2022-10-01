import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { changeModel, onSetPasteFiles, pastedFiles } from '../../../redux/actions/modelAction';
import Dropzone from 'react-dropzone'
import { getPresignedUrl, uploadToS3 } from '../../../utils/s3/s3Connection';
import { ROUTINE } from '../Main/UserChat/footer/ChatFooter';
import { sendMessage } from '../../../utils/wssConnection/wssConnection';
import { DROP_ZONE, GROUP } from './models';

export const DropZone = (props) => {
    const dispatch = useDispatch();
    const { name } = useSelector((state) => state.model);
    const { activeChat } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.user);
    const inputFileRef = useRef();

    const [isUploading, setUploading] = useState(false);
    const [files, setFiles] = useState();
    const [caption, setCaption] = useState();

    useEffect(() => {
        if (pastedFiles.length === 0)
            inputFileRef?.current?.click();
        else if (pastedFiles.length > 0) {
            onDropFilesHandler(pastedFiles);
        }
    }, []);

    const onCancelHandler = () => {
        dispatch(changeModel(""));
        setFiles([]);
        if (pastedFiles.length !== 0) dispatch(onSetPasteFiles([]))
    }

    const onDropFilesHandler = (filesList) => {
        const files = Array.from(filesList);
        setFiles(files);
        let newArr = [];
        for (const i in files)
            newArr[i] = { name: files[i].name };
        setCaption(newArr);
    }

    const getSendToUsers = () => {
        let array = activeChat.chatusers;
        if (activeChat.type === GROUP) {
            return array.filter(x => x.userId !== user.id).map((item) => item.userId);
        }
        return (array.filter(x => x.userId !== user.id)[0].userId);
    }

    const onSendFileMessage = async () => {
        setUploading(true);
        let index = 0;
        for (const file of files) {
            const presignedUrl = await onUploadImage(file);
            const uploadedImageUrl = await uploadToS3(presignedUrl, file);
            const msgObject = {
                chatType: activeChat.type,
                chatId: activeChat.id,
                message: caption[index].caption ? caption[index].caption : "",
                mediaType: `${file.type.split("/").shift()}/${file.name.split(".").pop()}`,
                mediaUrl: uploadedImageUrl,
                type: ROUTINE,
                sendTo: getSendToUsers(),
                sendBy: user.id,
                quotedMessageId: props.quoteMessage ? props.quoteMessage.id : null,
                patient: "",
                subject: "",
                fileName: caption[index].name,
                isMessage: true
            }
            index++;
            sendMessage(msgObject);
        };
        setUploading(true);
        onCancelHandler();
    }

    const onUploadImage = async (file) => {
        if (file) {
            const res = await getPresignedUrl({
                fileName: file.name,
                fileType: file.type
            });
            return res.data.url;
        }
    }

    return (<>
        <div className={`modal modal-lg-fullscreen ${name === DROP_ZONE ? 'fade show d-block' : ''}`.trim()} id="dropZone" tabIndex={-1} role="dialog" aria-labelledby="dropZoneLabel" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-dialog-zoom">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title js-title-step" id="dropZoneLabel">&nbsp;<span className="label label-success">1</span> Select File to Send</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => dispatch(changeModel(""))}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body py-0 hide-scrollbar m-2 text-white">
                        <Dropzone onDrop={onDropFilesHandler}>
                            {({ getRootProps, getInputProps }) => (
                                <section className='border-1 text-center p-1'>
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} className="dropzone-input" ref={inputFileRef} />
                                        <p className='py-2 mb-0'>Drag / drop some files here, or click to select files</p>
                                    </div>
                                </section>
                            )}
                        </Dropzone>
                        {files && <>{
                            files.map((file, index) => {
                                return (<FileTarget key={index} files={files} index={index}
                                    caption={caption} setCaption={setCaption}
                                />)
                            })
                        }
                        </>}
                    </div>
                    <div className="modal-footer">
                        <button
                            className="btn btn-link text-muted js-btn-step mr-auto"
                            data-orientation="cancel"
                            data-dismiss="modal"
                            onClick={() => onCancelHandler()}>Cancel</button>
                        <button
                            className="btn btn-primary js-btn-step"
                            data-orientation="next"
                            onClick={() => onSendFileMessage()}
                            disabled={!files || isUploading}
                        >
                            {isUploading ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>);
}

export const FileTarget = ({ files, index, setCaption, caption }) => {
    return (<>
        <div className="mt-1 transparent-bg"><p className='mb-0'>{files[index].name}</p></div>
        <input type="text" className="mt-1 form-control bg-dark p-4_8"
            placeholder='File name'
            defaultValue={files[index].name}
            onChange={e => {
                setCaption((prev) => {
                    const newArr = [...prev];
                    newArr[index] = {
                        ...newArr[index],
                        name: e.target.value
                    };
                    return newArr;
                });
            }} />
        <input type="text" className="mt-1 form-control bg-dark p-4_8"
            placeholder='Add Caption'
            onChange={e => {
                setCaption((prev) => {
                    const newArr = [...prev];
                    newArr[index] = {
                        ...newArr[index],
                        caption: e.target.value
                    };
                    return newArr;
                });
            }} />
    </>);
}