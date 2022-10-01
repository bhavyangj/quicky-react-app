import React, { useEffect, useState } from 'react'
import useDebounce from '../../../hooks/useDebounce';
import { DesignationTable } from './DesignationTable';

export const UserDesignation = ({ userDesignations }) => {
    const [addFlag, setAddFlag] = useState(false);
    const [designations, setDesignation] = useState(userDesignations);
    const [searchDesignation, setSearchDesignation] = useState("");
    const newSearch = useDebounce(searchDesignation, 500);

    useEffect(() => {
        if (userDesignations)
            setDesignation(userDesignations.filter((item) => (item?.name?.toLowerCase().includes(newSearch.toLowerCase()) || newSearch === "")))
    }, [userDesignations, newSearch]);

    return (<>
        <div className="form-inline">
            <div className="input-group admin-search m-0">
                <input type="text" className="form-control search border-0 transparent-bg p-4_8"
                    placeholder="Search Designation..."
                    onChange={(e) => setSearchDesignation(e.target.value.trim())} />
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
                Add Designation
            </button>
        </div>
        <DesignationTable
            designations={designations}
            addFlag={addFlag}
            setAddFlag={setAddFlag}
        />
    </>)
}