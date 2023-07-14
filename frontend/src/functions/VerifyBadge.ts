import UserType from "../interfaces/UserType";

function VerifyBadge(element: HTMLElement, user: UserType) {
	element.textContent = user.displayName;

	if (user.owner) element.innerHTML += ` <i style="color: lime" class="fa-solid fa-gear-complex-code"></i>`;
	else if (user.bug_hunter) element.innerHTML += ` <i style="color: #ff52d7" class="fa-solid fa-screwdriver-wrench"></i>`;
	else if (user.moderator) element.innerHTML += ` <i style="color: #00ddff" class="fa-solid fa-shield-check"></i>`;
	else if (user.verified) element.innerHTML += ` <i style="color: yellow" class="fa-solid fa-badge-check"></i>`;

	if (user.private) element.innerHTML += ` <i style="color: yellow" class="fa-solid fa-lock"></i>`;
}

export default VerifyBadge;
