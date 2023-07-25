import { useEffect, useRef, useState, UIEvent, ChangeEventHandler } from "react";
import GetUserData from "../api/GetUserData";
import NavigationPanel from "../Components/NavigationPanel";
import MainPanel from "../Components/MainPanel";
import InfoPanel from "../Components/InfoPanel";
import UserType from "../interfaces/UserType";
import GetOtherUser from "../api/GetOtherUser";
import { useNavigate, useParams } from "react-router-dom";
import "./HomePostPage.css";
import { PostBoxType, PostType } from "../interfaces/PostType";
import axios from "axios";
import { api_url } from "../constants/ApiURL";
import { VerifyBadgeBool } from "../functions/VerifyBadgeBool";
import VerifyBadgeText from "../functions/VerifyBadgeText";
import moment from "moment";
import displayContent from "../functions/displayContent";
import socket from "../io/socket";
import PostBox from "../Components/MainPanel/PostBox";
import getBadgeType from "../functions/getBadgeType";
import { Icons, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react";
import sanitize from "sanitize-html";
import VerifyBadge from "../functions/VerifyBadge";
import MetaTags from "react-meta-tags";
import StatusCheck from "../functions/StatusCheck";
import uuid4 from "uuid4";
import { TailSpin } from "react-loader-spinner";

function HomePostPage() {
	const navigate = useNavigate();
	const { postID } = useParams();
	const [me, setMe] = useState<UserType>({} as UserType);
	const [user, setUser] = useState<UserType>({} as UserType);
	const [post, setPost] = useState<PostBoxType>({} as PostBoxType);
	const [render, setRender] = useState<boolean>(false);
	const [isLiked, setLiked] = useState<boolean>(false);
	const [replies, setReplies] = useState<PostBoxType[]>([]);
	const emojiPicker = useRef<HTMLDivElement>(null);
	const pageName = useRef<HTMLParagraphElement>(null);
	const [offset, setOffset] = useState<number>(0);
	const [isEmojiPickerShown, setEmojiShown] = useState(false);
	const [replyParent, setReplyParent] = useState<PostBoxType>({} as PostBoxType);
	const [isBookmarked, setBookmarked] = useState<boolean>(false);
	const [isReposted, setReposted] = useState<boolean>(false);
	const [editingPost, setEditing] = useState<boolean>(false);
	const [edit_content, setContent] = useState<string>("");
	const [status, setStatus] = useState<string>("offline");
	const [loading, setLoading] = useState(false);
	const [images, setImages] = useState<string[]>([]);
	const html_likes = useRef<HTMLParagraphElement>(null);
	const html_bookmarks = useRef<HTMLParagraphElement>(null);
	const html_reposts = useRef<HTMLParagraphElement>(null);
	const postFile = useRef<HTMLInputElement>(null);
	const postText = useRef<HTMLTextAreaElement>(null);

	const repost = () => {
		if (user?.bot_account) return;
		if (isReposted) {
			setReposted(false);
			html_reposts.current!.style.color = "rgba(255, 255, 255, 0.377)";

			axios.post(`${api_url}/api/repost`, {
				token: localStorage.getItem("auth_token") as string,
				postID: post.data.postID,
				unrepost: true,
			});
			console.log("uh huh");
		} else {
			setReposted(true);
			html_reposts.current!.style.color = "#66f542";

			axios.post(`${api_url}/api/repost`, {
				token: localStorage.getItem("auth_token") as string,
				postID: post.data.postID,
				unrepost: false,
			});
		}
	};

	let postLikesCheck = 0;
	socket.on("post-like-refresh", async (postId: string, liked: string[]) => {
		if (postLikesCheck > 0) {
			if (postLikesCheck >= 4) postLikesCheck = 0;
		}
		if (postId !== postID) {
			const post = replies.findIndex(m_post => m_post.data.postID == postId);
			if (post < 0) return;
			replies[post].data.likes = liked;
			setReplies([...replies]);
			postLikesCheck++;
		} else if (post) {
			post.data.likes = liked;
			setPost(structuredClone(post));
		}
	});

	let postRepostCheck = 0;
	socket.on("post-repost-refresh", async (postId: string, reposts: string[]) => {
		if (postRepostCheck > 0) {
			if (postRepostCheck >= 4) postRepostCheck = 0;
		}
		if (postId !== postID) {
			const post = replies.findIndex(m_post => m_post.data.postID == postId);
			if (post < 0) return;
			replies[post].data.reposts = reposts;
			setReplies([...replies]);
			postRepostCheck++;
		} else if (post) {
			post.data.reposts = reposts;
			setPost(structuredClone(post));
		}
	});

	// let postCheck = 0;
	// socket.on("post", async (post: PostBoxType) => {
	// 	if (postCheck > 0) {
	// 		if (postCheck >= 4) postCheck = 0;
	// 	}
	// 	if (!post.data.reply_type || post.data.replyingTo !== postID) return;
	// 	if (replies.findIndex(x => x.data.postID === post.data.postID) > -1) return;
	// 	replies.unshift(post);

	// 	setReplies([...replies]);
	// 	postCheck++;
	// });

	let postDeleteCheck = 0;
	socket.on("post-deleted", async (postId: string, isrepost: boolean) => {
		if (postDeleteCheck > 0) {
			if (postDeleteCheck >= 4) postDeleteCheck = 0;
		}
		if (isrepost) return;
		replies.splice(
			replies.findIndex(x => x.data.postID == postId),
			1
		);
		setReplies([...replies]);
		postDeleteCheck++;
	});

	const addEmoji = (emoji: EmojiClickData) => {
		postText.current!.value += emoji.emoji;
	};

	useEffect(() => {
		(async () => {
			let interval: NodeJS.Timer;
			let interval_likes: NodeJS.Timer;
			let interval_bookmarks: NodeJS.Timer;
			const data = await GetUserData();
			if (data.error) {
				navigate("/");
			} else {
				setMe(data.user);
			}

			const post = (
				await axios.post(`${api_url}/api/get-post/${postID}`, {
					token: localStorage.getItem("auth_token"),
				})
			).data as PostBoxType;

			if (post.data.reply_type) {
				setReplyParent(
					(
						await axios.post(`${api_url}/api/get-post/${post.data.replyingTo}`, {
							token: localStorage.getItem("auth_token"),
						})
					).data as PostBoxType
				);
			}

			setPost(post);
			setUser(post.op);
			setRender(true);
			setMe(data.user);

			const replies = (await axios.get(`${api_url}/api/get-replies/${postID}/${offset}`)).data;
			setReplies(replies.data);

			setContent(post.data.content);

			const data_status = (await axios.get(`${api_url}/status/${post.op.handle}`)).data;
			setStatus(data_status.status);

			interval = setInterval(() => {
				if (postFile.current && html_likes.current && html_bookmarks.current && html_reposts.current) {
					postFile.current.addEventListener("change", async (event: Event) => {
						setLoading(true);
						const fileFormData = new FormData();
						console.log(postFile.current!.files![0]);
						fileFormData.append("file", postFile.current!.files![0]);

						const split = postFile.current!.files![0].name.split(".");
						const ext = split[split.length - 1];
						fileFormData.append("ext", ext);

						fileFormData.append("token", localStorage.getItem("auth_token") as string);

						const res = (
							await axios.post(
								`${api_url}/api/upload-file`,
								fileFormData,
								{
									headers: {
										"Content-Type": "multipart/form-data",
									},
								}
							)
						).data;

						// postText.current!.value += res.img;
						setImages(prev => [...prev, res.img]);
						setLoading(false);
					});

					if (post.data.likes.find(x => x === data.user.handle)) {
						setLiked(true);
						html_likes.current!.style.color = "#ff4281";
					} else {
						setLiked(false);
						html_likes.current!.style.color = "rgba(255, 255, 255, 0.377)";
					}

					if (post.data.reposts.find(x => x === data.user.handle)) {
						setLiked(true);
						html_reposts.current!.style.color = "#66f542";
					} else {
						setLiked(false);
						html_reposts.current!.style.color = "rgba(255, 255, 255, 0.377)";
					}

					if (html_bookmarks.current) {
						if (data.user.bookmarks.find(x => x === post.data.postID)) {
							setBookmarked(true);
							html_bookmarks.current!.style.color = "#349beb";
						} else {
							setBookmarked(false);
							html_bookmarks.current!.style.color =
								"rgba(255, 255, 255, 0.377)";
						}
					}

					clearInterval(interval);
				}
			}, 100);
		})();
	}, []);

	const bookmark = () => {
		if (isBookmarked) {
			setBookmarked(false);

			html_bookmarks.current!.style.color = "rgba(255, 255, 255, 0.377)";

			axios.post(`${api_url}/api/bookmark`, {
				token: localStorage.getItem("auth_token") as string,
				postID,
				unbookmark: true,
			});
		} else {
			html_bookmarks.current!.style.color = "#349beb";
			setBookmarked(true);

			axios.post(`${api_url}/api/bookmark`, {
				token: localStorage.getItem("auth_token") as string,
				postID,
				unbookmark: false,
			});
		}
	};

	const likePost = () => {
		if (user?.bot_account) return;
		if (isLiked) {
			setLiked(false);
			html_likes.current!.style.color = "rgba(255, 255, 255, 0.377)";

			axios.post(`${api_url}/api/like-post`, {
				token: localStorage.getItem("auth_token") as string,
				postId: postID,
				unlike: true,
			});
		} else {
			setLiked(true);
			html_likes.current!.style.color = "#ff4281";
			axios.post(`${api_url}/api/like-post`, {
				token: localStorage.getItem("auth_token") as string,
				postId: postID,
				unlike: false,
			});
		}
	};

	const reply = () => {
		if (user?.bot_account) return;
		const content = postText.current!.value;
		if (content === "" && images.length < 1) return;

		axios.post(`${api_url}/api/post`, {
			token: localStorage.getItem("auth_token")!,
			content: content + " " + images.join(" "),
			reply_type: true,
			replyingTo: postID,
			socketID: socket.id,
		}).then(res => {
			postText.current!.value = "";
			replies.unshift(res.data);
			setImages([]);
			setReplies([...replies]);
		});
	};

	const deletePost = async () => {
		axios.post(`${api_url}/api/delete-post`, {
			postId: postID,
			token: localStorage.getItem("auth_token"),
		}).then(res => navigate("/"));
	};

	const detectScrolling = (event: UIEvent<HTMLDivElement>) => {
		const element = event.target! as HTMLDivElement;
		if (element.scrollHeight - element.scrollTop === element.clientHeight) {
			axios.get(`${api_url}/api/get-replies/${postID}/${offset + 1}`).then(async res => {
				let uniquePosts: PostBoxType[] = [];
				res.data.data.forEach((c: PostBoxType) => {
					if (!replies.find(x => x.data.postID === c.data.postID)) {
						uniquePosts.push(c);
					}
				});
				if (uniquePosts.length < 1) return;
				setReplies(replies.concat(uniquePosts));

				setOffset(res.data.offset);
				console.log(`Offset: ${res.data.offset}`);
			});
		}
	};

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

	const report = async () => {
		if (user?.bot_account) return;
		const result = (
			await axios.post(`${api_url}/api/report`, {
				postID,
				token: localStorage.getItem("auth_token"),
			})
		).data;

		if (result.error) {
			toast("An erorr has occured when trying to report the post.", {
				icon: Icons.error,
				theme: "dark",
				progressStyle: {
					backgroundColor: "red",
				},
				position: "top-right",
			});
		} else {
			toast(result.status, {
				icon: Icons.success,
				progressStyle: {
					backgroundColor: "yellow",
				},
				theme: "dark",
			});
		}
	};

	const edit = async () => {
		setEditing(!editingPost);
	};

	const editSave = async () => {
		if (edit_content === "") return;

		const res = await axios.post(`${api_url}/api/edit-post`, {
			token: localStorage.getItem("auth_token"),
			content: edit_content,
			postID,
		});

		window.location.reload();
	};

	const set_content = (event: any) => {
		const target = event.target as HTMLTextAreaElement;

		setContent(target.value);
	};

	const pasteContent = async (event: any) => {
		const item = event.clipboardData.items[0];

		if (item.type.indexOf("image") === 0 || item.type.indexOf("video") === 0) {
			setLoading(true);
			event.preventDefault();
			const blob = item.getAsFile();

			const fileFormData = new FormData();
			console.log(blob);
			fileFormData.append("file", blob);

			const split = blob.name.split(".");
			const ext = split[split.length - 1];
			fileFormData.append("ext", ext);

			fileFormData.append("token", localStorage.getItem("auth_token") as string);

			alert("The file is being uploaded, please wait.");

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

	return (
		<>
			<div className="main-pages">
				<InfoPanel />
				<div
					onScroll={detectScrolling}
					className="navigation-panel main-panel page-panel"
				>
					{render ? (
						<>
							<MetaTags>
								<meta
									name="description"
									content={"Post " + postID}
								/>
								<meta
									property="og:title"
									content="Beezle Post"
								/>
								<meta
									property="og:image"
									content="/icon.png"
								/>
							</MetaTags>
							{post?.data.edited ? (
								<p
									style={{
										marginTop: "-5px",
									}}
									className="page-replying-to"
								>
									<i className="fa-solid fa-pen"></i>{" "}
									Edited{" "}
								</p>
							) : (
								""
							)}
							{post?.data.reply_type ? (
								<p
									onClick={() =>
										window.location.assign(
											"/post/" +
												replyParent
													.data
													.postID
										)
									}
									className="page-replying-to"
								>
									<i
										style={{
											color: "white",
										}}
										className="fa-solid fa-reply"
									></i>{" "}
									Replying to{" "}
									<span
										style={{
											color: "rgba(255,255,255,0.6)",
											wordWrap: "break-word",
										}}
									>
										{replyParent.data.content.replace(
											/(.{40})..+/,
											"$1…"
										)}
									</span>
								</p>
							) : (
								""
							)}

							<div
								style={{ cursor: "pointer" }}
								onClick={() =>
									navigate(
										`/profile/${post.op.handle}`
									)
								}
							>
								<div className="avatar-parent postpage-avatar-parent">
									<div
										style={{
											backgroundImage: `url("${
												post!
													.op
													.avatar
											}")`,
											clipPath:
												post
													.op
													.cosmetic
													?.avatar_shape !==
												""
													? post
															.op
															.cosmetic
															.avatar_shape
													: "circle(50% at 50% 50%)",
										}}
										className="page-avatar"
									></div>
									<div
										className="status"
										style={{
											backgroundColor: StatusCheck(
												status
											),
										}}
									></div>
								</div>
								<p
									dangerouslySetInnerHTML={{
										__html: sanitize(
											VerifyBadgeText(
												user!
											),
											{
												allowedTags: [],
											}
										),
									}}
									ref={pageName}
									className="page-name"
								></p>
								<p className="page-handle">
									@{user?.handle}
								</p>
							</div>
							<p className="page-date">
								{moment(post?.data.date)
									.fromNow(true)
									.replace("minutes", "m")
									.replace(" ", "")
									.replace("hours", "h")
									.replace("afew seconds", "1s")
									.replace("aminute", "1m")
									.replace("ahour", "1h")
									.replace("anhour", "1h")
									.replace("aday", "1d")
									.replace("days", "d")
									.replace("day", "1d")}
							</p>
							{editingPost ? (
								<>
									<textarea
										onChange={
											set_content
										}
										className="post-edit-textarea"
										value={
											edit_content
										}
									></textarea>
									<button
										onClick={
											editSave
										}
										className="post-edit-save"
									>
										Save Changes
									</button>
								</>
							) : (
								<p
									dangerouslySetInnerHTML={{
										__html: displayContent(
											post!
												.data
												.content
										),
									}}
									className="page-content"
								></p>
							)}
							<hr
								style={{
									marginTop: "40px",
								}}
								className="small-bar"
							/>
							<div className="buttons">
								<div
									ref={html_reposts}
									onClick={repost}
								>
									<i className="fa-solid fa-repeat"></i>{" "}
									<span>
										{
											post
												?.data
												.reposts
												.length
										}
									</span>
								</div>
								<div
									ref={html_likes}
									onClick={likePost}
								>
									<i className="fa-solid fa-heart"></i>{" "}
									<span>
										{
											post
												?.data
												.likes
												.length
										}
									</span>
								</div>
								<div
									onClick={bookmark}
									ref={html_bookmarks}
								>
									<i className="fa-solid fa-bookmark"></i>
								</div>

								<div onClick={report}>
									<i className="fa-solid fa-flag"></i>
								</div>

								<div
									onClick={() =>
										navigator.share(
											{
												url: window
													.location
													.href,
												text: "Look at this post on beezle!",
											}
										)
									}
								>
									<i className="fa-solid fa-share"></i>
								</div>

								{localStorage.getItem("handle") ===
								post?.op.handle ? (
									<>
										<div
											onClick={
												edit
											}
										>
											<i className="fa-solid fa-pen"></i>
										</div>
										<div
											onClick={
												deletePost
											}
										>
											<i className="fa-solid fa-trash"></i>
										</div>
									</>
								) : (
									""
								)}
							</div>
							<hr
								style={{
									marginTop: "25px",
								}}
								className="small-bar"
							/>
							<br />
							<div className="post-text-user">
								<div
									style={{
										backgroundImage: `url("${
											me!
												.avatar
										}")`,
										clipPath:
											me
												.cosmetic
												?.avatar_shape !==
											""
												? me
														.cosmetic
														.avatar_shape
												: "circle(50% at 50% 50%)",
									}}
									className="post-text-avatar"
								></div>
								<p
									dangerouslySetInnerHTML={{
										__html: VerifyBadgeText(
											me!
										),
									}}
									className="post-text-name"
								></p>
								<p className="post-text-handle">
									@{me!.handle}
								</p>
							</div>
							<div className="post-text-box">
								<textarea
									ref={postText}
									style={{
										fontSize: "20px",
										minHeight: "70px",
										display: loading
											? "none"
											: "block",
									}}
									onPaste={pasteContent}
									placeholder={`Reply to ${post?.op.displayName.replace(
										/(.{16})..+/,
										"$1…"
									)}!`}
									className="post-textarea"
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
								<div className="image-holder">
									{images.map(img => (
										<div
											className="postImage"
											style={{
												backgroundImage:
													"url(" +
													img +
													")",
											}}
											key={uuid4()}
										></div>
									))}
								</div>
								<hr
									style={{
										marginBottom: "25px",
									}}
									className="small-bar"
								/>
								<div className="post-text-buttons">
									<a
										onClick={() =>
											setEmojiShown(
												!isEmojiPickerShown
											)
										}
									>
										<i className="fa-solid fa-face-awesome"></i>
									</a>
									<a
										onClick={() =>
											postFile.current!.click()
										}
									>
										<i className="fa-solid fa-image"></i>
									</a>
									<input
										accept=".gif,.jpg,.jpeg,.png,.webp,.mp4,.webm,.mov,.mp3,.ogg,.wav"
										style={{
											display: "none",
										}}
										id="post-file"
										type="file"
										ref={postFile}
									/>
									<button onClick={reply}>
										Reply
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
							{replies.map(item => {
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
								const darkMultiplyer = 0.5;
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
								const check =
									rgb?.r === 0 &&
									rgb?.g === 0 &&
									rgb?.b === 0;
								postColors = {
									color1: check
										? "rgb(53, 43, 24)"
										: `rgb(${
												divided.r *
												255
										  }, ${
												divided.g *
												255
										  }, ${
												divided.b *
												255
										  })`,
									color2: check
										? "rgb(53, 43, 24)"
										: `rgb(${
												divided2.r *
												255
										  }, ${
												divided2.g *
												255
										  }, ${
												divided2.b *
												255
										  })`,
								};
								return (
									<PostBox
										activity={
											item
												.op
												.activity
										}
										edited={
											item
												.data
												.edited
										}
										avatarShape={
											item
												.op
												.cosmetic
												.avatar_shape
										}
										repost_type={
											item
												.data
												.repost_type
										}
										repost_id={
											item
												.data
												.repost_id
										}
										repost_op={
											item
												.data
												.repost_op
										}
										reply_type={
											false
										}
										replyingTo=""
										badgeType={getBadgeType(
											item.op
										)}
										key={
											item
												.data
												.postID
										}
										date={
											item
												.data
												.date
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
										tokenUser={me!}
									/>
								);
							})}
						</>
					) : (
						""
					)}
				</div>
				<NavigationPanel />
			</div>
		</>
	);
}

export default HomePostPage;
