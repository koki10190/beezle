import User from "../models/User";

async function GetUserByHandle(handle: string) {
	return await User.findOne({ handle });
}

export default GetUserByHandle;
