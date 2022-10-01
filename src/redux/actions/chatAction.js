import axios from "../../utils/axios";
import { GROUP, PRIVATE } from "../../Components/Chat/Models/models";
import { GetUserChatList } from "../../utils/wssConnection/wssConnection";
import {
	ADD_IMPORTANT_MESSAGE_SUCCESS,
	CREATE_TASK_FAIL,
	GET_IMPORTANT_MESSAGE_SUCCESS,
	GET_NOTES_SUCCESS,
	GET_NOTE_FAIL,
	GET_TASKS_SUCCESS,
	GET_TASK_FAIL,
	LOAD_CHAT_USER_LIST_FAIL,
	REMOVE_IMPORTANT_MESSAGE_SUCCESS,
	SET_ACTIVE_CHAT_FAIL,
	SET_ACTIVE_CHAT_REQUEST,
	SET_ACTIVE_CHAT_SUCCESS,
	SET_INFO_MESSAGE,
	SET_THREAD_MESSAGE,
	UPDATE_ISMESSAGE,
} from "../constants/chatConstants";
import { CONST } from "../../utils/constants";
import { listenChatList } from "../../utils/wssConnection/Listeners/chatListener";
import { setNotiCount } from "../..";
export let totalNotiCount;

const notificationAudio = new Audio(
	"./assets/media/sound/notificationSound.mp3"
);

// Load chat user list
export const loadUserChatList = (joinSocket) => async (dispatch) => {
	try {
		// dispatch({ type: LOAD_CHAT_USER_LIST_REQUEST });
		GetUserChatList();
		dispatch(listenChatList(joinSocket));
	} catch (error) {
		dispatch({ type: LOAD_CHAT_USER_LIST_FAIL, payload: error });
	}
};

// Set Active Chat
export const setActiveChat = (item) => async (dispatch) => {
	try {
		dispatch({ type: SET_ACTIVE_CHAT_REQUEST });
		dispatch({ type: SET_ACTIVE_CHAT_SUCCESS, payload: item });
	} catch (error) {
		dispatch({ type: SET_ACTIVE_CHAT_FAIL, payload: error });
	}
};

// Create Task
export const createTask = (body) => async (dispatch) => {
	try {
		const { data } = await axios.post(CONST.API.CREATE_TASK, body);
		if (data.data.messageId) {
			dispatch({
				type: UPDATE_ISMESSAGE,
				payload: {
					messageId: data.data.messageId,
					isMessage: data.data?.isMessage,
				},
			});
		}
	} catch (error) {
		dispatch({ type: CREATE_TASK_FAIL, payload: error });
	}
};

// Fetch Task List
export const getTaskList =
	(chatId, type = "") =>
	async (dispatch) => {
		try {
			const body = type !== "All Tasks" ? { chatId, type } : { chatId };
			const { data } = await axios.post(CONST.API.GET_TASKS_LIST, body);
			dispatch({ type: GET_TASKS_SUCCESS, payload: data });
		} catch (error) {
			dispatch({ type: GET_TASK_FAIL });
		}
	};

// Create Private Chat
export const CreatePrivateChat = async (id, userId) => {
	try {
		const { data } = await axios.post(CONST.API.CREATE_NEW_CHAT, {
			type: PRIVATE,
			users: [userId, id],
		});
		return data;
	} catch (error) {
		console.log(error);
	}
};

// Create Group Chat
export const CreateGroupChat = async (usersId, userId, name, image = "") => {
	try {
		const { data } = await axios.post(CONST.API.CREATE_NEW_CHAT, {
			type: GROUP,
			users: [userId, ...usersId],
			name,
			image,
		});
		return data;
	} catch (error) {
		console.log(error);
	}
};

// Get Users List
export const getUsersList = async (username) => {
	try {
		const { data } = await axios.get(CONST.API.GET_USERS_LIST + username);
		return data;
	} catch (error) {
		console.log(error);
	}
};

// Create new Note
export const CreateNewNote = async (body) => {
	try {
		const { data } = await axios.post(CONST.API.CRAETE_NEW_NOTE, body);
		return data;
	} catch (error) {
		console.log(error);
	}
};

// Get Note List
export const getNoteList = (chatId) => async (dispatch) => {
	try {
		const body = {
			chatId,
		};
		const { data } = await axios.post(CONST.API.GET_NOTE_LIST, body);
		dispatch({ type: GET_NOTES_SUCCESS, payload: data });
	} catch (error) {
		dispatch({ type: GET_NOTE_FAIL });
	}
};

// Play Notification Sound for particular notification
export const playNotificationSound = () => {
	try {
		notificationAudio.play();
	} catch (e) {
		console.log(e);
	}
};

// Set Current Message for Getting Thread Responses
export const setThreadMessage = (message) => async (dispatch) => {
	dispatch({ type: SET_THREAD_MESSAGE, payload: message });
};
export const setInfoMessage = (message) => async (dispatch) => {
	dispatch({ type: SET_INFO_MESSAGE, payload: message });
};

// Get Thread Message Responses
export const getResponseofThread = async (messageId) => {
	try {
		const body = { messageId };
		const { data } = await axios.post(CONST.API.GET_RES_THREAD, body);
		return data;
	} catch (error) {
		console.log(error);
	}
};

// Get Media Files for ActiveChat
export const getFilesData = async (chatId, type, search) => {
	try {
		const body = { chatId, type, search };
		const { data } = await axios.post(CONST.API.GET_FILES_DATA, body);
		return data;
	} catch (error) {
		console.log(error);
	}
};

// Set Mute Notification Setting
export const saveNotificationSettings = async (
	chatId,
	isRoutineNotificationMute,
	isEmergencyNotificationMute,
	isUrgentNotificationMute
) => {
	try {
		const body = {
			chatId,
			isRoutineNotificationMute,
			isEmergencyNotificationMute,
			isUrgentNotificationMute,
		};
		const { data } = await axios.post(
			CONST.API.UPDATE_NOTIFICATION_SETTING,
			body
		);
		return data;
	} catch (error) {
		console.log(error);
	}
};

// Add as Important Message
export const addImportantMessage = (message, type) => async (dispatch) => {
	try {
		let body = {
			type,
			chatId: message.chatId,
			messageId: message.id,
		};
		const { data } = await axios.post(CONST.API.ADD_IMPORTANT_MESSAGE, body);
		dispatch({ type: ADD_IMPORTANT_MESSAGE_SUCCESS, payload: data.data });
	} catch (error) {
		console.log(error);
	}
};

// Remove Important Tag from Message
export const removeImportantMessage = (message, type) => async (dispatch) => {
	try {
		let body = {
			type: type,
			importantMessageId: message.importantMessage.id,
			chatId: message.chatId,
			messageId: message.id,
		};
		const { data } = await axios.post(CONST.API.REMOVE_IMPORTANT_MESSAGE, body);
		dispatch({ type: REMOVE_IMPORTANT_MESSAGE_SUCCESS, payload: data.data });
	} catch (error) {
		console.log(error);
	}
};

// Get Important Messages
export const getImportantMessageList = (chatId) => async (dispatch) => {
	try {
		const body = { chatId };
		const { data } = await axios.post(CONST.API.GET_IMPORTANT_MSG_LIST, body);
		dispatch({ type: GET_IMPORTANT_MESSAGE_SUCCESS, payload: data.data });
	} catch (error) {
		dispatch({ type: GET_TASK_FAIL });
		console.log(error);
	}
};

export const checkNotifications = async (chatList, userId) => {
	try {
		const getCounts = async () => {
			totalNotiCount = 0;
			for (let index = 0; index < chatList.length; index++) {
				let chat = chatList[index];
				const chatusers = chat.chatusers;
				const chatUserIndex = chatusers.findIndex(
					(item) => item.userId === userId
				);
				const userchat = chatusers[chatUserIndex];
				const chatUnreadCount =
					userchat?.atTheRateMentionMessageCount +
					userchat?.hasMentionMessageCount +
					userchat?.emergencyUnreadMessageCount +
					userchat?.routineUnreadMessageCount +
					userchat?.urgentUnreadMessageCount;
				totalNotiCount += chatUnreadCount;
			}
			return totalNotiCount || 0;
		};
		const count = await getCounts();
		setNotiCount(count);
	} catch (e) {
		console.log(e);
	}
};
