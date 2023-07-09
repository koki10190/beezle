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
import { text } from "express";
import uuid4 from "uuid4";
import millify from "millify";
import displayContent from "../../functions/displayContent";
import { PostType } from "../../interfaces/PostType";

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
	date: Date;
	badgeType: BadgeType;
	replyingTo: string;
	reply_type: boolean;
	repost_type: boolean;
	repost_id: string;
	repost_op: string;
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
}: PostBoxInterface) {
	let user: UserType;
	// const [meUser, setMe] = useState({} as any as UserType);
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

	(async () => {
		// setMe(me);
	})();

	useEffect(() => {
		(async () => {
			// user = (await GetOtherUser(handle)).user;
			VerifyBadgeBool(username.current!, name, badgeType);

			if (likes.find(x => x === localStorage.getItem("handle"))) {
				html_likes.current!.style.color = "#ff4281";
				setLiked(true);
			} else {
				html_likes.current!.style.color = "rgba(255, 255, 255, 0.377)";
			}

			if (reposts.find(x => x === localStorage.getItem("handle"))) {
				html_reposts.current!.style.color = "#66f542";
				setReposted(true);
			} else {
				html_reposts.current!.style.color = "rgba(255, 255, 255, 0.377)";
			}
		})();
	}, [likes]);

	useEffect(() => {
		(async () => {
			if (repost_type) {
				const repostData = await axios.get(`${api_url}/api/get-post/${repost_id}`);
				setRepostData(repostData.data.data);

				const repostOp = await GetOtherUser(repost_op);
				setRepostOp(repostOp.user);
				setIsRepost(repost_type);

				if (handle === localStorage.getItem("handle")) {
					html_reposts.current!.style.color = "#66f542";
				}

				setReposted(true);
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
		if (isBookmarked) {
			setBookmarked(false);

			html_bookmarks.current!.style.color = "rgba(255, 255, 255, 0.377)";

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
		if (isLiked) {
			setLiked(false);
			html_likes.current!.style.color = "rgba(255, 255, 255, 0.377)";

			axios.post(`${api_url}/api/like-post`, {
				token: localStorage.getItem("auth_token") as string,
				postId,
				unlike: true,
			});
		} else {
			setLiked(true);
			html_likes.current!.style.color = "#ff4281";
			axios.post(`${api_url}/api/like-post`, {
				token: localStorage.getItem("auth_token") as string,
				postId,
				unlike: false,
			});
		}
	};

	const repost = () => {
		if (isReposted) {
			setReposted(false);
			html_reposts.current!.style.color = "rgba(255, 255, 255, 0.377)";

			axios.post(`${api_url}/api/repost`, {
				token: localStorage.getItem("auth_token") as string,
				postID: isRepost ? repost_id : postId,
				unrepost: true,
			});
			console.log("uh huh");
		} else {
			setReposted(true);
			html_reposts.current!.style.color = "#66f542";

			axios.post(`${api_url}/api/repost`, {
				token: localStorage.getItem("auth_token") as string,
				postID: isRepost ? repost_id : postId,
				unrepost: false,
			});
		}
	};

	const redirectToProfile = () => (window.location.href = "/profile/" + handle);

	const deletePost = async () => {
		axios.post(`${api_url}/api/delete-post`, {
			postId,
			token: localStorage.getItem("auth_token"),
		});
	};

	const reply = () => (window.location.href = "/post/" + postId);

	return (
		<div className="post-box">
			<div className="user-stuff">
				{isRepost ? (
					<p
						onClick={() => (window.location.href = `/post/${repost_id}`)}
						className="post-box-replying"
					>
						<i className="fa-solid fa-repeat"></i> Repost
					</p>
				) : (
					""
				)}
				{reply_type ? (
					<p
						onClick={() => (window.location.href = `/post/${replyingTo}`)}
						className="post-box-replying"
					>
						<i className="fa-solid fa-reply"></i> Replying to a post
					</p>
				) : (
					""
				)}
				<div
					onClick={redirectToProfile}
					className="user-desc"
				>
					<div
						style={{
							backgroundImage: `url("${
								isRepost ? repostOp.avatar : avatarURL
							}")`,
						}}
						className="post-avatar"
					></div>
					<p
						ref={username}
						className="post-name"
					>
						{isRepost ? repostOp.displayName : name}
					</p>
					<p className="post-date">@{isRepost ? repostOp.handle : handle}</p>
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
					onClick={() => (window.location.href = "/post/" + (isRepost ? repost_id : postId))}
					style={{
						cursor: "pointer",
						width: "100%",
					}}
					dangerouslySetInnerHTML={{
						__html: displayContent(isRepost ? repostData.content : content),
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
							{millify(
								isRepost
									? repostData.reposts.length
									: reposts.length
							)}
						</span>
					</div>
					<div
						ref={html_likes}
						onClick={likePost}
					>
						<i className="fa-solid fa-heart"></i>{" "}
						<span>{millify(isRepost ? repostData.likes.length : likes.length)}</span>
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
