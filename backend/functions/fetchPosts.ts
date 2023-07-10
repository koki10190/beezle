import sanitize from "sanitize-html";
import { PostBoxType, PostType } from "../interfaces/PostType";
import Post from "../models/Post";
import GetUserByHandle from "../searches/GetUserByHandle";
import User from "../models/User";
import UserType from "../interfaces/UserType";

function shuffle(array: any[]) {
	let currentIndex = array.length,
		randomIndex;

	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
}

async function fetchGlobalPosts(offset: number): Promise<{ data: PostBoxType[]; latestIndex: number }> {
	const collection_size = await Post.count({ __v: { $gte: 0 } });
	const m_posts = (await Post.find({
		__v: { $gte: 0 },
	})
		.sort({ $natural: -1 })
		.skip(Math.random() * collection_size)
		.limit(10)) as any[];

	const posts = shuffle(m_posts);

	for (let i = 0; i < posts.length; i++) {
		posts[i] = {
			data: posts[i],
			op: await GetUserByHandle(posts[i].op),
		};
		const count = await Post.count({
			replyingTo: posts[i].data.postID,
		});

		posts[i].data.replies = count;
		posts[i].data.content = sanitize(posts[i].data.content);
	}

	return { data: posts, latestIndex: offset + posts.length - 1 };
}

async function fetchRightNow(offset: number): Promise<{ data: PostBoxType[]; latestIndex: number }> {
	const posts = (await Post.find({
		__v: { $gte: 0 },
		// repost_type: { $ne: true },
		// reply_type: { $ne: true },
	})
		.sort({ $natural: -1 })
		.skip(offset)
		.limit(10)) as any[];
	for (let i = 0; i < posts.length; i++) {
		posts[i] = {
			data: posts[i],
			op: await GetUserByHandle(posts[i].op),
		};
		const count = await Post.count({
			replyingTo: posts[i].data.postID,
		});

		posts[i].data.replies = count;
		posts[i].data.content = sanitize(posts[i].data.content);
	}

	return { data: posts, latestIndex: offset + posts.length - 1 };
}

async function fetchReplies(postID: string, offset: number): Promise<{ data: PostBoxType[]; latestIndex: number }> {
	const posts = (await Post.find({
		__v: { $gte: 0 },
		repost_type: { $ne: true },
		replyingTo: postID,
		reply_type: true,
	})
		.sort({ $natural: -1 })
		.skip(offset)
		.limit(10)) as any[];

	for (let i = 0; i < posts.length; i++) {
		posts[i] = {
			data: posts[i],
			op: await GetUserByHandle(posts[i].op),
		};
		const count = await Post.count({
			replyingTo: posts[i].data.postID,
		});

		posts[i].data.replies = count;
		posts[i].data.content = sanitize(posts[i].data.content);
	}

	return { data: posts, latestIndex: offset + posts.length - 1 };
}

async function fetchUserPosts(handle: string) {
	const posts = (await Post.find({
		op: handle,
		reply_type: { $ne: true },
	})) as any[];

	return posts;
}

async function fetchPostsFollowing(following_handles: string[], offset: number): Promise<PostType[]> {
	let posts: PostType[] = [];
	for (const follow of following_handles) {
		const m_posts = await Post.find({
			handle: follow,
			reply_type: { $ne: true },
		})
			.sort({ $natural: -1 })
			.skip(offset)
			.limit(6);
		posts = posts.concat(m_posts as any);
	}

	return posts;
}
async function fetchBookmarks(ids: string[], offset: number): Promise<{ bookmarks: PostBoxType[]; offset: number }> {
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

		const count = await Post.count({
			replyingTo: bookmarks[i].data.postID,
		});

		bookmarks[i].data.replies = count;
	}
	return { bookmarks, offset: offset + bookmarks.length - 1 };
}

async function fetchPostByID(postID: string): Promise<any> {
	const post = await Post.find({ postID }).limit(1);
	if (post.length <= 0) return;
	const count = await Post.count({
		replyingTo: post[0].postID,
	});

	(post[0] as any).replies = count;
	return {
		data: post[0] as any as PostType,
		op: (await User.find({ handle: post[0].op }).limit(1))[0] as any as UserType,
	};
}

export { fetchRightNow, fetchGlobalPosts, fetchReplies, fetchPostsFollowing, fetchUserPosts, fetchBookmarks, fetchPostByID };
