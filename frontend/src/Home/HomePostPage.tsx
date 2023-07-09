import { useEffect, useRef, useState, UIEvent } from "react";
import GetUserData from "../api/GetUserData";
import NavigationPanel from "../Components/NavigationPanel";
import MainPanel from "../Components/MainPanel";
import InfoPanel from "../Components/InfoPanel";
import UserType from "../interfaces/UserType";
import GetOtherUser from "../api/GetOtherUser";
import { useParams } from "react-router-dom";
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

function HomePostPage() {
	const { postID } = useParams();
	const [me, setMe] = useState<UserType>({} as UserType);
	const [user, setUser] = useState<UserType>({} as UserType);
	const [post, setPost] = useState<PostBoxType>({} as PostBoxType);
	const [render, setRender] = useState<boolean>(false);
	const [isLiked, setLiked] = useState<boolean>(false);
	const [replies, setReplies] = useState<PostBoxType[]>([]);
	const [offset, setOffset] = useState<number>(0);
	const [replyParent, setReplyParent] = useState<PostBoxType>({} as PostBoxType);
	const [isBookmarked, setBookmarked] = useState<boolean>(false);
	const html_likes = useRef<HTMLParagraphElement>(null);
	const html_bookmarks = useRef<HTMLParagraphElement>(null);
	const postFile = useRef<HTMLInputElement>(null);
	const postText = useRef<HTMLTextAreaElement>(null);

	let postLikesCheck = 0;
	socket.on("post-like-refresh", async (postId: string, liked: string[]) => {
		if (postLikesCheck > 0) {
			if (postLikesCheck >= 4) postLikesCheck = 0;
		}
		if (postId !== postID) return;

		if (post) {
			post.data.likes = liked;
			setPost(structuredClone(post));
		}
	});

	let postRepostCheck = 0;
	socket.on("post-repost-refresh", async (postId: string, reposts: string[]) => {
		if (postLikesCheck > 0) {
			if (postLikesCheck >= 4) postLikesCheck = 0;
		}
		if (postId !== postID) return;

		if (post) {
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

	useEffect(() => {
		(async () => {
			let interval: NodeJS.Timer;
			let interval_likes: NodeJS.Timer;
			let interval_bookmarks: NodeJS.Timer;
			const data = await GetUserData();
			if (data.error) {
				window.location.href = "/";
			} else {
				setMe(data.user);
			}

			const post = (await axios.get(`${api_url}/api/get-post/${postID}`)).data as PostBoxType;

			if (post.data.reply_type) {
				setReplyParent((await axios.get(`${api_url}/api/get-post/${post.data.replyingTo}`)).data as PostBoxType);
			}

			setPost(post);
			setUser(post.op);
			setRender(true);
			setMe(data.user);

			const replies = (await axios.get(`${api_url}/api/get-replies/${postID}/${offset}`)).data;
			setReplies(replies.data);

			interval = setInterval(() => {
				if (postFile.current && html_likes.current && html_bookmarks.current) {
					postFile.current.addEventListener("change", async (event: Event) => {
						const fileFormData = new FormData();
						console.log(postFile.current!.files![0]);
						fileFormData.append("file", postFile.current!.files![0]);

						const split = postFile.current!.files![0].name.split(".");
						const ext = split[split.length - 1];
						fileFormData.append("ext", ext);

						fileFormData.append("token", localStorage.getItem("auth_token") as string);

						alert("The file is being uploaded, please wait.");

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

						postText.current!.value += res.img;
					});

					if (post.data.likes.find(x => x === data.user.handle)) {
						setLiked(true);
						html_likes.current!.style.color = "#ff4281";
					} else {
						setLiked(false);
						html_likes.current!.style.color = "rgba(255, 255, 255, 0.377)";
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
		const content = postText.current!.value;
		if (content === "") return;

		axios.post(`${api_url}/api/post`, {
			token: localStorage.getItem("auth_token")!,
			content: content,
			reply_type: true,
			replyingTo: postID,
			socketID: socket.id,
		}).then(res => {
			postText.current!.value = "";
			replies.unshift(res.data);
			setReplies([...replies]);
		});
	};

	const deletePost = async () => {
		axios.post(`${api_url}/api/delete-post`, {
			postId: postID,
			token: localStorage.getItem("auth_token"),
		}).then(res => (window.location.href = "/"));
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

				setReplies(replies.concat(uniquePosts));

				setOffset(res.data.offset);
				console.log(`Offset: ${res.data.offset}`);
			});
		}
	};

	const report = async () => {
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
							{post?.data.reply_type ? (
								<p
									onClick={() =>
										(window.location.href =
											"/post/" +
											replyParent
												.data
												.postID)
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
										{replyParent
											.data
											.content
											.length >
										14
											? replyParent.data.content.substring(
													0,
													replyParent
														.data
														.content
														.length -
														3
											  ) +
											  "..."
											: replyParent
													.data
													.content}
									</span>
								</p>
							) : (
								""
							)}

							<div
								style={{ cursor: "pointer" }}
								onClick={() =>
									(window.location.href = `/profile/${post.op.handle}`)
								}
							>
								<div
									style={{
										backgroundImage: `url("${
											post!
												.op
												.avatar
										}")`,
									}}
									className="page-avatar"
								></div>
								<p
									dangerouslySetInnerHTML={{
										__html: VerifyBadgeText(
											user!
										),
									}}
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
									.replace("anhour", "1h")}
							</p>
							<p
								dangerouslySetInnerHTML={{
									__html: displayContent(
										post!.data
											.content
									),
								}}
								className="page-content"
							></p>
							<hr
								style={{
									marginTop: "40px",
								}}
								className="small-bar"
							/>
							<div className="buttons">
								<div
								// ref={
								// html_rereplies
								// }
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

								{localStorage.getItem("handle") ===
								post?.op.handle ? (
									<div onClick={deletePost}>
										<i className="fa-solid fa-trash"></i>
									</div>
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
									}}
									placeholder={`Reply to ${post?.op.displayName}!`}
									className="post-textarea"
								></textarea>
								<hr
									style={{
										marginBottom: "25px",
									}}
									className="small-bar"
								/>
								<div className="post-text-buttons">
									<a>
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
							</div>
							{replies.map(item => (
								<PostBox
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
									reply_type={false}
									replyingTo=""
									badgeType={getBadgeType(
										item.op
									)}
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
									tokenUser={me!}
								/>
							))}
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
