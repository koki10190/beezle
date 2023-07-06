import axios from "axios";
import RegisterTokenData from "../interfaces/RegisterTokenData";
import TokenDataType from "../interfaces/TokenDataType";
import { api_url } from "../constants/ApiURL";

async function GetOtherUser(handle: string) {
	const data = (
		await axios.post(`${api_url}/api/get-user`, {
			handle,
		})
	).data as TokenDataType;
	data.user.displayName =
		data.user.displayName.length > 10
			? data.user.displayName.substring(0, 10) + "..."
			: data.user.displayName;
	return data;
}

export default GetOtherUser;
