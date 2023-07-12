import { useEffect, useRef } from "react";
import GetUserData from "../api/GetUserData";
import NavigationPanel from "../Components/NavigationPanel";
import MainPanel from "../Components/MainPanel";
import InfoPanel from "../Components/InfoPanel";
import Profile from "../Components/MainPanel/Profile";
import Followers from "../Components/MainPanel/Followers";
import { useNavigate } from "react-router-dom";

function HomeFollowers() {
	let user;
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
