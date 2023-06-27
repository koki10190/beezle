import express from "express";
const app = express();
app.listen(process.env.PORT, () => console.log("[VAULTS] Listening to port " + process.env.PORT));

app.get("/", (req: express.Request, res: express.Response) => {
	res.send("Hello, World!");
});
