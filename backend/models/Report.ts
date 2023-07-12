import mongoose from "mongoose";

const schema = new mongoose.Schema({
	user: { type: String, required: true },
	postID: { type: String, required: true },
});

export default mongoose.model("Report", schema);
