import { useEffect, useRef } from "react";
import GetUserData from "../api/GetUserData";
import NavigationPanel from "../Components/NavigationPanel";
import MainPanel from "../Components/MainPanel";
import InfoPanel from "../Components/InfoPanel";
import Profile from "../Components/MainPanel/Profile";
import Followers from "../Components/MainPanel/Followers";

function HomeFollowers() {
	let user;

	(async () => {
		const data = await GetUserData();
		if (data.error) {
			window.location.href = "/";
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
				<Followers />
				<NavigationPanel />
			</div>
		</>
	);
}

export default HomeFollowers;
