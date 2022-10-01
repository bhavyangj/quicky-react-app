import { combineReducers } from "redux";
import { chatReducer } from "./reducers/chatReducer";
import { issuesReducer } from "./reducers/issuesReducer";
import { modelReducer } from "./reducers/modelReducer";
import { taskReducer } from "./reducers/taskReducer";
import { userReducer } from "./reducers/userReducer";

export default combineReducers({
	user: userReducer,
	chat: chatReducer,
	task: taskReducer,
	model: modelReducer,
	issues: issuesReducer,
});
