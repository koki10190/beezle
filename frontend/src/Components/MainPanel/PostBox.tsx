import { useEffect, useRef } from "react";
import UserType from "../../interfaces/UserType";
import GetUserData from "../../api/GetUserData";
import GetOtherUser from "../../api/GetOtherUser";

interface PostBoxInterface {
	name: string;
	handle: string;
	avatarURL: string;
	content: string;
	likes: number;
	reposts: number;
	replies: number;
}

function PostBox({ name, handle, avatarURL, content }: PostBoxInterface) {
	let user: UserType;
	const username = useRef<HTMLParagraphElement>(null);
	useEffect(() => {
		(async () => {
			user = (await GetOtherUser(handle)).user;
			if (user.verified || user.owner)
				username.current!.innerHTML += ` <i style="color: yellow" class="fa-solid fa-badge-check"></i>`;
			if (user.moderator)
				username.current!.innerHTML += ` <i style="color: yellow" class="fa-solid fa-shield-check"></i>`;
		})();
	}, []);

	return (
		<div className="post-box">
			<div className="user-stuff">
				<div
					style={{
						backgroundImage: `url("${avatarURL}")`,
					}}
					className="post-avatar"
				></div>
				<p ref={username} className="post-name">
					{name}
				</p>
				<p className="post-date">@{handle}</p>
				<p className="post-content">
					{content}
				</p>
			</div>
		</div>
	);
}

export default PostBox;
