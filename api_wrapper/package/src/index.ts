import axios from "axios";
import io from "socket.io-client";
import FormData from "form-data";
import fs from "fs";
const socket = io("https://722b-95-83-232-242.ngrok-free.app ");

interface UserType {
	handle: string;
	displayName: string;
	email: string;
	password: string;
	private: boolean;
	bio: string;
	avatar: string;
	banner: string;
	verified: boolean;
	bug_hunter: boolean;
	supporter: boolean;
	moderator: boolean;
	owner: boolean;
	pinned_post: string;
	followers: string[];
	following: string[];
	bookmarks: string[];
	notifications: string[];
	milestones: number[];
	status: string;
	bot_account: boolean;
	connected_accounts: {
		spotify: {
			access_token: string;
			refresh_token: string;
		};
	};
}

interface PostType {
	postID: string;
	content: string;
	date: Date;
	edited: {
		type: Boolean;
		required: true;
		default: false;
	};
	private_post: boolean;
	op: string;
	likes: string[];
	reposts: string[];
	reply_type: boolean;
	replyingTo: string;
	replies: number;
	repost_type: boolean;
	repost_op: string;
	repost_id: string;
}

interface PostBoxType {
	data: PostType;
	op: UserType;
}

type File = string;

class BeezleClient {
	user: UserType;
	token: string;
	#server_url = "";
	constructor(token: string, server_url: string) {
		this.token = token;
		this.user = {} as any;
		this.#server_url = server_url;
	}

	async setUser() {
		socket.connect();
		const res = await axios.post(`${this.#server_url}/api/verify-token`, {
			token: this.token,
		});

		if (res.data.error) throw new Error("Error: Invalid Token");
		this.user = res.data.user as UserType;

		if (!this.user.bot_account) throw new Error("Error: The account isn't a Bot Account! using user accounts for API is not allowed!");
	}

	async uploadMedia(file: string): Promise<File> {
		const formData = new FormData();
		const buffer = fs.createReadStream(file);
		formData.append("file", buffer);
		formData.append("ext", file.split(".")[file.split(".").length - 1]);
		formData.append("token", this.token);

		const res = await axios.post(`${this.#server_url}/api/upload-file`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		buffer.close();

		return res.data.img;
	}

	async post(content: string, ...args: string[]): Promise<PostBox 
rep={item.op.reputation}Type> {
		const res = await axios.post(`${this.#server_url}/api/post`, {
			token: this.token,
			content: (content += args.join(" ")),
		});

		return res.data;
	}

	async reply(postID: string, content: string, ...args: string[]): Promise<PostBox 
rep={item.op.reputation}Type> {
		const res = await axios.post(`${this.#server_url}/api/post`, {
			token: this.token,
			content: (content += args.join(" ")),
			replyingTo: postID,
			reply_type: true,
		});

		return res.data;
	}

	async editPost(content: string, postID: string, ...args: string[]): Promise<PostBox 
rep={item.op.reputation}Type> {
		const res = await axios.post(`${this.#server_url}/api/post`, {
			token: this.token,
			postID,
			content: (content += args.join(" ")),
		});

		return res.data;
	}

	async deletePost(postID: string) {
		const res = await axios.post(`${this.#server_url}/api/delete-post`, {
			token: this.token,
			postID,
		});
	}

	async repost(postID: string, unrepost: boolean = false) {
		const res = await axios.post(`${this.#server_url}/api/repost`, {
			token: this.token,
			postID,
			unrepost,
		});
	}

	async like(postID: string, unlike: boolean = false) {
		const res = await axios.post(`${this.#server_url}/api/like-post`, {
			token: this.token,
			postID,
			unlike,
		});
	}

	async follow(handle: string, unfollow: boolean = false) {
		const res = await axios.post(`${this.#server_url}/api/follow`, {
			token: this.token,
			toFollow: handle,
			unfollow,
		});
	}

	async getPost(postID: string): Promise<PostBox 
rep={item.op.reputation}Type> {
		const res = await axios.post(`${this.#server_url}/api/get-post/${postID}`, {
			token: this.token,
		});

		return res.data;
	}

	async searchPost(toSearch: string): Promise<PostBox 
rep={item.op.reputation}Type[]> {
		const res = await axios.post(`${this.#server_url}/api/search`, {
			token: this.token,
			toSearch,
		});

		return res.data;
	}

	async getExplorePosts(query_offset: number): Promise<ExplorePosts> {
		const res = await axios.post(`${this.#server_url}/api/get-explore-posts/${query_offset}`, {
			token: this.token,
		});

		return res.data;
	}

	async getReplies(postID: string, query_offset: number): Promise<ReplyPosts> {
		const res = await axios.get(`${this.#server_url}/api/get-replies/${postID}/${query_offset}`);
		return res.data;
	}

	async onPost(event: "post" | "delete-post", callback: (post: PostBoxType | string) => void) {
		switch (event) {
			case "post":
				socket.on("post", post => {
					callback(post as PostBoxType);
				});
				break;
			case "delete-post":
				socket.on("post-deleted", deletePost => {
					callback(deletePost as string);
				});
		}
	}

	async onPostInteraction(event: "post-like" | "post-repost", callback: (postID: string, interactions: string[]) => void) {
		switch (event) {
			case "post-like":
				socket.on("post-like-refresh", (postID: string, likes: string[]) => callback(postID, likes));
				break;
			case "post-repost":
				socket.on("post-repost-refresh", (postID: string, reposts: string[]) => callback(postID, reposts));
				break;
		}
	}

	async dm(handle: string, content: string, ...args: string[]) {
		const from = this.user.handle;
		const to = handle;
		const msg: MessageType = {
			handle: from,
			avatar: this.user.avatar,
			name: this.user.displayName,
			content: (content += args.join(" ")),
			me: false,
		};
		socket.emit("message", from, to, msg);
	}

	async onMessage(callback: (from: string, to: string, message: MessageType) => void) {
		socket.on("get-message", (from: string, to: string, msg: MessageType) => {
			callback(from, to, msg);
		});
	}
}

interface ReplyPosts {
	posts: PostBoxType[];
	offset: number;
}

interface ExplorePosts {
	posts: PostBoxType[];
	latestIndex: number;
}

interface MessageType {
	handle: string;
	avatar: string;
	name: string;
	content: string;
	me: boolean;
}

export { BeezleClient, PostBoxType, PostType, ExplorePosts, ReplyPosts, MessageType };
