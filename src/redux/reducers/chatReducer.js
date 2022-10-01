import { PRIVATE } from "../../Components/Chat/Models/models";
import {
	ADD_GROUP_ADMIN,
	ADD_REMOVE_CHAT_USER_GROUP,
	ADD_TO_MEDIA_FILES,
	CLEAR_ERRORS,
	CLEAR_USER_NOTIFICATION,
	CREATE_TASK_FAIL,
	DELETE_ACTIVE_CHAT,
	GET_MESSAGES_FAIL,
	GET_MESSAGES_SUCCESS,
	GET_NOTES_SUCCESS,
	GET_TASKS_SUCCESS,
	IMAGE_INDEX,
	LOAD_CHAT_USER_LIST_FAIL,
	LOAD_CHAT_USER_LIST_REQUEST,
	LOAD_CHAT_USER_LIST_SUCCESS,
	NEW_CHAT_RECEIVED,
	RECEIVED_NEW_MESSAGE,
	RELOAD_STATE,
	REMOVE_CHAT,
	REMOVE_GROUP_ADMIN,
	SET_ACTIVE_CHAT_FAIL,
	SET_ACTIVE_CHAT_REQUEST,
	SET_ACTIVE_CHAT_SUCCESS,
	SET_COUNT,
	SET_DOCUMENT_FILES,
	SET_FILES,
	SET_MEDIA_FILES,
	SET_MEDIA_FILE_TYPE,
	SET_NOTIFICATION_STATUS,
	SET_OFFSET,
	SET_PDF_URL,
	SET_THREAD_MESSAGE,
	SET_USER_NOTIFICATION,
	SET_USER_OFFLINE,
	SET_USER_ONLINE,
	UPDATE_EDITED_MESSAGE,
	GET_IMPORTANT_MESSAGE_SUCCESS,
	ADD_IMPORTANT_MESSAGE_SUCCESS,
	REMOVE_IMPORTANT_MESSAGE_SUCCESS,
	UPDATE_DELETE_MESSAGE,
	DELETE_MESSAGE,
	UPDATE_CHAT_LIST,
	SET_CHAT_TIMER_SETTINGS,
	SET_UNREAD_USERS_ADMIN,
	SET_USER_STATUS,
	SET_USERS_LIST,
	SET_ACCOUNT_STATUS,
	UPDATE_ISMESSAGE,
	SET_USER_ROLE_LIST_DELETE,
	SET_USER_ROLE_LIST_ADD,
	UPDATE_SINGLE_CHAT_LIST,
	INIT_CHAT,
	SET_INFO_MESSAGE,
	UPDATE_USERLIST_STATUS,
	SET_FORWARD_MSG,
	RES_SEARCH_CHATLIST_DATA,
	SET_FIND_MSG_ID,
	RES_CREATE_DESIGNATION,
	RES_DELETE_DESIGNATION,
	RES_UPDATE_DESIGNATION,
} from "../constants/chatConstants";
import { SET_USER_ROLE_LIST_UPDATE } from "../constants/modelConstants";
import { READ_DESIGNATIONS } from "../constants/taskConstants";
import {
	CREATED_NEW_SUPER_ADMIN,
	SET_ALL_GROUPS_DATA,
	SET_ALL_USERS_DATA,
	UPDATE_GROUP_DATA,
} from "../constants/userContants";

const initialState = {
	activeChat: {
		id: -1,
	},
	taskList: {
		data: [],
	},
	notesList: {
		data: {
			rows: [],
		},
	},
	chatList: [],
	importantMessageList: {
		rows: [],
	},
	usersList: {
		count: 0,
		users: [],
	},
	threadMessage: { id: -1 },
	infoMessage: { id: -1 },
	mediaFiles: [],
	documentFiles: [],
	offset: 0,
	totalCount: 1,
	messages: {
		data: {
			count: 0,
			rows: [],
		},
	},
};

export const chatReducer = (state = initialState, action) => {
	switch (action.type) {
		case INIT_CHAT:
			return initialState;
		case LOAD_CHAT_USER_LIST_REQUEST:
			return {
				...state,
				loading: true,
			};
		case SET_FIND_MSG_ID:
			return {
				...state,
				...action.payload,
			};
		case SET_ALL_GROUPS_DATA:
			return {
				...state,
				AllGroups: action.payload,
			};
		case SET_ALL_USERS_DATA:
			return {
				...state,
				AllUsers: action.payload,
			};
		case LOAD_CHAT_USER_LIST_SUCCESS:
			const loadChatList = action.payload;
			loadChatList.sort(compareDateTime);
			return {
				...state,
				loading: false,
				chatList: loadChatList,
			};
		case READ_DESIGNATIONS:
			return {
				...state,
				userDesignations: action.payload,
			};
		case SET_USER_NOTIFICATION:
			const newChatList = state.chatList;
			const NotificationIndex = newChatList.findIndex(
				(item) => item.id === action.payload.chatId
			);
			const lastMessageNotified = {
				id: action.payload.messageDetail.id,
				chatId: action.payload.messageDetail.chatId,
				message: action.payload.messageDetail.message,
				subject: action.payload.messageDetail.subject,
				createdAt: action.payload.messageDetail.createdAt,
				mediaType: action.payload.messageDetail.mediaType,
				fileName: action.payload.messageDetail.fileName,
				isMessage: action.payload.messageDetail.isMessage,
				sendByDetail: action.payload.messageDetail.sendByDetail,
			};
			const newChatUsers = newChatList[NotificationIndex].chatusers.filter(
				(x) => x.userId !== action.userId
			);
			const newChatUsersFiltered = newChatList[
				NotificationIndex
			].chatusers.filter((x) => x.userId === action.userId)[0];
			newChatUsersFiltered.routineUnreadMessageCount =
				action.payload.notification.routineUnreadMessageCount;
			newChatUsersFiltered.emergencyUnreadMessageCount =
				action.payload.notification.emergencyUnreadMessageCount;
			newChatUsersFiltered.urgentUnreadMessageCount =
				action.payload.notification.urgentUnreadMessageCount;
			newChatUsersFiltered.atTheRateMentionMessageCount =
				action.payload.notification.atTheRateMentionMessageCount;
			newChatUsersFiltered.hasMentionMessageCount =
				action.payload.notification.hasMentionMessageCount;
			if (NotificationIndex !== -1) {
				newChatList[NotificationIndex] = {
					...newChatList[NotificationIndex],
					messages: [lastMessageNotified],
					updatedAt: action.payload.messageDetail.createdAt,
					chatusers: [...newChatUsers, newChatUsersFiltered],
				};
			}
			newChatList.sort(compareDateTime);
			return {
				...state,
				chatList: newChatList,
			};
		case SET_NOTIFICATION_STATUS:
			const newNotificationChatList = state.chatList;
			const chatNotificationIndex = newNotificationChatList.findIndex(
				(item) => item.id === action.payload.chatId
			);
			const newChatNotifyUserIndex = newNotificationChatList[
				chatNotificationIndex
			].chatusers.findIndex((x) => x.userId === action.payload.userId);
			if (chatNotificationIndex !== -1 && newChatNotifyUserIndex !== -1) {
				newNotificationChatList[chatNotificationIndex].chatusers[
					newChatNotifyUserIndex
				] = {
					...newNotificationChatList[chatNotificationIndex].chatusers[
						newChatNotifyUserIndex
					],
					isRoutineNotificationMute: action.payload?.isRoutineNotificationMute,
					isEmergencyNotificationMute:
						action.payload?.isEmergencyNotificationMute,
					isUrgentNotificationMute: action.payload?.isUrgentNotificationMute,
				};
			}
			const chatuserIndex = state.activeChat.chatusers.findIndex(
				(user) => user.userId === action.payload.userId
			);
			if (chatuserIndex !== -1) {
				const modiChatusers = state.activeChat.chatusers;
				modiChatusers[chatuserIndex] = {
					...modiChatusers[chatuserIndex],
					isRoutineNotificationMute: action.payload?.isRoutineNotificationMute,
					isEmergencyNotificationMute:
						action.payload?.isEmergencyNotificationMute,
					isUrgentNotificationMute: action.payload?.isUrgentNotificationMute,
				};
				return {
					...state,
					activeChat: {
						...state.activeChat,
						chatusers: modiChatusers,
					},
					chatList: newNotificationChatList,
				};
			}
			return state;
		case CLEAR_USER_NOTIFICATION:
			const ClearChatNotificationList = state.chatList;
			const ClearNotificationIndex = ClearChatNotificationList.findIndex(
				(item) => item.id === action.payload.chatId
			);
			const oldChatUsersClear = ClearChatNotificationList[
				ClearNotificationIndex
			]?.chatusers.filter((x) => x.userId !== action.payload.userId);
			const newChatUsersFilteredClear = ClearChatNotificationList[
				ClearNotificationIndex
			]?.chatusers.filter((x) => x.userId === action.payload.userId)[0];
			if (newChatUsersFilteredClear !== undefined) {
				newChatUsersFilteredClear.routineUnreadMessageCount = 0;
				newChatUsersFilteredClear.emergencyUnreadMessageCount = 0;
				newChatUsersFilteredClear.urgentUnreadMessageCount = 0;
				newChatUsersFilteredClear.atTheRateMentionMessageCount = 0;
				newChatUsersFilteredClear.hasMentionMessageCount = 0;
				if (ClearNotificationIndex !== -1) {
					ClearChatNotificationList[ClearNotificationIndex] = {
						...ClearChatNotificationList[ClearNotificationIndex],
						chatusers: [...oldChatUsersClear, newChatUsersFilteredClear],
					};
				}
				ClearChatNotificationList.sort(compareDateTime);
				return {
					...state,
					chatList: ClearChatNotificationList,
				};
			}
			return {
				...state,
			};
		case RECEIVED_NEW_MESSAGE:
			const lastMessage = {
				id: action.payload.id,
				message: action.payload.message,
				subject: action.payload.subject,
				createdAt: action.payload.createdAt,
				chatId: action.payload.chatId,
				mediaType: action.payload.mediaType,
				fileName: action.payload.fileName,
				isMessage: action.payload.isMessage,
				sendByDetail: action.payload.sendByDetail,
			};
			const chatListForLastList = state.chatList;
			const chatListForLastMsgIndex = chatListForLastList.findIndex(
				(item) => item.id === action.payload.chatId
			);
			if (chatListForLastMsgIndex !== -1) {
				chatListForLastList[chatListForLastMsgIndex] = {
					...chatListForLastList[chatListForLastMsgIndex],
					messages: [lastMessage],
				};
			}
			chatListForLastList.sort(compareDateTime);
			return {
				...state,
				chatList: chatListForLastList,
				messages: {
					data: {
						count: state.messages.data.count,
						rows: [action.payload].concat(state.messages.data.rows),
					},
				},
			};
		case LOAD_CHAT_USER_LIST_FAIL:
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		case SET_ACTIVE_CHAT_REQUEST:
			return {
				...state,
				loading: true,
			};
		case SET_ACTIVE_CHAT_SUCCESS:
			return {
				...state,
				loading: false,
				messages: {
					data: {
						count: 0,
						rows: [],
					},
				},
				activeChat: action.payload,
			};
		case SET_ACTIVE_CHAT_FAIL:
			return {
				...state,
				loading: false,
				activeChat: {
					id: -1,
				},
			};
		case GET_MESSAGES_SUCCESS:
			return {
				...state,
				loading: false,
				messages: action.payload,
			};
		case GET_MESSAGES_FAIL:
			return {
				...state,
				loading: false,
				messages: {
					data: {
						count: 0,
						rows: [],
					},
				},
			};
		case CREATE_TASK_FAIL:
			return {
				...state,
				loading: false,
				error: "There is something wrong",
			};
		case NEW_CHAT_RECEIVED:
			const newChatListCreated = [action.payload, ...state.chatList];
			newChatListCreated.sort(compareDateTime);
			return {
				...state,
				chatList: newChatListCreated,
			};
		case GET_TASKS_SUCCESS:
			return {
				...state,
				loading: false,
				taskList: action.payload,
			};
		case GET_NOTES_SUCCESS:
			return {
				...state,
				loading: false,
				notesList: action.payload,
			};
		case DELETE_ACTIVE_CHAT:
			const nextChatState = { ...state };
			delete nextChatState.activeChat;
			return {
				...nextChatState,
				activeChat: {
					id: -1,
				},
			};
		case SET_USER_ONLINE:
			const newChatListOnline = state.chatList;
			const userChatIndexOnline = newChatListOnline.findIndex(
				(item) =>
					item.users.includes(action.payload.userId) && item.type === PRIVATE
			);
			if (userChatIndexOnline !== -1) {
				const chatUsersOnline = newChatListOnline[
					userChatIndexOnline
				]?.chatusers.filter((x) => x.userId !== action.payload.userId);
				const chatUsersFilteredOnline = newChatListOnline[
					userChatIndexOnline
				]?.chatusers.filter((x) => x.userId === action.payload.userId)[0];
				if (chatUsersFilteredOnline?.user?.profileStatus)
					chatUsersFilteredOnline.user.profileStatus = "online";
				newChatListOnline[userChatIndexOnline] = {
					...newChatListOnline[userChatIndexOnline],
					chatusers: [...chatUsersOnline, chatUsersFilteredOnline],
				};
				return {
					...state,
					chatList: newChatListOnline,
				};
			}
			return state;
		case SET_USER_OFFLINE:
			const newChatListOffline = state.chatList;
			const userChatIndexOffline = newChatListOffline.findIndex(
				(item) =>
					item.users.includes(action.payload.userId) && item.type === PRIVATE
			);
			if (userChatIndexOffline !== -1) {
				const chatUsersOffline = newChatListOffline[
					userChatIndexOffline
				]?.chatusers.filter((x) => x.userId !== action.payload.userId);
				const chatUsersFilteredOffline = newChatListOffline[
					userChatIndexOffline
				]?.chatusers.filter((x) => x.userId === action.payload.userId)[0];
				if (chatUsersFilteredOffline?.user?.profileStatus) {
					chatUsersFilteredOffline.user.profileStatus = "offline";
					chatUsersFilteredOffline.user.lastSeen = action.payload.lastSeen;
				}
				newChatListOffline[userChatIndexOffline] = {
					...newChatListOffline[userChatIndexOffline],
					chatusers: [...chatUsersOffline, chatUsersFilteredOffline],
				};
				return {
					...state,
					chatList: newChatListOffline,
				};
			}
			return state;
		case SET_USER_STATUS:
			const newChatListStatus = state.chatList;
			const userChatIndexStatus = newChatListStatus.findIndex(
				(item) =>
					item.users.includes(action.payload.userId) && item.type === PRIVATE
			);
			if (userChatIndexStatus !== -1) {
				const chatUsersStatus = newChatListStatus[
					userChatIndexStatus
				]?.chatusers.filter((x) => x.userId !== action.payload.userId);
				const chatUsersFilteredStatus = newChatListStatus[
					userChatIndexStatus
				]?.chatusers.filter((x) => x.userId === action.payload.userId)[0];
				if (chatUsersFilteredStatus?.user?.profileStatus) {
					chatUsersFilteredStatus.user.profileStatus =
						action.payload.profileStatus;
					chatUsersFilteredStatus.user.lastSeen = action.payload.lastSeen;
				}
				newChatListStatus[userChatIndexStatus] = {
					...newChatListStatus[userChatIndexStatus],
					chatusers: [...chatUsersStatus, chatUsersFilteredStatus],
				};
				return {
					...state,
					chatList: newChatListStatus,
				};
			}
			return state;
		case UPDATE_USERLIST_STATUS:
			const newUsersList = state.usersList.users;
			const userIndex = newUsersList?.findIndex(
				(item) => item.id === action.payload.userId
			);
			if (userIndex !== -1) {
				newUsersList[userIndex] = {
					...newUsersList[userIndex],
					profileStatus: action.payload.profileStatus,
				};
				return {
					...state,
					usersList: {
						...state.usersList,
						users: newUsersList,
					},
				};
			}
			return state;
		case RELOAD_STATE:
			return {
				...state,
			};
		case SET_PDF_URL:
			return {
				...state,
				pdfUrl: {
					url: action.payload,
					filename: action.fileName,
				},
			};
		case IMAGE_INDEX:
			return {
				...state,
				imageId: action.payload,
			};
		case SET_THREAD_MESSAGE:
			return {
				...state,
				threadMessage: action.payload,
			};
		case SET_INFO_MESSAGE:
			return {
				...state,
				infoMessage: action.payload,
			};
		case SET_FILES:
			return {
				...state,
				files: action.payload,
			};
		case SET_MEDIA_FILE_TYPE:
			return {
				...state,
				filesType: action.payload,
			};
		case SET_MEDIA_FILES:
			return {
				...state,
				mediaFiles: action.payload,
			};
		case SET_DOCUMENT_FILES:
			return {
				...state,
				documentFiles: action.payload,
			};
		case SET_OFFSET:
			return {
				...state,
				offset: action.payload,
			};
		case SET_COUNT:
			return {
				...state,
				totalCount: action.payload,
			};
		case CLEAR_ERRORS:
			return {
				...state,
				error: null,
			};
		case UPDATE_ISMESSAGE:
			let updateIsMessage = state.messages.data.rows;
			const indexIsMsg = updateIsMessage.findIndex(
				(item) => item.id === action.payload.messageId
			);
			if (indexIsMsg !== -1) {
				updateIsMessage[indexIsMsg] = {
					...updateIsMessage[indexIsMsg],
					isMessage: action.payload.isMessage,
				};
				return {
					...state,
					messages: {
						data: {
							count: state.messages.data.count,
							rows: updateIsMessage,
						},
					},
				};
			}
			return state;
		case ADD_REMOVE_CHAT_USER_GROUP:
			let newchatListAddRemove = state.chatList;
			const addRemoveIndex = newchatListAddRemove.findIndex(
				(item) => item.id === action.payload.id
			);
			if (addRemoveIndex !== -1) {
				newchatListAddRemove[addRemoveIndex] = {
					...newchatListAddRemove[addRemoveIndex],
					chatusers: action.payload.chatusers,
					users: [...action.payload.chatusers.map((user) => user.userId)],
				};
			}
			return {
				...state,
				activeChat: {
					...state.activeChat,
					chatusers: action.payload.chatusers,
					users: [...action.payload.chatusers.map((user) => user.userId)],
				},
				chatList: newchatListAddRemove,
			};
		case REMOVE_CHAT:
			if (action.payload === state.activeChat.id) {
				delete state.activeChat;
				return {
					...state,
					activeChat: {
						id: -1,
					},
					chatList: [
						...state.chatList.filter((item) => item.id !== action.payload),
					],
				};
			}
			return {
				...state,
				chatList: [
					...state.chatList.filter((item) => item.id !== action.payload),
				],
			};
		case ADD_TO_MEDIA_FILES:
			return {
				...state,
				mediaFiles: [
					...state.mediaFiles,
					{
						id: action.payload.id,
						mediaType: action.payload.mediaType,
						mediaUrl: action.payload.mediaUrl,
						fileName: action.payload.fileName,
					},
				],
			};
		case ADD_GROUP_ADMIN:
			let newaddChatusers = state.activeChat.chatusers;
			const indexAdd = newaddChatusers.findIndex(
				(item) => item.userId === action.payload.userId
			);
			if (indexAdd !== -1)
				newaddChatusers[indexAdd] = {
					...newaddChatusers[indexAdd],
					isAdmin: true,
				};
			let newchatlistAdd = state.chatList;
			const chatlistAddIndex = newchatlistAdd.findIndex(
				(item) => item.id === action.payload.chatId
			);
			if (chatlistAddIndex !== -1) {
				const chatuserIndex = newchatlistAdd[
					chatlistAddIndex
				].chatusers.findIndex((item) => item.userId === action.payload.userId);
				newchatlistAdd[chatlistAddIndex].chatusers[chatuserIndex] = {
					...newchatlistAdd[chatlistAddIndex].chatusers[chatuserIndex],
					isAdmin: true,
				};
			}
			return {
				...state,
				activeChat: {
					...state.activeChat,
					chatusers: newaddChatusers,
				},
				chatList: newchatlistAdd,
			};
		case REMOVE_GROUP_ADMIN:
			let newremoveChatusers = state.activeChat.chatusers;
			const indexRemove = newremoveChatusers.findIndex(
				(item) => item.userId === action.payload.userId
			);
			if (indexRemove !== -1)
				newremoveChatusers[indexRemove] = {
					...newremoveChatusers[indexRemove],
					isAdmin: false,
				};
			let newchatlistRemove = state.chatList;
			const chatlistRemoveIndex = newchatlistRemove.findIndex(
				(item) => item.id === action.payload.chatId
			);
			if (chatlistRemoveIndex !== -1) {
				const chatuserIndex = newchatlistRemove[
					chatlistRemoveIndex
				].chatusers.findIndex((item) => item.userId === action.payload.userId);
				newchatlistRemove[chatlistRemoveIndex].chatusers[chatuserIndex] = {
					...newchatlistRemove[chatlistRemoveIndex].chatusers[chatuserIndex],
					isAdmin: false,
				};
			}
			return {
				...state,
				activeChat: {
					...state.activeChat,
					chatusers: newremoveChatusers,
				},
				chatList: newchatlistRemove,
			};
		case UPDATE_EDITED_MESSAGE:
			let updateMessages = state.messages.data.rows;
			const indexEditMsg = updateMessages.findIndex(
				(item) => item.id === action.payload.messageId
			);
			if (indexEditMsg !== -1) {
				updateMessages[indexEditMsg] = {
					...updateMessages[indexEditMsg],
					message: action.payload.messageData.message,
					patient: action.payload.messageData.patient,
					subject: action.payload.messageData.subject,
					mentionusers: action.payload.messageData.updatedMentionUsers,
					type: action.payload.messageData.type,
					isEdited: true,
				};
				return {
					...state,
					messages: {
						data: {
							count: state.messages.data.count,
							rows: updateMessages,
						},
					},
				};
			}
			return state;
		case UPDATE_DELETE_MESSAGE:
			let updateDeletedMessages = state.messages.data.rows;
			const indexDeleteMessage = updateDeletedMessages.findIndex(
				(item) => item.id === action.payload.id
			);
			if (indexDeleteMessage !== -1) {
				updateDeletedMessages[indexDeleteMessage] = {
					...updateDeletedMessages[indexDeleteMessage],
					...action.payload,
					isDeleted: true,
					isViewable: true,
				};
				return {
					...state,
					messages: {
						data: {
							count: state.messages.data.count,
							rows: updateDeletedMessages,
						},
					},
				};
			}
			return state;
		case GET_IMPORTANT_MESSAGE_SUCCESS:
			return {
				...state,
				loading: false,
				importantMessageList: {
					rows: action.payload,
				},
			};
		case ADD_IMPORTANT_MESSAGE_SUCCESS:
			let messageList = state.messages.data.rows;
			const updatedMessageList = messageList.map((item, index) => {
				if (item.id === action.payload.messageId) {
					item.importantMessage = {
						id: action.payload.id,
						userId: action.payload.usersId,
					};
				}
				return item;
			});
			return {
				...state,
				loading: false,
				messages: {
					data: {
						...state.messages.data.count,
						rows: updatedMessageList,
					},
				},
			};
		case REMOVE_IMPORTANT_MESSAGE_SUCCESS:
			let currentMessageList = state.messages.data.rows;
			const updatedNewMessageList = currentMessageList.map((item, index) => {
				if (item.id === action.payload.messageId) {
					item.importantMessage = null;
				}
				return item;
			});
			return {
				...state,
				loading: false,
				messages: {
					data: {
						...state.messages.data.count,
						rows: updatedNewMessageList,
					},
				},
			};
		case DELETE_MESSAGE:
			let updateMessagesDeleted = state.messages.data.rows;
			const indexDeleteMsg = updateMessagesDeleted.findIndex(
				(item) => item.id === action.payload.deletedMessageId
			);
			if (indexDeleteMsg !== -1) {
				updateMessagesDeleted[indexDeleteMsg] = {
					...updateMessagesDeleted[indexDeleteMsg],
					message: "",
					patient: "",
					subject: "",
					mentionusers: [],
					mediaUrl: "",
					fileName: "",
					mediaType: "",
					isDeleted: true,
				};
				return {
					...state,
					messages: {
						data: {
							count: state.messages.data.count,
							rows: updateMessagesDeleted,
						},
					},
				};
			}
			return state;
		case UPDATE_CHAT_LIST:
			const newUpdateChatList = state.chatList;
			const chatUpdateIndex = newUpdateChatList.findIndex(
				(item) => item.id === action.payload.id
			);
			if (chatUpdateIndex !== -1) {
				newUpdateChatList[chatUpdateIndex] = {
					...newUpdateChatList[chatUpdateIndex],
					...action.payload,
				};
				return {
					...state,
					chatList: newUpdateChatList,
				};
			}
			return state;
		case UPDATE_SINGLE_CHAT_LIST:
			const UpdateSingleChatList = state.chatList;
			const chatSingleUpdateIndex = UpdateSingleChatList.findIndex(
				(item) => item.id === action.payload?.id
			);
			if (chatSingleUpdateIndex !== -1) {
				UpdateSingleChatList[chatSingleUpdateIndex] = {
					...UpdateSingleChatList[chatSingleUpdateIndex],
					...action.payload,
				};
				return {
					...state,
					chatList: UpdateSingleChatList,
				};
			}
			return state;
		case CREATED_NEW_SUPER_ADMIN:
			const newadminUsersList = state.usersList.users;
			const usersUpdateIndex = newadminUsersList.findIndex(
				(item) => item.id === action.payload.userId
			);
			if (usersUpdateIndex !== -1) {
				newadminUsersList[usersUpdateIndex] = {
					...newadminUsersList[usersUpdateIndex],
					roleData: action.payload.roleData,
				};
				return {
					...state,
					usersList: {
						...state.usersList,
						users: newadminUsersList,
					},
				};
			}
			return state;
		case SET_USERS_LIST:
			return {
				...state,
				usersList: action.payload,
			};
		case SET_ACCOUNT_STATUS:
			const newAccUsersList = state.usersList.users;
			const userAccUpdateIndex = newAccUsersList.findIndex(
				(item) => item.id === action.payload.userId
			);
			if (userAccUpdateIndex !== -1) {
				newAccUsersList[userAccUpdateIndex] = {
					...newAccUsersList[userAccUpdateIndex],
					isActive: action.payload.isActive,
				};
				return {
					...state,
					usersList: {
						...state.usersList,
						users: newAccUsersList,
					},
				};
			}
			return state;
		case SET_USER_ROLE_LIST_ADD:
			const addAccUsersList = state.usersList.users;
			return {
				...state,
				usersList: {
					...state.usersList,
					count: action.payload.count,
					users: [action.payload.user, ...addAccUsersList],
				},
			};
		case SET_USER_ROLE_LIST_UPDATE:
			const updateAccUsersList = state.usersList.users;
			const userUpdateIndex = updateAccUsersList.findIndex(
				(item) => item.id === action.payload.id
			);
			if (userUpdateIndex !== -1) {
				updateAccUsersList[userUpdateIndex] = {
					...updateAccUsersList[userUpdateIndex],
					...action.payload,
				};
				return {
					...state,
					usersList: {
						...state.usersList,
						users: updateAccUsersList,
					},
				};
			}
			return state;
		case SET_USER_ROLE_LIST_DELETE:
			const deleteAccUsersList = state.usersList.users;
			const userdeleteIndex = deleteAccUsersList.findIndex(
				(item) => item.id === action.payload.userId
			);
			if (userdeleteIndex !== -1) {
				return {
					...state,
					usersList: {
						...state.usersList,
						count: action.payload.count,
						users: action.payload.users,
					},
				};
			}
			return state;
		case SET_CHAT_TIMER_SETTINGS:
			let newactiveChatTimer = state.activeChat;
			let newChatlistTimer = state.chatList;
			let chatlistTimerIndex = newChatlistTimer.findIndex(
				(item) => item.id === action.payload.chatId
			);
			if (newactiveChatTimer.id === action.payload.chatId) {
				newactiveChatTimer = {
					...newactiveChatTimer,
					...action.payload.data,
				};
			}
			if (chatlistTimerIndex !== -1) {
				newChatlistTimer[chatlistTimerIndex] = {
					...newChatlistTimer[chatlistTimerIndex],
					...action.payload.data,
				};
			}
			return {
				...state,
				activeChat: newactiveChatTimer,
				chatList: newChatlistTimer,
			};
		case SET_UNREAD_USERS_ADMIN:
			let newactiveChatUnreadUser = state.activeChat;
			let newChatlistUnreadUser = state.chatList;
			let chatlistUnreadUserIndex = newChatlistUnreadUser.findIndex(
				(item) => item.id === action.payload.chatId
			);
			if (newactiveChatUnreadUser.id === action.payload.chatId) {
				newactiveChatUnreadUser = {
					...newactiveChatUnreadUser,
					unreadUsersArr: action.payload.chatUserArray,
				};
			}
			if (chatlistUnreadUserIndex !== -1) {
				newChatlistUnreadUser[chatlistUnreadUserIndex] = {
					...newChatlistUnreadUser[chatlistUnreadUserIndex],
					unreadUsersArr: action.payload.chatUserArray,
				};
			}
			return {
				...state,
				activeChat: newactiveChatUnreadUser,
				chatList: newChatlistUnreadUser,
			};
		case UPDATE_GROUP_DATA:
			let updateChatList = state.chatList;
			let updateactivechat = {};
			let updateChatListIndex = updateChatList.findIndex(
				(item) => item.id === action.payload.chatId
			);
			if (updateChatListIndex !== -1) {
				if (state.activeChat.id === action.payload.chatId) {
					updateactivechat = {
						...action.payload.data,
					};
				}
				updateChatList[updateChatListIndex] = {
					...updateChatList[updateChatListIndex],
					...action.payload.data,
				};
				return {
					...state,
					chatList: updateChatList,
					activeChat: {
						...state.activeChat,
						...updateactivechat,
					},
				};
			}
			return state;
		case RES_SEARCH_CHATLIST_DATA:
			return {
				...state,
				chatListData: action.payload,
			};
		case SET_FORWARD_MSG:
			return {
				...state,
				activeChat: {
					...state.activeChat,
					forwardMsg: action.payload,
				},
			};
		case RES_CREATE_DESIGNATION:
			return {
				...state,
				userDesignations: [action.payload, ...state.userDesignations],
			};
		case RES_DELETE_DESIGNATION:
			return {
				...state,
				userDesignations: state.userDesignations.filter(
					(item) => item.id !== action.payload.id
				),
			};
		case RES_UPDATE_DESIGNATION:
			let newUsersDesg = state.userDesignations;
			const desgIndex = newUsersDesg.findIndex(
				(item) => item.id === action.payload.id
			);
			if (desgIndex !== -1) {
				newUsersDesg[desgIndex] = {
					...newUsersDesg[desgIndex],
					...action.payload,
				};
				return {
					...state,
					userDesignations: newUsersDesg,
				};
			}
			return state;
		default:
			return state;
	}
};

export const compareDateTime = (a, b) => {
	let aTime, bTime;
	if (a.messages[0]) aTime = a.messages[0].createdAt;
	else aTime = a.updatedAt;
	if (b.messages[0]) bTime = b.messages[0].createdAt;
	else bTime = b.updatedAt;
	if (aTime && bTime) {
		if (new Date(aTime) < new Date(bTime)) return 1;
		if (new Date(aTime) > new Date(bTime)) return -1;
	}
	return 0;
};
