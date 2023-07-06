import { useParams } from "react-router-dom";
import GetOtherUser from "../../api/GetOtherUser";
import { useEffect, useRef, useState } from "react";
import UserType from "../../interfaces/UserType";
import "./Profile.css";
import VerifyBadge from "../../functions/VerifyBadge";
import { PostBoxType, PostType } from "../../interfaces/PostType";
import axios from "axios";
import PostBox from "./PostBox";
import { api_url } from "../../constants/ApiURL";
import GetUserData from "../../api/GetUserData";

function Profile() {
	let user: UserType;
	const { handle } = useParams();
	const [m_user, setUser] = useState({} as any as UserType);
	const [m_user_follow, setUserFollow] = useState({} as any as UserType);

	const username = useRef<HTMLHeadingElement>(null);
	const tag = useRef<HTMLHeadingElement>(null);
	const bio = useRef<HTMLHeadingElement>(null);
	const avatar = useRef<HTMLDivElement>(null);
	const banner = useRef<HTMLDivElement>(null);
	const following = useRef<HTMLSpanElement>(null);
	const followers = useRef<HTMLSpanElement>(null);
	const followBtn = useRef<HTMLButtonElement>(null);

	const [posts, setPosts] = useState([] as PostBoxType[]);

	const follow = () => {
		axios.post(`${api_url}/api/follow`, {
			token: localStorage.getItem("auth_token") as string,
			toFollow: handle,
			unfollow:
				followBtn.current!.innerText ===
				"Unfollow"
					? true
					: false,
		}).then(res => window.location.reload());
	};

	useEffect(() => {
		(async () => {
			user = (await GetOtherUser(handle!)).user;
			setUserFollow(user);
			const usrData = await GetUserData();
			setUser(usrData.user);

			VerifyBadge(username.current!, user);
			tag.current!.textContent = "@" + user.handle;
			bio.current!.innerHTML = user.bio;
			avatar.current!.style.backgroundImage = `url("${user.avatar}")`;
			banner.current!.style.backgroundImage = `url("${user.banner}")`;
			following.current!.innerText =
				user.following.length.toString();
			followers.current!.innerText =
				user.followers.length.toString();

			followBtn.current!.innerText = user.followers.find(
				x => x === usrData.user.handle
			)
				? "Unfollow"
				: "Follow";

			const posts = (
				await axios.get(
					`${api_url}/api/get-user-posts/${handle}`
				)
			).data as PostType[];
			const actualPosts: PostBoxType[] = [];
			posts.forEach(post =>
				actualPosts.push({
					data: post,
					op: user,
				})
			);
			setPosts(actualPosts);
		})();
	}, []);

	const editProf = () => {
		window.location.href = "/user/edit-profile";
	};

	return (
		<div className="navigation-panel main-panel">
			<div ref={banner} className="banner"></div>
			<div ref={avatar} className="avatar"></div>
			<div>
				{m_user?.handle == handle ? (
					<button
						onClick={
							editProf
						}
						className="edit-prof-btn"
					>
						Edit
						Profile
					</button>
				) : (
					<button
						ref={
							followBtn
						}
						onClick={
							follow
						}
						className="edit-prof-btn"
					>
						Follow
					</button>
				)}
			</div>
			<h1 ref={username} className="profile-name"></h1>
			<h3 ref={tag} className="profile-handle"></h3>
			<p ref={bio} className="profile-bio"></p>
			<div className="profile-follower-box">
				<p>
					<span
						ref={
							following
						}
						className="hlnum"
					>
						0
					</span>{" "}
					Following
				</p>
				<p>
					<span
						ref={
							followers
						}
						className="hlnum"
					>
						0
					</span>{" "}
					Followers
				</p>
			</div>
			<hr className="small-bar" />

			<div className="profile-posts">
				{posts.map(item => (
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
				))}
			</div>
		</div>
	);
}

export default Profile;
