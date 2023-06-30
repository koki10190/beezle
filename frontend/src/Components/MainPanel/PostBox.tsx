import { useEffect, useRef } from "react";
import UserType from "../../interfaces/UserType";
import GetUserData from "../../api/GetUserData";
import GetOtherUser from "../../api/GetOtherUser";
import VerifyBadge from "../../functions/VerifyBadge";
import FlipNumbers from "react-flip-numbers";

interface PostBoxInterface {
	name: string;
	handle: string;
	avatarURL: string;
	content: string;
	likes: number;
	reposts: number;
	replies: number;
}

function PostBox({ name, handle, avatarURL, content, likes, reposts, replies }: PostBoxInterface) {
	let user: UserType;
	const username = useRef<HTMLParagraphElement>(null);
	useEffect(() => {
		(async () => {
			user = (await GetOtherUser(handle)).user;
			VerifyBadge(username.current!, user);
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
				<div className="buttons">
					<div>
						<i className="fa-solid fa-comment"></i>{" "}
						<span>
							{
								replies
							}
						</span>
					</div>
					<div>
						<i className="fa-solid fa-repeat"></i>{" "}
						<span>
							{
								reposts
							}
						</span>
					</div>
					<div>
						<i className="fa-solid fa-heart"></i>{" "}
						<span>
							{
								likes
							}
						</span>
					</div>
					<div>
						<i className="fa-solid fa-clipboard"></i>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PostBox;
