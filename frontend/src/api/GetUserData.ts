import axios from "axios";
import TokenDataType from "../interfaces/TokenDataType";

async function GetUserData(): Promise<TokenDataType> {
	const data: TokenDataType = (
		await axios.post("http://localhost:3000/api/verify-token", {
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
