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
	op: string;
	likes: string[];
	reposts: string[];
	reply_type: boolean;
	replyingTo: string;
	replies: number;
}

interface PostBoxType {
	data: PostType;
	op: UserType;
}

export type { PostType, PostBoxType };
