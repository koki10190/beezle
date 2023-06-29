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
	pinned_post: string;
}

export default UserType;
