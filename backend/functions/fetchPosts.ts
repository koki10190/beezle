import { PostBoxType, PostType } from "../interfaces/PostType";
import Post from "../models/Post";
import GetUserByHandle from "../searches/GetUserByHandle";

async function fetchGlobalPosts(
	offset: number
): Promise<{ data: PostBoxType[]; latestIndex: number }> {
	const posts = (await Post.find({
		__v: { $gte: 0 },
	})
		.sort({ $natural: -1 })
		.skip(offset)
		.limit(10)) as any[];
	for (let i = 0; i < posts.length; i++) {
		posts[i] = {
			data: posts[i],
			op: await GetUserByHandle(posts[i].op),
		};
	}

	return { data: posts, latestIndex: offset + posts.length - 1 };
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
