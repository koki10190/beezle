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
	date: Date;
	badgeType: BadgeType;
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
}: PostBoxInterface) {
	let user: UserType;
	// const [meUser, setMe] = useState({} as any as UserType);
	const username = useRef<HTMLParagraphElement>(null);
	const html_likes = useRef<HTMLDivElement>(null);
	const html_bookmarks = useRef<HTMLDivElement>(null);
	const html_reposts = useRef<HTMLDivElement>(null);
	const html_replies = useRef<HTMLDivElement>(null);
	const [isLiked, setLiked] = useState(false);
	const [isBookmarked, setBookmarked] = useState(false);

	(async () => {
		// setMe(me);
	})();

	useEffect(() => {
		(async () => {
			// user = (await GetOtherUser(handle)).user;
			VerifyBadgeBool(username.current!, name, badgeType);

			if (
				likes.find(
					x =>
						x ===
						localStorage.getItem(
							"handle"
						)
				)
			) {
				html_likes.current!.style.color =
					"#ff4281";
				setLiked(true);
			} else {
				html_likes.current!.style.color =
					"rgba(255, 255, 255, 0.377)";
			}
		})();
	}, [likes]);

	useEffect(() => {
		if (tokenUser) {
			if (tokenUser.bookmarks.find(x => x == postId))
				html_bookmarks.current!.style.color =
					"#349beb";
		}
	}, []);

	const bookmark = () => {
		if (isBookmarked) {
			setBookmarked(false);

			html_bookmarks.current!.style.color =
				"rgba(255, 255, 255, 0.377)";

			axios.post(`${api_url}/api/bookmark`, {
				token: localStorage.getItem(
					"auth_token"
				) as string,
				postID: postId,
				unbookmark: true,
			});
		} else {
			html_bookmarks.current!.style.color = "#349beb";
			setBookmarked(true);

			axios.post(`${api_url}/api/bookmark`, {
				token: localStorage.getItem(
					"auth_token"
				) as string,
				postID: postId,
				unbookmark: false,
			});
		}
	};

	const likePost = () => {
		if (isLiked) {
			setLiked(false);
			html_likes.current!.style.color =
				"rgba(255, 255, 255, 0.377)";

			axios.post(`${api_url}/api/like-post`, {
				token: localStorage.getItem(
					"auth_token"
				) as string,
				postId,
				unlike: true,
			});
		} else {
			setLiked(true);
			html_likes.current!.style.color = "#ff4281";
			axios.post(`${api_url}/api/like-post`, {
				token: localStorage.getItem(
					"auth_token"
				) as string,
				postId,
				unlike: false,
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

	return (
		<div className="post-box">
			<div className="user-stuff">
				<div
					onClick={
						redirectToProfile
					}
					className="user-desc"
				>
					<div
						style={{
							backgroundImage: `url("${avatarURL}")`,
						}}
						className="post-avatar"
					></div>
					<p
						ref={
							username
						}
						className="post-name"
					>
						{name}
					</p>
					<p className="post-date">
						@{handle}
					</p>
					<p className="post-date-time">
						{moment(
							date
						).fromNow()}
					</p>
					<p
						dangerouslySetInnerHTML={{
							__html: content.replace(
								/@([a-z\d_\.-]+)/gi,
								`<a class="mention" href="/profile/$1">@$1</a>`
							),
						}}
						className="post-content"
					></p>
				</div>
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
					<div
						onClick={
							bookmark
						}
						ref={
							html_bookmarks
						}
					>
						<i className="fa-solid fa-bookmark"></i>
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
					)}
				</div>
			</div>
		</div>
	);
}

export default PostBox;
