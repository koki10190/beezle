const { BeezleClient } = require("beezle.js");
const client = new BeezleClient("");

async function init() {
	await client.setUser();
	client.onPost("post", post => {
		if (post.data.content.includes("!ping")) {
			client.reply(post.data.postID, "Pong!");
		}
	});
}
init();
