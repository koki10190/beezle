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
	milestones: number[];
	notifications: string[];
	status: string;
	bot_account: boolean;
	connected_accounts: {
		spotify: {
			access_token: string;
			refresh_token: string;
		};
	};

	coins: number;
	cosmetic: {
		avatar_shape: string;
		avatar_frame: string;
		custom_emojis: string[];
	};
}

export default UserType;
