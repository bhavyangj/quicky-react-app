import {
	DELETE_ISSUE_ATTACHMENT,
	RES_CREATE_ISSUE,
	RES_GET_REQUEST_DETAILS,
	RES_LIST_ISSUES_CATEGORY,
	SET_ISSUES_ATTACHMENTS,
	SET_ISSUE_CARD_ITEM,
} from "../constants/issuesConstants";

const initialState = {
	issueList: [],
};
export const issuesReducer = (state = initialState, action) => {
	switch (action.type) {
		case RES_LIST_ISSUES_CATEGORY:
			return {
				...state,
				issueList: action.payload,
			};
		case RES_CREATE_ISSUE:
			return {
				...state,
				issueList: [action.payload, ...state.issueList],
			};
		case RES_GET_REQUEST_DETAILS:
			return {
				...state,
				issueDetails: action.payload,
			};
		case SET_ISSUES_ATTACHMENTS:
			return {
				...state,
				issueDetails: {
					...state.issueDetails,
					issuesAttachments: action.payload.data,
				},
			};
		case SET_ISSUE_CARD_ITEM:
			return {
				...state,
				activeCard: action.payload,
			};
		case DELETE_ISSUE_ATTACHMENT:
			const newIssuesList = state.issueList;
			const issueDeleteIndex = newIssuesList.findIndex(
				(item) => item.id === action.payload.id
			);
			if (issueDeleteIndex !== -1) {
				newIssuesList[issueDeleteIndex] = {
					...newIssuesList[issueDeleteIndex],
					issuesAttachments: newIssuesList[
						issueDeleteIndex
					].issuesAttachments.filter(
						(item) => item.id !== action.payload.attachmentId
					),
				};
				return {
					...state,
					issueList: newIssuesList,
				};
			}
			return state;
		default:
			return state;
	}
};
