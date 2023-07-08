import UserType from "../interfaces/UserType";

function VerifyBadgeText(user: UserType): string {
	let ret = user.handle;

	if (user.owner) ret += ` <i style="color: lime" class="fa-solid fa-gear-complex-code"></i>`;
	else if (user.moderator) ret += ` <i style="color: yellow" class="fa-solid fa-shield-check"></i>`;
	else if (user.verified) ret += ` <i style="color: yellow" class="fa-solid fa-badge-check"></i>`;

	return ret;
}

export { VerifyBadgeText };
