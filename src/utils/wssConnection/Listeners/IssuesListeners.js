import {
	RES_CREATE_ISSUE,
	RES_LIST_ISSUES_CATEGORY,
} from "../../../redux/constants/issuesConstants";
import { socket } from "../wssConnection";

export const listenListofIssue = (selectedCard) => (dispatch) => {
	socket?.removeAllListeners("issues:res-list");
	socket?.on("issues:res-list", (data) => {
		dispatch({ type: RES_LIST_ISSUES_CATEGORY, payload: data.data });
	});
};
export const listenAddRequest = (selectedCard) => (dispatch) => {
	socket?.removeAllListeners("issues:res-create");
	socket?.on("issues:res-create", (data) => {
		dispatch({ type: RES_CREATE_ISSUE, payload: data.data });
	});
};
