import UserType from "../interfaces/UserType";
import { BadgeType } from "./VerifyBadgeBool";

const getBadgeType = (user: UserType): BadgeType => {
	if (user.private) return BadgeType.PRIVATE;
	if (user.owner) return BadgeType.OWNER;
	if (user.moderator) return BadgeType.MODERATOR;
	if (user.bug_hunter) return BadgeType.BUG_HUNTER;
	if (user.supporter) return BadgeType.SUPPORTER;
	if (user.verified) return BadgeType.VERIFIED;
	if (user.bot_account) return BadgeType.BOT;
	else return BadgeType.NONE;
};

export default getBadgeType;
