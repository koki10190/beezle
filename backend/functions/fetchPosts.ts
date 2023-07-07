import sanitize from "sanitize-html";
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
		posts[i].data.content = sanitize(posts[i].data.content);
	}

	return { data: posts, latestIndex: offset + posts.length - 1 };
}

async function fetchUserPosts(handle: string) {
	const posts = await Post.find({
		op: handle,
	});

	return posts;
}

async function fetchPostsFollowing(
	following_handles: string[],
	offset: number
): Promise<PostType[]> {
	let posts: PostType[] = [];
	for (const follow of following_handles) {
		const m_posts = await Post.find({
			handle: follow,
		})
			.sort({ $natural: -1 })
			.skip(offset)
			.limit(6);
		posts = posts.concat(m_posts as any);
	}

	return posts;
}
async function fetchBookmarks(
	ids: string[],
	offset: number
): Promise<{ bookmarks: PostBoxType[]; offset: number }> {
	const bookmarks = (await Post.find({
		postID: { $in: ids },
	})
		.sort({ $natural: -1 })
		.skip(offset)
		.limit(10)) as any;

	for (let i = 0; i < bookmarks.length; i++) {
		bookmarks[i] = {
			data: bookmarks[i],
			op: await GetUserByHandle(bookmarks[i].op),
		};
	}
	console.log(bookmarks);
	return { bookmarks, offset: offset + bookmarks.length - 1 };
}

export { fetchGlobalPosts, fetchPostsFollowing, fetchUserPosts, fetchBookmarks };
