interface UserType {
	handle: string;
	displayName: string;
	email: string;
	password: string;
	bio: string;
	avatar: string;
	banner: string;
	verified: boolean;
	moderator: boolean;
	owner: boolean;
}

export default UserType;
