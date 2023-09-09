import { useEffect, useRef, useState } from "react";
import UserType from "../../interfaces/UserType";
import GetUserData from "../../api/GetUserData";
import GetOtherUser from "../../api/GetOtherUser";
import VerifyBadge from "../../functions/VerifyBadge";
import FlipNumbers from "react-flip-numbers";
import socket from "../../io/socket";
import axios from "axios";
import { api_url } from "../../constants/ApiURL";
import moment from "moment";
import { BadgeType, VerifyBadgeBool } from "../../functions/VerifyBadgeBool";
import { response, text } from "express";
import uuid4 from "uuid4";
import millify from "millify";
import displayContent from "../../functions/displayContent";
import { PostType } from "../../interfaces/PostType";
import { useNavigate } from "react-router-dom";
import VerifyBadgeText from "../../functions/VerifyBadgeText";
import StatusCheck from "../../functions/StatusCheck";
import sanitize from "sanitize-html";
import { RepBadge } from "../../functions/RepBadge";

interface PostBoxInterface {
	name: string;
	handle: string;
	avatarURL: string;
	content: string;
	likes: string[];
	reposts: string[];
	replies: number;
	postId: string;
	tokenUser: UserType;
	activity: string;
	date: Date;
	badgeType: BadgeType[];
	replyingTo: string;
	reply_type: boolean;
	repost_type: boolean;
	repost_id: string;
	repost_op: string;
	edited: boolean;
	avatarShape?: string;
	gradient?: {
		color1?: string;
		color2?: string;
	};
	rep: number;
	// me: UserType;
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
	// me,
	badgeType,
	date,
	replyingTo,
	reply_type,
	repost_type,
	repost_id,
	repost_op,
	edited,
	avatarShape,
	gradient,
	activity,
	rep
}: PostBoxInterface) {
	const navigate = useNavigate();
	let user: UserType;
	// const [meUser, setMe] = useState({} as any as UserType);
	const default_button_color = "rgba(255, 255, 255, 0.377)";
	const username = useRef<HTMLParagraphElement>(null);
	const html_likes = useRef<HTMLDivElement>(null);
	const html_bookmarks = useRef<HTMLDivElement>(null);
	const html_reposts = useRef<HTMLDivElement>(null);
	const html_replies = useRef<HTMLDivElement>(null);
	const [isLiked, setLiked] = useState(false);
	const [isReposted, setReposted] = useState(false);
	const [isBookmarked, setBookmarked] = useState(false);
	const [isRepost, setIsRepost] = useState(false);
	const [repostData, setRepostData] = useState<PostType>({} as PostType);
	const [repostOp, setRepostOp] = useState<UserType>({} as UserType);
	const [like_color, setLikeColor] = useState<string>(default_button_color);
	const [repost_color, setRepostColor] = useState<string>(default_button_color);
	const [status, setStatus] = useState("offline");

	(async () => {
		// setMe(me);
	})();

	useEffect(() => {
		(async () => {
			// user = (await GetOtherUser(handle)).user;
			RepBadge(username.current!, name.replace(/(.{16})..+/, "$1…"), rep, badgeType);
			if (likes.find(x => x === localStorage.getItem("handle"))) {
				html_likes.current!.style.color = "#ff4281";
				setLikeColor("#ff4281");
				setLiked(true);
			} else {
				html_likes.current!.style.color = default_button_color;
				setLikeColor(default_button_color);
			}

			if (reposts.find(x => x === localStorage.getItem("handle"))) {
				html_reposts.current!.style.color = "#66f542";
				setReposted(true);
				setRepostColor("#66f54n");
			} else {
				html_reposts.current!.style.color = default_button_color;
				setRepostColor(default_button_color);
			}
		})();
	}, [likes]);

	useEffect(() => {
		(async () => {
			if (repost_type) {
				const repostData = await axios.post(`${api_url}/api/get-post/${repost_id}`, {
					token: localStorage.getItem("auth_token"),
				});
				setRepostData(repostData.data.data);

				const repostOp = await GetOtherUser(repost_op);
				setRepostOp(repostOp.user);
				setIsRepost(repost_type);

				if (handle === localStorage.getItem("handle")) {
					html_reposts.current!.style.color = "#66f542";
				}

				VerifyBadgeBool(username.current!, repostOp.user.displayName.replace(/(.{16})..+/, "$1…"), badgeType);
				setReposted(true);

				const status = await axios.get(`${api_url}/status/${repostOp.user.handle}`);
				setStatus(status.data.status);
			} else {
				const status = await axios.get(`${api_url}/status/${handle}`);
				setStatus(status.data.status);
			}
		})();
		if (tokenUser) {
			if (tokenUser.bookmarks.find(x => x == postId)) {
				html_bookmarks.current!.style.color = "#349beb";
				setBookmarked(true);
			}
		}
	}, []);

	const bookmark = () => {
		if (user?.bot_account) return;
		if (isBookmarked) {
			setBookmarked(false);

			html_bookmarks.current!.style.color = default_button_color;

			axios.post(`${api_url}/api/bookmark`, {
				token: localStorage.getItem("auth_token") as string,
				postID: postId,
				unbookmark: true,
			});
		} else {
			html_bookmarks.current!.style.color = "#349beb";
			setBookmarked(true);

			axios.post(`${api_url}/api/bookmark`, {
				token: localStorage.getItem("auth_token") as string,
				postID: postId,
				unbookmark: false,
			});
		}
	};

	const likePost = () => {
		if (user?.bot_account) return;
		if (isLiked) {
			setLiked(false);
			setLikeColor(default_button_color);
			html_likes.current!.style.color = default_button_color;

			axios.post(`${api_url}/api/like-post`, {
				token: localStorage.getItem("auth_token") as string,
				postId,
				unlike: true,
			});
		} else {
			setLiked(true);
			html_likes.current!.style.color = "#ff4281";
			setLikeColor("#ff4281");
			axios.post(`${api_url}/api/like-post`, {
				token: localStorage.getItem("auth_token") as string,
				postId,
				unlike: false,
			});
		}
	};

	const repost = () => {
		if (user?.bot_account) return;
		if (isReposted) {
			setReposted(false);
			setRepostColor(default_button_color);
			html_reposts.current!.style.color = default_button_color;

			axios.post(`${api_url}/api/repost`, {
				token: localStorage.getItem("auth_token") as string,
				postID: isRepost ? repost_id : postId,
				unrepost: true,
			});
			console.log("uh huh");
		} else {
			setReposted(true);
			html_reposts.current!.style.color = "#66f542";
			setRepostColor("#66f542");

			axios.post(`${api_url}/api/repost`, {
				token: localStorage.getItem("auth_token") as string,
				postID: isRepost ? repost_id : postId,
				unrepost: false,
			});
		}
	};

	const redirectToProfile = () => {
		window.location.href = "/profile/" + repost_type ? repostOp.handle : handle;
	};

	const deletePost = async () => {
		if (user?.bot_account) return;
		axios.post(`${api_url}/api/delete-post`, {
			postId,
			token: localStorage.getItem("auth_token"),
		});
	};

	const reply = () => window.location.assign("/post/" + postId);
	const [mention, setMention] = useState<UserType | null>(null);
	const [timeoutM, setTimeoutM] = useState<NodeJS.Timeout>();
	const hoverMention = async (mmention: string) => {
		if (mention?.handle === mmention) return clearTimeout(timeoutM);
		const data = await GetOtherUser(mmention.replace("@", ""));
		setMention(data.user);
	};

	useEffect(() => {
		const mentions = content.match(/@([a-z\d_\.-]+)/gi);

		try {
			mentions?.forEach(mention => {
				const element = document.getElementById(mention.replace("@", "") + "-" + postId) as HTMLAnchorElement;

				if (element) {
					element.onmouseover = () => hoverMention(element.innerText);
					element.onmouseleave = () => {
						setMention(null);
						clearTimeout(timeoutM);
					};
				}
			});
		} catch (err) {}
	}, []);

	return (
		<div
			style={{
				backgroundImage: `-webkit-linear-gradient(-15deg, ${
					gradient?.color1 ? gradient.color1 : "rgb(53, 43, 24)"
				}, ${gradient?.color2 ? gradient.color2 : "rgb(53, 43, 24)"})`,
			}}
			className="post-box"
		>
			{mention ? (
				<div
					onClick={() => navigate("/profile/" + mention.handle)}
					className="mini-profile"
				>
					<div
						style={{ backgroundImage: `url("${mention.banner}")` }}
						className="mini-banner"
					></div>
					<div
						style={{
							backgroundImage: `url("${mention.avatar}")`,
						}}
						className="mini-avatar"
					></div>
					<p
						className="mini-name"
						dangerouslySetInnerHTML={{
							__html: VerifyBadgeText(mention),
						}}
					></p>
					<p className="mini-handle">
						@{mention.handle} - {sanitize(mention.activity, { allowedTags: [] })}
					</p>
					<p
						dangerouslySetInnerHTML={{
							__html: mention.bio,
						}}
						className="mini-bio"
					></p>
				</div>
			) : (
				""
			)}
			<div className="user-stuff">
				{isRepost ? (
					<p
						onClick={() => navigate(`/post/${repost_id}`)}
						className="post-box-replying"
					>
						<i className="fa-solid fa-repeat"></i> Repost
					</p>
				) : (
					""
				)}

				{edited ? (
					<p className="post-box-replying">
						<i className="fa-solid fa-pen"></i> Edited{" "}
					</p>
				) : (
					""
				)}
				{reply_type ? (
					<p
						onClick={() => navigate(`/post/${replyingTo}`)}
						className="post-box-replying"
					>
						<i className="fa-solid fa-reply"></i> Replying to a post
					</p>
				) : (
					""
				)}
				<div
					onClick={() => {
						window.location.href = `/profile/${isRepost ? repostOp.handle : handle}`;
					}}
					className="user-desc"
				>
					<div className="avatar-parent post-avatar-parent">
						<div
							style={{
								backgroundImage: `url("${
									isRepost
										? repostOp.avatar
										: avatarURL
								}")`,
								clipPath: (
									isRepost
										? repostOp
												.cosmetic
												?.avatar_shape
											? repostOp
													.cosmetic
													?.avatar_shape
											: "circle(50% at 50% 50%)"
										: avatarShape
								)
									? isRepost
										? repostOp
												.cosmetic
												?.avatar_shape
											? repostOp
													.cosmetic
													?.avatar_shape
											: "circle(50% at 50% 50%)"
										: avatarShape
									: "circle(50% at 50% 50%)",
							}}
							className="post-avatar"
						></div>
						<div
							style={{
								backgroundColor: StatusCheck(status),
							}}
							className="status"
						></div>
					</div>
					<p
						ref={username}
						className="post-name"
					>
						{isRepost
							? repostOp.displayName.replace(/(.{16})..+/, "$1…")
							: name.replace(/(.{16})..+/, "$1…")}
					</p>
					<p className="post-date">
						@{isRepost ? repostOp.handle : handle}{" "}
						{activity.replace(" ", "") !== "" ? "-" : ""}{" "}
						<span style={{ color: "rgba(255,255,255,0.7)" }}>
							{isRepost
								? repostOp.activity.replace(
										/(.{24})..+/,
										"$1…"
								  )
								: activity.replace(/(.{24})..+/, "$1…")}
						</span>
					</p>
					<p className="post-date-time">
						{moment(isRepost ? repostData.date : date)
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
				</div>
				<p
					onClick={() => navigate("/post/" + isRepost ? repost_id : postId)}
					style={{
						cursor: "pointer",
						width: "100%",
					}}
					dangerouslySetInnerHTML={{
						__html: displayContent(isRepost ? repostData.content : content, postId),
					}}
					className="post-content"
				></p>
				<div
					style={{ zIndex: "1" }}
					className="buttons"
				>
					<div
						onClick={reply}
						ref={html_replies}
					>
						<i className="fa-solid fa-comment"></i> <span>{millify(replies)}</span>
					</div>
					<div
						onClick={repost}
						ref={html_reposts}
					>
						<i className="fa-solid fa-repeat"></i>{" "}
						<span>
							<FlipNumbers
								height={15}
								width={15}
								color={repost_color}
								play
								nonNumberClassName="like-flip"
								numberClassName="like-flip"
								perspective={100}
								numbers={millify(
									isRepost
										? repostData
												.reposts
												.length
										: reposts.length
								)}
							/>
						</span>
					</div>
					<div
						ref={html_likes}
						onClick={likePost}
					>
						<i className="fa-solid fa-heart"></i>{" "}
						<span>
							<FlipNumbers
								height={15}
								width={15}
								color={like_color}
								play
								nonNumberClassName="like-flip"
								numberClassName="like-flip"
								perspective={100}
								numbers={millify(
									isRepost
										? repostData
												.likes
												.length
										: likes.length
								)}
							/>
						</span>
					</div>
					<div
						onClick={bookmark}
						ref={html_bookmarks}
					>
						<i className="fa-solid fa-bookmark"></i>
					</div>

					{/* <div>
						<i className="fa-solid fa-flag"></i>
					</div>

					{localStorage.getItem(
						"handle"
					) === handle ? (
						<div
							onClick={
								deletePost
							}
						>
							<i className="fa-solid fa-trash"></i>
						</div>
					) : (
						""
					)} */}
				</div>
			</div>
		</div>
	);
}

export default PostBox;
