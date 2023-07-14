import UserType from "../interfaces/UserType";

function VerifyBadgeText(user: UserType): string {
	let ret = user.handle;

	if (user.owner) ret += ` <i style="color: lime" class="fa-solid fa-gear-complex-code"></i>`;
	else if (user.moderator) ret += ` <i style="color: #00ddff" class="fa-solid fa-shield-check"></i>`;
	else if (user.bug_hunter) ret += ` <i style="color: #ff52d7" class="fa-solid fa-screwdriver-wrench"></i>`;
	else if (user.supporter) ret += ` <i style="color: yellow" class="fa-duotone fa-honey-pot"></i>`;
	else if (user.verified) ret += ` <i style="color: yellow" class="fa-solid fa-badge-check"></i>`;

	if (user.private) ret += ` <i style="color: yellow" class="fa-solid fa-lock"></i>`;

	return ret;
}

export { VerifyBadgeText };
