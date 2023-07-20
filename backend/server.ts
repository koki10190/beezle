import dotenv from "dotenv";
dotenv.config();

const jwt_secret = process.env.TOKEN_SECRET as string;
const database_guild = "1123623839037919304";
const database_channel = "1123624150225920060";
const report_channel = "1127200828025995284";
import express from "express";
import multer from "multer";
import bcrypt, { hash } from "bcrypt";
import fs from "fs";
import mongoose from "mongoose";
import { rateLimit } from "express-rate-limit";
import jwt, { verify } from "jsonwebtoken";
import client from "./discord/bot";
import cors from "cors";
import uuid, { valid } from "uuid4";
// MongoDB Models
import User from "./models/User";
import Report from "./models/Report";
import UserType from "./interfaces/UserType";
import GetUserByEmail from "./searches/GetUserByEmail";
import GetUserByHandle from "./searches/GetUserByHandle";
import { Colors, EmbedBuilder, TextChannel } from "discord.js";
import sanitize from "sanitize-html";
import http from "http";
import { marked } from "marked";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import Post from "./models/Post";
import uuid4 from "uuid4";
import usernameOrEmailTaken from "./functions/usernameOrEmailTaken";
import { fetchBookmarks, fetchGlobalPosts, fetchRightNow, fetchPostByID, fetchPostsFollowing, fetchReplies, fetchUserPosts } from "./functions/fetchPosts";
import { Socket, Server as ioServer } from "socket.io";
import { getSockets, initSocket } from "./io/socket";
import smtpTransport from "nodemailer-smtp-transport";
import { PostType } from "./interfaces/PostType";
import CONSTANTS from "./constants/constants";
import { VerifyBadgeText } from "./functions/badges";
import validate from "deep-email-validator";
import EmailVerification from "./models/EmailVerification";
import Message from "./models/Message";
import PasswordVerification from "./models/PasswordVerification";
import axios from "axios";
import cryptr from "cryptr";
import SpotifyWebApi from "spotify-web-api-node";
import App from "./models/App";
import { activityItems } from "./interfaces/ItemType";
const crypt = new cryptr(process.env.SPOTIFY_SECRET as string);
const spotifyAPI = new SpotifyWebApi();
const basic_spotify = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64");

process.on("uncaughtException", function (err) {
	console.error(err);
	console.log("Node NOT Exiting...");
});

interface PostLimiter {
	[key: string]: boolean;
}

const transporter = nodemailer.createTransport(
	smtpTransport({
		service: "gmail",
		auth: {
			user: "beezle.app.lol@gmail.com",
			pass: process.env.GMAIL_PASS as string,
		},
	})
);

function sendEmail(to: string, subject: string, text: string) {
	const mailOptions = {
		from: process.env.GMAIL_ACCOUNT,
		to,
		subject,
		text,
	};
	transporter.sendMail(mailOptions as Mail.Options, (err, info) => {
		if (err) return console.log(err);
	});
}

const limiter = rateLimit({
	windowMs: 30 * 1000, // 15 minutes
	max: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const max_size = 7 * 1024 * 1024; // 8mb
const upload = multer({ dest: "uploads", limits: { fileSize: max_size } });

mongoose.connect(process.env.MONGO_URI as string).then(() => console.log("[BEEZLE] Connected to the Mongoose Database"));

const app = express();
const server = http.createServer(app);
const io = initSocket(server);
server.listen(process.env.PORT, () => console.log("[BEEZLE] Listening to port " + process.env.PORT));
// app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
	cors({
		origin: "*",
	})
);

app.get("/", (req: express.Request, res: express.Response) => {
	// res.send("Hello, World!");
	// Post.deleteMany({
	// 	__v: { $gte: 0 },
	// }).then(() => res.write("Deleted!"));
});

app.get("/search/:email", async (req: express.Request, res: express.Response) => {
	const { email } = req.params;

	res.json(await User.findOne({ email }));
});

app.get("/deletgae", (req: express.Request, res: express.Response) => {
	// User.deleteMany({
	// 	__v: { $gte: 0 },
	// }).then(() => res.write("Deleted!"));
});

app.post("/api/register-user", async (req: express.Request, res: express.Response) => {
	const { name, email, password } = req.body;
	const salt = await bcrypt.genSalt(10);
	const hashed = await bcrypt.hash(password, salt);
	// return res.json({
	// 	error: "Registering users is currently unavailable due to an exploit.",
	// 	was_error: true,
	// });
	User.findOneAndDelete({ email: "guitarwithluka@gmail.com" });
	if (await usernameOrEmailTaken(name, email)) {
		res.json({
			error: "The username " + name + " or email " + email + " is already taken!",
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

	if (!name.toLowerCase().match(/^[a-z0-9\._-]+$/g)) {
		res.json({
			error: "The username cannot have any special characters except of dots, dashes, underscores and lower case letters!",
			was_error: true,
		});
		return;
	}

	if (password.length < 8) {
		res.json({
			error: "The password must have atleast 8 characters!",
			was_error: true,
		});
		return;
	}

	const emailCheck = await validate(email);
	if (!emailCheck.valid) {
		res.json({
			error: "Invalid email address!",
			was_error: true,
		});
	}

	const length = 24;
	const user = await User.create({
		handle: name.toLowerCase().replace(/(.{16})..+/, "$1"),
		displayName: name.toLowerCase().replace(/(.{16})..+/, "$1…"),
		email: email,
		password: hashed,
		active: false,
	});

	const verify = await EmailVerification.create({
		auth: uuid4(),
		for: user.handle,
	});
	const ipAddress = req.header("x-forwarded-for") || req.socket.remoteAddress;
	sendEmail(
		user.email,
		"Verify your email address",
		`Hello ${user.handle}!\nClick the URL to verify your account "@${user.handle}": ${CONSTANTS.SERVER_URL}/verify/${verify.auth}\nDO NOT Click on this link if you didn't register using this email!\nIP Address of the requester: ${ipAddress}`
	);

	return res.json({ error: "An email has been sent, please verify your account", was_error: true });

	const token = jwt.sign(user.toJSON(), jwt_secret);
	// sendEmail(
	// 	email,
	// 	"Thank you for registering on Beezle!",
	// 	`Thank you for registering on Beezle, ${name}!\n\nYou can use your account to post, discover accounts, follow accounts and much more!.`
	// );

	res.json({ token, error: "", was_error: false });
});

app.post("/api/login", async (req: express.Request, res: express.Response) => {
	const { email, password } = req.body;
	const user = (await GetUserByEmail(email)) || (await GetUserByHandle(email));

	if (!user) {
		return res.json({
			error: "Incorrect email address!",
			was_error: true,
		});
	}

	if (!(await bcrypt.compare(password, user.password))) {
		return res.json({
			error: "Incorrect password!",
			was_error: true,
		});
	}

	if (!user.active) {
		let verify = await EmailVerification.findOne({ for: user.handle });
		if (!verify) {
			verify = await EmailVerification.create({
				for: user.handle,
				auth: uuid4(),
			});
		}

		const ipAddress = req.header("x-forwarded-for") || req.socket.remoteAddress;
		sendEmail(
			user.email,
			"Verify your email address",
			`Hello ${user.handle}!\nClick the URL to verify your account "@${user.handle}": ${CONSTANTS.SERVER_URL}/verify/${verify.auth}\n\nDO NOT Click on this link if you didn't login into your account!\nIP Address of the requester: ${ipAddress}`
		);

		return res.json({ error: "An email has been sent, please verify your account", was_error: true });
	}

	const token = jwt.sign(
		{
			handle: user.handle,
			email: user.email,
		},
		jwt_secret
	);
	return res.json({ token, error: "", was_error: false });
});

app.post("/api/logout", async (req: express.Request, res: express.Response) => {
	const { token } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });

		const m_user = await User.findOneAndUpdate(
			{
				handle: user.handle,
			},
			{
				active: false,
			}
		);
		return res.json({ error: false });
	});
});

app.post("/api/verify-token", async (req: express.Request, res: express.Response) => {
	const { token } = req.body;
	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });

		const m_user = await User.findOne({
			handle: user.handle,
		});
		if (!m_user) return res.json({ error: true });
		m_user!.displayName = sanitize(m_user!.displayName, {
			allowedTags: [],
		});

		res.json({ user: m_user, error: false });
	});
});

app.post("/api/get-user", async (req: express.Request, res: express.Response) => {
	const { handle } = req.body;

	const user = await GetUserByHandle(handle);
	if (!user) return res.json({ error: "Couldn't find user!", was_error: true });
	const userData = user!.toJSON() as any;
	delete userData["password"];
	userData.displayName = sanitize(userData.displayName, {
		allowedTags: [],
	});
	return res.json({ user: userData, was_error: false, error: "" });
});

app.post("/api/upload-avatar", upload.single("avatar"), async (req, res) => {
	let path = req.file?.path;
	const { token } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });

		try {
			res.json({ user, error: false });
			console.log(path);

			fs.rename(path!, path! + "." + (req.body.ext as string), err => {
				if (err) console.log(err);
			});
			path = path! + "." + (req.body.ext as string);

			const guild = await client.guilds.fetch(database_guild);
			const channel = (await guild.channels.fetch(database_channel)) as TextChannel;
			const message = await channel.send({
				files: [{ attachment: path! }],
			});

			const attachment = message.attachments.first()?.proxyURL;
			console.log(attachment);

			const m_user = await User.updateOne(
				{
					handle: user.handle,
				},
				{
					avatar: attachment,
				}
			);

			fs.unlink(path, err => {
				if (err) console.log(err);
			});
		} catch (err) {}
	});
});

app.post("/api/upload-banner", upload.single("banner"), async (req, res) => {
	let path = req.file?.path;
	const { token } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });

		console.log("PATH " + req.file?.path);

		try {
			fs.rename(path!, path! + "." + (req.body.ext_banner as string), err => {
				if (err) console.log(err);
			});
			path = path! + "." + (req.body.ext_banner as string);

			const guild = await client.guilds.fetch(database_guild);
			const channel = (await guild.channels.fetch(database_channel)) as TextChannel;
			const message = await channel.send({
				files: [{ attachment: path! }],
			});

			const attachment = message.attachments.first()?.proxyURL;
			console.log(attachment);

			const m_user = await User.updateOne(
				{
					handle: user.handle,
				},
				{
					banner: attachment,
				}
			);

			fs.unlink(path, err => {
				if (err) console.log(err);
			});

			res.json({
				user,
				error: false,
			});
		} catch (err) {
			res.json({ error: true });
		}
	});
});

app.post("/api/edit-profile", (req: express.Request, res: express.Response) => {
	const { status, displayName, token, bio } = req.body;
	const m_bio = sanitize(marked(bio), {
		allowedTags: [
			"img",
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
			"abbr",
			"acronym",
			"b",
			"blockquote",
			"br",
			"code",
			"div",
			"em",
			"i",
			"li",
			"ol",
			"p",
			"span",
			"strong",
			"table",
			"td",
			"tr",
			"ul",
		],
	});

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		console.log(err);
		if (err) return res.json({ error: true });
		const m_user = await User.updateOne(
			{
				handle: user.handle,
			},
			{
				displayName,
				bio: m_bio,
				status,
			}
		);

		res.send({ error: false });
	});
});

// app.get("/verify/:handle", async (req: express.Request, res: express.Response) => {
// 	// const { handle } = req.params;
// 	// const user = await User.updateOne(
// 	// 	{
// 	// 		handle,
// 	// 	},
// 	// 	{
// 	// 		verified: true,
// 	// 	}
// 	// );
// 	// res.send("test!");
// });

app.get("/mod/:handle", async (req: express.Request, res: express.Response) => {
	// const { handle } = req.params;
	// const user = await User.updateOne(
	// 	{
	// 		handle,
	// 	},
	// 	{
	// 		moderator: true,
	// 	}
	// );
	// res.send("test!");
});

const post_limiters: PostLimiter = {};
app.post("/api/post", async (req: express.Request, res: express.Response) => {
	const { content, token } = req.body;

	if (content === "") return;

	const length = 650;
	const trimmedString = content.length > length ? content.substring(0, length - 3) + "..." : content;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });

		const m_user = await User.findOne({
			handle: user.handle,
		});
		if (!m_user) return res.json({ error: true });

		if (post_limiters[m_user.handle]) return res.json({ error: true });

		let post;
		if (req.body.reply_type) {
			post = await Post.create({
				postID: uuid4(),
				content: sanitize(trimmedString),
				op: m_user?.handle,
				reply_type: true,
				replyingTo: req.body.replyingTo,
				repost_type: false,
				repost_op: "",
				private_post: m_user.private,
				repost_id: "",
			});

			const post_rec = (await Post.find({ postID: req.body.replyingTo }).limit(1))[0];
			const receiver = (await User.find({ handle: post_rec.op }).limit(1))[0];
			const url = `${CONSTANTS.FRONTEND_URL}/post/${post.postID}`;
			const notif = `<a href="${url}" class="handle-notif"><div style="background-image: url(${
				m_user?.avatar
			})" class="notifAvatar"></div> @${VerifyBadgeText(m_user as any as UserType)} has replied to your post!</a>`;

			if (receiver.handle != user.handle && receiver.status !== "dnd") {
				if (getSockets()[receiver!.handle]) getSockets()[receiver.handle].emit("notification", notif, url);

				receiver.notifications.push(notif);
				receiver.save();
			}
		} else {
			post = await Post.create({
				postID: uuid4(),
				content: sanitize(trimmedString),
				op: m_user?.handle,
				reply_type: false,
				repost_type: false,
				repost_op: "",
				repost_id: "",
			});
			m_user.coins += CONSTANTS.COIN_GIVE;
			m_user.save();
		}

		const mentions = content.match(/@([a-z\d_\.-]+)/gi);

		if (mentions) {
			for (const m of mentions) {
				const mention = m.replace("@", "");

				const receiver = (await User.find({ handle: mention }).limit(1))[0];
				const url = `${CONSTANTS.FRONTEND_URL}/post/${post.postID}`;
				const notif = `<a href="${url}" class="handle-notif"><div style="background-image: url(${
					m_user?.avatar
				})" class="notifAvatar"></div> @${VerifyBadgeText(m_user as any as UserType)} mentioned you!</a>`;

				if (receiver.handle != user.handle && receiver.status !== "dnd") {
					if (getSockets()[receiver!.handle])
						getSockets()[receiver.handle].emit("notification", notif, url);

					receiver.notifications.push(notif);
					receiver.save();
				}
			}
		}

		const box_type = {
			op: await User.findOne({
				handle: post.op,
			}),
			data: post,
		};
		box_type.data.content = sanitize(box_type.data.content);

		post_limiters[m_user.handle] = true;
		setTimeout(() => (post_limiters[m_user.handle] = false), 5000);

		io.emit("post", box_type);
		res.json(box_type);
	});
});

app.post("/api/explore-posts/:offset", async (req: express.Request, res: express.Response) => {
	const { offset } = req.params;
	const { token } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });

		const m_user = (await User.find({ handle: user.handle }).limit(1))[0];
		const posts = await fetchGlobalPosts(m_user.handle, parseInt(offset));
		return res.json({
			posts: posts.data,
			latestIndex: posts.latestIndex,
		});
	});
});

app.post("/api/right-now/:offset", async (req: express.Request, res: express.Response) => {
	const { offset } = req.params;
	const { token } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });

		const m_user = (await User.find({ handle: user.handle }).limit(1))[0];
		const posts = await fetchRightNow(m_user.handle, parseInt(offset));
		return res.json({
			posts: posts.data,
			latestIndex: posts.latestIndex,
		});
	});
});

app.post("/api/user-posts/:handle", async (req: express.Request, res: express.Response) => {
	const { token, handle } = req.params;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });

		const m_user = (await User.find({ handle: user.handle }).limit(1))[0];
		return res.json({
			posts: fetchUserPosts(m_user.handle, handle as string),
		});
	});
});

app.post("/api/follow-posts", async (req: express.Request, res: express.Response) => {
	const { token, offset } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		const m_user = (await User.findOne({
			handle: user.handle,
		}))!;

		return res.json({
			posts: fetchPostsFollowing(m_user.following as string[], offset),
		});
	});
});

app.post("/api/like-post", async (req: express.Request, res: express.Response) => {
	const { token, postId, unlike } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		const m_user = (await User.findOne({
			handle: user.handle,
		}))!;

		const Unlike = async () => {
			const post = await Post.findOneAndUpdate(
				{
					postID: postId,
				},
				{
					$pull: {
						likes: m_user.handle,
					},
				}
			);
			if (!post)
				return res.json({
					error: true,
				});

			const index = m_post?.likes.findIndex(x => x === user.handle);
			if (index! < 0) return;
			m_post?.likes.splice(index!, 1);
			m_user.coins -= 1;
			m_user.save();

			io.emit("post-like-refresh", postId, m_post?.likes);
		};

		const m_post = await Post.findOne({ postID: postId });
		if (m_post?.likes.find(x => x === user.handle)) return Unlike();

		if (unlike) {
			Unlike();
		} else {
			const post = await Post.findOneAndUpdate(
				{
					postID: postId,
				},
				{
					$push: {
						likes: m_user.handle,
					},
				}
			);
			if (!post)
				return res.json({
					error: true,
				});
			m_post?.likes.push(m_user.handle);

			const receiver = await User.findOne({ handle: post.op });

			const url = `${CONSTANTS.FRONTEND_URL}/post/${post.postID}`;
			const notif = `<a href="${url}" class="handle-notif"><div style="background-image: url(${
				m_user?.avatar
			})" class="notifAvatar"></div> @${VerifyBadgeText(m_user as any as UserType)} has liked your post!</a>`;

			if (receiver?.handle != user.handle && receiver?.status !== "dnd") {
				if (getSockets()[receiver!.handle]) getSockets()[receiver!.handle].emit("notification", notif, url);
				receiver!.notifications.push(notif);
			}
			receiver!.save();

			if (m_post!.likes.length >= 1000) {
				receiver?.milestones.push(1);

				const url = `${CONSTANTS.FRONTEND_URL}/profile/${receiver!.handle}`;
				const notif = `<a href="${url}" class="handle-notif">Congratulations! You achieved "1K Likes" milestone!</a>`;

				if (receiver?.handle != user.handle && receiver?.status !== "dnd") {
					if (getSockets()[receiver!.handle])
						getSockets()[receiver!.handle].emit("notification", notif, url);
					receiver!.notifications.push(notif);
				}
				receiver!.save();
			}

			m_user.coins += CONSTANTS.COIN_GIVE;
			m_user.save();
		}

		res.json({ error: false });
		io.emit("post-like-refresh", postId, m_post?.likes);
	});
});

app.post("/api/get-user-posts/:handle/:offset", async (req: express.Request, res: express.Response) => {
	const { offset, handle } = req.params;
	const { token } = req.body;
	const posts = (await Post.find({ op: handle }).sort({ $natural: -1 }).skip(parseInt(offset)).limit(10)) as any[];

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });

		const m_user = (await User.find({ handle: user.handle }).limit(1))[0];
		const p_user = (await User.find({ handle }).limit(1))[0];

		for (const i in posts) {
			const count = await Post.count({
				replyingTo: posts[i].postID,
			});
			posts[i].replies = count;
		}

		if (p_user.private && !p_user.following.includes(m_user.handle) && p_user.handle !== m_user.handle) {
			return res.json({ posts: [], latestIndex: 0 });
		}

		res.json({
			posts,
			latestIndex: parseInt(offset) + posts.length - 1,
		});
	});
});

app.post("/api/follow", async (req: express.Request, res: express.Response) => {
	const { token, toFollow, unfollow } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (!user) return;
		if (toFollow == user?.handle) return;
		const Unfollow = async () => {
			const m_user = await User.findOneAndUpdate(
				{
					handle: user.handle,
				},
				{
					$pull: {
						following: toFollow,
					},
				}
			);

			const m_user_follow = await User.findOneAndUpdate(
				{
					handle: toFollow,
				},
				{
					$pull: {
						followers: user.handle,
					},
				}
			);
		};

		const m_user = await User.findOneAndUpdate(
			{
				handle: user.handle,
			},
			{
				$push: {
					following: toFollow,
				},
			}
		);

		const userToFollow = await User.findOne({
			handle: toFollow,
		});

		if (userToFollow?.followers.find(x => x == user.handle)) {
			Unfollow();
		}

		if (!unfollow) {
			const m_user_follow = await User.findOneAndUpdate(
				{
					handle: toFollow,
				},
				{
					$push: {
						followers: user.handle,
					},
				}
			);
			if (!m_user_follow) return;
			const url = `${CONSTANTS.FRONTEND_URL}/profile/${user.handle}`;
			const notif = `<a href="${url}" class="handle-notif"><div style="background-image: url(${
				m_user?.avatar
			})" class="notifAvatar"></div> @${VerifyBadgeText(m_user as any as UserType)} has followed you!</a>`;

			if (m_user_follow.handle != user.handle && m_user_follow.status !== "dnd") {
				if (getSockets()[m_user_follow!.handle]) {
					const emit = getSockets()[m_user_follow!.handle].emit("notification", notif, url);
				}
				m_user_follow!.notifications.push(notif);
			}

			if (m_user_follow.followers.length >= 1000) {
				m_user_follow.milestones.push(0);

				const url = `${CONSTANTS.FRONTEND_URL}/profile/${m_user_follow.handle}`;
				const notif = `<a href="${url}" class="handle-notif">Congratulations! You achieved "1K Followers" Milestone!</a>`;

				if (m_user_follow.handle != user.handle && m_user_follow.status !== "dnd") {
					if (getSockets()[m_user_follow!.handle]) {
						const emit = getSockets()[m_user_follow!.handle].emit(
							"notification",
							notif,
							url
						);
					}
					m_user_follow!.notifications.push(notif);
				}
			}

			if (m_user_follow.followers.length >= 100000) {
				m_user_follow.milestones.push(3);

				const url = `${CONSTANTS.FRONTEND_URL}/profile/${m_user_follow.handle}`;
				const notif = `<a href="${url}" class="handle-notif">Congratulations! You achieved "100K Followers" Milestone!</a>`;

				if (m_user_follow.handle != user.handle && m_user_follow.status !== "dnd") {
					if (getSockets()[m_user_follow!.handle]) {
						const emit = getSockets()[m_user_follow!.handle].emit(
							"notification",
							notif,
							url
						);
					}
					m_user_follow!.notifications.push(notif);
				}
			}

			m_user_follow!.save();
			m_user!.coins -= 1;
			m_user!.save();
		} else {
			m_user!.coins += CONSTANTS.COIN_GIVE;
			m_user!.save();
			Unfollow();
		}
	});
	res.json({ followed: true });
});

app.post("/api/delete-post", async (req: express.Request, res: express.Response) => {
	const { token, postId } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		const m_user = (
			await User.find({
				handle: user.handle,
			}).limit(1)
		)[0];

		const post = await Post.deleteOne({
			op: m_user.handle,
			postID: postId,
		});

		io.emit("post-deleted", postId, false);
		return res.json({ error: false });
	});
});

app.post("/api/bookmark", async (req: express.Request, res: express.Response) => {
	const { token, postID, unbookmark } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (unbookmark) {
			const m_user = await User.updateOne(
				{
					handle: user.handle,
				},
				{
					$pull: {
						bookmarks: postID,
					},
				}
			);
		} else {
			const m_user = await User.updateOne(
				{
					handle: user.handle,
				},
				{
					$push: {
						bookmarks: postID,
					},
				}
			);
		}

		return res.json({ error: false });
	});
});

app.post("/api/get-bookmarks", async (req: express.Request, res: express.Response) => {
	const { token, offset } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		const m_user = (
			await User.find({
				handle: user.handle,
			}).limit(1)
		)[0];

		const data = await fetchBookmarks(m_user.bookmarks, offset);
		return res.json({ bookmarks: data.bookmarks, offset: data.offset });
	});
});

app.post("/api/upload-file", upload.single("file"), async (req, res) => {
	let path = req.file?.path;
	const { token } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });

		console.log(path);

		fs.rename(path!, path! + "." + (req.body.ext as string), err => {
			if (err) console.log(err);
		});
		path = path! + "." + (req.body.ext as string);

		const guild = await client.guilds.fetch(database_guild);
		const channel = (await guild.channels.fetch(database_channel)) as TextChannel;
		const message = await channel.send({
			files: [{ attachment: path! }],
		});

		const attachment = message.attachments.first()?.proxyURL;

		fs.unlink(path, err => {
			if (err) console.log(err);
		});
		return res.json({ img: attachment });
	});
});

app.post("/api/get-post/:postID", async (req: express.Request, res: express.Response) => {
	const { postID } = req.params;
	const { token } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({});

		const m_user = (await User.find({ handle: user.handle }).limit(1))[0];
		const post = await fetchPostByID(postID);

		if (post.op.private && !post.op.following.includes(m_user.handle)) {
			return res.json({});
		}

		return res.json(post);
	});
});

app.get("/api/get-replies/:postID/:offset", async (req: express.Request, res: express.Response) => {
	const { postID, offset } = req.params;
	const replies = await fetchReplies(postID, parseInt(offset));
	return res.json({ data: replies.data, offset: replies.latestIndex });
});

app.post("/api/search", async (req: express.Request, res: express.Response) => {
	const { toSearch, token } = req.body;

	const regexSearch = toSearch.replace('"', "");

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });

		const m_user = (
			await User.find({
				handle: user.handle,
			}).limit(1)
		)[0];

		const searchData = (await Post.find({
			$or: [
				{
					op: { $regex: new RegExp(regexSearch, "i") },
				},
				{
					content: { $regex: new RegExp(regexSearch, "i") },
				},
				{
					postID: { $regex: new RegExp(regexSearch, "i") },
				},
			],
		}).limit(25)) as any[];

		for (const index in searchData) {
			searchData[index] = {
				data: searchData[index],
				op: (await User.find({ handle: searchData[index].op }).limit(1))[0],
			};
		}

		return res.json(searchData);
	});
});

app.post("/api/report", async (req: express.Request, res: express.Response) => {
	const { postID, token } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });

		const m_user = (
			await User.find({
				handle: user.handle,
			}).limit(1)
		)[0];

		const embed = new EmbedBuilder({
			title: `${m_user.handle} has flagged a post!`,
			color: Colors.Red,
			author: { icon_url: m_user.avatar, name: `@${m_user.handle}` },
			description: `**@${m_user.handle}** flagged a post with ID **${postID}**\n[Click here to get redirected to that post](${CONSTANTS.FRONTEND_URL}/post/${postID})`,
		});

		const guild = await client.guilds.fetch(database_guild);
		const channel = (await guild.channels.fetch(report_channel)) as TextChannel;
		const message = await channel.send({
			embeds: [embed],
		});

		const report = await Report.create({
			user: user.handle,
			postID,
		});

		return res.json({ status: "The post has been reported." });
	});
});

app.post("/api/clear-notifs", async (req: express.Request, res: express.Response) => {
	const { token } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });
		const m_user = await User.findOneAndUpdate(
			{
				handle: user.handle,
			},
			{
				notifications: [],
			}
		);

		res.json({ done: true });
	});
});

app.post("/api/repost", async (req: express.Request, res: express.Response) => {
	const { token, postID, unrepost } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });

		const m_user = (await User.find({ handle: user.handle, email: user.email }).limit(1))[0];
		const post = (await Post.find({ postID }).limit(1))[0];
		if (unrepost) {
			const postFUCK = await Post.findOne({ repost_id: postID });
			postFUCK?.deleteOne();
			post.reposts.splice(
				post.reposts.findIndex(x => x === m_user.handle),
				1
			);
			if (m_user.coins > 0) {
				m_user.coins += CONSTANTS.COIN_GIVE;
				m_user.save();
			}
			post.save();
			io.emit("post-repost-refresh", postID, post.reposts);
			io.emit("post-deleted", postID, true);
			return res.json({ done: true });
		} else {
			const repost = await Post.create({
				postID: uuid4(),
				op: m_user.handle,
				content: post.content,
				date: post.date,
				edited: post.edited,
				likes: post.likes,
				reposts: post.reposts,
				replies: post.replies,
				replyingTo: post.replyingTo,
				reply_type: post.reply_type,
				repost_type: true,
				repost_op: post.op,
				repost_id: post.postID,
			});
			post.reposts.push(m_user.handle);
			post.save();
			io.emit("post-repost-refresh", postID, post.reposts);

			const receiver = (await User.find({ handle: post.op }).limit(1))[0];
			const url = `${CONSTANTS.FRONTEND_URL}/post/${post.postID}`;
			const notif = `<a href="${url}" class="handle-notif"><div style="background-image: url(${
				m_user?.avatar
			})" class="notifAvatar"></div> @${VerifyBadgeText(m_user as any as UserType)} has reposted your post!</a>`;
			if (getSockets()[receiver!.handle] && receiver.handle != user.handle && receiver.status !== "dnd") {
				getSockets()[receiver!.handle].emit("notification", notif, url);
				receiver!.notifications.push(notif);
			}
			if (post.reposts.length >= 1000) {
				receiver.milestones.push(2);

				const url = `${CONSTANTS.FRONTEND_URL}/profile/${receiver.handle}`;
				const notif = `<a href="${url}" class="handle-notif">Congratulations! You achieved "1K Reposts" Milestone!</a>`;

				if (receiver.handle != user.handle && receiver.status !== "dnd") {
					if (getSockets()[receiver!.handle]) {
						const emit = getSockets()[receiver!.handle].emit(
							"notification",
							notif,
							url
						);
					}
					receiver!.notifications.push(notif);
				}
			}
			receiver!.save();
			m_user.coins += CONSTANTS.COIN_GIVE;
			m_user.save();

			return res.json(repost);
		}
	});
});

app.post("/api/edit-post", async (req: express.Request, res: express.Response) => {
	const { token, postID, content } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });

		const m_user = (await User.find({ handle: user.handle, email: user.email }).limit(1))[0];
		const post = (await Post.find({ postID, op: user.handle }).limit(1))[0];
		if (!m_user || !post) return res.json({ error: true });

		post.content = content;
		post.edited = true;

		post.save();

		res.json({ error: false });
	});
});

app.get("/hash/:password", async (req: express.Request, res: express.Response) => {
	const { password } = req.params;
	const salt = await bcrypt.genSalt(10);
	const hashed = await bcrypt.hash(password, salt);
	return res.send(hashed);
});

app.get("/verify/:hashtt", async (req: express.Request, res: express.Response) => {
	const { hashtt } = req.params;
	const verify = await EmailVerification.findOne({ auth: hashtt });

	if (!verify) return res.redirect(`${CONSTANTS.FRONTEND_URL}`);

	const user = await User.findOneAndUpdate(
		{ handle: verify.for },
		{
			active: true,
		}
	);

	res.send("Success! Your account has been created, you can login now.");
});

app.post("/api/fetch-messages", async (req: express.Request, res: express.Response) => {
	const { token, of } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json([]);

		const m_user = (await User.find({ handle: user.handle }).limit(0))[0];
		const messages = await Message.find({
			$or: [
				{
					channel: `${of}&${m_user.handle}`,
				},
				{
					channel: `${m_user.handle}&${of}`,
				},
			],
		});

		return res.json(messages);
	});
});

app.get("/status/:handle", async (req: express.Request, res: express.Response) => {
	const { handle } = req.params;

	if (getSockets()[handle]) {
		const user = (await User.find({ handle }).limit(1))[0];
		return res.json({ status: user?.status ? user.status : "online" });
	} else return res.json({ status: "offline" });
});

// MODERATOR FIELD
app.post("/mod/ban-user", async (req: express.Request, res: express.Response) => {
	const { token, handle } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });

		const m_user = (await User.find({ handle: user.handle }).limit(1))[0];
		if (m_user.moderator || m_user.owner) {
		} else return res.json({ error: true });
		m_user.coins += CONSTANTS.COIN_GIVE;
		m_user.save();

		const user_ban = await User.findOne({ handle });
		if (!user_ban) return res.json({ error: true });
		if (user_ban.owner) return res.json({ error: true });
		if (user_ban.moderator && !user_ban.owner) return res.json({ error: true });
		const posts = await Post.find({ op: handle });
		posts.forEach(post => post.deleteOne());
		await user_ban.deleteOne();

		sendEmail(
			user_ban.email,
			`Your account (@${user_ban.handle}) has been banned`,
			`Hello @${user_ban?.handle}\nYour account has been banned for violating the rules.`
		);

		return res.json({ error: false });
	});
});

app.post("/mod/delete-post", async (req: express.Request, res: express.Response) => {
	const { token, postID } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });

		const m_user = (await User.find({ handle: user.handle }).limit(1))[0];
		if (m_user.moderator || m_user.owner) {
		} else return res.json({ error: true });
		m_user.coins += CONSTANTS.COIN_GIVE;
		m_user.save();

		const post = await Post.findOne({ postID });
		if (!post) return res.json({ error: true });
		await post?.deleteOne();

		const post_user = await User.findOne({ handle: post?.op });
		if (!post_user) return res.json({ error: true });
		sendEmail(
			post_user.email,
			`Your post ${postID} has been deleted`,
			`Hello @${post_user?.handle}\nYour post ${postID} has been deleted by a moderator: @${m_user.handle}`
		);
		return res.json({ error: false });
	});
});

app.post("/mod/get-reports", async (req: express.Request, res: express.Response) => {
	const { token, offset } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true, reports: [], offset });

		const m_user = (await User.find({ handle: user.handle }).limit(1))[0];
		if (m_user.moderator || m_user.owner) {
		} else return res.json({ error: true, reports: [], offset });
		m_user.coins += CONSTANTS.COIN_GIVE;
		m_user.save();

		const reports = (await Report.find({
			__v: { $gte: 0 },
		})
			.sort({ $natural: -1 })
			.skip(offset)
			.limit(10)) as any[];

		for (const report in reports) {
			reports[report] = {
				user: (await User.find({ handle: reports[report].user }).limit(0))[0],
				postID: reports[report].postID,
			};
		}

		return res.json({ error: false, reports, offset: offset + reports.length - 1 });
	});
});

app.post("/mod/resolve", async (req: express.Request, res: express.Response) => {
	const { token, postID, reporter } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });

		const m_user = (await User.find({ handle: user.handle }).limit(1))[0];
		if (m_user.moderator || m_user.owner) {
		} else return res.json({ error: true });
		m_user.coins += CONSTANTS.COIN_GIVE;
		m_user.save();

		const reports = await Report.find({
			postID,
			user: reporter,
		});
		reports.forEach(report => report.deleteOne());

		const rec = (await User.find({ handle: reporter }).limit(1))[0];

		sendEmail(
			rec.email,
			"Report of post: " + postID,
			`Hello @${rec.handle}!\nYour report of post: ${postID} has been marked as resolved by @${user.handle as string}`
		);

		return res.json({ error: false });
	});
});

app.post("/mod/verify-user", async (req: express.Request, res: express.Response) => {
	const { token, handle } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });

		const m_user = (await User.find({ handle: user.handle }).limit(1))[0];
		if (m_user.moderator || m_user.owner) {
		} else return res.json({ error: true });
		m_user.coins += CONSTANTS.COIN_GIVE;
		m_user.save();

		const verify_user = await User.findOne({ handle });
		if (!verify_user) return res.json({ error: true });
		verify_user.bug_hunter = true;
		verify_user.save();

		sendEmail(
			verify_user.email,
			`Your account (@${verify_user.handle}) has been given a bug hunter verification!`,
			`Hello @${verify_user?.handle}\nYour account has been given a bug hunter verification!`
		);

		return res.json({ error: false });
	});
});
// MODERATOR FIELD

// SETTINGS FIELD

app.post("/settings/delete-user", async (req: express.Request, res: express.Response) => {
	const { token } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });

		const m_user = (await User.find({ handle: user.handle }).limit(1))[0];

		const handle = m_user.handle;
		const user_ban = await User.findOne({ handle });
		if (!user_ban) return res.json({ error: true });
		if (user_ban.owner) return res.json({ error: true });
		if (user_ban.moderator && !user_ban.owner) return res.json({ error: true });
		const posts = await Post.find({ op: handle });
		posts.forEach(post => post.deleteOne());
		await user_ban.deleteOne();

		sendEmail(
			user_ban.email,
			`Your account (@${user_ban.handle}) has been deleted`,
			`Hello @${user_ban?.handle}\nYour account that you requested to be deleted\nhas been deleted.`
		);

		return res.json({ error: false });
	});
});

app.post("/settings/private-user", async (req: express.Request, res: express.Response) => {
	const { token } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });

		const m_user = (await User.find({ handle: user.handle }).limit(1))[0];
		m_user.private = !m_user.private;
		m_user.save();

		return res.json({ error: false });
	});
});

app.post("/settings/change-password", async (req: express.Request, res: express.Response) => {
	const { token, password } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });
		const m_user = (await User.find({ handle: user.handle }).limit(1))[0];
		const ipAddress = req.header("x-forwarded-for") || req.socket.remoteAddress;

		const auth = uuid4();

		if (password.length < 8) return res.json({ error: true });

		const m_auth = await PasswordVerification.create({
			for: m_user.handle,
			auth,
			new_pass: password,
		});

		sendEmail(
			m_user.email,
			"Change Password",
			`Hello @${m_user.handle}!\nYou requested a password change, click on the link below to confirm changes\nIP Address of requester: ${ipAddress}\n\n${CONSTANTS.SERVER_URL}/pass-change/${auth}`
		);

		return res.json({ error: false });
	});
});

app.post("/settings/forgot-pass", async (req: express.Request, res: express.Response) => {
	const { email, password } = req.body;

	const m_user = (await User.find({ email }).limit(1))[0];
	const ipAddress = req.header("x-forwarded-for") || req.socket.remoteAddress;

	const auth = uuid4();
	if (password.length < 8) return res.json({ error: true });

	const m_auth = await PasswordVerification.create({
		for: m_user.handle,
		auth,
		new_pass: password,
	});

	sendEmail(
		m_user.email,
		"Change Password",
		`Hello @${m_user.handle}!\nYou requested a password change, click on the link below to confirm changes\nIP Address of requester: ${ipAddress}\n\n${CONSTANTS.SERVER_URL}/pass-change/${auth}`
	);

	return res.json({ error: false });
});

app.post("/settings/change-email", async (req: express.Request, res: express.Response) => {
	const { token, email } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });
		const m_user = (await User.find({ handle: user.handle }).limit(1))[0];
		const ipAddress = req.header("x-forwarded-for") || req.socket.remoteAddress;

		const auth = uuid4();

		if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
			res.json({
				error: true,
			});
			return;
		}

		const m_auth = await PasswordVerification.create({
			for: m_user.handle,
			auth,
			new_pass: email,
		});

		sendEmail(
			m_user.email,
			"Change E-Mail",
			`Hello @${m_user.handle}!\nYou requested an E-Mail change, click on the link below to confirm changes\nIP Address of requester: ${ipAddress}\n\n${CONSTANTS.SERVER_URL}/email-change/${auth}`
		);

		return res.json({ error: false });
	});
});

app.get("/pass-change/:auth", async (req: express.Request, res: express.Response) => {
	const { auth } = req.params;

	const m_auth = await PasswordVerification.findOne({
		auth,
	});
	if (!m_auth) return res.send("Invalid authentication code!");

	const salt = await bcrypt.genSalt(10);
	const hashed = await bcrypt.hash(m_auth.new_pass, salt);

	const user = await User.findOneAndUpdate(
		{
			handle: m_auth.for,
		},
		{
			password: hashed,
		}
	);

	m_auth.deleteOne();

	res.send("Success! your password has been resetted!");
});

app.get("/email-change/:auth", async (req: express.Request, res: express.Response) => {
	const { auth } = req.params;

	const m_auth = await PasswordVerification.findOne({
		auth,
	});
	if (!m_auth) return res.send("Invalid authentication code!");

	const user = await User.findOneAndUpdate(
		{
			handle: m_auth.for,
		},
		{
			email: m_auth.new_pass,
		}
	);

	m_auth.deleteOne();

	res.send("Success! your email has been resetted!");
});

// SETTINGS FIELD

// CONNECTING ACCOUNTS FIELD
interface SpotifyBearer {
	access_token: string;
	expires_in: string;
	token_type: string;
}
const encodeFormData = (data: any) => {
	return Object.keys(data)
		.map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
		.join("&");
};

app.get("/cipher", async (req: express.Request, res: express.Response) => {
	const encrypt = crypt.encrypt("HELLO!!");
	res.json({ encrypt, dec: crypt.decrypt(encrypt) });
});

app.post("/user/connect-spotify", async (req: express.Request, res: express.Response) => {
	const { code, token } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });

		const m_user = (await User.find({ handle: user.handle }).limit(1))[0];
		let body = {
			grant_type: "authorization_code",
			code: code[1],
			redirect_uri: CONSTANTS.FRONTEND_URL,
			client_id: process.env.SPOTIFY_CLIENT_ID,
			client_secret: process.env.SPOTIFY_CLIENT_SECRET,
		};
		const m_res = await axios.post("https://accounts.spotify.com/api/token", encodeFormData(body), {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization:
					"Basic " +
					Buffer.from(
						process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
					).toString("base64"),
			},
		});
		const encrypted_access = crypt.encrypt(m_res.data.access_token);
		const encrypted_refresh = crypt.encrypt(m_res.data.refresh_token);
		m_user.connected_accounts = {
			spotify: { access_token: encrypted_access, refresh_token: encrypted_refresh },
		};
		console.log(m_res.data);
		m_user.save();

		return res.json({ error: false });
	});
});

interface Tokens {
	[handle: string]: {
		access_token: string;
		refresh_token: string;
	};
}
const spotify_tokens: Tokens = {};

app.get("/refresh-spotify-token/:handle", async (req: express.Request, res: express.Response) => {
	const { handle } = req.params;

	try {
		const user = await User.findOne({ handle });
		if (!user) return res.json({ error: true });
		let body = {
			grant_type: "refresh_token",
			refresh_token: crypt.decrypt(user.connected_accounts!.spotify!.refresh_token),
		};
		const m_res = await axios.post("https://accounts.spotify.com/api/token", encodeFormData(body), {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization:
					"Basic " +
					Buffer.from(
						process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
					).toString("base64"),
			},
		});

		user.connected_accounts!.spotify!.access_token = crypt.encrypt(m_res.data.access_token);
		if (spotify_tokens[user.handle]) {
			spotify_tokens[user.handle] = user.connected_accounts!.spotify!;
		}
		user.save();

		res.json({ error: false });
	} catch (err) {
		res.json({ error: true });
	}
});

app.get("/spotify-status/:handle", async (req: express.Request, res: express.Response) => {
	const { handle } = req.params;

	if (!spotify_tokens[handle]) {
		const user = await User.findOne({ handle });
		if (!user) return res.json({ error: true });
		spotify_tokens[handle] = user.connected_accounts!.spotify!;
	}

	try {
		spotifyAPI.setAccessToken(crypt.decrypt(spotify_tokens[handle].access_token));
		spotifyAPI.setRefreshToken(crypt.decrypt(spotify_tokens[handle].refresh_token));
		const track = await spotifyAPI
			.getMyCurrentPlayingTrack()
			.then(m => {
				res.json(m);
			})
			.catch(async err => {
				const user = (await User.findOne({ handle }))!;

				let body = {
					grant_type: "refresh_token",
					refresh_token: crypt.decrypt(user.connected_accounts!.spotify!.refresh_token),
				};
				const m_res = await axios.post("https://accounts.spotify.com/api/token", encodeFormData(body), {
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization:
							"Basic " +
							Buffer.from(
								process.env.SPOTIFY_CLIENT_ID +
									":" +
									process.env
										.SPOTIFY_CLIENT_SECRET
							).toString("base64"),
					},
				});

				user.connected_accounts!.spotify!.access_token = crypt.encrypt(m_res.data.access_token);
				if (spotify_tokens[user.handle]) {
					spotify_tokens[user.handle] = user.connected_accounts!.spotify!;
				}
				user.save();
				return res.json({});
			});
	} catch (err) {
		res.json({});
	}
});
// CONNECTING ACCOUNTS FIELD

// BOT SECTION
app.post("/bot/make-bot", async (req: express.Request, res: express.Response) => {
	const { token } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, user: any) => {
		if (err) return res.json({ error: true });

		const m_user = (await User.find({ handle: user.handle }).limit(1))[0];
		m_user.bot_account = !m_user.bot_account;
		m_user.save();

		return res.json({ error: false, bot_account: m_user.bot_account });
	});
});
// BOT SECTION

// RPC SECTION

interface RPC {
	largeImage: string;
	smallImage: string;
	title: string;
	description: string;
	time_elapsed: Date;
	time_set: boolean;
}

const rpcs: { [handle: string]: RPC } = {};

app.post("/rpc/set", async (req: express.Request, res: express.Response) => {
	const { apiKey, largeImage, smallImage, title, description, time_elapsed, time_set } = req.body;

	jwt.verify(apiKey, jwt_secret, async (err: any, m: any) => {
		if (err) return res.json({ error: true, rpc: {} });

		rpcs[m.user] = {
			largeImage,
			smallImage,
			title,
			description,
			time_elapsed,
			time_set,
		};

		res.json({ error: false, rpc: rpcs[m.user] });
	});
});

app.post("/rpc/unset", async (req: express.Request, res: express.Response) => {
	const { apiKey } = req.body;

	jwt.verify(apiKey, jwt_secret, async (err: any, m: any) => {
		if (err) return res.json({ error: true });

		delete rpcs[m.user];
		res.json({ error: false });
	});
});

app.get("/rpc/:handle", async (req: express.Request, res: express.Response) => {
	const { handle } = req.params;

	return res.json(
		rpcs[handle]
			? rpcs[handle]
			: {
					largeImage: "",
					smallImage: "",
					title: "",
					description: "",
					time_elapsed: Date.now(),
					time_set: false,
			  }
	);
});

app.post("/auth", async (req: express.Request, res: express.Response) => {
	const { token, appID } = req.body;

	const app = await App.findOne({ id: appID });

	if (!app) return res.json({ error: true });

	jwt.verify(token, jwt_secret, async (err: any, m: any) => {
		if (err) return res.json({ error: true });

		const user = (await User.find({ handle: m.handle }).limit(1))[0];
		if (user.api_key) {
			return res.json({ uri: app.uri, api_key: crypt.decrypt(user.api_key) });
		} else {
			user.api_key = crypt.encrypt(jwt.sign({ user: user.handle }, jwt_secret));
			user.save();
			return res.json({ uri: app.uri, api_key: crypt.decrypt(user.api_key) });
		}
	});
});

app.post("/app/create", async (req: express.Request, res: express.Response) => {
	const { token, uri, name } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, m: any) => {
		if (err) return res.json({ error: true });

		const app = await App.create({
			id: uuid4(),
			uri,
			name,
			by: m.handle,
		});
		return res.json({ app, error: false });
	});
});

app.post("/app/get", async (req: express.Request, res: express.Response) => {
	const { token } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, m: any) => {
		if (err) return res.json({ error: true });
		const apps = await App.find({
			by: m.handle,
		});
		return res.json({ apps, error: false });
	});
});

app.post("/app/edit", async (req: express.Request, res: express.Response) => {
	const { token, id, uri, name } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, m: any) => {
		if (err) return res.json({ error: true });

		const app = await App.findOneAndUpdate(
			{
				by: m.handle,
				id,
			},
			{
				uri,
				name,
			}
		);
		return res.json({ app, error: false });
	});
});

app.post("/app/delete", async (req: express.Request, res: express.Response) => {
	const { token, id, uri, name } = req.body;

	jwt.verify(token, jwt_secret, async (err: any, m: any) => {
		if (err) return res.json({ error: true });

		const app = await App.findOne({
			by: m.handle,
			id,
		});
		app?.deleteOne();
		return res.json({ app, error: false });
	});
});

// RPC SECTION

// ACTIVITY SHOP SECTION

app.get("/activity-items", async (req: express.Request, res: express.Response) => {
	res.json(activityItems);
});

app.post("/buy-avatar-frame", async (req: express.Request, res: express.Response) => {
	const { token, name } = req.body;
	const item = activityItems[activityItems.findIndex(x => x.name === name)];

	if (!item) return res.json({ error: true });

	jwt.verify(token, jwt_secret, async (err: any, m: any) => {
		if (err) return res.json({ error: true });

		const user = (await User.find({ handle: m.handle }))[0];

		if (user.coins >= item.price) {
			if (!user.cosmetic) {
				user.cosmetic = {
					avatar_shape: item.style,
					avatar_frame: "",
					custom_emojis: [],
				};
			} else {
				user.cosmetic.avatar_shape = item.style;
			}

			user.coins -= item.price;
			user.save();
		} else {
			return res.json({ msg: "You do not have enough coins to buy this item! Be more active on Beezle to get more coins!" });
		}

		return res.json({ msg: 'Avatar frame "' + item.name + '" Successfully bought!' });
	});
});

// ACTIVITY SHOP SECTION
