import UserType from "../interfaces/UserType";
import badges from "./Badges";

function VerifyBadge(element: HTMLElement, user: UserType) {
	element.textContent = user.displayName;

	if (user.owner) element.innerHTML += badges.owner;
	if (user.moderator) element.innerHTML += badges.moderator;
	if (user.kofi) element.innerHTML += badges.kofi;
	if (user.bug_hunter) element.innerHTML += badges.bug_hunter;
	if (user.supporter) element.innerHTML += badges.supporter;
	if (user.verified) element.innerHTML += badges.verified;
	if (user.bot_account) element.innerHTML += badges.bot;

	if (user.private) element.innerHTML += badges.private;
}

export default VerifyBadge;
