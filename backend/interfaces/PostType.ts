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
	replies: string[];
}

export { PostType };
