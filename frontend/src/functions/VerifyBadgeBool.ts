import UserType from "../interfaces/UserType";
import badges from "./Badges";

enum BadgeType {
	OWNER = 0,
	MODERATOR = 1,
	VERIFIED = 2,
	NONE = 3,
	PRIVATE = 4,
	BUG_HUNTER = 5,
	SUPPORTER = 6,
	BOT = 7,
}

function VerifyBadgeBool(element: HTMLElement, displayName: string, badgeType: BadgeType) {
	element.textContent = displayName;

	switch (badgeType) {
		case BadgeType.PRIVATE:
			element.innerHTML += badges.owner;
			break;
		case BadgeType.MODERATOR:
			element.innerHTML += badges.moderator;
			break;
		case BadgeType.BUG_HUNTER:
			element.innerHTML += badges.bug_hunter;
			break;
		case BadgeType.SUPPORTER:
			element.innerHTML += badges.supporter;
			break;
		case BadgeType.OWNER:
			element.innerHTML += badges.owner;
			break;
		case BadgeType.VERIFIED:
			element.innerHTML += badges.verified;
			break;
		case BadgeType.BOT:
			element.innerHTML += badges.bot;
		default:
			break;
	}
}

export { VerifyBadgeBool, BadgeType };
