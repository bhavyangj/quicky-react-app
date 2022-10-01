import { getChatTaskList } from "../../../Components/Tasks/TaskPage";
import {
	RECEIVED_TASK_ADDED,
	RECEIVE_TASK_DELETED,
	RES_GET_TASKLIST,
	SET_USER_TASK_LOGS,
	UPDATE_TASK_DETAILS,
	UPDATE_TASK_MEMBERS,
} from "../../../redux/constants/taskConstants";
import { socket } from "../wssConnection";

export const ListenCreateTask = (activeChatId) => async (dispatch) => {
	// receive new task added
	socket?.removeAllListeners("manage-task-module:res-create");
	socket?.on("manage-task-module:res-create", (data) => {
		if (activeChatId === data.taskInfo.taskCreated.chatId || activeChatId === 0)
			dispatch({ type: RECEIVED_TASK_ADDED, payload: data });
	});
};
export const ListenDeleteTask = (activeChatId) => async (dispatch) => {
	// receive deleted task
	socket?.removeAllListeners("manage-task-module:res-delete");
	socket?.on("manage-task-module:res-delete", (data) => {
		if (activeChatId === data.chatId || activeChatId === 0)
			dispatch({ type: RECEIVE_TASK_DELETED, payload: data });
	});
};
export const ListenTaskList = (activeChatId) => async (dispatch) => {
	// receive filter task list
	socket?.removeAllListeners("manage-task-module:res-task-list");
	socket?.on("manage-task-module:res-task-list", (data) => {
		dispatch({ type: RES_GET_TASKLIST, payload: data });
	});
};
export const ListenTaskUpdate = () => async (dispatch) => {
	// receive filter task list
	socket?.removeAllListeners("manage-task-module:res-update-task");
	socket?.on("manage-task-module:res-update-task", (data) => {
		if (data && data.status === 1) {
			dispatch({
				type: UPDATE_TASK_DETAILS,
				payload: {
					status: data.data.status,
					dueDate: data.data.dueDate,
					description: data.data.description,
					label: data.data.label,
				},
			});
		}
	});
};
export const SaveNewTaskData = (body) => async (dispatch) => {
	// receive filter task list
	socket?.emit("manage-task-module:req-update-task", body);
};

export const ListenUpdateAssignMember = (taskInfo) => async (dispatch) => {
	// receive filter task list
	socket?.removeAllListeners("manage-task-module:res-new-assign-task");
	socket?.on("manage-task-module:res-new-assign-task", (data) => {
		if (taskInfo && taskInfo.id)
			dispatch({ type: UPDATE_TASK_MEMBERS, payload: data.data });
	});
};

export const ListenNewAssign =
	(filterObj, chatList, activeTaskChatId) => async (dispatch) => {
		// receive filter task list
		socket?.removeAllListeners("update-task-list-data");
		socket?.on("update-task-list-data", (data) => {
			getChatTaskList(activeTaskChatId, chatList, filterObj);
		});
	};

export const ListenUserTaskLogs = () => async (dispatch) => {
	socket?.removeAllListeners("res-user-tasks");
	socket?.on("res-user-tasks", (data) => {
		dispatch({ type: SET_USER_TASK_LOGS, payload: data.tasks });
	});
};
export const ListenGroupTasks = () => async (dispatch) => {
	socket?.removeAllListeners("res-get-chat-tasks");
	socket?.on("res-get-chat-tasks", (data) => {
		dispatch({ type: SET_USER_TASK_LOGS, payload: data.tasks });
	});
};
