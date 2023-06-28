import mongoose from "mongoose";

const schema = new mongoose.Schema({
	postID: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	date: {
		type: String,
		required: true,
	},
	op: {
		type: String,
		required: true,
	},
	likes: {
		type: Number,
		required: true,
		default: 0,
	},
	reposts: {
		type: Number,
		required: true,
		default: 0,
	},
});

export default mongoose.model("Post", schema);
