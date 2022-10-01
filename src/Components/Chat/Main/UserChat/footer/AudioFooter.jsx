import React, { useEffect, useRef, useState } from 'react'
import { getPresignedUrl, uploadToS3 } from '../../../../../utils/s3/s3Connection';
import { ROUTINE } from './ChatFooter';
import { useSelector } from 'react-redux';
import { sendMessage } from '../../../../../utils/wssConnection/wssConnection';
import { GROUP } from '../../../Models/models';
import { ReactComponent as TrashSvg } from '../../../../../assets/media/heroicons/solid/trash.svg';
import { ReactComponent as MicSvg } from '../../../../../assets/media/heroicons/solid/microphone.svg';
import { ReactComponent as PlaySvg } from '../../../../../assets/media/heroicons/solid/play.svg';
import { ReactComponent as PauseSvg } from '../../../../../assets/media/heroicons/solid/pause.svg';
import { ReactComponent as StopSvg } from '../../../../../assets/media/heroicons/solid/stop.svg';
import { ReactComponent as ArrowRightSvg } from '../../../../../assets/media/heroicons/solid/arrow-right.svg';

import { useAudioRecorder } from '@sarafhbk/react-audio-recorder'
let isPermissionGranted = false;

export const AudioFooter = (props) => {
    const { activeChat } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.user);

    const {
        audioResult,
        timer,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        status,
        // errorMessage
    } = useAudioRecorder()

    const [isUploading, setUploading] = useState(false);
    const [isRecording, setRecording] = useState(false);
    const [isBlocked, setBlocked] = useState(true);
    const [file, setFile] = useState();
    const [fileName, setFilename] = useState();
    const recordBtn = useRef();

    useEffect(() => {
        setTimeout(() => {
            recordBtn?.current?.click();
        }, 500);
    }, []);

    useEffect(() => {
        navigator.getUserMedia = (
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia
        );
        if (navigator.mediaDevices) {
            isPermissionGranted = true;
            if (typeof navigator.mediaDevices.getUserMedia === 'undefined') {
                navigator.getUserMedia({
                    audio: true, video: false
                }, () => setBlocked(false), () => setBlocked(true));
            } else {
                navigator.mediaDevices.getUserMedia({
                    audio: true, video: false
                }).then(() => setBlocked(false)).catch(() => setBlocked(true))
            }
        }
    }, [isBlocked, isRecording]);

    const getAudioPresignedurl = async () => {
        if (file) {
            const res = await getPresignedUrl({
                fileName: file.name,
                fileType: file.type
            });
            return (res.data.url)
        }
    }
    const getSendToUsers = () => {
        let array = activeChat.chatusers;
        if (activeChat.type === GROUP)
            return array.filter(x => x.userId !== user.id).map((item) => item.userId);
        return (array.filter(x => x.userId !== user.id)[0].userId);
    }

    const onSendAudioMessage = async (e) => {
        e.preventDefault();
        setUploading(true);
        const presignedUrl = await getAudioPresignedurl(file);
        if (presignedUrl) {
            const uploadedAudioUrl = await uploadToS3(presignedUrl, file);
            const msgObject = {
                chatType: activeChat.type,
                chatId: activeChat.id,
                message: "",
                mediaType: file.type,
                mediaUrl: uploadedAudioUrl,
                type: ROUTINE,
                sendTo: getSendToUsers(),
                isMessage: true,
                sendBy: user.id,
                quotedMessageId: props.quoteMessage ? props.quoteMessage.id : null,
                patient: "",
                subject: "",
                fileName: `${fileName}.mp3`
            }
            sendMessage(msgObject);
        }
        setUploading(false);
        props.setRecorder(false);
    }

    const onStart = () => {
        if (isBlocked || !isPermissionGranted)
            console.log("Permission Denied, Your Connection is not Secured!");
        else if (status === "paused")
            resumeRecording();
        else {
            setRecording(true);
            startRecording();
        }
    }
    const onPause = () => pauseRecording();
    const onStop = () => {
        setRecording(false);
        stopRecording();
    }

    useEffect(() => {
        if (audioResult) {
            const createFile = async () => {
                let d = new Date();
                const res = await fetch(audioResult);
                const blob = await res.blob();
                let file = new File([blob], d.valueOf(), { type: "audio/wav" });
                setFile(file);
            }
            createFile();
        }
    }, [audioResult]);

    const onTransh = () => {
        if (isRecording) onStop();
        props.setRecorder(false);
    }

    return (<>
        <div className="preaudio-footer chat-footer recording-footer d-flex flex-row align-items-center">
            <div className="btn p-4_8 audio_btn" role="button"
                onClick={onTransh}>
                <TrashSvg fill="#ff337c" />
            </div>
            {(!isRecording || status === "paused") &&
                <button className="btn-primary m-1 p-4_8 audio_btn b-none" onClick={onStart} ref={recordBtn}>
                    <PlaySvg fill='#fff' />
                </button>}
            {isRecording && <>
                {status !== "paused" &&
                    <button className="btn-primary m-1 p-4_8 audio_btn b-none" onClick={onPause}>
                        <PauseSvg fill='#fff' />
                    </button>}
                <button className="btn-secondary m-1 p-4_8 audio_btn b-none" onClick={onStop}>
                    <StopSvg fill="#ff337c" />
                </button>
            </>}
            {isRecording && <div className='mx-2 audio_btn audio_btn_recording b-none'>
                <MicSvg />
                <span className='text-capitalize'>{status}</span>
            </div>}
            {status !== "idle" && <span className='text-right text-light'>{new Date(timer * 1000).toISOString().substr(11, 8)}</span>}
            {audioResult && !isRecording && <audio className='audio-input h-75' src={audioResult} controls="controls" />}
        </div>
        {audioResult && !isRecording &&
            <div className="chat-footer recording-footer d-flex flex-row align-items-center">
                <form className="d-flex" onSubmit={onSendAudioMessage}>
                    <div className="input-group align-items-center">
                        <input
                            type="text"
                            className="form-control search transparent-bg mx-2 h-75"
                            value={fileName}
                            placeholder="Filename"
                            onChange={(e) => setFilename(e.target.value)} />
                    </div>
                    {file &&
                        <button
                            type="submit"
                            className="btn btn-primary m-1 align-items-center audio_btn b-none"
                            data-orientation="next"
                            disabled={isUploading || isBlocked || !fileName}
                        >
                            {isUploading ? 'Sending...' : <ArrowRightSvg fill="#fff" />}
                        </button>}
                </form>
            </div>}
    </>);
}
