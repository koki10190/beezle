import { useEffect, useRef } from "react";
import GetUserData from "../api/GetUserData";
import NavigationPanel from "../Components/NavigationPanel";
import MainPanel from "../Components/MainPanel";
import InfoPanel from "../Components/InfoPanel";
import Profile from "../Components/MainPanel/Profile";
import EditProfile from "../Components/MainPanel/EditProfile";
import Post from "../Components/MainPanel/Post";
import socket from "../io/socket";
import { useNavigate } from "react-router-dom";

function HomePost() {
	let user;
	const avatar = useRef<HTMLImageElement>(null);
	const banner = useRef<HTMLImageElement>(null);
	const username = useRef<HTMLHeadingElement>(null);
	const navigate = useNavigate();

	(async () => {
		const data = await GetUserData();
		if (data.error) {
			navigate("/");
		}
	})();

	useEffect(() => {
		(async () => {
			user = (await GetUserData()).user;
			// avatar.current!.src = user.avatar;
			// banner.current!.src = user.banner;
			// username.current!.textContent = user.displayName;
		})();
	}, []);

	return (
		<>
			{/* <img ref={banner} width={500} />
			<img ref={avatar} width={250} />
			<h1 ref={username}></h1> */}
			<div className="main-pages">
				<InfoPanel />
				<Post fetch_method="explore-posts" />
				<NavigationPanel />
			</div>
		</>
	);
}

export default HomePost;
