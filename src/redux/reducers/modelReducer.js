import {
	CHANGE_ADMIN_TABLE_PAGE,
	CLEAR_ERRORS,
	INIT_MODEL,
	MODEL_CHANGE_END,
	MODEL_CHANGE_START,
	SET_USER_ROLE_LIST,
	TASK_CHANGE_END,
	USER_UPDATE_DATA,
} from "../constants/modelConstants";

const initialState = {
	name: "",
	taskName: "",
	superAdminpage: 1,
};

export const modelReducer = (state = initialState, action) => {
	switch (action.type) {
		case INIT_MODEL:
			return initialState;
		case MODEL_CHANGE_START:
			return {
				...state,
				loading: true,
			};
		case MODEL_CHANGE_END:
			return {
				...state,
				loading: false,
				name: action.payload,
			};
		case CLEAR_ERRORS:
			return {
				...state,
				error: null,
			};
		case TASK_CHANGE_END:
			return {
				...state,
				error: null,
				taskName: action.payload,
			};
		case USER_UPDATE_DATA:
			return {
				...state,
				userData: action.payload,
			};
		case SET_USER_ROLE_LIST:
			return {
				...state,
				userRoles: action.payload,
				error: null,
			};
		case CHANGE_ADMIN_TABLE_PAGE:
			return {
				...state,
				superAdminpage: action.payload,
			};
		default:
			return state;
	}
};
