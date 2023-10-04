import mongoose, { trusted } from "mongoose";

const schema = new mongoose.Schema({
	op: { type: String, required: true },
	notif_of: { type: String, required: true },
});

export default mongoose.model("Notification", schema);
