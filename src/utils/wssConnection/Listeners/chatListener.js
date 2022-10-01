import {
	LOAD_CHAT_USER_LIST_SUCCESS,
	NEW_CHAT_RECEIVED,
	REMOVE_CHAT,
	SET_MY_STATUS,
	SET_USER_OFFLINE,
	SET_USER_ONLINE,
	SET_USER_STATUS,
	UPDATE_CHAT_BACKGROUND,
	UPDATE_USERLIST_STATUS,
} from "../../../redux/constants/chatConstants";
import {
	UPDATE_GROUP_DATA,
	UPDATE_USER_PROFILE_PICTURE,
} from "../../../redux/constants/userContants";
import { JoinAllChat, rooms, socket } from "../wssConnection";

export const ListenNewChat = () => async (dispatch) => {
	// Listen new Chat added by someone
	socket?.removeAllListeners("new-chat-data");
	socket.on("new-chat-data", (data) => {
		rooms.push(data.id);
		socket?.emit("join-chat", {
			chatId: data.id,
		});
		dispatch({ type: NEW_CHAT_RECEIVED, payload: data });
	});
};
export const ListenUserToOnline = (userId) => async (dispatch) => {
	// Listen User went Online
	socket.on("user-online", (data) => {
		if (data.userId !== userId) {
			dispatch({ type: SET_USER_ONLINE, payload: data });
			dispatch({ type: UPDATE_USERLIST_STATUS, payload: data });
		}
	});
};
export const ListenUserToOffline = (userId) => async (dispatch) => {
	// Listen User went Offline
	socket.on("user-offline", (data) => {
		if (data.userId !== userId) {
			dispatch({ type: SET_USER_OFFLINE, payload: data });
			dispatch({ type: UPDATE_USERLIST_STATUS, payload: data });
		}
	});
};
export const ListenUserStatus = (userId) => async (dispatch) => {
	// Listen User went Offline
	socket.on("user-status-changed", (data) => {
		if (data.userId !== userId) {
			dispatch({ type: SET_USER_STATUS, payload: data });
		} else dispatch({ type: SET_MY_STATUS, payload: data });
		dispatch({ type: UPDATE_USERLIST_STATUS, payload: data });
	});
};
export const ListenRemoveUserFromChat = (userId) => async (dispatch) => {
	// Listen removed me from group
	socket.on("res-remove-member", (data) => {
		dispatch({ type: REMOVE_CHAT, payload: data.chatId });
		socket?.emit("disconnect-user-chat", { chatId: data.chatId });
	});
};
export const listenChatList = (joinSocket) => async (dispatch) => {
	socket?.removeAllListeners("res-chat-list");
	socket?.on("res-chat-list", (data) => {
		// console.log("receive chats List: ", data);
		dispatch({ type: LOAD_CHAT_USER_LIST_SUCCESS, payload: data.data });
		if (joinSocket) JoinAllChat(data.data);
	});
};
export const listenUpdateprofile = () => async (dispatch) => {
	socket?.removeAllListeners("profile-picture:res-update");
	socket?.on("profile-picture:res-update", (data) => {
		dispatch({ type: UPDATE_USER_PROFILE_PICTURE, payload: data });
	});
};
export const listenUpdateGroup = () => async (dispatch) => {
	socket?.removeAllListeners("group-details:res-update");
	socket?.on("group-details:res-update", (data) => {
		// console.log("receive update data: ", data);
		dispatch({ type: UPDATE_GROUP_DATA, payload: data });
	});
};

export const listenUpdateBackground = (activeChatId) => async (dispatch) => {
	socket?.removeAllListeners("res-update-chat-background");
	socket?.on("res-update-chat-background", (data) => {
		// console.log("Update background: ", data);
		dispatch({ type: UPDATE_CHAT_BACKGROUND, payload: data });
	});
};
