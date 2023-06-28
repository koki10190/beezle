import axios from "axios";
import UserType from "../interfaces/UserType";

async function GetUserData(): Promise<UserType> {
	const data: UserType = (
		await axios.post("http://localhost:3000/api/verify-token", {
			token: localStorage.getItem("auth_token"),
		})
	).data as UserType;

	return data;
}

export default GetUserData;
