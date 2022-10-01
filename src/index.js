import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import { App } from "./App";
// import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./assets/webfonts/inter/inter.css";
import "react-datepicker/dist/react-datepicker.css";
import "./assets/css/app.min.css";
import "./assets/css/skins/dark-skin.min.css";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	// <React.StrictMode>
	<Provider store={store}>
		<Router>
			<App />
		</Router>
	</Provider>
	// </React.StrictMode>
);

export const setNotiCount = async (count = 1) => {
	if ("setAppBadge" in navigator) {
		// console.log("unread count: ", count);
		await navigator.setAppBadge(count);
	}
};
