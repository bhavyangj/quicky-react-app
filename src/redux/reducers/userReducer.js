import { chatBackgrounds } from "../../Components/Chat/Appbar/Settings/ChatBckground";
import {
	SET_MY_STATUS,
	UPDATE_CHAT_BACKGROUND,
} from "../constants/chatConstants";
import {
	CLOCK_IN,
	CLOCK_OUT,
	INIT_USER,
	LOAD_USER_FAIL,
	LOAD_USER_SUCCESS,
	LOGIN_FAIL,
	LOGIN_REQUEST,
	LOGIN_SUCCESS,
	LOGOUT_FAIL,
	LOGOUT_REQUEST,
	LOGOUT_SUCCESS,
	RECEIVED_DATE_USER_CLOCK_DATA,
	RECEIVED_USER_CLOCK_DATA,
	REGISTER_USER_FAIL,
	REGISTER_USER_REQUEST,
	SET_ERROR_MSG,
	SET_SEARCH_USER_LIST_LOGS,
	SET_USERS_LIST_LOGS,
	TOKEN_REQUEST_FAIL,
	UPDATE_USER_PROFILE_PICTURE,
} from "../constants/userContants";

const initialState = {
	user: {
		id: -1,
		LogsList: { status: 0 },
		searchUserLogs: { status: 0 },
	},
	isAuthenticated: false,
};

export const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case INIT_USER:
			return initialState;
		case LOGIN_REQUEST:
		case REGISTER_USER_REQUEST:
			return {
				...state,
				loading: true,
				isAuthenticated: false,
			};
		case LOGIN_SUCCESS:
			return {
				...state,
				loading: false,
				isAuthenticated: true,
				token: action.payload,
			};
		case LOAD_USER_SUCCESS:
			return {
				...state,
				loading: false,
				isAuthenticated: true,
				user: { ...state.user, ...action.payload },
			};
		case LOGOUT_REQUEST:
			return {
				...state,
				loading: true,
			};
		case LOGOUT_SUCCESS:
			delete state.token;
			return {
				...state,
				loading: false,
				user: initialState.user,
				isAuthenticated: false,
			};
		case LOGIN_FAIL:
		case REGISTER_USER_FAIL:
			return {
				...state,
				loading: false,
				isAuthenticated: false,
				user: { ...state.user, ...initialState.user },
				error: action.payload,
			};
		case TOKEN_REQUEST_FAIL:
			return {
				...state,
				loading: false,
				isAuthenticated: false,
				user: { ...state.user, ...initialState.user },
				error: action.payload,
			};
		case LOAD_USER_FAIL:
			return {
				...state,
				loading: false,
				isAuthenticated: false,
				user: { ...state.user, ...initialState.user },
				error: action.payload,
			};
		case LOGOUT_FAIL:
			return {
				...state,
				loading: false,
				error: action.payload,
				isAuthenticated: false,
			};
		case SET_MY_STATUS:
			return {
				...state,
				user: {
					...state.user,
					profileStatus: action.payload.profileStatus,
				},
			};
		case RECEIVED_USER_CLOCK_DATA:
			return {
				...state,
				user: {
					...state.user,
					clockTime: {
						clockin: action.payload
							?.filter((item) => item.type === CLOCK_IN)
							.reverse(),
						clockout: action.payload
							?.filter((item) => item.type === CLOCK_OUT)
							.reverse(),
					},
				},
			};
		case RECEIVED_DATE_USER_CLOCK_DATA:
			return {
				...state,
				user: {
					...state.user,
					dateClockTime: {
						clockin: action.payload
							?.filter((item) => item.type === CLOCK_IN)
							.reverse(),
						clockout: action.payload
							?.filter((item) => item.type === CLOCK_OUT)
							.reverse(),
					},
				},
			};
		case UPDATE_USER_PROFILE_PICTURE:
			return {
				...state,
				user: {
					...state.user,
					profilePicture: action.payload.url,
				},
			};
		case SET_USERS_LIST_LOGS:
			return {
				...state,
				user: {
					...state.user,
					LogsList: action.payload,
				},
			};
		case SET_SEARCH_USER_LIST_LOGS:
			return {
				...state,
				user: {
					...state.user,
					searchUserLogs: action.payload,
				},
			};
		case SET_ERROR_MSG:
			return {
				...state,
				error: action.payload,
			};
		case UPDATE_CHAT_BACKGROUND:
			const colorIndex = chatBackgrounds.findIndex(
				(item) => item.colorCode === action.payload.colorCode
			);
			if (colorIndex !== -1) {
				const item = chatBackgrounds[colorIndex];
				return {
					...state,
					user: {
						...state.user,
						chatWallpaper: item.class,
					},
				};
			} else if (action.payload.colorCode === "none") {
				return {
					...state,
					user: {
						...state.user,
						chatWallpaper: "none",
					},
				};
			}
			return state;

		default:
			return state;
	}
};
