import React from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { listenAddRequest, listenListofIssue } from '../../../utils/wssConnection/Listeners/IssuesListeners';
import { ReqIssuesListforCategory } from '../../../utils/wssConnection/wssConnection';
import { MyAssignedRequest } from './AssignedRequest/MyAssignedRequest';
import { MyRequests } from './MyRequests/MyRequests'

export const CategoryData = ({ activeCard, categories, setNewRequest }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(listenListofIssue(activeCard));
        dispatch(listenAddRequest(activeCard));
        ReqIssuesListforCategory({
            categoryId: activeCard.id
        });
    }, [activeCard, dispatch]);

    return (
        <div className='my-2 p-0'>
            <div className="tab-section">
                <nav className='dashboard-nav'>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button className="nav-link active" id="nav-my-issue-tab" data-bs-toggle="tab" data-bs-target="#nav-chats" type="button" role="tab" aria-controls="nav-my-issue" aria-selected="true">
                            <span className='fs-14'>My Requests</span>
                        </button>
                        <button className="nav-link" id="nav-cc-issue-tab" data-bs-toggle="tab" data-bs-target="#nav-cc-issue" type="button" role="tab" aria-controls="nav-cc-issue" aria-selected="false">
                            <span className='fs-14'>Assigned Requests</span>
                        </button>
                    </div>
                </nav>
                <div className="tab-content p-2" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-chats" role="tabpanel" aria-labelledby="nav-my-issue-tab">
                        <MyRequests
                            setNewRequest={setNewRequest}
                            categories={categories}
                            activeCard={activeCard} />
                    </div>
                    <div className="tab-pane fade" id="nav-cc-issue" role="tabpanel" aria-labelledby="nav-cc-issue-tab">
                        <MyAssignedRequest />
                    </div>
                </div>
            </div>
        </div>
    )
}
