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
	if (!data.user) return undefined;
	data.user.displayName = data.user.displayName.replace(/(.{16})..+/, "$1");
	return data;
}

export default GetOtherUser;
