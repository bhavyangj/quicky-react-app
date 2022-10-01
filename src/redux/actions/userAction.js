import instance from "../../utils/axios";
import axios from "../../utils/axios";
import { CONST } from "../../utils/constants";
import {
	connectUserWithSocket,
	connectWithWebSocket,
	disconnectSocket,
} from "../../utils/wssConnection/wssConnection";
import { INIT_CHAT } from "../constants/chatConstants";
import { INIT_MODEL } from "../constants/modelConstants";
import { INIT_TASK } from "../constants/taskConstants";
import {
	INIT_USER,
	LOAD_USER_SUCCESS,
	LOGIN_FAIL,
	LOGIN_REQUEST,
	LOGIN_SUCCESS,
	LOGOUT_REQUEST,
	LOGOUT_SUCCESS,
	TOKEN_REQUEST_FAIL,
} from "../constants/userContants";

// Login Request
export const login = (email, password) => async (dispatch) => {
	try {
		dispatch({ type: LOGIN_REQUEST });
		const { data } = await axios.post(CONST.API.LOGIN, { email, password });
		connectWithWebSocket(data.token);
		localStorage.setItem("token", JSON.stringify(data.token));
		dispatch({ type: LOGIN_SUCCESS, payload: data.token });
		dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
		connectUserWithSocket(data.user.id, dispatch);
		instance.defaults.headers.common["x-access-token"] = data.token;
	} catch (error) {
		console.log(error);
		dispatch({
			type: LOGIN_FAIL,
			payload:
				error.response.data !== undefined
					? error.response.data?.message
					: error.message,
		});
	}
};

// Verify token and get user data
export const verifyToken = () => async (dispatch) => {
	try {
		const token = localStorage.getItem("token");
		dispatch({ type: LOGIN_REQUEST });
		const { data } = await axios.get(CONST.API.VERIFY_TOKEN);
		connectWithWebSocket(token);
		dispatch({ type: LOGIN_SUCCESS, payload: token });
		dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
		connectUserWithSocket(data.user.id, dispatch);
		// return
	} catch (error) {
		localStorage.removeItem("token");
		dispatch({
			type: TOKEN_REQUEST_FAIL,
			payload: error.response?.data?.message,
		});
	}
};

// Logout user
export const onLogout = () => async (dispatch) => {
	try {
		dispatch({ type: LOGOUT_REQUEST });
		disconnectSocket();
		localStorage.removeItem("token");
		dispatch({ type: LOGOUT_SUCCESS });
	} catch (error) {
		dispatch({ type: TOKEN_REQUEST_FAIL, payload: error });
	}
};

// Logout user
export const setInitState = () => async (dispatch) => {
	try {
		dispatch({ type: INIT_USER });
		dispatch({ type: INIT_CHAT });
		dispatch({ type: INIT_MODEL });
		dispatch({ type: INIT_TASK });
	} catch (error) {}
};
