import { useParams } from "react-router-dom";
import GetOtherUser from "../../api/GetOtherUser";
import { useEffect, useRef } from "react";
import UserType from "../../interfaces/UserType";
import "./Profile.css";

function Profile() {
	const { handle } = useParams();
	let user: UserType;

	const username = useRef<HTMLHeadingElement>(null);
	const tag = useRef<HTMLHeadingElement>(null);
	const bio = useRef<HTMLHeadingElement>(null);
	const avatar = useRef<HTMLDivElement>(null);
	const banner = useRef<HTMLDivElement>(null);

	useEffect(() => {
		(async () => {
			user = (await GetOtherUser(handle!)).user;

			username.current!.textContent = user.displayName;
			tag.current!.textContent = "@" + user.handle;
			bio.current!.textContent = user.bio;
			avatar.current!.style.backgroundImage = `url("${user.avatar}")`;
			banner.current!.style.backgroundImage = `url("${user.banner}")`;
		})();
	}, []);

	const editProf = () => {
		window.location.href = "/user/edit-profile";
	};

	return (
		<div className="navigation-panel">
			<div ref={banner} className="banner"></div>
			<div ref={avatar} className="avatar"></div>
			<button onClick={editProf} className="edit-prof-btn">
				Edit Profile
			</button>
			<h1 ref={username} className="profile-name"></h1>
			<h3 ref={tag} className="profile-handle"></h3>
			<p ref={bio} className="profile-bio"></p>
		</div>
	);
}

export default Profile;
