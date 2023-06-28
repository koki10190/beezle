import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bcrypt, { hash } from "bcrypt";
import mongoose from "mongoose";
import { rateLimit } from "express-rate-limit";
import jwt from "jsonwebtoken";
import cors from "cors";
// MongoDB Models
import User from "./models/User";
import UserType from "./interfaces/UserType";

const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

mongoose.connect(process.env.MONGO_URI as string).then(() =>
	console.log("[BEEZLE] Connected to the Mongoose Database")
);
const app = express();
app.listen(process.env.PORT, () => console.log("[BEEZLE] Listening to port " + process.env.PORT));
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
	cors({
		origin: "*",
	})
);

app.get("/", (req: express.Request, res: express.Response) => {
	res.send("Hello, World!");
	User.deleteMany({
		__v: { $gte: 0 },
	}).then(() => res.write("Deleted!"));
});

app.get("/deletgae", (req: express.Request, res: express.Response) => {
	User.deleteMany({
		__v: { $gte: 0 },
	}).then(() => res.write("Deleted!"));
});

async function usernameOrEmailTaken(name: string, email: string): Promise<boolean> {
	const users =
		(await User.findOne({
			handle: name,
		})) ||
		(await User.findOne({
			email: email,
		}));

	return users ? true : false;
}

app.post("/api/register-user", async (req: express.Request, res: express.Response) => {
	const { name, email, password } = req.body;
	const salt = await bcrypt.genSalt(10);
	const hashed = await bcrypt.hash(password, salt);

	if (await usernameOrEmailTaken(name, email)) {
		res.json({
			error:
				"The username " +
				name +
				" or email " +
				email +
				" is already taken!",
			was_error: true,
		});
		return;
	}

	if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
		res.json({
			error: "Invalid email address!",
			was_error: true,
		});
		return;
	}

	if (!name.match(/^[a-z0-9\._-]+$/g)) {
		res.json({
			error: "The username cannot have any special characters except of dots, dashes and underscores!",
			was_error: true,
		});
		return;
	}

	const user = await User.create({
		handle: name,
		displayName: name,
		email: email,
		password: hashed,
	});

	const token = jwt.sign(user.toJSON(), process.env.TOKEN_SECRET as string);
	res.json({ token, error: "", was_error: false });
});

app.post("/api/verify-token", async (req: express.Request, res: express.Response) => {
	const { token } = req.body;
	jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
		if (err) return res.json({ error: true });

		res.json({ user, error: false });
	});
});
