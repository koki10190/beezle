import User from "../models/User";

async function GetUserByEmail(email: string) {
	return await User.findOne({ email });
}

export default GetUserByEmail;
