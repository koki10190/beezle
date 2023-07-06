import { useParams } from "react-router-dom";
import GetOtherUser from "../../api/GetOtherUser";
import { useEffect, useRef, useState } from "react";
import UserType from "../../interfaces/UserType";
import "./Profile.css";
import VerifyBadge from "../../functions/VerifyBadge";
import { PostBoxType, PostType } from "../../interfaces/PostType";
import axios from "axios";
import PostBox from "./PostBox";

function Profile() {
	const { handle } = useParams();
	let user: UserType;

	const username = useRef<HTMLHeadingElement>(null);
	const tag = useRef<HTMLHeadingElement>(null);
	const bio = useRef<HTMLHeadingElement>(null);
	const avatar = useRef<HTMLDivElement>(null);
	const banner = useRef<HTMLDivElement>(null);

	const [posts, setPosts] = useState([] as PostBoxType[]);

	useEffect(() => {
		(async () => {
			user = (await GetOtherUser(handle!)).user;

			VerifyBadge(username.current!, user);
			tag.current!.textContent = "@" + user.handle;
			bio.current!.innerHTML = user.bio;
			avatar.current!.style.backgroundImage = `url("${user.avatar}")`;
			banner.current!.style.backgroundImage = `url("${user.banner}")`;

			const posts = (
				await axios.get(
					"http://localhost:3000/api/get-user-posts/koki"
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
			<button onClick={editProf} className="edit-prof-btn">
				Edit Profile
			</button>
			<h1 ref={username} className="profile-name"></h1>
			<h3 ref={tag} className="profile-handle"></h3>
			<p ref={bio} className="profile-bio"></p>
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
