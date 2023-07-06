import axios from "axios";
import TokenDataType from "../interfaces/TokenDataType";
import { api_url } from "../constants/ApiURL";

async function GetUserData(): Promise<TokenDataType> {
	const data: TokenDataType = (
		await axios.post(`${api_url}/api/verify-token`, {
			token: localStorage.getItem("auth_token"),
		})
	).data as TokenDataType;
	data.user.displayName =
		data.user.displayName.length > 10
			? data.user.displayName.substring(0, 10) + "..."
			: data.user.displayName;
	return data;
}

export default GetUserData;
