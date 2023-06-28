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
	bio: {
		type: String,
		required: false,
		default: "Hello!",
	},
	avatar: {
		type: String,
		required: true,
		default: "https://cdn.discordapp.com/attachments/1123624150225920060/1123624173076488212/icon.png",
	},
	banner: {
		type: String,
		required: true,
		default: "https://cdn.discordapp.com/attachments/1123624150225920060/1123624173076488212/icon.png",
	},
	// token: {
	// 	type: String,
	// 	required: true,
	// },
});

export default mongoose.model("User", schema);
