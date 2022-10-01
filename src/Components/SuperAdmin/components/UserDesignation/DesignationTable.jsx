import React, { useRef, useState } from 'react'
import classes from "../../../Tasks/TasksPage.module.css";
import { ReactComponent as ExclamationSVG } from "../../../../assets/media/heroicons/outline/exclamation.svg";
import { ReactComponent as EditSvg } from "../../../../assets/media/heroicons/solid/pencil.svg";
import { ReactComponent as DeleteSvg } from "../../../../assets/media/heroicons/solid/trash.svg";
import { ReqAddDesignation, ReqDeleteDesignation, ReqUpdateDesignation } from '../../../../utils/wssConnection/wssConnection';
export const DesignationTable = ({ designations, setAddFlag, addFlag }) => {
    const [cardInput, setCardInput] = useState({
        name: "",
    });
    const addNewLabel = (e) => {
        e.preventDefault();
        if (cardInput.name !== "")
            ReqAddDesignation(cardInput);
        onCloseAddFlag();
        setCardInput({
            name: "",
        });
    }
    const onCloseAddFlag = () => setAddFlag(false);
    return (
        <div className="table-responsive table-users h-100">
            {<>
                <table className={`table table-dark table-hover w-100 mt-2 mb-1 ${classes["table-task-list"]}`}>
                    <thead>
                        <tr className="list-task-table-row">
                            <th>id</th>
                            <th>designation</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {designations?.map((item) => (
                            <DesignationItem
                                key={item.id}
                                item={item}
                            />
                        ))}
                    </tbody>
                </table>
                {designations?.length === 0 &&
                    <div className="text-center text-muted align-items-center">
                        <ExclamationSVG />
                        <p className="mb-0">No data available</p>
                    </div>}
                {addFlag && (
                    <div className="d-flex justify-content-center m-2">
                        <form onSubmit={addNewLabel} className="d-flex align-items-center">
                            <div className={`d-flex align-items-center ${classes["gap-2"]}`}>
                                <div className="form-group d-flex m-0 mx-1 align-items-center">
                                    <label htmlFor="label" className='mb-0 mr-1'>
                                        <nobr>Designation :</nobr>
                                    </label>
                                    <input
                                        type="text"
                                        id="designation"
                                        value={cardInput.name}
                                        autoFocus
                                        autoComplete='off'
                                        onChange={(e) => {
                                            setCardInput((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }));
                                        }}
                                        className={`${classes["form-control"]} form-control p-4_8 fs-14 w-100`}
                                    />
                                </div>
                            </div>
                            <div className={`text-center ${classes.action}`}>
                                <button className={`btn btn-primary mr-2 p-4_8`} type="submit">
                                    Add Designation
                                </button>
                                <button className={`btn btn-light border p-4_8`} onClick={onCloseAddFlag}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </>}
        </div>
    )
}

export const DesignationItem = ({ item }) => {
    const [isEdit, setEdit] = useState(false);
    const [newInput, setNewInput] = useState(item);
    const editInput = useRef();
    const OnClickEditLabel = () => {
        setEdit(true);
        editInput?.current?.focus();
    }
    const onDeleteLabel = () => {
        ReqDeleteDesignation({ id: item.id });
    }
    const OnUpdate = () => {
        ReqUpdateDesignation({
            id: item.id,
            name: newInput.name.trim(),
        });
        setEdit(false);
    }
    const onCancelUpdate = () => {
        setEdit(false);
        if (item.name !== newInput.name)
            setNewInput(item.name);
    }
    return (
        <tr className="list-task-table-row">
            <td>
                <nobr>{item.id}</nobr>
            </td>
            <td>
                {!isEdit && <nobr>{item.name}</nobr>}
                {isEdit && <nobr className="d-flex">
                    <input
                        className="tasklabel-update-input p-4_8 theme-border mr-1"
                        autoFocus
                        autoComplete='off'
                        type="text"
                        value={newInput.name}
                        ref={editInput}
                        onChange={(e) => setNewInput((prev) => ({
                            ...prev,
                            name: e.target.value
                        }))} />
                    <button className='btn btn-primary p-4_8 mx-1'
                        onClick={OnUpdate}
                    >Update</button>
                    <button className='btn btn-secondary p-4_8 text-white mx-1' onClick={onCancelUpdate}>Cancel</button>
                </nobr>}
            </td>
            <td>
                <nobr className="d-flex more_items justify-content-end">
                    {!isEdit && <div className="item p-4_8 mx-1 cursor-pointer" onClick={() => OnClickEditLabel()}>
                        <EditSvg color='#665dfe' />
                    </div>}
                    <div className="item p-4_8 text-danger mx-1 cursor-pointer" onClick={() => onDeleteLabel()}>
                        <DeleteSvg />
                    </div>
                </nobr>
            </td>
        </tr>
    )
}