// import { setUserHandler } from "../Components/Chat/Sidebar/ChatsContentSidebarList";
import { CONST } from "../utils/constants";
// import { totalNotiCount } from "./actions/chatAction";

export const getTzDateTime = (date) => {
	return date.toLocaleString("en-US", {
		timeZone: CONST.TIMEZONE,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		timeZoneName: "short",
	});
};

export const getStatusColor = (status) => {
	switch (status) {
		case "pending":
			return "bg-pending";
		case "started":
			return "bg-started";
		case "paused":
			return "bg-paused";
		case "finished":
			return "bg-finished";
		default:
			return "bg-pending";
	}
};
export const getUserColor = (id) => {
	return `c-user-${id % 10}`;
};

// const showError = () => {
// 	console.Error(
// 		"Error Occured While Requesting for Notification, Allow notification on this site"
// 	);
// };
// let granted = false;
// const requestPermission = async () => {
// 	if (Notification.permission === "granted") {
// 		granted = true;
// 	} else if (Notification.permission !== "denied") {
// 		let permission = await Notification.requestPermission();
// 		granted = permission === "granted" ? true : false;
// 	}
// };
export const showNotificationfunc = async (
	data = { msg: "NA", title: CONST.APP_NAME },
	userId,
	chatList,
	dispatch,
	navigate
) => {
	if ("Notification" in window && navigator.serviceWorker) {
		Notification.requestPermission((permission) => {
			if (permission === "granted") {
				// Using the registration object, we can call the `showNotification` method to push notification
				navigator.serviceWorker.getRegistration().then((registration) => {
					const options = {
						body: `${data.sendByDetail.name}: ${data.message}`,
						icon: "maskable_icon_x192.png",
					};
					registration.showNotification(CONST.APP_NAME, options);
				});
			} else {
				Notification.requestPermission((permission) => {
					if (permission === "granted") {
						navigator.serviceWorker.getRegistration().then((registration) => {
							const options = {
								body: `${data.sendByDetail.name}: ${data.message}`,
								icon: "maskable_icon_x192.png",
							};
							registration.showNotification(CONST.APP_NAME, options);
						});
					}
				});
			}
		});
	}
	// if (!granted) await requestPermission();
	// let showNotification = () => {
	// 	let notification = new Notification(`${CONST.APP_NAME}`, {
	// 		body: `${data.sendByDetail.name}: ${data.message}`,
	// 		timestamp: 10000,
	// 		icon: `maskable_icon_x192.png`,
	// 		vibrate: true,
	// 		badge: totalNotiCount,
	// 	});
	// 	// setTimeout(() => {
	// 	// 	notification.close();
	// 	// }, 10 * 1000);

	// 	notification.addEventListener("click", () => {
	// 		window.focus();
	// 		if (window.location.pathname !== "/chats") navigate("/chats");
	// 		// const index = chatList.findIndex((chat) => chat.id === data.chatId);
	// 		// if (index !== -1) {
	// 		// 	console.log(chatList[index]);
	// 		// 	setUserHandler(chatList[index], -3, userId, dispatch);
	// 		// }
	// 	});
	// };
	// granted ? showNotification() : showError();
};
