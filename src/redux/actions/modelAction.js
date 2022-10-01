import {
	MODEL_CHANGE_END,
	MODEL_CHANGE_START,
	TASK_CHANGE_END,
	USER_UPDATE_DATA,
} from "../constants/modelConstants";
export let pastedFiles = [];

// Set Model
export const changeModel = (modelName) => async (dispatch) => {
	dispatch({ type: MODEL_CHANGE_START });
	dispatch({ type: MODEL_CHANGE_END, payload: modelName });
};

export const onSetPasteFiles = (files) => async (dispatch) => {
	pastedFiles = files;
};

// Admin update data
export const updateUserData = (user) => async (dispatch) => {
	dispatch({ type: USER_UPDATE_DATA, payload: user });
};

// Set Task
export const changeTask = (taskName) => async (dispatch) => {
	dispatch({ type: TASK_CHANGE_END, payload: taskName });
};
