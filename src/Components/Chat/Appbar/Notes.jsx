import { useSelector } from "react-redux";
import { changeModel, changeTask } from "../../../redux/actions/modelAction";
import * as momentTimzone from 'moment-timezone';
import { ADD_NOTE, NOTES } from "../Models/models";
import { GET_NOTES_SUCCESS } from "../../../redux/constants/chatConstants";

export const Notes = ({ taskName, dispatch }) => {
    const { notesList } = useSelector((state) => state.chat);
    const getTypeClass = (type) => {
        switch (type) {
            case "favourite": return "badge-primary"
            case "personal": return "badge-info"
            case "work": return "badge-warning"
            default: return "badge-danger"
        }
    }
    const onCloseHandler = () => {
        dispatch(changeTask(""));
        if (notesList.data.rows.length > 0)
            dispatch({ type: GET_NOTES_SUCCESS, payload: { data: [] } });
    }
    return (<div className={`tab-pane h-100 ${taskName === NOTES ? 'active' : ''}`} id="notes" role="tabpanel" aria-labelledby="notes-tab">
        <div className="appnavbar-content-wrapper">
            <div className="appnavbar-scrollable-wrapper">
                <div className="appnavbar-heading sticky-top">
                    <ul className="nav justify-content-between align-items-center">
                        <li className="text-center">
                            <h5 className="text-truncate mb-0">Notes</h5>
                        </li>
                        <li className="nav-item list-inline-item close-btn" onClick={() => onCloseHandler()}>
                            <div data-appcontent-close="">
                                <svg className="hw-22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="appnavbar-body">
                    <div className="note-container">
                        {notesList?.data?.rows?.map((item) => {
                            return (<div className="note" key={item.id}>
                                <div className="note-body">
                                    <div className="note-added-on">{momentTimzone(item.createdAt).format("MM/DD/YY hh:mm A")}</div>
                                    <h5 className="note-title">{item.title}</h5>
                                    <p className="note-description">{item.detail}</p>
                                </div>
                                <div className="note-footer p-1">
                                    <div className="note-tools">
                                        <span className={`badge ${getTypeClass(item.tag)} text-capitalize`}>{item.tag}</span>
                                    </div>
                                </div>
                            </div>)
                        })}
                    </div>
                </div>
                <div className="appnavbar-footer">
                    <div
                        className="btn btn-primary btn-block"
                        role="button"
                        data-toggle="modal"
                        data-target="#addNoteModal"
                        onClick={() => {
                            dispatch(changeTask(""))
                            dispatch(changeModel(ADD_NOTE));
                        }}
                    >Add new note</div>
                </div>
            </div>
        </div>
    </div>);
}