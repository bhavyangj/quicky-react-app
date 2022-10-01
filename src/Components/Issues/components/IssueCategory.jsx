import React from 'react'
import { ReactComponent as SearchSvg } from "../../../assets/media/heroicons/solid/search.svg";
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import { CategoryData } from './CategoryData';
import { GenerateRequest } from './MyRequests/GenerateRequest';
import { useDispatch } from 'react-redux';
import { RES_GET_REQUEST_DETAILS, SET_ISSUE_CARD_ITEM } from '../../../redux/constants/issuesConstants';
import { RequestDetails } from './RequestDetail/RequestDetails';

export const IssueCategory = () => {
    const dispatch = useDispatch();
    const { taskLabels } = useSelector((state) => state.task);
    const { issueDetails, activeCard } = useSelector((state) => state.issues);
    const [categories, setcategories] = useState(taskLabels);
    const [searchStr, setSearch] = useState();
    // const [activeCard, setCardItem] = useState();
    const [createNewReq, setNewRequest] = useState(false);
    const [requestDetail, setRequestDetail] = useState();

    useEffect(() => {
        if (taskLabels) setcategories(taskLabels);
    }, [taskLabels]);

    const onCloseReqDeatails = () => {
        dispatch({ type: RES_GET_REQUEST_DETAILS, payload: null });
    }
    const setCardItem = (item) => {
        dispatch({ type: SET_ISSUE_CARD_ITEM, payload: item });
    }

    useEffect(() => {
        setRequestDetail(issueDetails);
    }, [issueDetails]);

    return (
        <div className={`col text-light w-100 custom-page-layout`}>
            <div className="header-knowledge my-2">
                <h4 className='text-white-70'>
                    HCMD Knowledge Based
                </h4>
            </div>
            {categories && !!categories.length && <>
                <div className="d-flex flex-wrap issues-category-cards mb-2">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb p-0 my-1 transparent-bg">
                            <li className="breadcrumb-item" onClick={() => {
                                setCardItem(null);
                                requestDetail && setRequestDetail();
                            }}>
                                {`Categories (${categories.length})`}
                            </li>
                            {activeCard &&
                                <li className="breadcrumb-item" onClick={() => { setRequestDetail() }}>
                                    {activeCard.name}
                                </li>}
                            {createNewReq &&
                                <li className="breadcrumb-item">
                                    {'New Request'}
                                </li>}
                            {requestDetail &&
                                <li className="breadcrumb-item text-info">
                                    {`#${requestDetail.id}`}
                                </li>}
                        </ol>
                    </nav>
                </div>
                {!activeCard && <>
                    <div className={`issues-search-category py-2`}>
                        <div className="d-flex search-input category justify-content-around w-100">
                            <div className={`input-group w-75`}>
                                <input
                                    type="text"
                                    className="form-control search border-right-0 transparent-bg pr-0 text-white-70"
                                    placeholder="Search Category..."
                                    onChange={(e) => setSearch(e.target.value)} />
                                <div className="input-group-append">
                                    <button className="btn btn-primary">
                                        <SearchSvg className="hw-20" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row d-flex flex-wrap issues-category-cards m-1">
                        {categories
                            .filter((item) => ((searchStr && item.name.toLowerCase().includes(searchStr.toLowerCase())) || !searchStr))
                            .map((card, index) => {
                                return (
                                    <div key={index} className="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12 my-1">
                                        <div
                                            className="card cursor-pointer"
                                            title={`Click to open ${card.name} category`}
                                            onClick={() => setCardItem(card)}>
                                            <div className="card-body text-center">
                                                <h5 className="card-title my-1">{card.name}</h5>
                                            </div>
                                        </div>
                                    </div>);
                            })}
                    </div>
                </>}
                {activeCard && !requestDetail && !createNewReq &&
                    <CategoryData
                        setNewRequest={setNewRequest}
                        categories={categories}
                        activeCard={activeCard}
                        setCardItem={setCardItem} />}
                {activeCard && !requestDetail && createNewReq &&
                    <GenerateRequest
                        categories={categories}
                        setNewRequest={setNewRequest}
                        activeCard={activeCard}
                        setCardItem={setCardItem} />}
                {activeCard && !createNewReq && requestDetail && (<>
                    <RequestDetails onClose={() => onCloseReqDeatails()} requestData={requestDetail} setRequestDetail={setRequestDetail} />
                </>
                )}
            </>}
        </div>
    )
}
