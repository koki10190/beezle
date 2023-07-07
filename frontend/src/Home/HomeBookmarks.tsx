import { useEffect, useRef } from "react";
import GetUserData from "../api/GetUserData";
import NavigationPanel from "../Components/NavigationPanel";
import InfoPanel from "../Components/InfoPanel";
import Bookmarks from "../Components/MainPanel/Bookmarks";

function HomeBookmarks() {
	let user;

	(async () => {
		user = await GetUserData();
		if (user.error) {
			window.location.href = "/";
		}
	})();
	return (
		<>
			<div className="main-pages">
				<InfoPanel />
				<Bookmarks />
				<NavigationPanel />
			</div>
		</>
	);
}

export default HomeBookmarks;
