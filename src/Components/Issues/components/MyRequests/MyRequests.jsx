import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { RES_GET_REQUEST_DETAILS } from '../../../../redux/constants/issuesConstants';
import { IssueList } from './IssueList';
import { ReactComponent as ExclamationSVG } from "../../../../assets/media/heroicons/outline/exclamation.svg";

export const MyRequests = ({ activeCard, categories, setNewRequest }) => {
    const dispatch = useDispatch();
    const { issueList } = useSelector((state) => state.issues);
    const [searchRequest, setSearchRequest] = useState();

    const setReqData = (item) => {
        dispatch({ type: RES_GET_REQUEST_DETAILS, payload: item });
    }

    return (<>
        <div className="form-inline">
            <div className="input-group admin-search m-0">
                <input type="text" className="form-control search border-0 transparent-bg p-4_8"
                    placeholder="Search Request"
                    onChange={(e) => setSearchRequest(e.target.value)} />
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
                onClick={() => setNewRequest(true)}
            >
                New Request
            </button>
        </div>
        {issueList && !!issueList.length &&
            <IssueList
                card={'issues'}
                setReqData={setReqData}
                issues={issueList.filter((item) => item.subject?.includes(searchRequest) ||
                    item.description?.includes(searchRequest) || !searchRequest)}
                dispatch={dispatch}
            />}
        {issueList && !issueList.length && <>
            <div className="text-center text-muted align-items-center mt-2">
                <ExclamationSVG />
                <p className="mb-0">No request available</p>
            </div>
        </>}
        {/* <div
            className={`backdrop ${name !== "" ? "backdrop-visible" : ""}`.trim()}
            onClick={() => {
                if (name !== "") dispatch(changeModel(""));
            }}
        ></div>
        {modelElement(name, activeCard, categories, dispatch)} */}
    </>)
}

// const modelElement = (model, card, categories, dispatch) => {
//     // All Models
//     switch (model) {
//         // Modal 1 :: Add User
//         case NEW_ISSUE_REQUEST:
//             return <NewRequest categories={categories} card={card} dispatch={dispatch} />;
//         default:
//             return null;
//     }
// };
