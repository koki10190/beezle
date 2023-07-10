import UserType from "./UserType";

interface PostType {
	postID: string;
	content: string;
	date: Date;
	edited: boolean;
	op: string;
	likes: string[];
	reposts: string[];
	replies: number;
	replyingTo: string;
	reply_type: boolean;
	repost_type: boolean;
	repost_op: string;
	repost_id: string;
}

interface PostBoxType {
	data: PostType;
	op: UserType;
}

export type { PostType, PostBoxType };
