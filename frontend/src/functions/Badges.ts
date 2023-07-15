interface Badges {
	[key: string]: string;
}
const badges: Badges = {
	private: ` <i style="color: yellow" class="fa-solid fa-lock"></i>`,
	owner: ` <i style="color: lime" class="fa-solid fa-gear-complex-code"></i>`,
	moderator: ` <i style="color: #00ddff" class="fa-solid fa-shield-check"></i>`,
	bug_hunter: ` <i style="color: #ff52d7" class="fa-solid fa-screwdriver-wrench"></i>`,
	supporter: ` <i style="color: yellow" class="fa-duotone fa-honey-pot"></i>`,
	verified: ` <i style="color: yellow" class="fa-solid fa-badge-check"></i>`,
	bot: ` <i style="color: yellow" class="fa-solid fa-message-bot"></i>`,
};
export default badges;
