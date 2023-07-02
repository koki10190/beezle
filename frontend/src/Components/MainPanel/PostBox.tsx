import { useEffect, useRef, useState } from "react";
import UserType from "../../interfaces/UserType";
import GetUserData from "../../api/GetUserData";
import GetOtherUser from "../../api/GetOtherUser";
import VerifyBadge from "../../functions/VerifyBadge";
import FlipNumbers from "react-flip-numbers";
import socket from "../../io/socket";
import axios from "axios";

interface PostBoxInterface {
	name: string;
	handle: string;
	avatarURL: string;
	content: string;
	likes: string[];
	reposts: string[];
	replies: string[];
	postId: string;
	tokenUser: UserType;
}

function PostBox({
	name,
	postId,
	handle,
	avatarURL,
	content,
	likes,
	reposts,
	replies,
	tokenUser,
}: PostBoxInterface) {
	let user: UserType;
	const username = useRef<HTMLParagraphElement>(null);
	const html_likes = useRef<HTMLDivElement>(null);
	const html_reposts = useRef<HTMLDivElement>(null);
	const html_replies = useRef<HTMLDivElement>(null);
	const [isLiked, setLiked] = useState(false);
	useEffect(() => {
		(async () => {
			user = (await GetOtherUser(handle)).user;

			const me = await (await GetUserData()).user;
			VerifyBadge(username.current!, user);

			if (likes.find(x => x === me.handle)) {
				html_likes.current!.style.color =
					"#ff4281";
				setLiked(true);
			} else {
				html_likes.current!.style.color =
					"rgba(255, 255, 255, 0.377);";
			}
		})();
	}, []);

	const likePost = () => {
		if (isLiked) return;
		axios.post("http://localhost:3000/api/like-post", {
			token: localStorage.getItem("auth_token") as string,
			postId,
		});
	};

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
					<div ref={html_replies}>
						<i className="fa-solid fa-comment"></i>{" "}
						<span>
							{
								replies.length
							}
						</span>
					</div>
					<div ref={html_reposts}>
						<i className="fa-solid fa-repeat"></i>{" "}
						<span>
							{
								reposts.length
							}
						</span>
					</div>
					<div
						ref={
							html_likes
						}
						onClick={
							likePost
						}
					>
						<i className="fa-solid fa-heart"></i>{" "}
						<span>
							{
								likes.length
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
