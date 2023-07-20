import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./Welcome/Welcome";
import Home from "./Home/Home";
import HomeProfile from "./Home/HomeProfile";
import HomeEditProfile from "./Home/HomeEditProfile";
import Post from "./Components/MainPanel/Post";
import HomePost from "./Home/HomePost";
import socket from "./io/socket";
import Followers from "./Components/MainPanel/Followers";
import HomeFollowers from "./Home/HomeFollowers";
import HomeFollowing from "./Home/HomeFollowing";
import HomeBookmarks from "./Home/HomeBookmarks";
import HomePostPage from "./Home/HomePostPage";
import HomeSearch from "./Home/HomeSearch";
import { ToastContainer } from "react-toastify";
import GetUserData from "./api/GetUserData";
import { useEffect, useState } from "react";
import HomeNotification from "./Home/HomeNotification";
import notif from "./functions/notif";
import HomeRightNow from "./Home/HomeRightNow";
import HomeExplore from "./Home/HomeExplore";
import HomeDms from "./DMs/HomeDms";
import PrivacyPolicy from "./Policy/PrivacyPolicy";
import DeleteAccount from "./Settings/Pages/DeleteAccount";
import Dashboard from "./Dashboard/Dashboard";
import Reports from "./Dashboard/Pages/Reports";
import DeletePost from "./Dashboard/Pages/DeletePost";
import BanUser from "./Dashboard/Pages/BanUser";
import VerifyUser from "./Dashboard/Pages/VerifyUser";
import Settings from "./Settings/Settings";
import PrivacySettings from "./Settings/Pages/Privacy";
import Credentials from "./Settings/Pages/Credentials";
import Auth from "./Auth/Auth";
import Developers from "./Settings/Pages/Developers";
import HomeTags from "./Home/HomeTags";
import { HelmetProvider } from "react-helmet-async";
import HomeShop from "./Home/HomeShop";

function iOS() {
	return (
		["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.userAgent) ||
		// iPad on iOS 13 detection
		(navigator.userAgent.includes("Mac") && "ontouchend" in document)
	);
}

const helmetContext = {};
function App() {
	const [gotHandle, setGot] = useState(false);

	useEffect(() => {
		(async () => {
			const data = await GetUserData();
			if (!data.error) socket.emit("get-handle", data.user.handle);
		})();
	}, [gotHandle]);

	if (window.screen.width > 1000) {
		Notification.requestPermission().then(perm => {
			if (perm === "granted") {
				// new Notification("Thank you for enabling notifications!");
			}
		});
	}

	// notif("Testing", {});
	return (
		<HelmetProvider context={helmetContext}>
			<ToastContainer />

			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={<Welcome />}
					/>
					<Route
						path="/home"
						element={<Home />}
					/>
					<Route
						path="/profile/:handle"
						element={<HomeProfile />}
					/>
					<Route
						path="/user/edit-profile"
						element={<HomeEditProfile />}
					/>
					<Route
						path="/followers/:handle"
						element={<HomeFollowers />}
					/>
					<Route
						path="/following/:handle"
						element={<HomeFollowing />}
					/>
					<Route
						path="/post"
						element={<HomePost />}
					/>
					<Route
						path="/bookmarks"
						element={<HomeBookmarks />}
					/>
					<Route
						path="/post/:postID"
						element={<HomePostPage />}
					/>
					<Route
						path="/search"
						element={<HomeSearch />}
					/>
					<Route
						path="/notifications"
						element={<HomeNotification />}
					/>
					<Route
						path="/now"
						element={<HomeRightNow />}
					/>
					<Route
						path="/explore"
						element={<HomeExplore />}
					/>
					<Route
						path="/dms"
						element={<HomeDms />}
					/>
					<Route
						path="/privacy-and-terms"
						element={<PrivacyPolicy />}
					/>
					<Route
						path="/dashboard"
						element={<Dashboard />}
					/>
					<Route
						path="/dashboard/reports"
						element={<Reports />}
					/>
					<Route
						path="/dashboard/delete-post"
						element={<DeletePost />}
					/>
					<Route
						path="/dashboard/ban"
						element={<BanUser />}
					/>
					<Route
						path="/dashboard/verify"
						element={<VerifyUser />}
					/>
					<Route
						path="/settings"
						element={<Settings />}
					/>
					<Route
						path="/settings/delete-account"
						element={<DeleteAccount />}
					/>
					<Route
						path="/delete-account"
						element={<DeleteAccount />}
					/>
					<Route
						path="/settings/privacy"
						element={<PrivacySettings />}
					/>
					<Route
						path="/settings/credentials"
						element={<Credentials />}
					/>
					<Route
						path="/settings/developers"
						element={<Developers />}
					/>
					<Route
						path="/auth/:appName/:appID"
						element={<Auth />}
					/>
					<Route
						path="/tag/:hashtag"
						element={<HomeTags />}
					/>
					<Route
						path="/shop"
						element={<HomeShop />}
					/>
				</Routes>
			</BrowserRouter>
		</HelmetProvider>
	);
}

export default App;
