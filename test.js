const express = require("express");
const cors = require("cors");
const { default: axios } = require("axios");
const app = express();
app.listen(3001);

app.use(
	cors({
		origin: "*",
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
var dapi_key;
var dhandle;
app.post("/beezle-auth", async (req, res) => {
	const { handle, api_key } = req.body;
	dapi_key = api_key;
	dhandle = handle;
});

async function set() {
	const set_rs = await axios.post(`https://304b-95-83-232-242.ngrok-free.app/rpc/set`, {
		apiKey: dapi_key,
		largeImage: "https://cdn.discordapp.com/attachments/1123624150225920060/1129890364027834520/20d5099f823bd07c9edda22ba6b2d369.png",
		smallImage: "https://cdn.discordapp.com/attachments/1123624150225920060/1129890364027834520/20d5099f823bd07c9edda22ba6b2d369.png",
		title: "Test App",
		description: "This is a test app",
		time_elapsed: Date.now(),
		time_set: true,
	});
	// to unset
	const unset_res = await axios.post(`https://304b-95-83-232-242.ngrok-free.app/rpc/unset`, {
		apiKey: dapi_key,
	});
}
