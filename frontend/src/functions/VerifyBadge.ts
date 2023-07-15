import UserType from "../interfaces/UserType";
import badges from "./Badges";

function VerifyBadge(element: HTMLElement, user: UserType) {
	element.textContent = user.displayName;

	if (user.owner) element.innerHTML += badges.owner;
	else if (user.moderator) element.innerHTML += badges.moderator;
	else if (user.bug_hunter) element.innerHTML += badges.bug_hunter;
	else if (user.supporter) element.innerHTML += badges.supporter;
	else if (user.verified) element.innerHTML += badges.verified;
	else if (user.bot_account) element.innerHTML += badges.bot;

	if (user.private) element.innerHTML += badges.private;
}

export default VerifyBadge;
