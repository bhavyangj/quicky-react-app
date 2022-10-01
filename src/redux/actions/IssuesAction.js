import axios from "../../utils/axios";
import { CONST } from "../../utils/constants";

// Send Attachment Data
export const SendAttachmentIssuesData = async (body) => {
	try {
		const data = await axios.post(CONST.API.SEND_ATTACHMENT_ISSUES_DATA, body);
		return data;
	} catch (error) {
		console.log("error:", error);
	}
};
// Delete Attachment Data
export const DeleteIssuesAttachment = async (body) => {
	try {
		const data = await axios.delete(
			CONST.API.DELETE_ISSUES_ATTACHMENT + body.attachmentId
		);
		return data;
	} catch (error) {
		console.log("error:", error);
	}
};
