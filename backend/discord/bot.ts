import Discord from "discord.js";

const client = new Discord.Client({
	intents: ["GuildMembers", "GuildMessages", "GuildMessageReactions"],
});
client.login(process.env.DISCORD_TOKEN as string);

client.on("ready", () => console.log("[BEEZLE] Connected to Discord"));

export default client;
