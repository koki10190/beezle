import UserType from "../interfaces/UserType";
import badges from "./Badges";
import { BadgeType, VerifyBadgeBool } from "./VerifyBadgeBool";

function RepBadge(element: HTMLElement, displayName: string, rep: number, badgeType: BadgeType[]) {
	element.textContent = displayName;

	if(rep < 25) {
		element.innerHTML += ` <i title="Awful Reputation" style="color: red" class="fa-solid fa-biohazard"></i>`
	} else if(rep < 50) {
		element.innerHTML += ` <i title="Bad Reputation" style="color: orange" class="fa-solid fa-circle-radiation"></i>`
	} else if(rep < 75) {
		element.innerHTML += ` <i title="Decent Reputation" style="color: yellow" class="fa-solid fa-circle-exclamation"></i>`
	} else if(rep >= 75) {
		element.innerHTML += ` <i title="Good Reputation" style="color: lime" class="fa-solid fa-hexagon-check"></i>`
	}

	VerifyBadgeBool(element, displayName, badgeType);
}

export { RepBadge };
