import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import useDebounce from '../../../../hooks/useDebounce';

export const SearchBar = (props) => {
    const { activeChat } = useSelector((state) => state.chat);
    const [searchText, setSearchText] = useState("");
    const [messageType, setMessageType] = useState("All Messages");
    const newSearch = useDebounce(searchText, 500);

    useEffect(() => {
        setMessageType("All Messages");
        setSearchText("");
    }, [activeChat.id]);
    const onFilterMessageHandler = (messageType) => {
        setMessageType(messageType)
        props.setSearch({
            search: searchText,
            type: (messageType !== "All Messages") ? messageType : "",
            isOpen: true
        });
    };
    useEffect(() => {
        if (props.isSearchOpen.isOpen)
            props.setSearch({
                search: newSearch.trim(),
                type: (messageType !== "All Messages") ? messageType : "",
                isOpen: true
            });
        //eslint-disable-next-line
    }, [newSearch]);

    return (<div className={`collapse border-bottom px-3 ${props?.isSearchOpen.isOpen ? 'show' : ''}`.trim()} id="searchCollapse">
        <div className="container-xl py-2 px-0 px-md-3">
            <div className="input-group bg-light">
                <div className="dropdown">
                    <button className="btn btn-sm btn-outline-default dropdown-toggle text-capitalize square-right h-100" id="searchBarDropdown" data-bs-toggle="dropdown">
                        <span>{messageType}</span>
                    </button>
                    <ul className="dropdown-menu m-0" aria-labelledby="searchBarDropdown">
                        <li className="dropdown-item" onClick={() => onFilterMessageHandler("All Messages")}>All Messages</li>
                        <li className="dropdown-item" onClick={() => onFilterMessageHandler("routine")}>Routine</li>
                        <li className="dropdown-item" onClick={() => onFilterMessageHandler("emergency")}>Emergency</li>
                        <li className="dropdown-item" onClick={() => onFilterMessageHandler("urgent")}>Urgent</li>
                    </ul>
                </div>
                <input type="text"
                    className="form-control border-right-0 transparent-bg pr-0 square-left text-white-70"
                    placeholder="Search Subject, Patient or Message..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)} />
                {/* <div className="input-group-append">
                    <button className="btn btn-primary border-left-0">
                        <svg className="hw-20 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div> */}
            </div>
        </div>
    </div>);
}
