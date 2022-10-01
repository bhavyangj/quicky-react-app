import React, { useEffect, useLayoutEffect } from "react";
import { TASK_STATUS } from "./config";
import classes from "./TasksPage.module.css";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import { ALL_CHATS, GROUP, PRIVATE } from "../Chat/Models/models";
import { DEFAULT_IMAGE } from "../Layout/HomePage/HomePage";
import { useDispatch } from "react-redux";
import { NEW_CHAT_SELECTED, SET_TASK_FILTER_DATA } from "../../redux/constants/taskConstants";
import useDebounce from "../hooks/useDebounce";
import { getFilterTasksData, receiveNewTask } from "../../utils/wssConnection/wssConnection";
let isRendering = false;

export default function FilterTasks({
	filterObj,
	setFilterObj,
	listView,
	setListView,
	setCreatorFilter,
	isCreatorFilter }) {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.user);
	const { activeTaskChat, filterTaskData } = useSelector((state) => state.task);
	const { chatList } = useSelector((state) => state.chat);
	const newFilters = useDebounce(filterObj, 500);

	useEffect(() => {
		if (newFilters.chatId !== undefined && isRendering) {
			getFilterTasksData(newFilters);
		}
		if (!isRendering) isRendering = true;
	}, [newFilters]);

	useLayoutEffect(() => {
		if (activeTaskChat) {
			dispatch(receiveNewTask(filterObj));
		}
		if (!activeTaskChat && chatList.length > 0) {
			dispatch({ type: NEW_CHAT_SELECTED, payload: { id: 0, name: "All Chats", type: GROUP } });
			setFilterObj({
				chatId: chatList.map((chat) => chat.id),
				search: "",
				status: filterTaskData.status,
				dateFrom: filterTaskData.dateFrom,
				dateTo: filterTaskData.dateTo,
				chatType: ALL_CHATS
			});
		}
		//eslint-disable-next-line
	}, [activeTaskChat]);

	const onChangeDate = (data) => {
		dispatch({ type: SET_TASK_FILTER_DATA, payload: { ...data } });
	}

	const getChatImageUrl = (chat) => {
		if (chat) {
			if (chat.type === GROUP)
				return { name: chat.name, image: chat.image };
			else {
				const { name, profilePicture } = chat.chatusers.filter(x => x.userId !== user.id)[0]?.user;
				return { name, image: profilePicture };
			}
		}
		return { name: null, image: null }
	}

	const NewChatSelected = (chat) => {
		if (chat !== "All Chats") {
			dispatch({ type: NEW_CHAT_SELECTED, payload: chat });
			setFilterObj({
				chatId: [chat.id],
				search: "",
				status: filterTaskData.status,
				dateFrom: filterTaskData.dateFrom,
				dateTo: filterTaskData.dateTo,
				chatType: chat.type
			});
		} else {
			dispatch({ type: NEW_CHAT_SELECTED, payload: { id: 0, name: "All Chats", type: GROUP } });
			setFilterObj({
				chatId: chatList.map((chat) => chat.id),
				search: "",
				status: filterTaskData.status,
				dateFrom: filterTaskData.dateFrom,
				dateTo: filterTaskData.dateTo,
				chatType: ALL_CHATS
			});
		}
	}

	const { name, image } = getChatImageUrl(activeTaskChat);

	return (
		<nav className={`navbar navbar-expand-lg navbar-dark bg-dark p-0 mx-1 mt-1 ${classes["board-toolbar"]}`}>
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
				<div className={`collapse navbar-collapse`} id="navbarSupportedContent">
					<div className={`row p-1 m-0 navbar-nav w-100`}>
						<div className="col-md-12 col-lg-8 col-xxl-6">
							<div className="row align-items-center">
								<div className="col-md-4 col-lg-4">
									<div className="d-flex align-items-center mb-2 mb-lg-0">
										<div className="dropdown flex-100">
											<div className="dropdown-toggle text-truncate d-flex align-items-center cursor-pointer" id="memberDropdown" data-bs-toggle="dropdown">
												<div id={`chat-${activeTaskChat?.id}`} className={`${classes.member}`} title={name}>
													<img src={image ? image : DEFAULT_IMAGE} alt="m" />
												</div>
												<span className="text-capitalize ml-1 text-truncate width-limit-8">{name}</span>
											</div>
											<ul className="dropdown-menu m-0 position-absolute" aria-labelledby="memberDropdown">
												<li key={0} className="dropdown-item cursor-pointer pl-2 py-2" onClick={() => NewChatSelected("All Chats")}>
													<div>All Chats</div>
												</li>
												{chatList.map((chat) => {
													if (chat.type === GROUP) {
														const { name, image } = chat;
														return (
															<li key={chat.id} className="dropdown-item cursor-pointer p-4_8" onClick={() => NewChatSelected(chat)}>
																<div id={`chat-${chat.id}`} className={`${classes.member}`}>
																	<img src={image ? image : DEFAULT_IMAGE} alt="m" />
																</div>
																<div className="text-capitalize ml-1 text-truncate width-limit-8">{name}</div>
															</li>
														)
													}
													else if (chat.type === PRIVATE) {
														const { name, profilePicture } = chat.chatusers.filter(x => x.userId !== user.id)[0]?.user;
														return (
															<li key={chat.id} className="dropdown-item cursor-pointer p-4_8" onClick={() => NewChatSelected(chat)}>
																<div id={`chat-${chat.id}`} className={`${classes.member}`}>
																	<img src={profilePicture ? profilePicture : DEFAULT_IMAGE} alt="m" />
																</div>
																<div className="text-capitalize ml-1 text-truncate width-limit-8">{name}</div>
															</li>)
													}
													return null;
												})}
											</ul>
										</div>
									</div>
								</div>
								<div className="col-md-5 col-sm-5 col-lg-5">
									<div className="fs-16 bold-text d-flex align-items-center mb-2 mb-lg-0 justify-content-between">
										<div className="dropdown-select-options text-white mr-2">
											{/* <div className='p-1'>Task View: </div> */}
											<div className='options'>
												<div className={`option p-1 ${!listView ? 'active' : ''}`} onClick={() => setListView(false)}>Board</div>
												<div className={`option p-1 ${listView ? 'active' : ''}`} onClick={() => setListView(true)}>List</div>
											</div>
										</div>
										<div className="custom-control custom-switch mx-1">
											<input type="checkbox" className="custom-control-input" id="creatorFilter" checked={isCreatorFilter} onChange={() => setCreatorFilter(!isCreatorFilter)} />
											<label className="custom-control-label" htmlFor="creatorFilter">Creator</label>
										</div>
										<div className="dropdown">
											<button
												className="btn btn-outline-default btn-sm dropdown-toggle text-capitalize"
												type="button"
												id="statusDropdown"
												data-bs-toggle="dropdown"
												aria-expanded="false"
											>
												<span>Status: {filterObj.status}</span>
											</button>
											<ul className="dropdown-menu m-0" style={{ overflow: "unset" }} aria-labelledby="statusDropdown">
												{TASK_STATUS.map((status) => (
													<li
														key={status.id}
														className="dropdown-item cursor-pointer text-capitalize"
														onClick={() => {
															dispatch({ type: SET_TASK_FILTER_DATA, payload: { status: TASK_STATUS[status.id].value } });
															// setFilterObj((prev) => ({ ...prev, status: status.value, }))
														}}
													>
														{status.value}
													</li>
												))}
											</ul>
										</div>
									</div>
								</div>
								<div className="col-md-3 col-sm-8 col-lg-3">
									<div className="fs-16 bold-text mb-2 mb-lg-0">
										<input
											type="text"
											name="search"
											id="search"
											placeholder="Search..."
											className={`${classes["form-control"]} form-control mr-2`}
											value={filterObj.search}
											autoComplete="off"
											onChange={(e) =>
												setFilterObj((prev) => ({
													...prev,
													search: e.target.value.trim(),
												}))
											}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="col-md-12 col-lg-4 col-xxl-4 m-auto">
							<div className="fs-16 bold-text text-end">
								<div className="row">
									<div className="col-6">
										<DatePicker
											id="fromDate"
											placeholderText="From..."
											className={`${classes["form-control"]} form-control flex-grow-1`}
											selected={filterObj.dateFrom ? new Date(filterObj.dateFrom) : null}
											value={filterObj.dateFrom ? new Date(filterObj.dateFrom) : null}
											onChange={(date) => onChangeDate({ dateFrom: date })}
											isClearable={true}
											maxDate={filterObj.dateTo ? new Date(filterObj.dateTo) : null}
										/>
									</div>
									<div className="col-6">
										<DatePicker
											id="toDate"
											placeholderText="To..."
											className={`${classes["form-control"]} form-control flex-grow-1`}
											selected={filterObj.dateTo ? new Date(filterObj.dateTo) : null}
											value={filterObj.dateTo ? new Date(filterObj.dateTo) : null}
											onChange={(date) => onChangeDate({ dateTo: date })}
											isClearable={true}
											minDate={filterObj.dateFrom ? new Date(filterObj.dateFrom) : null}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
