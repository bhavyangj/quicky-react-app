import {
	SET_ACCOUNT_STATUS,
	SET_USERS_LIST,
	SET_USER_ROLE_LIST_ADD,
	SET_USER_ROLE_LIST_DELETE,
} from "../../../redux/constants/chatConstants";
import {
	SET_USER_ROLE_LIST,
	SET_USER_ROLE_LIST_UPDATE,
} from "../../../redux/constants/modelConstants";
import { RECEIVED_TASK_CLOCK_DATA } from "../../../redux/constants/taskConstants";
import {
	CREATED_NEW_SUPER_ADMIN,
	RECEIVED_DATE_USER_CLOCK_DATA,
	RECEIVED_USER_CLOCK_DATA,
	SET_ALL_GROUPS_DATA,
	SET_ALL_USERS_DATA,
	SET_SEARCH_USER_LIST_LOGS,
	SET_SEARCH_USER_TASK_LOGS,
	SET_USERS_LIST_LOGS,
} from "../../../redux/constants/userContants";
import { socket } from "../wssConnection";

export const ListenCreateUserLog = () => async (dispatch) => {
	socket?.removeAllListeners("res-create-user-log");
	socket?.on("res-create-user-log", (data) => {
		if (data.isToday) {
			dispatch({ type: RECEIVED_USER_CLOCK_DATA, payload: data.data });
			dispatch({ type: RECEIVED_DATE_USER_CLOCK_DATA, payload: data.data });
		} else {
			if (!data.isDate)
				dispatch({ type: RECEIVED_USER_CLOCK_DATA, payload: data.data });
			else
				dispatch({ type: RECEIVED_DATE_USER_CLOCK_DATA, payload: data.data });
		}
	});
};
export const ListenCreateTaskLog = () => async (dispatch) => {
	socket?.removeAllListeners("res-create-task-log");
	socket?.on("res-create-task-log", (data) => {
		// console.log("receive task clock data: ", data);
		dispatch({ type: RECEIVED_TASK_CLOCK_DATA, payload: data.data });
	});
};
export const ListenCreateSuperAdmin = () => async (dispatch) => {
	socket?.removeAllListeners("res-create-super-admin");
	socket?.on("res-create-super-admin", (data) => {
		// console.log("receive user admin status: ", data);
		dispatch({ type: CREATED_NEW_SUPER_ADMIN, payload: data });
	});
};
export const ListenDeactivateAccount = () => async (dispatch) => {
	socket?.removeAllListeners("res-deactive-account");
	socket?.on("res-deactive-account", (data) => {
		// console.log("receive account status: ", data);
		dispatch({ type: SET_ACCOUNT_STATUS, payload: data });
	});
};
export const ListenRolesList = () => async (dispatch) => {
	socket?.removeAllListeners("res-fetch-role-list");
	socket?.on("res-fetch-role-list", (data) => {
		// console.log("receive role list: ", data);
		dispatch({ type: SET_USER_ROLE_LIST, payload: data.data });
	});
};
export const ListenAddnewUser = () => async (dispatch) => {
	socket?.removeAllListeners("res-add-user");
	socket?.on("res-add-user", (data) => {
		// console.log("receive new user: ", data);
		dispatch({ type: SET_USER_ROLE_LIST_ADD, payload: data });
	});
};
export const ListenDeleteUser = () => async (dispatch) => {
	socket?.removeAllListeners("res-delete-user");
	socket?.on("res-delete-user", (data) => {
		// console.log("receive delete user: ", data);
		dispatch({ type: SET_USER_ROLE_LIST_DELETE, payload: data });
	});
};
export const ListenUpdateUser = () => async (dispatch) => {
	socket?.removeAllListeners("res-update-user");
	socket?.on("res-update-user", (data) => {
		// console.log("receive updated user: ", data);
		dispatch({ type: SET_USER_ROLE_LIST_UPDATE, payload: data.user });
	});
};
export const ListenPaginateUserData = () => async (dispatch) => {
	socket?.removeAllListeners("res-paginate-user-data");
	socket?.on("res-paginate-user-data", (data) => {
		// console.log("receive users List: ", data);
		dispatch({ type: SET_USERS_LIST, payload: data });
	});
};
export const ListenListDateLogs = () => async (dispatch) => {
	socket?.removeAllListeners("user-logs:res-date-range");
	socket?.on("user-logs:res-date-range", (data) => {
		// console.log("receive users logs: ", data);
		dispatch({ type: SET_USERS_LIST_LOGS, payload: data });
	});
};
export const ListenUserLogs = () => async (dispatch) => {
	socket?.removeAllListeners("user-logs-admin:res-date-range");
	socket?.on("user-logs-admin:res-date-range", (data) => {
		// console.log("receive users logs: ", data);
		dispatch({ type: SET_SEARCH_USER_LIST_LOGS, payload: data });
	});
};
export const ListenTaskTimeLogs = () => async (dispatch) => {
	socket?.removeAllListeners("res-task-log-with-user");
	socket?.on("res-task-log-with-user", (data) => {
		// console.log("receive task logs: ", data);
		dispatch({ type: SET_SEARCH_USER_TASK_LOGS, payload: data });
	});
};
export const ListenAllGroupsList = () => async (dispatch) => {
	socket?.removeAllListeners("res-get-chat-groups");
	socket?.on("res-get-chat-groups", (data) => {
		// console.log("receive all groups: ", data);
		dispatch({ type: SET_ALL_GROUPS_DATA, payload: data.chats });
	});
};
export const ListenAllUsersList = () => async (dispatch) => {
	socket?.removeAllListeners("res-get-chat-users");
	socket?.on("res-get-chat-users", (data) => {
		// console.log("receive all groups: ", data);
		dispatch({ type: SET_ALL_USERS_DATA, payload: data.users });
	});
};
