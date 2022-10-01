import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { CreateNewNote } from '../../../redux/actions/chatAction';
import { changeModel } from '../../../redux/actions/modelAction';
import { ADD_NOTE } from './models';

export const AddNote = () => {
    const dispatch = useDispatch();
    const { name } = useSelector((state) => state.model);
    const [noteTitle, setNoteTitle] = useState("");
    const [noteDetails, setNoteDetails] = useState("");
    const [noteTag, setNoteTag] = useState("personal");
    const { activeChat } = useSelector((state) => state.chat);

    const onCloseHandler = () => {
        dispatch(changeModel(""));
        setNoteTitle("");
        setNoteDetails("");
    }
    const onAddNoteHandler = () => {
        const createNote = async () => {
            const res = await CreateNewNote({
                title: noteTitle,
                detail: noteDetails,
                tag: noteTag,
                chatId: activeChat.id
            });
            if (res.status === 1)
                onCloseHandler();
        }
        if (noteTitle !== "")
            createNote();
    }

    return (<>
        <div className={`modal modal-lg-fullscreen fade ${name === ADD_NOTE ? 'show d-block' : ''}`} id="addNoteModal" tabIndex={-1} role="dialog" aria-labelledby="addNoteModalLabel" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-dialog-zoom">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="addNoteModalLabel">Add new note</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => dispatch(changeModel(""))}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="addNoteName" className="col-form-label">Note title:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="addNoteName"
                                    value={noteTitle}
                                    onChange={(e) => setNoteTitle(e.target.value)}
                                    placeholder="Add note title here" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="addNoteDetails" className="col-form-label">Note details:</label>
                                <textarea
                                    className="form-control hide-scrollbar"
                                    id="addNoteDetails"
                                    rows={4}
                                    value={noteDetails}
                                    onChange={(e) => setNoteDetails(e.target.value)}
                                    placeholder="Add note descriptions" />
                            </div>
                            <div className="form-group">
                                <label className="col-form-label">Note tag:</label>
                                <select
                                    value={noteTag}
                                    onChange={(e) => setNoteTag(e.target.value)}
                                    className="custom-select custom-form-control font-size-sm shadow-none text-white"
                                >
                                    <option value="personal">Personal</option>
                                    <option value="important">Important</option>
                                    <option value="work">Work</option>
                                    <option value="favourite">Favourite</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light border" data-dismiss="modal" onClick={onCloseHandler}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={onAddNoteHandler}>Add Note</button>
                    </div>
                </div>
            </div>
        </div>
    </>);
}
