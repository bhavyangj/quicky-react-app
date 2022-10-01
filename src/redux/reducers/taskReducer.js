import {
	EMERGENCY,
	ROUTINE,
	URGENT,
} from "../../Components/Chat/Main/UserChat/footer/ChatFooter";
import { getDateXDaysAgo } from "../../Components/Dashboard/ListofDateLogs";
import { TASK_STATUS } from "../../Components/Tasks/config";
import {
	ADD_NEW_SUBTASK,
	ADD_NEW_SUBTASK_COMMENT,
	ADD_NEW_TASK_COMMENT,
	ADD_SUBTASK_COMMENTS,
	CHANGE_SUBTASK_STATUS,
	CREATE_TASK_LABEL,
	DELETE_SUBTASK,
	DELETE_TASK_LABEL,
	ENDED,
	GET_TEMPLATE_TASK_DETAIL,
	INIT_TASK,
	NEW_CHAT_SELECTED,
	READ_TASK_LABEL,
	RECEIVED_TASK_ADDED,
	RECEIVED_TASK_CLOCK_DATA,
	RECEIVED_TEMPLATE_TASKS,
	RECEIVED_TEMPLATE_TASK_ADDED,
	RECEIVE_TASK_DELETED,
	REQ_GET_TASK_DETAILS,
	RES_GET_TASKLIST,
	RES_GET_TASK_DETAILS,
	SET_NEW_TASK_LIST,
	SET_TASKS_ATTACHMENTS,
	SET_TASK_FILTER_DATA,
	SET_USER_TASK_LOGS,
	STARTED,
	UPDATE_TASK_DETAILS,
	UPDATE_TASK_LABEL,
	UPDATE_TASK_MEMBERS,
	UPDATE_TEMPLATE_DATA,
} from "../constants/taskConstants";
import { SET_SEARCH_USER_TASK_LOGS } from "../constants/userContants";
export const TASK_CARDS = [
	{
		id: EMERGENCY,
		title: "Emergency",
		type: EMERGENCY,
	},
	{
		id: URGENT,
		title: "Urgent",
		type: URGENT,
	},
	{
		id: ROUTINE,
		title: "Routine",
		type: ROUTINE,
	},
];
const initialState = {
	activeTaskChat: null,
	activeTaskList: [],
	taskCards: TASK_CARDS,
	templateTasksCards: [
		{
			id: "TASK",
			title: "Task Templates",
			type: "TASK",
		},
	],
	templateTaskList: [],
	templateTaskDetail: null,
	taskDetails: null,
	filterTaskData: {
		dateFrom: getDateXDaysAgo(1),
		dateTo: getDateXDaysAgo(0),
		status: TASK_STATUS[0].value,
	},
	taskLabels: [],
	loading: false,
};

export const taskReducer = (state = initialState, action) => {
	switch (action.type) {
		case INIT_TASK:
			return initialState;
		case NEW_CHAT_SELECTED:
			return {
				...state,
				activeTaskChat: action.payload,
			};
		case SET_NEW_TASK_LIST:
			return {
				...state,
				activeTaskList: action.payload,
			};
		case RES_GET_TASKLIST:
			return {
				...state,
				activeTaskList: action.payload,
			};
		case RECEIVED_TASK_ADDED:
			return {
				...state,
				activeTaskList: [
					...state.activeTaskList,
					{
						...action.payload.taskInfo.taskCreated,
						comments: [],
						label: [],
						attachments: [],
						subtasks: [],
						taskmembers: [],
					},
				],
			};
		case RECEIVE_TASK_DELETED:
			return {
				...state,
				activeTaskList: state.activeTaskList.filter(
					(item) => item.id !== action.payload.taskId
				),
			};
		case REQ_GET_TASK_DETAILS:
			return {
				...state,
				loading: true,
			};
		case RES_GET_TASK_DETAILS:
			return {
				...state,
				loading: false,
				taskDetails: action.payload,
			};
		case SET_TASKS_ATTACHMENTS:
			if (action.payload?.isTemplate) {
				return {
					...state,
					templateTaskDetail: {
						...state.templateTaskDetail,
						templateAttachments: action.payload.data,
					},
				};
			} else {
				return {
					...state,
					taskDetails: {
						...state.taskDetails,
						attachments: action.payload,
					},
				};
			}
		case UPDATE_TASK_DETAILS:
			return {
				...state,
				taskDetails: {
					...state.taskDetails,
					...action.payload,
				},
			};
		case UPDATE_TASK_MEMBERS:
			return {
				...state,
				taskDetails: {
					...state.taskDetails,
					taskmembers: action.payload,
				},
			};
		case SET_USER_TASK_LOGS:
			return {
				...state,
				TaskLogsforSadmin: action.payload,
			};
		case ADD_SUBTASK_COMMENTS:
			let newSubtasks = state.taskDetails.subtasks;
			const cmtIndex = newSubtasks.findIndex(
				(item) => item.id === action.payload.subTaskId
			);
			if (cmtIndex !== -1) {
				newSubtasks[cmtIndex] = {
					...newSubtasks[cmtIndex],
					comments: action.payload.comments,
				};
				return {
					...state,
					taskDetails: {
						...state.taskDetails,
						subtasks: newSubtasks,
					},
				};
			}
			return state;
		case ADD_NEW_SUBTASK:
			if (action.payload?.isTemplate) {
				let addSubtasks = state.templateTaskDetail.subTemplates;
				addSubtasks.push(action.payload);
				return {
					...state,
					templateTaskDetail: {
						...state.templateTaskDetail,
						subTemplates: addSubtasks,
					},
				};
			} else {
				let addSubtasks = state.taskDetails.subtasks;
				addSubtasks.push(action.payload);
				return {
					...state,
					taskDetails: {
						...state.taskDetails,
						subtasks: addSubtasks,
					},
				};
			}
		case ADD_NEW_SUBTASK_COMMENT:
			let newSubtasksComment = state.taskDetails.subtasks;
			const commentIndex = newSubtasksComment.findIndex(
				(item) => item.id === action.payload.subTaskId
			);
			if (commentIndex !== -1) {
				newSubtasksComment[commentIndex].comments.push(
					action.payload.newComment
				);
				newSubtasksComment[commentIndex].totalComments++;
				return {
					...state,
					taskDetails: {
						...state.taskDetails,
						subtasks: newSubtasksComment,
					},
				};
			}
			return state;
		case ADD_NEW_TASK_COMMENT:
			return {
				...state,
				taskDetails: {
					...state.taskDetails,
					comments: [...state.taskDetails.comments, action.payload],
				},
			};
		case CHANGE_SUBTASK_STATUS:
			let subtaskStatus = state.taskDetails.subtasks;
			const statusIndex = subtaskStatus.findIndex(
				(item) => item.id === action.payload.id
			);
			if (statusIndex !== -1) {
				subtaskStatus[statusIndex] = {
					...subtaskStatus[statusIndex],
					status: action.payload.status,
				};
				return {
					...state,
					taskDetails: {
						...state.taskDetails,
						subtasks: subtaskStatus,
					},
				};
			}
			return state;
		case DELETE_SUBTASK:
			if (action.payload?.isTemplate) {
				return {
					...state,
					templateTaskDetail: {
						...state.templateTaskDetail,
						subTemplates: state.templateTaskDetail.subTemplates.filter(
							(subTemplate) => subTemplate.id !== action.payload.subTemplateId
						),
					},
				};
			} else {
				return {
					...state,
					taskDetails: {
						...state.taskDetails,
						subtasks: state.taskDetails.subtasks.filter(
							(subtask) => subtask.id !== action.payload.subTaskId
						),
					},
				};
			}
		case RECEIVED_TASK_CLOCK_DATA:
			return {
				...state,
				taskDetails: {
					...state.taskDetails,
					clockTime: {
						started: action.payload
							?.filter((item) => item.type === STARTED)
							.reverse(),
						ended: action.payload
							?.filter((item) => item.type === ENDED)
							.reverse(),
					},
				},
			};
		case SET_TASK_FILTER_DATA:
			return {
				...state,
				filterTaskData: {
					...state.filterTaskData,
					...action.payload,
				},
			};
		case RECEIVED_TEMPLATE_TASKS:
			return {
				...state,
				templateTaskList: action.payload.data,
			};
		case RECEIVED_TEMPLATE_TASK_ADDED:
			return {
				...state,
				templateTaskList: [action.payload.data, ...state.templateTaskList],
			};
		case GET_TEMPLATE_TASK_DETAIL:
			return {
				...state,
				templateTaskDetail: action.payload,
			};
		case UPDATE_TEMPLATE_DATA:
			return {
				...state,
				templateTaskDetail: {
					...state.templateTaskDetail,
					...action.payload,
				},
			};
		case READ_TASK_LABEL:
			return {
				...state,
				taskLabels: action.payload,
			};
		case CREATE_TASK_LABEL:
			return {
				...state,
				taskLabels: [...state.taskLabels, action.payload],
			};
		case UPDATE_TASK_LABEL:
			let newtaskLabels = state.taskLabels;
			const taskLabelIndex = newtaskLabels.findIndex(
				(item) => item.id === action.payload.id
			);
			if (taskLabelIndex !== -1) {
				newtaskLabels[taskLabelIndex] = {
					...newtaskLabels[taskLabelIndex],
					name: action.payload.name,
					color: action.payload.color,
				};
				return {
					...state,
					taskLabels: newtaskLabels,
				};
			}
			return state;
		case DELETE_TASK_LABEL:
			return {
				...state,
				taskLabels: state.taskLabels.filter(
					(item) => item.id !== action.payload.id
				),
			};
		case SET_SEARCH_USER_TASK_LOGS:
			return {
				...state,
				searchUserTaskLogs: action.payload,
			};
		default:
			return state;
	}
};
