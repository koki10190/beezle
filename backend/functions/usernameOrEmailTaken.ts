import User from "../models/User";

async function usernameOrEmailTaken(name: string, email: string): Promise<boolean> {
	const users =
		(await User.findOne({
			handle: name,
		})) ||
		(await User.findOne({
			email: email,
		}));

	return users ? true : false;
}

export default usernameOrEmailTaken;
