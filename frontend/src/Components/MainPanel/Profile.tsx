import { useNavigate, useParams } from "react-router-dom";
import GetOtherUser from "../../api/GetOtherUser";
import { useEffect, useRef, useState, UIEvent } from "react";
import UserType from "../../interfaces/UserType";
import "./Profile.css";
import VerifyBadge from "../../functions/VerifyBadge";
import { PostBoxType, PostType } from "../../interfaces/PostType";
import axios from "axios";
import PostBox from "./PostBox";
import { api_url } from "../../constants/ApiURL";
import GetUserData from "../../api/GetUserData";
import socket from "../../io/socket";
import { BadgeType } from "../../functions/VerifyBadgeBool";
import getBadgeType from "../../functions/getBadgeType";

function Profile() {
	const navigate = useNavigate();
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
	const [offset, setOffset] = useState(0);
	const [status, setStatus] = useState("offline");

	let postDeleteCheck = 0;
	socket.on("post-deleted", async (postId: string, isrepost) => {
		if (postDeleteCheck > 0) {
			if (postDeleteCheck >= 4) postDeleteCheck = 0;
		}
		posts.splice(
			posts.findIndex(x => (isrepost ? x.data.repost_id == postId : x.data.postID == postId)),
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
		posts[post].data.likes = liked;
		setPosts([...posts]);
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

	const follow = () => {
		axios.post(`${api_url}/api/follow`, {
			token: localStorage.getItem("auth_token") as string,
			toFollow: handle,
			unfollow: followBtn.current!.innerText === "Unfollow" ? true : false,
		}).then(res => window.location.reload());
	};

	(async () => {
		user = (await GetOtherUser(handle!)).user;
	})();

	useEffect(() => {
		(async () => {
			user = (await GetOtherUser(handle!)).user;
			setUserFollow(user);
			const usrData = await GetUserData();
			setUser(usrData.user);

			VerifyBadge(username.current!, user);
			tag.current!.textContent = "@" + user.handle;
			const biolimit = 2000;
			bio.current!.innerHTML = user.bio.length > biolimit ? user.bio.substring(0, biolimit - 3) + "..." : user.bio;
			avatar.current!.style.backgroundImage = `url("${user.avatar}")`;
			banner.current!.style.backgroundImage = `url("${user.banner}")`;
			following.current!.innerText = user.following.length.toString();
			followers.current!.innerText = user.followers.length.toString();

			followBtn.current!.innerText = user.followers.find(x => x === usrData.user.handle) ? "Unfollow" : "Follow";

			const posts = (await axios.get(`${api_url}/api/get-user-posts/${handle}/${offset}`)).data;
			const actualPosts: PostBoxType[] = [];
			(posts.posts as PostType[]).forEach(post =>
				actualPosts.push({
					data: post,
					op: user,
				})
			);
			setPosts(actualPosts);
			setOffset(posts.latestIndex);

			const status = await axios.get(`${api_url}/status/${handle}`);
			console.log(status.data);
			setStatus(status.data.status);
		})();
	}, []);

	const editProf = () => {
		navigate("/user/edit-profile");
	};

	const followersPage = () => {
		navigate("/followers/" + user.handle);
	};

	const followingPage = () => {
		navigate("/following/" + user.handle);
	};

	const detectScrolling = (event: UIEvent<HTMLDivElement>) => {
		const element = event.target! as HTMLDivElement;
		if (element.scrollHeight - element.scrollTop === element.clientHeight) {
			axios.get(`${api_url}/api/get-user-posts/${handle}/${offset + 1}`).then(async res => {
				const actualPosts: PostBoxType[] = [];
				(res.data.posts as PostType[]).forEach(post =>
					actualPosts.push({
						data: post,
						op: user,
					})
				);

				setPosts(posts.concat(actualPosts));

				setOffset(res.data.latestIndex);
				console.log(`Offset: ${res.data.latestIndex}`);
			});
		}
	};

	return (
		<div
			onScroll={detectScrolling}
			className="navigation-panel main-panel profile-panel"
		>
			<div
				ref={banner}
				className="banner"
			></div>
			<div
				ref={avatar}
				className="avatar"
			>
				<div
					style={{
						backgroundColor: status === "online" ? "lime" : "gray",
					}}
					className="status"
				></div>
			</div>
			<div>
				{m_user?.handle == handle ? (
					<button
						onClick={editProf}
						className="edit-prof-btn"
					>
						Edit Profile
					</button>
				) : (
					<button
						ref={followBtn}
						onClick={follow}
						className="edit-prof-btn"
					>
						Follow
					</button>
				)}
			</div>
			<h1
				ref={username}
				className="profile-name"
			></h1>
			<h3
				ref={tag}
				className="profile-handle"
			></h3>
			<p
				ref={bio}
				className="profile-bio"
			></p>
			<div className="profile-follower-box">
				<p
					style={{
						cursor: "pointer",
					}}
					onClick={followingPage}
				>
					<span
						ref={following}
						className="hlnum"
					>
						0
					</span>{" "}
					Following
				</p>
				<p
					style={{
						cursor: "pointer",
					}}
					onClick={followersPage}
				>
					<span
						ref={followers}
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
						edited={item.data.edited}
						repost_id={item.data.repost_id}
						repost_type={item.data.repost_type}
						repost_op={item.data.repost_op}
						reply_type={item.data.reply_type}
						replyingTo={item.data.replyingTo}
						badgeType={getBadgeType(item.op)}
						key={item.data.postID}
						postId={item.data.postID}
						date={item.data.date}
						name={item.op.displayName}
						handle={item.op.handle}
						avatarURL={item.op.avatar}
						content={item.data.content}
						likes={item.data.likes}
						reposts={item.data.reposts}
						replies={item.data.replies}
						tokenUser={user}
					/>
				))}
			</div>
		</div>
	);
}

export default Profile;
