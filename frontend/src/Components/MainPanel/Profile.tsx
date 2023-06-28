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
			if (user.verified || user.owner)
				username.current!.innerHTML += ` <i style="color: yellow" class="fa-solid fa-badge-check"></i>`;
			if (user.moderator)
				username.current!.innerHTML += ` <i style="color: yellow" class="fa-solid fa-shield-check"></i>`;
			tag.current!.textContent = "@" + user.handle;
			bio.current!.innerHTML = user.bio;
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
			<hr className="small-bar" />
		</div>
	);
}

export default Profile;
