import UserType from "../interfaces/UserType";
import badges from "./Badges";

function VerifyBadgeText(user: UserType): string {
	if (!user.displayName) return "";
	let ret = user.displayName.replace(/(.{16})..+/, "$1…");

	if (user.owner) ret += badges.owner;
	if (user.moderator) ret += badges.moderator;
	if (user.kofi) ret += badges.kofi;
	if (user.supporter) ret += badges.supporter;
	if (user.bug_hunter) ret += badges.bug_hunter;
	if (user.verified) ret += badges.verified;
	if (user.bot_account) ret += badges.bot;
	if (user.private) ret += badges.private;

	return ret;
}

export default VerifyBadgeText;
