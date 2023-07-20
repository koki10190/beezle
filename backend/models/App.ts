import mongoose, { trusted } from "mongoose";

const schema = new mongoose.Schema({
	name: { type: String, required: true },
	id: { type: String, required: true },
	uri: { type: String, required: true },
	by: { type: String, required: true },
});

export default mongoose.model("App", schema);
