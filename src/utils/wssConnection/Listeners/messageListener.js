import {
	ADD_GROUP_ADMIN,
	ADD_REMOVE_CHAT_USER_GROUP,
	DELETE_MESSAGE,
	REMOVE_GROUP_ADMIN,
	RES_SEARCH_CHATLIST_DATA,
	SET_CHAT_TIMER_SETTINGS,
	SET_UNREAD_USERS_ADMIN,
	SET_USER_NOTIFICATION,
	UPDATE_CHAT_LIST,
	UPDATE_DELETE_MESSAGE,
	UPDATE_EDITED_MESSAGE,
	UPDATE_SINGLE_CHAT_LIST,
} from "../../../redux/constants/chatConstants";
import { rooms, socket } from "../wssConnection";

export const listenNotification = (dispatch, activeChatId, userId) => {
	socket?.removeAllListeners("add-notification");
	socket?.on("add-notification", (data) => {
		const IsChatIdAvailable = rooms?.includes(data.chatId);
		if (IsChatIdAvailable && data.chatId !== activeChatId)
			dispatch({ type: SET_USER_NOTIFICATION, payload: data, userId });
	});
};

export const ListenUpdateMember = (activeChatId) => async (dispatch) => {
	// Listen User added / removed into group
	socket?.removeAllListeners("group-update-member");
	socket?.on("group-update-member", (data) => {
		if (activeChatId === data.id)
			dispatch({ type: ADD_REMOVE_CHAT_USER_GROUP, payload: data });
	});
};
export const ListenMakeGroupAdmin = (activeChatId) => async (dispatch) => {
	// Listen add group admin
	socket?.removeAllListeners("res-make-group-admin");
	socket?.on("res-make-group-admin", (data) => {
		if (activeChatId === data.chatId)
			dispatch({ type: ADD_GROUP_ADMIN, payload: data });
	});
};
export const ListenRemoveGroupAdmin = (activeChatId) => async (dispatch) => {
	// Listen remove group admin
	socket?.removeAllListeners("res-remove-group-admin");
	socket?.on("res-remove-group-admin", (data) => {
		if (activeChatId === data.chatId)
			dispatch({ type: REMOVE_GROUP_ADMIN, payload: data });
	});
};
export const ListenEditChatMsg = (activeChatId) => async (dispatch) => {
	// Listen new edited message
	socket?.removeAllListeners("res-edited-chat-message");
	socket?.on("res-edited-chat-message", (data) => {
		if (activeChatId === data.chatId)
			dispatch({ type: UPDATE_EDITED_MESSAGE, payload: data });
	});
};
export const ListenDeleteChatMsg = (activeChatId) => async (dispatch) => {
	// Listen delete message
	socket?.removeAllListeners("res-delete-chat-message");
	socket?.on("res-delete-chat-message", (data) => {
		if (activeChatId === data.chatId)
			dispatch({ type: DELETE_MESSAGE, payload: data });
	});
};
export const ListenViewDeletedMsg = (activeChatId) => async (dispatch) => {
	// receive deleted message
	socket?.removeAllListeners("res-view-deleted-message");
	socket?.on("res-view-deleted-message", (data) => {
		if (activeChatId === data.chatId)
			dispatch({ type: UPDATE_DELETE_MESSAGE, payload: data });
	});
};
export const ListenUpdateChatList = () => async (dispatch) => {
	// Update chat in chatlist
	socket?.removeAllListeners("res-update-chat-list");
	socket?.on("res-update-chat-list", (data) => {
		dispatch({ type: UPDATE_CHAT_LIST, payload: data });
	});
};
export const ListenUnreadUsersToAdmin = () => async (dispatch) => {
	// receive timer notification
	socket?.removeAllListeners("unread-users-notified-to-admins");
	socket?.on("unread-users-notified-to-admins", (data) => {
		dispatch({ type: SET_UNREAD_USERS_ADMIN, payload: data });
	});
};
export const ListenTimerNotification = (activeChatId) => async (dispatch) => {
	// receive timer notification update
	socket?.removeAllListeners("res-set-time-admin-notification");
	socket?.on("res-set-time-admin-notification", (data) => {
		if (activeChatId === data.chatInfo.id) {
			dispatch({
				type: SET_CHAT_TIMER_SETTINGS,
				payload: {
					chatId: data.chatInfo.id,
					data: {
						routineHour: Number(data.chatInfo.routineHour),
						routineMinute: Number(data.chatInfo.routineMinute),
						emergencyHour: Number(data.chatInfo.emergencyHour),
						emergencyMinute: Number(data.chatInfo.emergencyMinute),
						urgentHour: Number(data.chatInfo.urgentHour),
						urgentMinute: Number(data.chatInfo.urgentMinute),
					},
				},
			});
		}
	});
};

export const ListenSingleChat = () => async (dispatch) => {
	// Update chat in chatlist
	socket?.removeAllListeners("res-single-chat-list");
	socket?.on("res-single-chat-list", (data) => {
		// console.log(data);
		dispatch({ type: UPDATE_SINGLE_CHAT_LIST, payload: data });
	});
};
export const ListenSearchChatMsg = () => async (dispatch) => {
	// Update chat in chatlist
	socket?.removeAllListeners("res-search:message-chat");
	socket?.on("res-search:message-chat", (data) => {
		// console.log("get data::::", data);
		dispatch({ type: RES_SEARCH_CHATLIST_DATA, payload: data });
	});
};
