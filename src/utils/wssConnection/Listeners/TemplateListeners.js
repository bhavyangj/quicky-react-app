import {
	RES_CREATE_DESIGNATION,
	RES_DELETE_DESIGNATION,
	RES_UPDATE_DESIGNATION,
} from "../../../redux/constants/chatConstants";
import {
	CREATE_TASK_LABEL,
	DELETE_TASK_LABEL,
	READ_DESIGNATIONS,
	READ_TASK_LABEL,
	RECEIVED_TEMPLATE_TASKS,
	RECEIVED_TEMPLATE_TASK_ADDED,
	UPDATE_TASK_LABEL,
	UPDATE_TEMPLATE_DATA,
} from "../../../redux/constants/taskConstants";
import { socket } from "../wssConnection";

export const ListenNewTemplateTasks = (activeChatId) => async (dispatch) => {
	// receive new task added
	socket?.removeAllListeners("manage-task-module:res-create-template");
	socket?.on("manage-task-module:res-create-template", (data) => {
		// console.log("RECEIVED NEW TASK: ", data);
		dispatch({ type: RECEIVED_TEMPLATE_TASK_ADDED, payload: data });
	});
};
export const ListenTemplateTasks = (activeChatId) => async (dispatch) => {
	// receive new task added
	socket?.removeAllListeners("manage-task-module:res-fetch-templates");
	socket?.on("manage-task-module:res-fetch-templates", (data) => {
		// console.log("RECEIVED TASK List: ", data);
		dispatch({ type: RECEIVED_TEMPLATE_TASKS, payload: data });
	});
};
export const ListenUpdateTemplateTasks = (activeChatId) => async (dispatch) => {
	// receive new task added
	socket?.removeAllListeners("manage-task-module:res-update-templates");
	socket?.on("manage-task-module:res-update-templates", (data) => {
		// console.log("RECEIVED TASK updates: ", data);
		dispatch({ type: UPDATE_TEMPLATE_DATA, payload: data.data });
	});
};
export const ListenReadTaskLabel = () => async (dispatch) => {
	// receive new task added
	// console.log("listening read labels");
	socket?.removeAllListeners("res-list-task-labels");
	socket?.on("res-list-task-labels", (data) => {
		// console.log("RECEIVED read: ", data);
		dispatch({ type: READ_TASK_LABEL, payload: data.data });
	});
};
export const ListenReadDesignations = () => async (dispatch) => {
	// receive new task added
	// console.log("listening read labels");
	socket?.removeAllListeners("designation:res-list");
	socket?.on("designation:res-list", (data) => {
		// console.log("RECEIVED designations: ", data);
		dispatch({ type: READ_DESIGNATIONS, payload: data.data });
	});
};
export const ListenCreateTaskLabel = () => async (dispatch) => {
	// receive new task added
	socket?.removeAllListeners("res-create-task-label");
	socket?.on("res-create-task-label", (data) => {
		// console.log("RECEIVED create: ", data);
		dispatch({ type: CREATE_TASK_LABEL, payload: data.data });
	});
};
export const ListenUpdateTaskLabel = () => async (dispatch) => {
	// receive new task added
	socket?.removeAllListeners("res-update-task-label");
	socket?.on("res-update-task-label", (data) => {
		// console.log("RECEIVED updates: ", data);
		dispatch({ type: UPDATE_TASK_LABEL, payload: data.data });
	});
};
export const ListenDeleteTaskLabel = () => async (dispatch) => {
	// receive new task added
	// console.log("listen delete =");
	socket?.removeAllListeners("res-delete-task-label");
	socket?.on("res-delete-task-label", (data) => {
		// console.log("RECEIVED delete: ", data);
		dispatch({ type: DELETE_TASK_LABEL, payload: data });
	});
};
export const ListenCreateDesignation = () => async (dispatch) => {
	// console.log("listen delete =");
	socket?.removeAllListeners("designation:res-create");
	socket?.on("designation:res-create", (data) => {
		// console.log("RECEIVED craete: ", data);
		dispatch({ type: RES_CREATE_DESIGNATION, payload: data.data });
	});
};
export const ListenUpdateDesignation = () => async (dispatch) => {
	// console.log("listen delete =");
	socket?.removeAllListeners("designation:res-update");
	socket?.on("designation:res-update", (data) => {
		// console.log("RECEIVED update: ", data);
		dispatch({ type: RES_UPDATE_DESIGNATION, payload: data.data });
	});
};
export const ListenDeleteDesignation = () => async (dispatch) => {
	// console.log("listen delete =");
	socket?.removeAllListeners("designation:res-delete");
	socket?.on("designation:res-delete", (data) => {
		// console.log("RECEIVED delete: ", data);
		dispatch({ type: RES_DELETE_DESIGNATION, payload: data.data });
	});
};
