import { useEffect, useRef } from "react";
import GetUserData from "../api/GetUserData";
import NavigationPanel from "../Components/NavigationPanel";
import MainPanel from "../Components/MainPanel";
import InfoPanel from "../Components/InfoPanel";
import { useNavigate } from "react-router-dom";

function Home() {
	const navigate = useNavigate();
	let user;
	const avatar = useRef<HTMLImageElement>(null);
	const banner = useRef<HTMLImageElement>(null);
	const username = useRef<HTMLHeadingElement>(null);

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
				<MainPanel />
				<NavigationPanel />
			</div>
		</>
	);
}

export default Home;
