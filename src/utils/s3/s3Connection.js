import axiosInstance from "../../utils/axios";
import axios from "axios";
import { CONST } from "../constants";
export const onUploadImage = async (file) => {
	if (file) {
		const res = await getPresignedUrl({
			fileName: file.name,
			fileType: file.type,
		});
		return res.data.url;
	}
};
export const getPresignedUrl = async (body) => {
	try {
		const { data } = await axiosInstance.post(CONST.API.PRESIGNED_URL, body);
		return data;
	} catch (error) {
		console.log(error);
	}
};

export const uploadToS3 = async (presignedUrl, FileObject) => {
	try {
		if (presignedUrl !== null) {
			const config = {
				headers: { "Content-Type": FileObject.type },
			};
			const body = FileObject;
			const res = await axios.put(presignedUrl, body, config);
			if (res.status === 200) return presignedUrl.split("?").shift();
		}
		return "";
	} catch (error) {
		console.log(error);
	}
};
