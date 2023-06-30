interface ReplyType {
	amount: number;
	posts: string;
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
	op: string;
	likes: number;
	reposts: number;
	replies: Array<ReplyType>;
}

export type { PostType, ReplyType };
