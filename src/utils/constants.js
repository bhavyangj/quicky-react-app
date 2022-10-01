export const CONST = {
	APP_NAME: "HCMD Communication",
	// TIMEZONE: "Europe/London",
	TIMEZONE: "America/Los_Angeles",
	API: {
		PRESIGNED_URL: `/message/file`,
		LOGIN: `/auth/login`,
		VERIFY_TOKEN: `/auth/verifyToken`,
		GET_TASK_DETAILS: `/task/manageTask/detail`,
		GET_TASK_DETAILS_BY_MESSAGE: `/task/manageTask/message/detail`,
		SEND_ATTACHMENT_DATA: `/task/manageTask/attachment/add`,
		DELETE_ATTACHMENT: `/task/manageTask/attachment/delete/`,
		SEND_ATTACHMENT_ISSUES_DATA: `/issue/attachment/add`,
		DELETE_ISSUES_ATTACHMENT: `/issue/attachment/delete/`,
		UPDATE_TASK: `/task/manageTask/update`,
		CREATE_SUBTASK: `/task/subtask/create`,
		GET_SUBTASK_COMMENTS: `/task/subtask/comment/list`,
		ADD_SUBTASK_COMMENT: `/task/subtask/comment/add`,
		UPDATE_SUBTASK_STATUS: `/task/subtask`,
		DELETE_SUBTASK: `/task/subtask/delete`,
		UPDATE_TASK_MEMBERS: `/task/manageTask/member-update`,
		LOAD_USER_CHATLIST: `/chat`,
		CREATE_TASK: `/task`,
		GET_TASKS_LIST: `/task/list`,
		CREATE_NEW_CHAT: `/chat`,
		GET_USERS_LIST: `/user?search=`,
		CRAETE_NEW_NOTE: `/note`,
		GET_NOTE_LIST: `/note/list`,
		GET_RES_THREAD: `/message/threadMessageList`,
		GET_FILES_DATA: `/message/chatGallaryMedia`,
		UPDATE_NOTIFICATION_SETTING: `/chat/updateMuteNotification`,
		ADD_IMPORTANT_MESSAGE: `/importantmessage/update`,
		REMOVE_IMPORTANT_MESSAGE: `/importantmessage/update`,
		GET_IMPORTANT_MSG_LIST: `/importantmessage/get`,
		DELETE_TEMPLATE_ATTACHMENT: `/task/template/attachment/delete/`,
	},
	SOCKET: {},
};