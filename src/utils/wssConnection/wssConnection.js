import { io } from "socket.io-client";
import { GROUP, PRIVATE } from "../../Components/Chat/Models/models";
import {
	loadUserChatList,
	playNotificationSound,
} from "../../redux/actions/chatAction";
import {
	EMERGENCY,
	ROUTINE,
	URGENT,
} from "../../Components/Chat/Main/UserChat/footer/ChatFooter";
import {
	setIsReceived,
	setNewLimitInChat,
} from "../../Components/Chat/Main/UserChat/message/ChatMessages";
import {
	ADD_TO_MEDIA_FILES,
	CLEAR_USER_NOTIFICATION,
	RECEIVED_NEW_MESSAGE,
} from "../../redux/constants/chatConstants";
import { base } from "../config";
import {
	ListenNewChat,
	ListenRemoveUserFromChat,
	listenUpdateBackground,
	listenUpdateGroup,
	listenUpdateprofile,
	ListenUserStatus,
	ListenUserToOffline,
	ListenUserToOnline,
} from "./Listeners/chatListener";
import {
	ListenDeleteChatMsg,
	ListenEditChatMsg,
	ListenMakeGroupAdmin,
	listenNotification,
	ListenRemoveGroupAdmin,
	ListenSearchChatMsg,
	ListenSingleChat,
	ListenTimerNotification,
	ListenUnreadUsersToAdmin,
	ListenUpdateChatList,
	ListenUpdateMember,
	ListenViewDeletedMsg,
} from "./Listeners/messageListener";
import {
	ListenCreateTask,
	ListenDeleteTask,
	ListenTaskList,
	ListenTaskUpdate,
} from "./Listeners/Tasklistener";
import {
	ListenAddnewUser,
	ListenAllGroupsList,
	ListenAllUsersList,
	ListenCreateSuperAdmin,
	ListenCreateTaskLog,
	ListenCreateUserLog,
	ListenDeactivateAccount,
	ListenDeleteUser,
	ListenListDateLogs,
	ListenPaginateUserData,
	ListenRolesList,
	ListenTaskTimeLogs,
	ListenUpdateUser,
	ListenUserLogs,
} from "./Listeners/ClockListener";
import { showNotificationfunc } from "../../redux/common";
import {
	ListenReadDesignations,
	ListenReadTaskLabel,
} from "./Listeners/TemplateListeners";
export let socket;
export let rooms = [];

export const connectWithWebSocket = (token) => {
	socket = io.connect(base.URL, {
		query: `token=${token.replaceAll('"', "")}`,
		forceNew: true,
		reconnection: true,
		reconnectionDelay: 1000,
		reconnectionDelayMax: 3000,
		reconnectionAttempts: Infinity,
	});
};

export const connectUserWithSocket = (userId, dispatch) => {
	socket.emit("join-device", { userId: userId });
	dispatch(ListenNewChat());
	dispatch(ListenUserToOnline(userId));
	dispatch(ListenUserToOffline(userId));
	dispatch(ListenUserStatus(userId));
	dispatch(ListenRemoveUserFromChat(userId));
	dispatch(listenUpdateprofile(userId));
	dispatch(listenUpdateGroup(userId));
};

export const disconnectSocket = () => {
	try {
		socket?.emit("disconnected", {});
	} catch (error) {
		console.log(error);
	}
};

export const ConnectInNewChat = (data) => {
	rooms.push(data.id);
	socket?.emit("join-chat", { chatId: data.id });
};

export const JoinAllChat = (data) => {
	rooms = data.map((room) => room.id);
	[...rooms].forEach((roomId) => {
		socket?.emit("join-chat", { chatId: roomId });
	});
};

export const listenChatActivities = (activeChatId) => async (dispatch) => {
	dispatch(ListenUpdateMember(activeChatId));
	dispatch(ListenMakeGroupAdmin(activeChatId));
	dispatch(ListenRemoveGroupAdmin(activeChatId));
	dispatch(ListenEditChatMsg(activeChatId));
	dispatch(ListenDeleteChatMsg(activeChatId));
	dispatch(ListenViewDeletedMsg(activeChatId));
	dispatch(ListenUpdateChatList());
	dispatch(ListenTimerNotification(activeChatId));
	dispatch(ListenUnreadUsersToAdmin(activeChatId));
	dispatch(listenUpdateBackground(activeChatId));
};

export const listenTaskActivities = (activeChatId, dispatch) => {
	dispatch(ListenCreateTask(activeChatId));
	dispatch(ListenDeleteTask(activeChatId));
	dispatch(ListenTaskList(activeChatId));
	dispatch(ListenTaskUpdate());
};

export const listenClockEvents = (userId, dispatch) => {
	listenNotification(dispatch, -1, userId);
	dispatch(ListenSearchChatMsg());
	dispatch(ListenSingleChat());
	dispatch(ListenCreateUserLog());
	dispatch(ListenCreateTaskLog());
	dispatch(ListenCreateSuperAdmin());
	dispatch(ListenDeactivateAccount());
	dispatch(ListenRolesList());
	dispatch(ListenAddnewUser());
	dispatch(ListenDeleteUser());
	dispatch(ListenUpdateUser());
	dispatch(ListenPaginateUserData());
	dispatch(ListenListDateLogs());
	dispatch(ListenUserLogs());
	dispatch(ListenTaskTimeLogs());
	dispatch(ListenAllGroupsList());
	dispatch(ListenAllUsersList());
};

export const sendMessage = (messageObject) => {
	// console.log("seding masg....", messageObject);
	socket?.emit("message", messageObject);
};
export const sendTemplateMessage = (messageObject) => {
	socket?.emit("message-template", messageObject);
};

export const receiveMessage = (
	activeChatId,
	dispatch,
	userId,
	chatList,
	navigate
) => {
	socket?.removeAllListeners("new-message");
	socket?.on("new-message", (data) => {
		// console.log("active ChatId: ", activeChatId, " Data: ", data);
		if (data && data.chatId && activeChatId === data.chatId) {
			setIsReceived(true);
			dispatch({ type: RECEIVED_NEW_MESSAGE, payload: data });
			if (data.mediaType)
				if (["image", "video"].includes(data.mediaType.split("/").shift()))
					dispatch({ type: ADD_TO_MEDIA_FILES, payload: data });
			if (data.chatType === GROUP && data.sendTo.includes(userId))
				MarkReadChat(activeChatId);
			else if (data.chatType === PRIVATE && data.sendTo === userId)
				MarkReadChat(activeChatId);

			if (data.sendBy === userId) {
				socket?.emit("update-notification", {
					chatId: data.chatId,
					chatType: data.chatType,
					messageType: data.type,
					messageId: data.id,
					userId: data.sendTo,
					mentionusers: data.mentionusers,
				});
			}
		} else if (data?.isForwarded && data.sendBy === userId) {
			socket?.emit("update-notification", {
				chatId: data.chatId,
				chatType: data.chatType,
				messageType: data.type,
				messageId: data.id,
				userId: data.sendTo,
				mentionusers: data.mentionusers,
			});
		} else if (userId !== data.sendBy) {
			// Code Block for notification
			const chatNotificationIndex = chatList.findIndex(
				(item) => item.id === data.chatId
			);
			const newChatNotifyUserIndex = chatList[
				chatNotificationIndex
			].chatusers.findIndex((x) => x.userId === userId);
			const {
				isRoutineNotificationMute,
				isEmergencyNotificationMute,
				isUrgentNotificationMute,
			} = chatList[chatNotificationIndex].chatusers[newChatNotifyUserIndex];

			const pushNotification = () => {
				if (
					document.hidden ||
					(data && data.chatId && activeChatId !== data.chatId)
				)
					showNotificationfunc(data, userId, chatList, dispatch, navigate);
			};

			if (data.type === ROUTINE && !isRoutineNotificationMute) {
				playNotificationSound();
				pushNotification();
			} else if (data.type === EMERGENCY && !isEmergencyNotificationMute) {
				playNotificationSound();
				pushNotification();
			} else if (data.type === URGENT && !isUrgentNotificationMute) {
				playNotificationSound();
				pushNotification();
			}
		}
	});
};

export const readAllMessages = (chatId, userId) => (dispatch) => {
	MarkReadChat(chatId);
	dispatch({ type: CLEAR_USER_NOTIFICATION, payload: { chatId, userId } });
};

export const notifyUsers = (userId, chatId, users, type) => {
	socket?.emit("new-chat-request", { createdBy: userId, chatId, users, type });
};

export const ReqforLength = (chatId, rquestedMessageId, currentMessageId) => {
	socket?.removeAllListeners("res-message-count-range");
	socket?.emit("req-message-count-range", {
		chatId,
		rquestedMessageId,
		currentMessageId,
	});
	socket?.on("res-message-count-range", (data) => {
		setNewLimitInChat(data.messageCount);
	});
};

export const MarkReadChat = (chatId) => {
	socket?.emit("mark-read-chat", { chatId });
};

export const AddUserGroup = (chatId, users) => {
	socket?.emit("req-add-member", { chatId, users });
};

export const RemoveUserGroup = (chatId, userId) => {
	socket?.emit("req-remove-member", { chatId, userId });
};

export const makeGroupAdmin = (chatId, userId) => {
	socket?.emit("req-make-group-admin", { chatId, userId });
};

export const removeGroupAdmin = (chatId, userId) => {
	socket?.emit("req-remove-group-admin", { chatId, userId });
};

export const EditedChatMessage = (chatId, messageId, messageData) => {
	socket?.emit("req-edited-chat-message", { chatId, messageId, messageData });
};

export const DeleteChatMessage = (chatId, messageId) => {
	socket?.emit("req-delete-chat-message", { chatId, messageId });
};

export const showDeletedMessage = (chatId, messageId) => {
	socket?.emit("req-view-deleted-message", { chatId, messageId });
};

export const setChatNotifyTimer = (chatId, userId, timerData) => {
	const data = {
		routineHour: timerData.routineHour,
		emergencyHour: timerData.emergencyHour,
		urgentHour: timerData.urgentHour,
		routineMinute: timerData.routineMinute,
		emergencyMinute: timerData.emergencyMinute,
		urgentMinute: timerData.urgentMinute,
	};
	socket?.emit("req-set-time-admin-notification", { chatId, userId, ...data });
};

// ====================== Task Board ======================

// export const reqAddNewTask = (data) => {
// 	console.log("request adding new task: ", data);
// 	socket?.emit("manage-task-module:req-create", {
// 		chatId: data.chatId,
// 		name: data.name,
// 		subject: data.subject,
// 		patient: data.patient,
// 		description: data.description,
// 		type: data.type,
// 	});
// };
export const reqDeleteTask = (chatId, taskId) => {
	// console.log("request delete task: ", chatId, taskId);
	socket?.emit("manage-task-module:req-delete", {
		chatId,
		taskId,
	});
};

export const getFilterTasksData = (data) => {
	// console.log("Filter Tasks: ", data);
	socket?.emit("manage-task-module:req-task-list", data);
};

export const receiveNewTask = (newFilters) => (dispatch) => {
	socket?.removeAllListeners("new-message");
	socket?.on("new-message", (data) => {
		if (!data.isMessage) {
			if (data && data.chatId && newFilters.chatId.includes(data.chatId)) {
				getFilterTasksData(newFilters);
			}
		}
	});
};

export const changeProfileStatus = (status) => {
	socket?.emit("change-profile-status", {
		profileStatus: status,
	});
};

export const reqUserLogs = (data) => {
	// console.log("req clock", data);
	socket?.emit("list-user-logs", data);
};
export const sendNewUserLog = (data) => {
	// console.log(data);
	socket?.emit("create-user-log", data);
};
export const reqTaskLogs = (data) => {
	// console.log("requesting for time log with taskId", data);
	socket?.emit("list-task-logs", data);
};
export const sendNewTaskLog = (data) => {
	// console.log(data);
	socket?.emit("create-task-log", data);
};
export const createUserSuperAdmin = (data) => {
	// console.log("req create super admin: ", data);
	socket?.emit("create-super-admin", data);
};
export const deactivateAccount = (data) => {
	// console.log("deactivate account: ", data);
	socket?.emit("deactive-account", data);
};
export const ReqRoleList = (data) => {
	// console.log("req role list ", data);
	socket?.emit("fetch-role-list", data);
};
export const ReqCreateNewUser = (data) => {
	// console.log("req add new user: ", data);
	socket?.emit("add-user", data);
};
export const deleteAccount = (data) => {
	// console.log("req delete user: ", data);
	socket?.emit("delete-user", data);
};
export const ReqUpdateUserData = (data) => {
	// console.log("req update user: ", data);
	socket?.emit("update-user", data);
};
export const getUsersListData = (data) => {
	// console.log("req users list : ", data);
	socket?.emit("paginate-user-data", data);
};

export const GetUserChatList = () => {
	socket?.emit("chat-list", {});
};

export const ReqUpdateProfilePicture = (url) => {
	socket?.emit("profile-picture:req-update", {
		profilePicture: url,
	});
};
export const ReqUpdateGroupDetails = (body) => {
	socket?.emit("group-details:req-update", body);
};
export const reqListofDateLogs = (data) => {
	// console.log(data);
	socket?.emit("user-logs:date-range", data);
};
export const ReqNewTemplateTask = (data) => {
	// console.log(data);
	socket?.emit("manage-task-module:req-create-template", data);
};
export const getTemplateTasks = (data) => {
	// console.log("requesting templates", data);
	socket?.emit("manage-task-module:req-fetch-templates", data);
};
export const ReqUpdateTemplateTask = (data) => {
	// console.log("requesting update");
	socket?.emit("manage-task-module:req-update-templates", data);
};
export const ReqUserLogs = (data) => {
	// console.log("requesting data", data);
	socket?.emit("user-logs-admin:date-range", data);
};
export const ReqUpdateAssignMembers = (data) => {
	// console.log("requesting data", data);
	socket?.emit("manage-task-module:req-new-assign-task", data);
};

export const ReqListLabel = (data) => {
	// console.log("requesting data", data);
	socket?.emit("list-task-labels", data);
};
export const ReqListDesignations = (data) => {
	// console.log("requesting data", data);
	socket?.emit("designation:req-list", data);
};
export const ReqAddLabel = (data) => {
	// console.log("requesting create data", data);
	socket?.emit("create-task-label", data);
};
export const ReqDeleteLabel = (data) => {
	// console.log("requesting data", data);
	socket?.emit("delete-task-label", data);
};
export const ReqUpdateLabel = (data) => {
	// console.log("requesting data", data);
	socket?.emit("update-task-label", data);
};
export const ReqAddDesignation = (data) => {
	// console.log("requesting create data", data);
	socket?.emit("designation:req-create", data);
};
export const ReqDeleteDesignation = (data) => {
	// console.log("requesting data", data);
	socket?.emit("designation:req-delete", data);
};
export const ReqUpdateDesignation = (data) => {
	// console.log("requesting data", data);
	socket?.emit("designation:req-update", data);
};

export const DefaultRequests = (userId) => (dispatch) => {
	dispatch(loadUserChatList(true));
	reqUserLogs({});
	listenClockEvents(userId, dispatch);
	ReqListLabel();
	ReqListDesignations();
	getUsersListData({ page: 1, name: "" });
};
export const DefaultListeners = () => (dispatch) => {
	dispatch(ListenReadTaskLabel());
	dispatch(ListenReadDesignations());
};

export const ReqUserTaskLogs = (data) => {
	// console.log("requesting data", data);
	socket?.emit("req-user-tasks", data);
};
export const ReqGroupTasks = (data) => {
	// console.log("requesting data", data);
	socket?.emit("req-get-chat-tasks", data);
};
export const ReqUpdateBackground = (data) => {
	// console.log("requesting data", data);
	socket?.emit("req-update-chat-background", data);
};
export const reqTaskTimeLogs = (data) => {
	// console.log("requesting data", data);
	socket?.emit("req-task-log-with-user", data);
};
export const ReqAllGroupsList = (data) => {
	// console.log("requesting groups");
	socket?.emit("req-get-chat-groups");
};
export const ReqAllUsersList = (data) => {
	// console.log("requesting groups");
	socket?.emit("req-get-chat-users");
};
export const ForwardMessageToChats = (data) => {
	// console.log("forwarding messg", data);
	socket?.emit("req-forward-message", data);
};
export const reqSearchChatMessage = (data) => {
	// console.log("req search globally: ", data);
	socket?.emit("req-search:message-chat", data);
};
export const ReqCreateNewIssueRequest = (data) => {
	socket?.emit("issues:req-create", data);
};
export const ReqIssuesListforCategory = (data) => {
	socket?.emit("issues:req-list", data);
};
