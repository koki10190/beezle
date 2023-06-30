import axios from "axios";
import RegisterTokenData from "../interfaces/RegisterTokenData";
import TokenDataType from "../interfaces/TokenDataType";

async function GetOtherUser(handle: string) {
	const data = (
		await axios.post("http://localhost:3000/api/get-user", {
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
