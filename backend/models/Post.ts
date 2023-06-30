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
		type: Date,
		required: true,
		default: Date.now,
	},
	edited: {
		type: Boolean,
		required: true,
		default: false,
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
	replies: {
		amount: { type: Number, required: true, default: 0 },
		posts: [
			{
				type: String,
				required: false,
			},
		],
	},
});

export default mongoose.model("Post", schema);
