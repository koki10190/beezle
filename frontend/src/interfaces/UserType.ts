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
	activity: string;
	reputation: number;
	bookmarks: string[];
	milestones: number[];
	notifications: string[];
	status: string;
	bot_account: boolean;
	joined: Date;
	levels: { xp: number; level: number };
	kofi: boolean;
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
		profile_colors: boolean;
	};
	gradient: {
		color1: string;
		color2: string;
	};
}

export default UserType;
