# Beezle.JS

Beezle.JS Is an API wrapper for a website called "Beezle" \
You can create bots using Beezle.JS

# Examples

## Project Setup

```js
const { BeezleClient } = require("beezle.js");

async function init() {
	const client = new BeezleClient("TOKEN", "CURRENT_NGROK_URL");
	await client.setUser();

	client.post("Hello, World!");
}
init();
```

## Listening to posts

```js
const { BeezleClient } = require("beezle.js");

async function init() {
	const client = new BeezleClient("TOKEN");
	await client.setUser();

	client.onPost("post", post => {
		client.reply(post.data.postID, "Hello " + post.op.displayName);
	});
}
init();
```

## Listening to post delete

```js
const { BeezleClient } = require("beezle.js");

async function init() {
	const client = new BeezleClient("TOKEN");
	await client.setUser();

	// postID is a string
	client.onPost("delete-post", postID => {
		client.post(postID + " has been deleted");
	});
}
init();
```

## Uploading files

```js
const { BeezleClient } = require("beezle.js");

async function init() {
	const client = new BeezleClient("TOKEN");
	await client.setUser();

	// postID is a string
	const file = await client.uploadMedia("image.png");
	client.post(file);
}
init();
```
