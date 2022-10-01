import axios from "../../utils/axios";
import { CONST } from "../../utils/constants";
import {
	REQ_GET_TASK_DETAILS,
	// REQ_GET_TASKLIST,
	// RES_GET_TASKLIST,
	RES_GET_TASK_DETAILS,
} from "../constants/taskConstants";

// Get Task Details
export const getTaskDetails =
	(taskId, chatId, chatList) => async (dispatch) => {
		try {
			dispatch({ type: REQ_GET_TASK_DETAILS });
			const { data } = await axios.post(CONST.API.GET_TASK_DETAILS, { taskId });
			const chatDetailsIndex = chatList.findIndex((chat) => chat.id === chatId);
			dispatch({
				type: RES_GET_TASK_DETAILS,
				payload: {
					...data.data,
					chatDetails: chatList[chatDetailsIndex],
				},
			});
		} catch (error) {
			console.log("error:", error);
		}
	};
// Get Task Details by messageId
export const getTaskDetailsByMsgId =
	(messageId, chatId, chatList) => async (dispatch) => {
		try {
			dispatch({ type: REQ_GET_TASK_DETAILS });
			const { data } = await axios.post(CONST.API.GET_TASK_DETAILS_BY_MESSAGE, {
				messageId,
			});
			const chatDetailsIndex = chatList.findIndex((chat) => chat.id === chatId);
			dispatch({
				type: RES_GET_TASK_DETAILS,
				payload: {
					...data.data,
					chatDetails: chatList[chatDetailsIndex],
				},
			});
		} catch (error) {
			console.log("error:", error);
		}
	};

// Send Attachment Data
export const SendAttachmentData = async (body) => {
	try {
		const data = await axios.post(CONST.API.SEND_ATTACHMENT_DATA, body);
		return data;
	} catch (error) {
		console.log("error:", error);
	}
};
// Delete Attachment Data
export const DeleteAttachment = async (body) => {
	try {
		const data = await axios.delete(
			CONST.API.DELETE_ATTACHMENT + body.attachmentId
		);
		return data;
	} catch (error) {
		console.log("error:", error);
	}
};
// Delete Attachment Data
export const DeleteTemplateAttachment = async (body) => {
	try {
		const data = await axios.delete(
			CONST.API.DELETE_TEMPLATE_ATTACHMENT + body.attachmentId
		);
		return data;
	} catch (error) {
		console.log("error:", error);
	}
};
// create new subtask
export const CreateNewSubTask = async (body) => {
	try {
		const data = await axios.post(CONST.API.CREATE_SUBTASK, body);
		return data;
	} catch (error) {
		console.log("error:", error);
	}
};
// create new subtask
export const getSubtasksComments = async (body) => {
	try {
		const data = await axios.post(CONST.API.GET_SUBTASK_COMMENTS, body);
		return data;
	} catch (error) {
		console.log("error:", error);
	}
};
// create new subtask
export const AddSubtaskComment = async (body) => {
	try {
		const data = await axios.post(CONST.API.ADD_SUBTASK_COMMENT, body);
		return data;
	} catch (error) {
		console.log("error:", error);
	}
};
// change subtask status
export const changeSubtaskStatus = async (body) => {
	try {
		const data = await axios.put(CONST.API.UPDATE_SUBTASK_STATUS, body);
		return data;
	} catch (error) {
		console.log("error:", error);
	}
};
// delete subtask
export const deleteSubtask = async (body) => {
	try {
		const data = await axios.post(CONST.API.DELETE_SUBTASK, body);
		return data;
	} catch (error) {
		console.log("error:", error);
	}
};
// // update task members
// export const UpdateTaskMembers = async (body) => {
// 	try {
// 		const data = await axios.post(CONST.API.UPDATE_TASK_MEMBERS, body);
// 		return data;
// 	} catch (error) {
// 		console.log("error:", error);
// 	}
// };
