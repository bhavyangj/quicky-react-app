import { applyMiddleware, createStore } from "redux";
import mainReducer from "./reducer";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
// import { base } from "../utils/config";
// import { DEVELOPMENT } from "./constants/appConstants";

const middleware = [thunk];
const store = createStore(
	mainReducer,
	composeWithDevTools(applyMiddleware(...middleware))
	// base.version === DEVELOPMENT
	// 	? composeWithDevTools(applyMiddleware(...middleware))
	// 	: applyMiddleware(...middleware)
);

export default store;
