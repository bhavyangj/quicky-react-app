import axios from "axios";
import { base } from "./config";
const instance = axios.create({ baseURL: base.URL });

instance.defaults.headers.common["x-access-token"] = JSON.parse(
	localStorage.getItem("token")
);
instance.defaults.headers.get["Access-Control-Allow-Origin"] = "*";
instance.defaults.headers.common["Content-Type"] = "application/json";
export default instance;
