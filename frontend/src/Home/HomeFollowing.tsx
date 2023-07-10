import { useEffect, useRef } from "react";
import GetUserData from "../api/GetUserData";
import NavigationPanel from "../Components/NavigationPanel";
import MainPanel from "../Components/MainPanel";
import InfoPanel from "../Components/InfoPanel";
import Profile from "../Components/MainPanel/Profile";
import Followers from "../Components/MainPanel/Followers";
import Following from "../Components/MainPanel/Following";
import { useNavigate } from "react-router-dom";

function HomeFollowing() {
	let user;

	(async () => {
		const data = await GetUserData();
		if (data.error) {
			const navigate = useNavigate();
			navigate("/");
		}
	})();

	useEffect(() => {
		(async () => {
			user = (await GetUserData()).user;
		})();
	}, []);

	return (
		<>
			<div className="main-pages">
				<InfoPanel />
				<Following />
				<NavigationPanel />
			</div>
		</>
	);
}

export default HomeFollowing;
