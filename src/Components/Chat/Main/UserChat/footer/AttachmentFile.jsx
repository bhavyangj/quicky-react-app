import { changeModel } from "../../../../../redux/actions/modelAction";
import { useDispatch } from "react-redux";
import { DROP_ZONE } from "../../../Models/models";
import { ReactComponent as MicSvg } from '../../../../../assets/media/heroicons/outline/microphone.svg';

export const AttachmentFile = (props) => {
    const dispatch = useDispatch();
    const onClickGalleryHandler = () => dispatch(changeModel(DROP_ZONE));
    const onClickDocumentHandler = () => dispatch(changeModel(DROP_ZONE));
    const onClickAudioRecorderHandler = () => props.setRecorder(true);
    return (
        <div className="attachment">
            <div className="dropdown">
                <button className="btn btn-secondary btn-icon btn-minimal btn-sm" id="attachmentDropdown" data-bs-toggle="dropdown" type="button">
                    <svg className="hw-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
                <ul className="dropdown-menu chat-attachment-dropdown m-0" aria-labelledby="attachmentDropdown">
                    <li className="dropdown-item" onClick={() => onClickGalleryHandler()}>
                        <svg className="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Gallery</span>
                    </li>
                    <li className="dropdown-item" onClick={() => onClickDocumentHandler()}>
                        <svg className="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                        <span>Audio</span>
                    </li>
                    <li className="dropdown-item" onClick={() => onClickDocumentHandler()}>
                        <svg className="hw-20 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span>Document</span>
                    </li>
                    <li className="dropdown-item" onClick={() => onClickAudioRecorderHandler()}>
                        <MicSvg className="hw-20 mr-2" />
                        <span>Audio Recorder</span>
                    </li>
                </ul>
            </div>
        </div>);
}