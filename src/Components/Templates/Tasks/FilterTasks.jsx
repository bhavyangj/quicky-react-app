import React from 'react'
import { EMERGENCY, ROUTINE, URGENT } from '../../Chat/Main/UserChat/footer/ChatFooter';
import classes from "../../Tasks/TasksPage.module.css";

export const FilterTasks = ({ filters, setFilters }) => {

    return (
        <nav className={`navbar navbar-expand-lg navbar-dark bg-dark p-1 m-1 ${classes["board-toolbar"]}`}>
            <div className="container-fluid p-0">
                <button
                    className="navbar-toggler m-1"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    +<small> Add Filter</small>
                </button>
                <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
                    <div className="dropdown mr-2">
                        <button className="btn btn-outline-default dropdown-toggle text-capitalize" id="TodoDropdown" data-bs-toggle="dropdown" type="button">
                            {filters.type}
                        </button>
                        <ul className="dropdown-menu m-0" aria-labelledby="TodoDropdown">
                            <li className="dropdown-item" onClick={() => setFilters((prev) => ({ ...prev, type: "All Tasks" }))}>All Tasks</li>
                            <li className="dropdown-item" onClick={() => setFilters((prev) => ({ ...prev, type: ROUTINE }))}>Routine</li>
                            <li className="dropdown-item" onClick={() => setFilters((prev) => ({ ...prev, type: EMERGENCY }))}>Emergency</li>
                            <li className="dropdown-item" onClick={() => setFilters((prev) => ({ ...prev, type: URGENT }))}>Urgent</li>
                        </ul>
                    </div>
                    <form className="form-inline">
                        <div className="input-group">
                            <input type="text" className="form-control search transparent-bg" placeholder="Search Task" onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))} />
                        </div>
                    </form>
                </div>
            </div>
        </nav>
    );
}
