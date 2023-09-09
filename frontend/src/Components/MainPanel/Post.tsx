import { useEffect, useRef, useState, UIEvent } from "react";
import "./Post.css";
import UserType from "../../interfaces/UserType";
import GetUserData from "../../api/GetUserData";
import PostBox from "./PostBox";
import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react";
import VerifyBadge from "../../functions/VerifyBadge";
import CutLong from "../../functions/CutLong";
import axios from "axios";
import { PostBoxType } from "../../interfaces/PostType";
import socket from "../../io/socket";
import { api_url, darkMultiplyer } from "../../constants/ApiURL";
import getBadgeType from "../../functions/getBadgeType";
import { Icons, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import uuid4 from "uuid4";
import { Helmet } from "react-helmet";

function Post({ fetch_method }: { fetch_method: string }) {
	const navigate = useNavigate();
	let user: UserType;
	const [meUser, setMe] = useState<UserType>();
	const avatar = useRef<HTMLDivElement>(null);
	const username = useRef<HTMLParagraphElement>(null);
	const handle = useRef<HTMLParagraphElement>(null);
	const post = useRef<HTMLTextAreaElement>(null);
	const postFile = useRef<HTMLInputElement>(null);
	const emojiPicker = useRef<HTMLDivElement>(null);
	const imageHolder = useRef<HTMLDivElement>(null);

	const [isEmojiPickerShown, setEmojiShown] = useState(false);
	const [posts, setPosts] = useState([] as PostBoxType[]);
	const [showPosts, setShowPosts] = useState(false);
	const [postsOffset, setPostsOffset] = useState(0);
	const [loading, setLoading] = useState(false);
	const [images, setImages] = useState<string[]>([]);

	let postCheck = 0;
	// socket.on("post", async (post: PostBoxType) => {
	// 	if (postCheck > 0) {
	// 		if (postCheck >= 4) postCheck = 0;
	// 	}
	// 	if (post.data.reply_type) return;
	// 	if (posts.find(x => x.data.postID == post.data.postID)) return;
	// 	posts.unshift(post);
	// 	setPosts([...posts]);
	// 	postCheck++;
	// });

	let postDeleteCheck = 0;
	socket.on("post-deleted", async (postId: string, isrepost: boolean) => {
		if (postDeleteCheck > 0) {
			if (postDeleteCheck >= 4) postDeleteCheck = 0;
		}
		if (isrepost) return;
		posts.splice(
			posts.findIndex(x => x.data.postID == postId),
			1
		);
		setPosts([...posts]);
		postDeleteCheck++;
	});

	let postLikesCheck = 0;
	socket.on("post-like-refresh", async (postId: string, liked: string[]) => {
		if (postLikesCheck > 0) {
			if (postLikesCheck >= 4) postLikesCheck = 0;
		}
		const post = posts.findIndex(m_post => m_post.data.postID == postId);
		if (post < 0) return;
		setPosts(prev => {
			prev[post].data.likes = liked;
			return [...prev];
		});
		postLikesCheck++;
	});

	let postRepostCheck = 0;
	socket.on("post-repost-refresh", async (postId: string, reposts: string[]) => {
		if (postRepostCheck > 0) {
			if (postRepostCheck >= 4) postRepostCheck = 0;
		}
		const post = posts.findIndex(m_post => m_post.data.postID == postId);
		if (post < 0) return;
		posts[post].data.reposts = reposts;
		setPosts([...posts]);
		postRepostCheck++;
	});

	function hexToRgb(hex: string) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16),
			  }
			: null;
	}

	useEffect(() => {
		(async () => {
			user = (await GetUserData()).user;
			if (!localStorage.getItem("auth_token")) navigate("/");
			setMe(user);
			socket.emit("get-handle", user.handle);
			setShowPosts(true);
			localStorage.setItem("notifs", JSON.stringify(user.notifications));
			localStorage.setItem("handle", user.handle);
			window.dispatchEvent(new Event("update-notif-counter"));

			avatar.current!.style.backgroundImage = `url("${user.avatar}")`;
			avatar.current!.style.clipPath = user.cosmetic?.avatar_shape;
			username.current!.innerText = user.displayName;
			handle.current!.innerText = "@" + user.handle;

			post.current!.innerText = "";

			VerifyBadge(username.current!, user);
			CutLong(user.displayName, 10);

			axios.post(`${api_url}/api/${fetch_method}/${postsOffset}`, { token: localStorage.getItem("auth_token") }).then(
				async res => {
					console.log(res.data);
					setPosts(res.data.posts);
					setPostsOffset(res.data.latestIndex);
				}
			);
		})();

		postFile.current!.addEventListener("change", async (event: Event) => {
			setLoading(true);
			const fileFormData = new FormData();
			fileFormData.append("file", postFile.current!.files![0]);

			const split = postFile.current!.files![0].name.split(".");
			const ext = split[split.length - 1];
			fileFormData.append("ext", ext);

			fileFormData.append("token", localStorage.getItem("auth_token") as string);

			const res = (
				await axios.post(`${api_url}/api/upload-file`, fileFormData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				})
			).data;

			const img = new Image();
			const nID = uuid4();
			img.onload = () => {
				const element = document.getElementById(nID) as HTMLDivElement;
				if (element) element.style.height = `${img.naturalHeight > 500 ? 500 : img.naturalHeight}px`;
			};
			img.src = res.img;

			if (images.findIndex(x => x === res.img) < 0) {
				setImages(prev => [...prev, res.img]);
			}
			setLoading(false);
		});
	}, []);

	const redirectToUserProfile = () => {
		navigate("/profile/" + localStorage.getItem("handle"));
	};

	const addEmoji = (emoji: EmojiClickData) => {
		post.current!.value += emoji.emoji;
	};

	const showEmojiPicker = () => setEmojiShown(!isEmojiPickerShown);

	const [limiter, setLimiter] = useState(false);

	const makePost = () => {
		if (limiter) return;
		if (user?.bot_account) return;
		if (post.current!.value == "" && images.length < 1) return;
		setLimiter(true);

		setTimeout(() => setLimiter(false), 5000);

		axios.post(`${api_url}/api/post`, {
			token: localStorage.getItem("auth_token")!,
			content: post.current!.value + " " + images.join(" "),
			socketID: socket.id,
		}).then(res => {
			if (res.data.error) return;

			setPosts(prev => [res.data, ...prev]);
			post.current!.value = "";
			setImages([]);
		});
	};

	const pasteContent = async (event: any) => {
		const item = event.clipboardData.items[0];

		if (item.type.indexOf("image") === 0 || item.type.indexOf("video") === 0) {
			setLoading(true);
			event.preventDefault();
			const blob = item.getAsFile();

			const fileFormData = new FormData();
			fileFormData.append("file", blob);

			const split = blob.name.split(".");
			const ext = split[split.length - 1];
			fileFormData.append("ext", ext);

			fileFormData.append("token", localStorage.getItem("auth_token") as string);

			const res = (
				await axios.post(`${api_url}/api/upload-file`, fileFormData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				})
			).data;

			setImages(prev => [...prev, res.img]);
			setLoading(false);
		}
	};

	const detectScrolling = (event: UIEvent<HTMLDivElement>) => {
		const element = event.target! as HTMLDivElement;
		if (element.scrollHeight - element.scrollTop === element.clientHeight) {
			axios.post(`${api_url}/api/${fetch_method}/${postsOffset + 1}`, { token: localStorage.getItem("auth_token") }).then(
				async res => {
					setPosts(posts.concat(res.data.posts as PostBoxType[]));

					setPostsOffset(res.data.latestIndex);
				}
			);
		}
	};

	const uploadImage = async () => {
		postFile.current!.click();
	};

	const refresh = async () => {
		const tst = toast("Refreshing posts", {
			icon: Icons.spinner,
			progressStyle: {
				backgroundColor: "yellow",
			},
			theme: "dark",
			hideProgressBar: true,
		});
		axios.post(`${api_url}/api/${fetch_method}/0`, { token: localStorage.getItem("auth_token") }).then(async res => {
			setPosts(res.data.posts as PostBoxType[]);
			setPostsOffset(res.data.latestIndex);
			toast("Refreshed the posts", {
				icon: Icons.success,
				progressStyle: {
					backgroundColor: "yellow",
				},
				theme: "dark",
			});
			toast.dismiss(tst);
		});
	};

	return (
		<>
			{/* <div className="image-shower"></div> */}
			<Helmet>
				<meta
					property="og:title"
					content="Beezle"
				/>
				<meta
					property="og:type"
					content="website"
				/>
				<meta
					property="og:url"
					content="https://beezle.lol"
				/>
				<meta
					property="og:image"
					content={window.location.host + "/icon2.png"}
				/>
				<meta
					property="og:description"
					content="See posts on Beezle"
				/>
				<meta
					name="theme-color"
					content="#ffd500"
				></meta>
			</Helmet>
			<div
				className="navigation-panel main-panel make-post"
				onScroll={detectScrolling}
			>
				<p
					onClick={refresh}
					className="refresh"
				>
					<i className="fa-solid fa-arrows-rotate"></i> Refresh Posts
				</p>
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
						placeholder="Press here to type your post."
						style={{
							display: loading ? "none" : "block",
						}}
						className="post-textarea"
						onPaste={pasteContent}
					></textarea>
					{loading ? (
						<TailSpin
							wrapperStyle={{
								marginBottom: "50px",
							}}
							height="100"
							width="100"
							color="yellow"
							ariaLabel="loading"
						/>
					) : (
						""
					)}
					<div
						ref={imageHolder}
						className="image-holder"
					>
						{images.map(img => {
							if (
								img.endsWith("png") ||
								img.endsWith("gif") ||
								img.endsWith("webp") ||
								img.endsWith("jpg") ||
								img.endsWith("jpeg")
							) {
								return (
									<div
										className="postImage"
										style={{
											backgroundImage:
												"url(" +
												img +
												")",
										}}
										key={uuid4()}
									>
										{/* <a
									className="download-img"
									onClick={() => {
										setImages([
											...images.splice(
												images.indexOf(
													img
												),
												1
											),
										]);
										console.log(
											images.splice(
												images.indexOf(
													img
												),
												1
											)
										);
									}}
								>
									<i className="fa-solid fa-trash"></i>
								</a> */}
									</div>
								);
							} else if (
								img.endsWith("mp4") ||
								img.endsWith("webm") ||
								img.endsWith("mov")
							) {
								return (
									<video
										className="post-video"
										src={img}
										key={uuid4()}
										controls
									>
										{/* <a
									className="download-img"
									onClick={() => {
										setImages([
											...images.splice(
												images.indexOf(
													img
												),
												1
											),
										]);
										console.log(
											images.splice(
												images.indexOf(
													img
												),
												1
											)
										);
									}}
								>
									<i className="fa-solid fa-trash"></i>
								</a> */}
									</video>
								);
							} else if (
								img.endsWith("ogg") ||
								img.endsWith("mp3") ||
								img.endsWith("wav")
							) {
								return (
									<video
										className="post-audio"
										src={img}
										key={uuid4()}
										controls
									>
										{/* <a
									className="download-img"
									onClick={() => {
										setImages([
											...images.splice(
												images.indexOf(
													img
												),
												1
											),
										]);
										console.log(
											images.splice(
												images.indexOf(
													img
												),
												1
											)
										);
									}}
								>
									<i className="fa-solid fa-trash"></i>
								</a> */}
									</video>
								);
							}
						})}
					</div>

					<div className="post-text-buttons">
						<a onClick={loading ? () => {} : showEmojiPicker}>
							<i className="fa-solid fa-face-awesome"></i>
						</a>
						<a onClick={loading ? () => {} : uploadImage}>
							<i className="fa-solid fa-image"></i>
						</a>
						<input
							accept=".gif,.jpg,.jpeg,.png,.webp,.mp4,.webm,.mov,.mp3,.ogg,.wav"
							style={{
								display: "none",
							}}
							type="file"
							ref={postFile}
						/>
						<button onClick={makePost}>Post</button>
					</div>
					{isEmojiPickerShown ? (
						<div
							className="emoji-picker-post"
							ref={emojiPicker}
						>
							<EmojiPicker
								onEmojiClick={addEmoji}
								theme={Theme.DARK}
								emojiStyle={EmojiStyle.TWITTER}
							/>
						</div>
					) : (
						<div></div>
					)}
				</div>
				<hr
					style={{
						boxSizing: "content-box",
					}}
					className="small-bar"
				/>
				<p
					style={{
						color: "rgba(255,255,255,0.4)",
					}}
				>
					{(() => {
						if (fetch_method === "explore-posts") {
							return "You're viewing Explore page";
						}

						if (fetch_method === "right-now") {
							return "You're viewing Right Now page";
						}

						if (fetch_method === "follow-posts") {
							return "You're viewing Home page";
						}
					})()}
				</p>
				{showPosts
					? posts.map(item => {
							let postColors = {
								color1: "rgb(53, 43, 24)",
								color2: "rgb(53, 43, 24)",
							};
							let rgb = hexToRgb(item.op.gradient.color1);
							if (!rgb) rgb = hexToRgb("#000000");
							const divided = {
								r: rgb!.r / 255,
								g: rgb!.g / 255,
								b: rgb!.b / 255,
							};
							divided.r *= darkMultiplyer;
							divided.g *= darkMultiplyer;
							divided.b *= darkMultiplyer;

							let rgb2 = hexToRgb(item.op.gradient.color2);
							if (!rgb2) rgb2 = hexToRgb("#000000");
							const divided2 = {
								r: rgb2!.r / 255,
								g: rgb2!.g / 255,
								b: rgb2!.b / 255,
							};
							divided2.r *= darkMultiplyer;
							divided2.g *= darkMultiplyer;
							divided2.b *= darkMultiplyer;
							const check = rgb?.r === 0 && rgb?.g === 0 && rgb?.b === 0;
							postColors = {
								color1: check
									? "rgb(53, 43, 24)"
									: `rgb(${divided.r * 255}, ${
											divided.g *
											255
									  }, ${divided.b * 255})`,
								color2: check
									? "rgb(53, 43, 24)"
									: `rgb(${divided2.r * 255}, ${
											divided2.g *
											255
									  }, ${divided2.b * 255})`,
							};

							return (
								<PostBox 
									rep={item.op.reputation}
									activity={item.op.activity}
									avatarShape={
										item.op
											.cosmetic
											.avatar_shape
									}
									edited={item.data.edited}
									repost_type={
										item.data
											.repost_type
									}
									repost_id={
										item.data
											.repost_id
									}
									repost_op={
										item.data
											.repost_op
									}
									badgeType={getBadgeType(
										item.op
									)}
									reply_type={
										item.data
											.reply_type
									}
									replyingTo={
										item.data
											.replyingTo
									}
									key={item.data.postID}
									date={item.data.date}
									postId={item.data.postID}
									name={item.op.displayName}
									handle={item.op.handle}
									avatarURL={item.op.avatar}
									content={item.data.content}
									likes={item.data.likes}
									reposts={item.data.reposts}
									replies={item.data.replies}
									gradient={postColors}
									tokenUser={meUser!}
								/>
							);
					  })
					: ""}
			</div>
		</>
	);
}

export default Post;
