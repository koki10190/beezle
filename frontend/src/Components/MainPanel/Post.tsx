import { useEffect, useRef, useState } from "react";
import "./Post.css";
import UserType from "../../interfaces/UserType";
import GetUserData from "../../api/GetUserData";
import PostBox from "./PostBox";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import VerifyBadge from "../../functions/VerifyBadge";
import CutLong from "../../functions/CutLong";

function Post() {
	let user: UserType;
	const avatar = useRef<HTMLDivElement>(null);
	const username = useRef<HTMLParagraphElement>(null);
	const handle = useRef<HTMLParagraphElement>(null);
	const post = useRef<HTMLTextAreaElement>(null);
	const emojiPicker = useRef<HTMLDivElement>(null);

	const [isEmojiPickerShown, setEmojiShown] = useState(false);

	useEffect(() => {
		(async () => {
			user = (await GetUserData()).user;

			avatar.current!.style.backgroundImage = `url("${user.avatar}")`;
			username.current!.innerText = user.displayName;
			handle.current!.innerText = "@" + user.handle;

			post.current!.innerText = "";

			VerifyBadge(username.current!, user);
			CutLong(user.displayName, 10);
		})();
	}, []);

	const redirectToUserProfile = () => {
		window.location.href = "/profile/" + user.handle;
	};

	const addEmoji = (emoji: EmojiClickData) => {
		post.current!.value += emoji.emoji;
	};

	const showEmojiPicker = () => setEmojiShown(!isEmojiPickerShown);

	return (
		<div className="navigation-panel main-panel make-post">
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
			<div className="post-text-box">
				<textarea
					ref={post}
					placeholder="Lorem ipsum dolor sit amet."
					className="post-textarea"
				></textarea>
				<div className="post-text-buttons">
					<a
						onClick={
							showEmojiPicker
						}
					>
						<i className="fa-solid fa-face-awesome"></i>
					</a>
					<button>Post</button>
				</div>
				{isEmojiPickerShown ? (
					<div
						className="emoji-picker-post"
						ref={
							emojiPicker
						}
					>
						<EmojiPicker
							onEmojiClick={
								addEmoji
							}
							theme={
								Theme.DARK
							}
						/>
					</div>
				) : (
					<div></div>
				)}
			</div>
			<hr
				style={{ boxSizing: "content-box" }}
				className="small-bar"
			/>
			<PostBox
				name="koki"
				handle="koki"
				avatarURL=""
				content="hello, world!"
				likes={0}
				reposts={0}
				replies={0}
			/>
		</div>
	);
}

export default Post;
