import UserType from "../interfaces/UserType";

enum BadgeType {
	OWNER = 0,
	MODERATOR = 1,
	VERIFIED = 2,
	NONE = 3,
	PRIVATE = 4,
	BUG_HUNTER = 5,
	SUPPORTER = 6,
}

function VerifyBadgeBool(element: HTMLElement, displayName: string, badgeType: BadgeType) {
	element.textContent = displayName;

	switch (badgeType) {
		case BadgeType.PRIVATE:
			element.innerHTML += ` <i alt="Owner of the account" style="color: yellow" class="fa-solid fa-lock"></i>`;
			break;
		case BadgeType.MODERATOR:
			element.innerHTML += ` <i style="color: #00ddff" class="fa-solid fa-shield-check"></i>`;
			break;
		case BadgeType.BUG_HUNTER:
			element.innerHTML += ` <i style="color: #ff52d7" class="fa-solid fa-screwdriver-wrench"></i>`;
			break;
		case BadgeType.SUPPORTER:
			element.innerHTML += ` <i style="color: yellow" class="fa-duotone fa-honey-pot"></i>`;
			break;
		case BadgeType.OWNER:
			element.innerHTML += ` <i style="color: lime" class="fa-solid fa-gear-complex-code"></i>`;
			break;
		case BadgeType.VERIFIED:
			element.innerHTML += ` <i style="color: yellow" class="fa-solid fa-badge-check"></i>`;
			break;
		default:
			break;
	}
}

export { VerifyBadgeBool, BadgeType };
