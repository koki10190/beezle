import UserType from "../interfaces/UserType";
import { BadgeType } from "./VerifyBadgeBool";

const getBadgeType = (user: UserType): BadgeType[] => {
	const badges: BadgeType[] = [];
	if (user.private) badges.push(BadgeType.PRIVATE);
	if (user.owner) badges.push(BadgeType.OWNER);
	if (user.moderator) badges.push(BadgeType.MODERATOR);
	if (user.kofi) badges.push(BadgeType.KOFI);
	if (user.bug_hunter) badges.push(BadgeType.BUG_HUNTER);
	if (user.supporter) badges.push(BadgeType.SUPPORTER);
	if (user.verified) badges.push(BadgeType.VERIFIED);
	if (user.bot_account) badges.push(BadgeType.BOT);

	return badges;
};

export default getBadgeType;
