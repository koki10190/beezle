import UserType from "../interfaces/UserType";

enum BadgeType {
	OWNER = 0,
	MODERATOR = 1,
	VERIFIED = 2,
	NONE = 3,
}

function VerifyBadgeBool(element: HTMLElement, displayName: string, badgeType: BadgeType) {
	element.textContent = displayName;

	switch (badgeType) {
		case BadgeType.OWNER:
			element.innerHTML += ` <i style="color: lime" class="fa-solid fa-gear-complex-code"></i>`;
			break;
		case BadgeType.MODERATOR:
			element.innerHTML += ` <i style="color: yellow" class="fa-solid fa-shield-check"></i>`;
			break;
		case BadgeType.VERIFIED:
			element.innerHTML += ` <i style="color: yellow" class="fa-solid fa-badge-check"></i>`;
			break;
		default:
			break;
	}
}

export { VerifyBadgeBool, BadgeType };
