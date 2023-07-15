interface UserType {
	handle: string;
	displayName: string;
	email: string;
	password: string;
	private: boolean;
	bio: string;
	avatar: string;
	banner: string;
	verified: boolean;
	bug_hunter: boolean;
	supporter: boolean;
	moderator: boolean;
	owner: boolean;
	pinned_post: string;
	followers: string[];
	following: string[];
	bookmarks: string[];
	notifications: string[];
	milestones: number[];
	status: string;
	connected_accounts: {
		spotify: {
			access_token: string;
			refresh_token: string;
		};
	};
}

export default UserType;
