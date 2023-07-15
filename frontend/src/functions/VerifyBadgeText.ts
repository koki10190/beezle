import UserType from "../interfaces/UserType";
import badges from "./Badges";

function VerifyBadgeText(user: UserType): string {
	if (!user.displayName) return "";
	let ret = user.displayName.replace(/(.{16})..+/, "$1…");

	if (user.owner) ret += badges.owner;
	else if (user.moderator) ret += badges.moderator;
	else if (user.bug_hunter) ret += badges.bug_hunter;
	else if (user.supporter) ret += badges.supporter;
	else if (user.verified) ret += badges.verified;
	else if (user.bot_account) ret += badges.bot;

	if (user.private) ret += badges.private;

	return ret;
}

export default VerifyBadgeText;
