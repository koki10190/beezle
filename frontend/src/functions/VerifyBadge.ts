import UserType from "../interfaces/UserType";

function VerifyBadge(element: HTMLElement, user: UserType) {
	element.textContent = user.displayName;
	console.log(user);

	if (user.owner)
		element.innerHTML += ` <i style="color: yellow" class="fa-solid fa-crown"></i>`;
	else if (user.verified)
		element.innerHTML += ` <i style="color: yellow" class="fa-solid fa-badge-check"></i>`;
	else if (user.moderator)
		element.innerHTML += ` <i style="color: yellow" class="fa-solid fa-shield-check"></i>`;
}

export default VerifyBadge;