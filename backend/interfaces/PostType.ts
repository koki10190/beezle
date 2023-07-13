import UserType from "./UserType";

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

export type { PostType, PostBoxType };
