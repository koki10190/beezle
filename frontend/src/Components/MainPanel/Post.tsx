import { useEffect, useRef } from "react";
import "./Post.css";
import UserType from "../../interfaces/UserType";
import GetUserData from "../../api/GetUserData";
import PostBox from "./PostBox";

function Post() {
	let user: UserType;
	const avatar = useRef<HTMLDivElement>(null);
	const username = useRef<HTMLParagraphElement>(null);
	const handle = useRef<HTMLParagraphElement>(null);

	useEffect(() => {
		(async () => {
			user = (await GetUserData()).user;

			avatar.current!.style.backgroundImage = `url("${user.avatar}")`;
			username.current!.innerText = user.displayName;
			handle.current!.innerText = "@" + user.handle;
		})();
	}, []);

	const redirectToUserProfile = () => {
		window.location.href = "/profile/" + user.handle;
	};

	return (
		<div className="navigation-panel make-post">
			<div
				onClick={redirectToUserProfile}
				className="post-text-user"
			>
				<div
					ref={avatar}
					className="post-text-avatar"
				></div>
				<p
					ref={username}
					className="post-text-name"
				>
					Name
				</p>
				<p
					ref={handle}
					className="post-text-handle"
				>
					@handle
				</p>
			</div>
			<textarea
				placeholder="Lorem ipsum dolor sit amet."
				className="post-textarea"
			></textarea>
			<hr
				style={{ boxSizing: "content-box" }}
				className="small-bar"
			/>
		</div>
	);
}

export default Post;
