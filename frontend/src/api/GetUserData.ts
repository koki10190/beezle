import axios from "axios";
import TokenDataType from "../interfaces/TokenDataType";

async function GetUserData(): Promise<TokenDataType> {
	const data: TokenDataType = (
		await axios.post("http://localhost:3000/api/verify-token", {
			token: localStorage.getItem("auth_token"),
		})
	).data as TokenDataType;

	return data;
}

export default GetUserData;
