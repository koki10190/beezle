import mongoose, { trusted } from "mongoose";

const schema = new mongoose.Schema({
	auth: { type: String, required: true },
	new_pass: { type: String, required: true },
	for: { type: String, required: true },
});

export default mongoose.model("PasswordVerification", schema);
