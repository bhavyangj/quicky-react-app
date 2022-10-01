import React from 'react'
import { useRef } from 'react';
import { useState } from 'react';
import { ReactComponent as EditSvg } from "../../../assets/media/heroicons/solid/pencil.svg";
import { ReactComponent as DeleteSvg } from "../../../assets/media/heroicons/solid/trash.svg";
import { ReqDeleteLabel, ReqUpdateLabel } from '../../../utils/wssConnection/wssConnection';
import { ALL_LABELS } from '../../Tasks/config';

export const LabelItem = ({ item }) => {
    const [isEdit, setEdit] = useState(false);
    const [newInput, setNewInput] = useState(item);
    const editInput = useRef();
    const OnClickEditLabel = () => {
        setEdit(true);
        editInput?.current?.focus();
    }
    const onDeleteLabel = () => {
        ReqDeleteLabel({ id: item.id });
    }
    const OnUpdate = () => {
        ReqUpdateLabel({
            id: item.id,
            name: newInput.name.trim(),
            color: newInput.color,
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
                    <div className="dropdown label-dropdown">
                        <button className="btn bg-dark-f text-white dropdown-toggle text-capitalize p-4_8" id="labelDropdown" data-bs-toggle="dropdown">
                            {newInput.color}
                        </button>
                        <ul className="dropdown-menu m-0" aria-labelledby="labelDropdown">
                            {ALL_LABELS.map((item) => {
                                return <li className="dropdown-item text-capitalize" onClick={() => setNewInput((prev) => ({
                                    ...prev,
                                    color: item.color
                                }))}>{item.color}</li>
                            })}
                        </ul>
                    </div>
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
