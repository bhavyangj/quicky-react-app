import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeModel, changeTask } from "../../../redux/actions/modelAction";
import { ChatsContentSidebar } from "../../Chat/Sidebar/ChatsContentSidebar";
import { Appbar } from "../../Chat/Appbar/Appbar";
import {
	ADD_NOTE,
	ADD_TASK,
	ADD_USER_TO_GROUP,
	CREATE_GROUP,
	DROP_ZONE,
	EDIT_TASK,
	FORWARD_MSG,
	IMAGE_GALLERY,
	INVITE_OTHERS,
	MEDIA_FILES,
	NEW_CHAT,
	NOTIFICATION_MODEL,
	PDF_VIEWER,
	PROFILE_PIC,
	UPDATE_GROUP_DEATILS,
} from "../../Chat/Models/models";
import { AddNote } from "../../Chat/Models/AddNote";
import { AddTask } from "../../Chat/Models/AddTask";
import { CreateGroup } from "../../Chat/Models/CreateGroup";
import { EditTask } from "../../Chat/Models/EditTask";
import { InviteOthers } from "../../Chat/Models/InviteOthers";
import { NewChat } from "../../Chat/Models/NewChat";
import { Notification } from "../../Chat/Models/Notification";
import { ChatsContent } from "../../Chat/Main/ChatsContent";
import { ImageGalleryZone } from "../../Chat/Models/ImageGalleryZone";
import { DropZone } from "../../Chat/Models/Dropzone";
import { PdfViewer } from "../../Chat/Models/PdfViewer";
// import { loadUser } from "../../../redux/actions/userAction";
import {
	setThreadMessage,
} from "../../../redux/actions/chatAction";
import {
	GET_NOTES_SUCCESS,
	GET_TASKS_SUCCESS,
} from "../../../redux/constants/chatConstants";
import { MediaFiles } from "../../Chat/Models/MediaFiles";
import { AddUsertoGroup } from "../../Chat/Models/AddUsertoGroup";
import { listenNotification } from "../../../utils/wssConnection/Listeners/messageListener";
import { ProfilePicUpdate } from "../../Chat/Models/ProfilePicUpdate";
import { GroupUpdate } from "../../Chat/Models/GroupUpdate";
import { ForwardMessage } from "../../Chat/Models/ForwardMessage";

export const HomePage = () => {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.user);
	const { name, taskName } = useSelector((state) => state.model);
	const { activeChat, taskList, notesList, threadMessage } = useSelector(
		(state) => state.chat
	);

	useEffect(() => {
		listenNotification(dispatch, -1, user?.id);
	}, [user, dispatch]);

	return (
		<>
			<aside className="sidebar">
				<div className="tab-content">
					<ChatsContentSidebar />
				</div>
			</aside>
			<main
				className={`main ${activeChat && activeChat.id !== -1 ? "main-visible" : ""
					}`.trim()}
			>
				<ChatsContent />
			</main>
			{activeChat && activeChat.id !== -1 && <Appbar user={user} dispatch={dispatch} />}
			<div
				className={`backdrop ${taskName !== "" || name !== "" ? "backdrop-visible" : ""}`.trim()}
				onClick={() => {
					if (name !== "") dispatch(changeModel(""));
					if (taskName !== "") dispatch(changeTask(""));
					if (threadMessage.id !== -1)
						dispatch(setThreadMessage({ id: -1 }));
					if (taskList.data.length > 0)
						dispatch({
							type: GET_TASKS_SUCCESS,
							payload: { data: [] },
						});
					if (notesList.data.length > 0)
						dispatch({
							type: GET_NOTES_SUCCESS,
							payload: { data: [] },
						});
				}}
			></div>
			{modelElement(name)}
		</>
	);
};

const modelElement = (model) => {
	// All Models
	switch (model) {
		// Modal 1 :: Start a Conversation
		case NEW_CHAT:
			return <NewChat />;
		// Modal 2 :: Create Group
		case CREATE_GROUP:
			return <CreateGroup />;
		// Modal 3 :: Invite Others
		case INVITE_OTHERS:
			return <InviteOthers />;
		// Modal 4 :: Notifications
		case NOTIFICATION_MODEL:
			return <Notification />;
		// Modal 5 :: Add Note
		case ADD_NOTE:
			return <AddNote />;
		// Modal 6 :: Edit Task
		case EDIT_TASK:
			return <EditTask />;
		// Modal 7 :: Add Task
		case ADD_TASK:
			return <AddTask />;
		// Modal 8 :: Dropzone
		case DROP_ZONE:
			return <DropZone />;
		// Modal 9 :: Image gallery
		case IMAGE_GALLERY:
			return <ImageGalleryZone />;
		// Modal 10 :: PDF Viewer
		case PDF_VIEWER:
			return <PdfViewer />;
		// Modal 11 :: PDF Viewer
		case MEDIA_FILES:
			return <MediaFiles />;
		// Modal 12 :: Add User to Group
		case ADD_USER_TO_GROUP:
			return <AddUsertoGroup />;
		case PROFILE_PIC:
			return <ProfilePicUpdate />;
		case UPDATE_GROUP_DEATILS:
			return <GroupUpdate />;
		case FORWARD_MSG:
			return <ForwardMessage />;
		default:
			return null;
	}
};

export const DEFAULT_IMAGE =
	"https://chatapp-storage-2022.s3.us-west-2.amazonaws.com/user_pic.jpg";
