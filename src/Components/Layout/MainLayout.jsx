import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as ListSvg } from "../../assets/media/heroicons/outline/clipboard-list.svg";
import { ReactComponent as BoardSvg } from "../../assets/media/heroicons/outline/collection.svg";
import { ReactComponent as ArchiveSvg } from "../../assets/media/heroicons/outline/archive.svg";
import { SUPER_ADMIN } from "../../redux/constants/userContants";

import { createBrowserHistory } from "history";
import { DELETE_ACTIVE_CHAT, GET_IMPORTANT_MESSAGE_SUCCESS, GET_NOTES_SUCCESS, GET_TASKS_SUCCESS } from "../../redux/constants/chatConstants";
import { useDispatch } from "react-redux";
import { listenNotification } from "../../utils/wssConnection/Listeners/messageListener";
import { changeTask } from "../../redux/actions/modelAction";
import { checkNotifications, setThreadMessage } from "../../redux/actions/chatAction";
import { DefaultListeners, DefaultRequests, receiveMessage } from "../../utils/wssConnection/wssConnection";
const history = createBrowserHistory({ window });

export default function MainLayout() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { activeChat, chatList } = useSelector((state) => state.chat);
	const { user, isAuthenticated } = useSelector((state) => state.user);
	const { name } = useSelector((state) => state.model);
	const { taskName } = useSelector((state) => state.model);
	const location = useLocation();
	checkNotifications(chatList, user.id);

	useEffect(() => {
		checkNotifications(chatList, user.id);
	}, [isAuthenticated, user, user.id, chatList, dispatch, navigate]);

	useEffect(() => {
		dispatch(DefaultRequests(user.id));
		dispatch(DefaultListeners());
	}, [user.id, dispatch]);

	useEffect(() => {
		receiveMessage(activeChat && activeChat.id, dispatch, user && user.id, chatList, navigate);
	}, [activeChat, activeChat.id, chatList, user, dispatch, navigate]);

	useEffect(() => {
		try {
			history.listen((newLocation, action) => {
				if (newLocation.action === "POP") {
					if (location.pathname === "/tasks" || location.pathname === "/tasks/list") {
						dispatch({ type: DELETE_ACTIVE_CHAT, payload: activeChat });
						navigate("/chats");
					}
					else if (location.pathname === "/chats" && activeChat.id !== -1) {
						dispatch({ type: DELETE_ACTIVE_CHAT, payload: activeChat });
						listenNotification(dispatch, -1, user?.id);
						if (taskName !== "") {
							dispatch(changeTask(""));
							dispatch(setThreadMessage({ id: -1 }));
							dispatch({ type: GET_TASKS_SUCCESS, payload: { data: [] } });
							dispatch({ type: GET_NOTES_SUCCESS, payload: { data: [] } });
							dispatch({ type: GET_IMPORTANT_MESSAGE_SUCCESS, payload: [] });
						}
						navigate("/chats");
					}
				}
			});
		} catch (error) {
			console.log(error);
		}
		//eslint-disable-next-line
	}, [activeChat.id, location, taskName]);
	try {
		return (
			<div className={`chats-tab-open h-100 ${name !== "" ? "modal-open" : ""}`.trim()}>
				<div className="main-layout">
					<div className="navigation navbar navbar-light bg-primary">
						{/* <!-- Logo Start --> */}
						<Link className="d-none d-xl-block bg-light rounded p-1" to="/dashboard">
							<svg height="30" width="30" viewBox="0 0 512 511">
								<g>
									<path d="m120.65625 512.476562c-7.25 0-14.445312-2.023437-20.761719-6.007812-10.929687-6.902344-17.703125-18.734375-18.117187-31.660156l-1.261719-41.390625c-51.90625-46.542969-80.515625-111.890625-80.515625-183.992188 0-68.816406 26.378906-132.101562 74.269531-178.199219 47.390625-45.609374 111.929688-70.726562 181.730469-70.726562s134.339844 25.117188 181.730469 70.726562c47.890625 46.097657 74.269531 109.382813 74.269531 178.199219 0 68.8125-26.378906 132.097657-74.269531 178.195313-47.390625 45.609375-111.929688 70.730468-181.730469 70.730468-25.164062 0-49.789062-3.253906-73.195312-9.667968l-46.464844 20.5c-5.035156 2.207031-10.371094 3.292968-15.683594 3.292968zm135.34375-471.976562c-123.140625 0-216 89.816406-216 208.925781 0 60.667969 23.957031 115.511719 67.457031 154.425781 8.023438 7.226563 12.628907 17.015626 13.015625 27.609376l.003906.125 1.234376 40.332031 45.300781-19.988281c8.15625-3.589844 17.355469-4.28125 25.921875-1.945313 20.132812 5.554687 41.332031 8.363281 63.066406 8.363281 123.140625 0 216-89.816406 216-208.921875 0-119.109375-92.859375-208.925781-216-208.925781zm-125.863281 290.628906 74.746093-57.628906c5.050782-3.789062 12.003907-3.839844 17.101563-.046875l55.308594 42.992187c16.578125 12.371094 40.304687 8.007813 51.355469-9.433593l69.519531-110.242188c6.714843-10.523437-6.335938-22.417969-16.292969-14.882812l-74.710938 56.613281c-5.050781 3.792969-12.003906 3.839844-17.101562.046875l-55.308594-41.988281c-16.578125-12.371094-40.304687-8.011719-51.355468 9.429687l-69.554688 110.253907c-6.714844 10.523437 6.335938 22.421874 16.292969 14.886718zm0 0" data-original="#000000" className="active-path" data-old_color="#000000" fill="#665dfe" />
								</g>
							</svg>
						</Link>
						<ul className="nav nav-minimal flex-row flex-grow-1 justify-content-around flex-xl-column justify-content-xl-center" id="mainNavTab" role="tablist">
							<li className="nav-item">
								<Link className={`nav-link p-0 py-xl-3 ${location.pathname === "/dashboard" ? "active" : ""}`} id="dashboard-tab" to="/dashboard" title="Dashboard">
									<svg className="hw-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
								</Link>
							</li>
							{user.roleData?.name === SUPER_ADMIN &&
								<li className="nav-item">
									<Link className={`nav-link p-0 py-xl-3 ${location.pathname === "/admin" ? "active" : ""}`} id="admin-tab" to="/admin" title="Super Admin">
										<svg className="hw-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
										</svg>
									</Link>
								</li>}
							{user.roleData?.name === SUPER_ADMIN &&
								<li className="nav-item">
									<Link className={`nav-link p-0 py-xl-3 ${location.pathname === "/template/tasks" ? "active" : ""}`} id="template-tab" to="/template/tasks" title="Template Tasks">
										<ArchiveSvg />
									</Link>
								</li>}
							<li className="nav-item">
								<Link className={`nav-link p-0 py-xl-3 ${location.pathname === "/chats" ? "active" : ""}`} id="chats-tab" to="/chats" title="Chats">
									<svg className="hw-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
									</svg>
								</Link>
							</li>
							<li className="nav-item">
								<Link className={`nav-link p-0 py-xl-3 ${location.pathname === "/tasks" ? "active" : ""}`} id="friends-tab" to="/tasks" title="Task Board">
									<ListSvg />
								</Link>
							</li>
							<li className="nav-item">
								<Link className={`nav-link p-0 py-xl-3 ${location.pathname === "/issues" ? "active" : ""}`} id="issues-tab" to="/issues" title="Knowledge Based">
									<BoardSvg />
								</Link>
							</li>
						</ul>
						{/* <!-- Main Nav End --> */}
					</div>
					<Outlet />
				</div>
			</div>
		);
	} catch (error) {
		console.log(error);
	}

}
