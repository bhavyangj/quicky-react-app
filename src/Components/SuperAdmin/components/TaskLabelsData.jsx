import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { useSelector } from 'react-redux';
import useDebounce from '../../hooks/useDebounce';
import { LabelsTable } from './LabelsTable';

export const TaskLabelsData = () => {
    const { taskLabels } = useSelector((state) => state.task);
    const [addFlag, setAddFlag] = useState(false);
    const [labels, setLabels] = useState(taskLabels);
    const [searchLabel, setSearchLabel] = useState("");
    const newSearch = useDebounce(searchLabel, 500);

    useEffect(() => {
        setLabels(
            taskLabels.filter((item) => item?.name?.toLowerCase().includes(newSearch.toLowerCase()) || newSearch === "")
        );
    }, [taskLabels, newSearch]);

    return (<>
        <div className="form-inline">
            <div className="input-group admin-search m-0">
                <input type="text" className="form-control search border-0 transparent-bg p-4_8"
                    placeholder="Search Category..."
                    onChange={(e) => setSearchLabel(e.target.value.trim())} />
                <div className="input-group-append">
                    <div className="input-group-text transparent-bg border-left-0" role="button">
                        <svg className="text-muted hw-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>
            <button
                className='btn btn-primary p-4_8 ml-auto'
                type="button"
                onClick={() => setAddFlag(prev => !prev)}
            >
                Add Category
            </button>
        </div>
        <LabelsTable
            labels={labels}
            addFlag={addFlag}
            setAddFlag={setAddFlag}
        />
    </>)
}