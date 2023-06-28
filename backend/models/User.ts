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
		require: false,
		default: "Hello!",
	},
	// token: {
	// 	type: String,
	// 	required: true,
	// },
});

export default mongoose.model("User", schema);
