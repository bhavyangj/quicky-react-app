import React from 'react'
import classes from "../../Tasks/TasksPage.module.css";
import { ReactComponent as ExclamationSVG } from "../../../assets/media/heroicons/outline/exclamation.svg";
import { LabelItem } from './LabelItem';
import { useState } from 'react';
import { ReqAddLabel } from '../../../utils/wssConnection/wssConnection';
import { ALL_LABELS } from '../../Tasks/config';

export const LabelsTable = ({ labels, setAddFlag, addFlag }) => {
    const [cardInput, setCardInput] = useState({
        name: "",
        color: ALL_LABELS[0].color
    });
    const addNewLabel = (e) => {
        e.preventDefault();
        if (cardInput.name !== "")
            ReqAddLabel(cardInput)
        onCloseAddFlag();
        setCardInput({
            name: "",
        });
    }
    const onCloseAddFlag = () => setAddFlag(false);
    return (
        <div className="table-responsive table-users h-100">
            {/* {!!usersData.users.length && <> */}
            {<>
                <table className={`table table-dark table-hover w-100 mt-2 mb-1 ${classes["table-task-list"]}`}>
                    <thead>
                        <tr className="list-task-table-row">
                            <th>id</th>
                            <th>category</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {labels?.map((item) => (
                            <LabelItem
                                key={item.id}
                                item={item}
                            />
                        ))}
                    </tbody>
                </table>
                {labels.length === 0 &&
                    <div className="text-center text-muted align-items-center">
                        <ExclamationSVG />
                        <p className="mb-0">No categories available</p>
                    </div>}
                {addFlag && (
                    <div className="d-flex justify-content-center m-2">
                        <form onSubmit={addNewLabel} className="d-flex align-items-center">
                            <div className={`d-flex align-items-center ${classes["gap-2"]}`}>
                                <div className="form-group d-flex m-0 mx-1 align-items-center">
                                    <label htmlFor="label" className='mb-0 mr-1'>
                                        <nobr>Category :</nobr>
                                    </label>
                                    <input
                                        type="text"
                                        id="label"
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
                                <div className="dropdown mr-2">
                                    <button className="btn bg-grey text-white dropdown-toggle text-capitalize p-4_8" id="labelDropdown" data-bs-toggle="dropdown">
                                        {cardInput.color}
                                    </button>
                                    <ul className="dropdown-menu m-0" aria-labelledby="labelDropdown">
                                        {ALL_LABELS.map((item, index) => {
                                            return <li key={index} className="dropdown-item text-capitalize" onClick={() => setCardInput((prev) => ({
                                                ...prev,
                                                color: item.color
                                            }))}>{item.color}</li>
                                        })}
                                    </ul>
                                </div>
                            </div>
                            <div className={`text-center ${classes.action}`}>
                                <button className={`btn btn-primary mr-2 p-4_8`} type="submit">
                                    Add Category
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
