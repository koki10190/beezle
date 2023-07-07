import { useEffect, useRef, useState, UIEvent } from "react";
import "./Post.css";
import UserType from "../../interfaces/UserType";
import GetUserData from "../../api/GetUserData";
import PostBox from "./PostBox";
import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react";
import VerifyBadge from "../../functions/VerifyBadge";
import CutLong from "../../functions/CutLong";
import axios from "axios";
import { PostType, PostBoxType } from "../../interfaces/PostType";
import GetOtherUser from "../../api/GetOtherUser";
import socket from "../../io/socket";
import uuid4 from "uuid4";
import { api_url } from "../../constants/ApiURL";

function Post() {
	let user: UserType;
	const avatar = useRef<HTMLDivElement>(null);
	const username = useRef<HTMLParagraphElement>(null);
	const handle = useRef<HTMLParagraphElement>(null);
	const post = useRef<HTMLTextAreaElement>(null);
	const emojiPicker = useRef<HTMLDivElement>(null);

	const [isEmojiPickerShown, setEmojiShown] = useState(false);
	const [posts, setPosts] = useState([] as PostBoxType[]);
	const [showPosts, setShowPosts] = useState(false);
	const [postsOffset, setPostsOffset] = useState(0);

	let postCheck = 0;
	socket.on("post", async (post: PostBoxType) => {
		if (postCheck > 0) {
			if (postCheck >= 4) postCheck = 0;
		}
		posts.unshift(post);
		setPosts([...posts]);
		postCheck++;
	});
	let postLikesCheck = 0;
	socket.connect();
	socket.on("post-like-refresh", async (postId: string, liked: string[]) => {
		if (postLikesCheck > 0) {
			if (postLikesCheck >= 4) postLikesCheck = 0;
		}
		const post = posts.findIndex(m_post => m_post.data.postID == postId);
		if (post < 0) return;
		posts[post].data.likes = liked;
		setPosts([...posts]);
		postLikesCheck++;
	});

	useEffect(() => {
		(async () => {
			user = (await GetUserData()).user;
			setShowPosts(true);
			localStorage.setItem("handle", user.handle);

			avatar.current!.style.backgroundImage = `url("${user.avatar}")`;
			username.current!.innerText = user.displayName;
			handle.current!.innerText = "@" + user.handle;

			post.current!.innerText = "";

			VerifyBadge(username.current!, user);
			CutLong(user.displayName, 10);

			axios.get(
				`${api_url}/api/explore-posts/${postsOffset}`
			).then(async res => {
				setPosts(
					res.data
						.posts as PostBoxType[]
				);

				setPostsOffset(res.data.latestIndex);
			});
		})();
	}, []);

	const redirectToUserProfile = () => {
		console.log(user);
		window.location.href = ("/profile/" +
			localStorage.getItem("handle")) as string;
	};

	const addEmoji = (emoji: EmojiClickData) => {
		post.current!.value += emoji.emoji;
	};

	const showEmojiPicker = () => setEmojiShown(!isEmojiPickerShown);

	const makePost = () => {
		if (post.current!.value == "") return;

		axios.post(`${api_url}/api/post`, {
			token: localStorage.getItem("auth_token")!,
			content: post.current!.value,
		}).then(res => {
			post.current!.value = "";
		});
	};

	const detectScrolling = (event: UIEvent<HTMLDivElement>) => {
		const element = event.target! as HTMLDivElement;
		if (
			element.scrollHeight - element.scrollTop ===
			element.clientHeight
		) {
			axios.get(
				`${api_url}/api/explore-posts/${
					postsOffset + 1
				}`
			).then(async res => {
				setPosts(
					posts.concat(
						res.data
							.posts as PostBoxType[]
					)
				);

				setPostsOffset(res.data.latestIndex);
				console.log(
					`Offset: ${res.data.latestIndex}`
				);
			});
		}
	};

	return (
		<div
			className="navigation-panel main-panel make-post"
			onScroll={detectScrolling}
		>
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
					<button
						onClick={
							makePost
						}
					>
						Post
					</button>
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
							emojiStyle={
								EmojiStyle.TWITTER
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
			{showPosts
				? posts.map(item => (
						<PostBox
							key={
								item
									.data
									.postID
							}
							postId={
								item
									.data
									.postID
							}
							name={
								item
									.op
									.displayName
							}
							handle={
								item
									.op
									.handle
							}
							avatarURL={
								item
									.op
									.avatar
							}
							content={
								item
									.data
									.content
							}
							likes={
								item
									.data
									.likes
							}
							reposts={
								item
									.data
									.reposts
							}
							replies={
								item
									.data
									.replies
							}
							tokenUser={
								user
							}
						/>
				  ))
				: ""}
		</div>
	);
}

export default Post;
