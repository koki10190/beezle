import { PostType } from "../interfaces/PostType";
import Post from "../models/Post";

async function fetchGlobalPosts() {
	const posts = await Post.find({
		__v: { $gte: 0 },
	});

	return posts;
}

async function fetchUserPosts(handle: string) {
	const posts = await Post.find({
		op: handle,
	});

	return posts;
}

async function fetchPostsFollowing(following_handles: string[]): Promise<PostType[]> {
	let posts: PostType[] = [];
	for (const follow of following_handles) {
		const m_posts = await Post.find({
			handle: follow,
		});
		posts = posts.concat(m_posts as any);
	}

	return posts;
}

export { fetchGlobalPosts, fetchPostsFollowing, fetchUserPosts };
