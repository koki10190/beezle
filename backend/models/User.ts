import mongoose from "mongoose";

const schema = new mongoose.Schema({
	handle: {
		type: String,
		required: true,
	},
	displayName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	private: { type: Boolean, default: false },
	joined: { type: Date, default: Date.now() },
	activity: { type: String, default: "" },
	bio: {
		type: String,
		required: false,
		default: "Hello!",
	},
	avatar: {
		type: String,
		required: true,
		default: "https://cdn.discordapp.com/attachments/1123624150225920060/1126940032289218691/icon.png",
	},
	banner: {
		type: String,
		required: true,
		default: "https://cdn.discordapp.com/attachments/1123624150225920060/1126940032289218691/icon.png",
	},
	verified: {
		type: Boolean,
		required: true,
		default: false,
	},
	bug_hunter: { type: Boolean, default: false },
	kofi: { type: Boolean, default: false },
	supporter: { type: Boolean, default: false },
	reputation: { type: Number, required: true, default: 100 },
	moderator: {
		type: Boolean,
		required: true,
		default: false,
	},
	gradient: {
		color1: { type: String, default: "#000000" },
		color2: { type: String, default: "#000000" },
	},
	owner: {
		type: Boolean,
		required: true,
		default: false,
	},
	pinned_post: String,
	bookmarks: [
		{
			type: String,
		},
	],
	following: [
		{
			type: String,
		},
	],
	followers: [
		{
			type: String,
		},
	],
	active: { type: Boolean, default: true },
	notifications: [{ type: String }],
	connected_accounts: {
		spotify: {
			access_token: { type: String, default: "" },
			refresh_token: { type: String, default: "" },
		},
	},
	milestones: [{ type: Number, default: [] }],
	status: { type: String, default: "online" },
	bot_account: { type: Boolean, default: false },
	api_key: { type: String, default: undefined },

	// ACTIVITY SHOP
	coins: { type: Number, default: 0 },
	cosmetic: {
		avatar_shape: { type: String, default: "circle(50% at 50% 50%)" },
		avatar_frame: { type: String, default: "" },
		custom_emojis: [
			{
				type: String,
				default: "",
			},
		],
		profile_colors: { type: Boolean, default: false },
	},
});

export default mongoose.model("User", schema);
