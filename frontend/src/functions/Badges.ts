interface Badges {
	[key: string]: string;
}
const badges: Badges = {
	private: ` <i title="Private Account" style="color: yellow" class="fa-solid fa-lock"></i>`,
	owner: ` <i title="Owner of this website" style="color: lime" class="fa-solid fa-gear-complex-code"></i>`,
	moderator: ` <i title="Moderator" style="color: #00ddff" class="fa-solid fa-shield-check"></i>`,
	bug_hunter: ` <i title="Bug Hunter (active)" style="color: #ff52d7" class="fa-solid fa-screwdriver-wrench"></i>`,
	supporter: ` <i title="Server Booster (thank you ❤️)" style="color: yellow" class="fa-duotone fa-honey-pot"></i>`,
	verified: ` <i title="Verified User" style="color: yellow" class="fa-solid fa-badge-check"></i>`,
	bot: ` <i title="BOT Account" style="color: yellow" class="fa-solid fa-message-bot"></i>`,
	kofi: ` <i title="Ko-fi Donator (thank you ❤️)" style="color: #ff6363" class="fa-solid fa-mug-hot"></i>`,
};
export default badges;
