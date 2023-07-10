import mongoose, { trusted } from "mongoose";

const schema = new mongoose.Schema({
	handle: { type: String, required: true },
	avatar: { type: String, required: true },
	name: { type: String, required: true },
	content: { type: String, required: true },
	channel: { type: String, required: true },
	messageID: { type: String, required: true },
	me: { type: Boolean, required: true, default: false },
});

export default mongoose.model("Message", schema);
