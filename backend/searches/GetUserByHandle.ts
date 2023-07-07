import User from "../models/User";

async function GetUserByHandle(handle: string) {
	const user = await User.find({ handle }).limit(1);
	return user[0];
}

export default GetUserByHandle;
