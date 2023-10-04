import { BeezleClient, PostBoxType } from "beezle.js";

async function init() {
	const client = new BeezleClient(
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoYW5kbGUiOiJib3QiLCJlbWFpbCI6ImFsbWFyYTc3QG1haWwucnUiLCJpYXQiOjE2OTE3NTI1NjN9.7TGQ0Ky1GT7JXIBRph7bF7UXjl4BIXBZq07IMuZt0KE"
	);
	await client.setUser();

	client.onPost("post", (_post: PostBoxType | string) => {
		console.log(_post);
		const post = _post as PostBoxType;

		switch (post.data.content) {
			case "!help":
				client.reply(post.data.postID, `!ping - responds with pong`);
				break;
			case "!ping":
				client.reply(post.data.postID, "Pong!");
		}
	});
}
